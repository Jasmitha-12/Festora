import {
  PlanRequestInput,
  GeminiPlanOutput,
  GeminiPlanOutputSchema,
} from './schema';
import { buildGeminiPrompt, getGeminiJsonSchema } from './geminiPrompt';

export interface GeminiApiConfig {
  apiKey?: string;
  model?: string;
  timeoutMs?: number;
}

export interface GeminiCallResult {
  success: boolean;
  data?: GeminiPlanOutput;
  error?: string;
  statusCode?: number;
  modelUsed?: string;
}

const DEFAULT_MODEL = 'gemini-1.5-flash';
const DEFAULT_TIMEOUT_MS = 25000;

/**
 * Invokes Google Gemini API with structured JSON output enforcing GeminiPlanOutputSchema.
 * Uses native fetch with AbortSignal timeout.
 */
export async function callGeminiForBlueprint(
  input: PlanRequestInput,
  config: GeminiApiConfig = {}
): Promise<GeminiCallResult> {
  const apiKey = config.apiKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    return {
      success: false,
      error: 'GEMINI_API_KEY environment variable is not configured.',
      statusCode: 401,
    };
  }

  const model = config.model || process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const promptText = buildGeminiPrompt(input);
  const jsonSchema = getGeminiJsonSchema();

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: promptText }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
      responseSchema: jsonSchema,
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errMessage = `Gemini API returned status ${res.status}`;
      try {
        const errJson = await res.json();
        if (errJson?.error?.message) {
          // Never echo the API key or internal tokens
          errMessage = `Gemini error: ${errJson.error.message.replace(/key=[^&]+/gi, 'key=***')}`;
        }
      } catch (_jsonErr: unknown) {
        // Fallback to text status if error response body cannot be parsed as JSON
      }
      return {
        success: false,
        error: errMessage,
        statusCode: res.status,
        modelUsed: model,
      };
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return {
        success: false,
        error: 'Gemini returned an empty candidate response or was filtered by safety policies.',
        statusCode: 502,
        modelUsed: model,
      };
    }

    // Parse JSON
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawText);
    } catch (parseErr) {
      return {
        success: false,
        error: `Failed to parse Gemini output as JSON: ${parseErr instanceof Error ? parseErr.message : 'Syntax error'}`,
        statusCode: 502,
        modelUsed: model,
      };
    }

    // Validate with Zod
    const validationResult = GeminiPlanOutputSchema.safeParse(parsedJson);
    if (!validationResult.success) {
      const issueDetails = validationResult.error.issues
        .slice(0, 3)
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; ');
      return {
        success: false,
        error: `AI response did not conform to blueprint schema: ${issueDetails}`,
        statusCode: 502,
        modelUsed: model,
      };
    }

    return {
      success: true,
      data: validationResult.data,
      modelUsed: model,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        return {
          success: false,
          error: `Gemini request timed out after ${timeoutMs / 1000} seconds.`,
          statusCode: 504,
          modelUsed: model,
        };
      }
      return {
        success: false,
        error: `Network error contacting Gemini API: ${err.message}`,
        statusCode: 502,
        modelUsed: model,
      };
    }
    return {
      success: false,
      error: 'Unknown error occurred during Gemini request.',
      statusCode: 500,
      modelUsed: model,
    };
  }
}
