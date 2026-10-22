import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FESTORA — Premium Celebration & Event Planner",
  description: "Big moments. Beautifully orchestrated. Personalized AI-powered event blueprint, budget studio, and vendor timelines for weddings, birthdays, and community gatherings.",
  keywords: ["event planner", "wedding planner", "celebration studio", "budget calculator", "event blueprint"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#28262B] font-sans selection:bg-[#E88D83]/30 selection:text-[#321D35]">
        {children}
      </body>
    </html>
  );
}
