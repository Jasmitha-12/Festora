# FESTORA — Premium AI Celebration & Event Planner

> *"Big moments. Beautifully orchestrated."*

**FESTORA** is a luxury-grade, editorial event-planning studio and generative assistant engineered for **Prompt Wars — Challenge 5: Celebration & Event Planner**. It empowers hosts and organizers to orchestrate weddings, milestone birthdays, and community gatherings with personalized aesthetic blueprints, integer-precise budget allocation, day-of schedules, and vetted vendor timelines.

---

## ✦ Key Capabilities & Experiences

### 1. Editorial Landing Experience
- **Brand Wordmark & Positioning**: Contemporary event-magazine aesthetics blending warm ivory, imperial plum, and soft champagne typography.
- **Hero & Dynamic Collage**: Visual composition featuring real celebration photography with graceful aspect ratios, descriptive accessibility alt-text, and fallback resilience.
- **Interactive Dossier Preview**: Live interactive preview tab bar allowing prospective planners to toggle through sample Themes, Day-of Schedules, Budget Allocations, and Vendor Sourcing.
- **Category Discovery**: Dedicated entry points for Weddings, Milestone Birthdays, and Community Activations.

### 2. Multi-Step Event Creation Studio
- **Guided Multi-Step Architecture**: Progress tracking across Category, Basics, Budget & Aesthetic, and Special Nuances.
- **Granular Inputs**:
  - Celebration Category: Wedding, Milestone Birthday, Community Event
  - Core Basics: Celebration Title, Calendar Date, City/Location, Guest Volume (with instant scale presets)
  - Financial Investment: Multi-currency support (**INR [₹]**, **USD [$]**, **EUR [€]**) with target budget calibration
  - Signature Aesthetic: Regal Elegance, Botanical Garden, Contemporary Modern, Curated Minimalist, Heritage Traditional, and Vibrant Playful with live swatch palettes
  - Tailored Nuances: Dietary requirements, accessibility needs, and vision wishes
- **Robust Validation**: Real-time feedback, inline error messaging, keyboard navigation, and full state preservation during step navigation.

### 3. Modular Planning Blueprint Engine
- **Deterministic & Rule-Curated**: Explicit, transparent architecture generating rich customized event blueprints without hallucinated filler text.
- **Input-Adaptive Logic**: Weddings receive bridal party run-of-shows and floral directives; Birthdays receive cake reveals and cocktail playlists; Community gatherings receive municipal permits, stage AV, and volunteer briefs.
- **Harmonious Color Palettes**: 4-swatch palettes with roles, descriptions, and one-click hex code copying.
- **Atmosphere & Acoustic Calibrations**: Tailored 2700K golden spectrum lighting notes and sound transition guidelines.

### 4. Interactive Budget Studio
- **Zero Floating-Point Drift**: Calculations run in integer minor units (cents / paise) internally before formatting to prevent currency precision bugs.
- **Dynamic Controls**: Dual range-slider and numerical inputs for instant category adjustments.
- **Real-Time Overflow Detection**: Immediate visual alert highlighting exact overspend amounts when budget thresholds are exceeded.
- **Category Customization**: Ability to add custom expense lines or reset back to default recommended distribution.

### 5. Timelines & Vendor Sourcing
- **Dual-Mode Schedule Tracker**:
  - *Preparation Milestones*: Chronological milestones relative to event date (from 9–12 months out down to day-of), with completion toggles, progress bars, and custom task creation.
  - *Day-of Run-Sheet*: Sequential chapter itinerary with timestamps, phases, and milestone descriptions.
- **Vendor Sourcing Briefs**: Prioritized partners (Essential, Recommended, Optional) with deliverables, suggested lead times, and specific interview questions to ask during vetting.

### 6. My Events Archive (Local Persistence)
- **Safe Browser Storage**: Graceful serialization and recovery with fallback in-memory handling for restricted or SSR environments.
- **Event Lifecycle Controls**: Open studio, edit event parameters (date, scale, budget), and delete events with two-step modal confirmations.
- **Inspiring Preloaded Sample**: First-time visitors can immediately explore an orchestrated celebration before typing a single character.

### 7. Export & Sharing
- **Print / PDF Dossier**: Print-optimized stylesheet (`@media print`) rendering an executive black-and-white event dossier via `window.print()` without buttons or nav clutter.
- **Executive Summary Copy**: Plain-text summary formatted for WhatsApp, email, or client documents, with privacy controls to include or exclude private notes.

---

## ✦ Color System & Brand Tokens

| Token | Hex | Role |
| :--- | :--- | :--- |
| **Warm Ivory** | `#FAF7F2` | Base paper canvas & light cards |
| **Deep Plum** | `#321D35` | Primary typographic anchor & dark accents |
| **Muted Coral** | `#E88D83` | Vibrant festive accent & active highlights |
| **Soft Sage** | `#A9B8A0` | Botanical balance & progress indicators |
| **Champagne** | `#D8BD91` | Warm metallic shimmer & badge trims |
| **Charcoal** | `#28262B` | Body copy & footer background |

---

## ✦ Architecture & Code Quality

```
├── app/
│   ├── globals.css              # Custom editorial design system & print styles
│   ├── layout.tsx               # Playfair Display & Plus Jakarta Sans typography
│   └── page.tsx                 # View orchestrator (Landing, Studio, Blueprint, Dashboard)
├── components/
│   ├── blueprint/
│   │   ├── BlueprintView.tsx    # Concept narrative, swatches & personalized ideas
│   │   └── VendorChecklistView.tsx # Vetted vendor cards & interview prompts
│   ├── budget/
│   │   └── BudgetStudio.tsx     # Integer minor-unit sliders & overflow HUD
│   ├── dashboard/
│   │   ├── EditEventModal.tsx   # Fast modification modal for event basics
│   │   └── MyEventsDashboard.tsx # Saved celebration cards & task completion HUD
│   ├── export/
│   │   ├── PrintablePlan.tsx    # High-fidelity print & PDF export dossier
│   │   └── ShareModal.tsx       # Plain-text executive summary with privacy guard
│   ├── landing/
│   │   ├── EventTypeDiscovery.tsx # Wedding, Birthday, Community cards
│   │   ├── Footer.tsx           # Editorial footer with privacy disclosures
│   │   ├── Hero.tsx             # Editorial headline & layered collage
│   │   ├── HowItWorks.tsx       # 3-step structured methodology
│   │   └── PlanPreview.tsx      # Live interactive dossier tabs
│   ├── studio/
│   │   ├── ActiveCelebrationStudio.tsx # Primary celebration dashboard & tabs
│   │   └── EventCreationStudio.tsx     # 4-step accessible planning wizard
│   └── ui/
│       ├── Navbar.tsx           # Brand wordmark, navigation & event counter
│       └── Toast.tsx            # Floating accessible notification system
├── lib/
│   ├── budget/
│   │   └── calculator.ts        # Float-free minor units & currency formatters
│   ├── planner/
│   │   └── engine.ts            # Modular deterministic planning engine
│   ├── storage/
│   │   └── persistence.ts       # Safe localStorage wrapper with memory fallback
│   ├── utils/
│   │   └── date.ts              # SSR-compatible date diff utilities
│   └── validation/
│       └── eventSchema.ts       # Strict domain input validators
├── tests/
│   ├── budget.test.ts           # Budget calculations & overflow detection tests
│   ├── persistence.test.ts      # Storage recovery, sample seeding & CRUD tests
│   ├── planner.test.ts          # Event-type blueprint differentiation tests
│   └── validation.test.ts       # Form validation & date boundary tests
└── types/
    └── event.ts                 # Strict TypeScript domain interfaces
```

---

## ✦ Verification & Testing

All verification commands execute with zero errors:

```bash
# Run unit tests (12 tests covering budget math, validation, planning engine & persistence)
npm test

# Run ESLint check (0 errors, 0 warnings)
npm run lint

# Build production bundle (Turbopack static prerender)
npm run build

# Start development server
npm run dev
```

---

*FESTORA — Orchestrated for Prompt Wars Challenge 5.*
