import {
  Check,
  ClipboardCheck,
  Copy,
  Palette,
  RotateCcw,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ThemeModeToggle } from "./ThemeModeToggle";

interface ColorPreset {
  name: string;
  light: string;
  dark: string;
  swatch: string;
}

interface RadiusPreset {
  name: string;
  value: string;
}

interface ThemePack {
  name: string;
  color: string;
  surface: string;
  radius: string;
  category?: "mono" | "brand";
  note?: string;
}

interface MotionPreset {
  name: string;
  overlayMs: number;
  interactiveMs: number;
}

interface EasingPreset {
  name: string;
  value: string;
}

interface SurfacePreset {
  name: string;
  tokens: SurfaceTokens;
}

interface SurfaceTokens {
  backgroundLight: string;
  foregroundLight: string;
  cardLight: string;
  cardForegroundLight: string;
  mutedLight: string;
  mutedForegroundLight: string;
  accentLight: string;
  accentForegroundLight: string;
  borderLight: string;
  inputLight: string;
  backgroundDark: string;
  foregroundDark: string;
  cardDark: string;
  cardForegroundDark: string;
  mutedDark: string;
  mutedForegroundDark: string;
  accentDark: string;
  accentForegroundDark: string;
  borderDark: string;
  inputDark: string;
}

interface StatusTokens {
  successLight: string;
  successForegroundLight: string;
  warningLight: string;
  warningForegroundLight: string;
  destructiveLight: string;
  destructiveForegroundLight: string;
  successDark: string;
  successForegroundDark: string;
  warningDark: string;
  warningForegroundDark: string;
  destructiveDark: string;
  destructiveForegroundDark: string;
}

const COLOR_PRESETS: ColorPreset[] = [
  {
    name: "Golden",
    light: "43 90% 44%",
    dark: "43 92% 58%",
    swatch: "hsl(43 90% 44%)",
  },
  {
    name: "Blue",
    light: "217 91% 55%",
    dark: "213 93% 67%",
    swatch: "hsl(217 91% 55%)",
  },
  {
    name: "Sky",
    light: "199 89% 48%",
    dark: "198 93% 61%",
    swatch: "hsl(199 89% 48%)",
  },
  {
    name: "Cyan",
    light: "189 90% 44%",
    dark: "189 90% 56%",
    swatch: "hsl(189 90% 44%)",
  },
  {
    name: "Teal",
    light: "172 70% 40%",
    dark: "171 72% 53%",
    swatch: "hsl(172 70% 40%)",
  },
  {
    name: "Emerald",
    light: "158 64% 40%",
    dark: "160 68% 54%",
    swatch: "hsl(158 64% 40%)",
  },
  {
    name: "Lime",
    light: "85 76% 44%",
    dark: "85 70% 57%",
    swatch: "hsl(85 76% 44%)",
  },
  {
    name: "Orange",
    light: "25 95% 50%",
    dark: "25 95% 63%",
    swatch: "hsl(25 95% 50%)",
  },
  {
    name: "Rose",
    light: "346 84% 52%",
    dark: "347 87% 65%",
    swatch: "hsl(346 84% 52%)",
  },
  {
    name: "Pink",
    light: "330 81% 57%",
    dark: "330 82% 68%",
    swatch: "hsl(330 81% 57%)",
  },
  {
    name: "Violet",
    light: "262 80% 52%",
    dark: "263 85% 70%",
    swatch: "hsl(262 80% 52%)",
  },
  {
    name: "Slate",
    light: "221 39% 41%",
    dark: "217 32% 66%",
    swatch: "hsl(221 39% 41%)",
  },
];

const RADIUS_PRESETS: RadiusPreset[] = [
  { name: "None", value: "0rem" },
  { name: "Small", value: "0.375rem" },
  { name: "Medium", value: "0.625rem" },
  { name: "Large", value: "0.875rem" },
  { name: "XL", value: "1rem" },
  { name: "2XL", value: "1.25rem" },
];

const THEME_PACKS_RAW: ThemePack[] = [
  {
    name: "Monochrome Light",
    color: "Slate",
    surface: "Mono White",
    radius: "0.5rem",
    category: "mono",
    note: "Neutral, bright, minimal",
  },
  {
    name: "Monochrome Dark",
    color: "Slate",
    surface: "Mono Black",
    radius: "0.5rem",
    category: "mono",
    note: "Neutral, high-contrast, minimal",
  },
  {
    name: "Slate Pro",
    color: "Slate",
    surface: "Mono Slate",
    radius: "0.5rem",
    category: "brand",
    note: "Neutral product docs",
  },
  {
    name: "Zinc Editorial",
    color: "Slate",
    surface: "Mono Zinc",
    radius: "0.625rem",
    category: "brand",
    note: "Editorial neutral tone",
  },
  {
    name: "Paper Studio",
    color: "Golden",
    surface: "Paper",
    radius: "0.625rem",
    category: "brand",
    note: "Warm documentation feel",
  },
  {
    name: "Ocean Product",
    color: "Blue",
    surface: "Ocean",
    radius: "0.875rem",
    category: "brand",
    note: "Cool product UI tone",
  },
  {
    name: "Forest Product",
    color: "Emerald",
    surface: "Forest",
    radius: "0.75rem",
    category: "brand",
    note: "Calm natural contrast",
  },
  {
    name: "Prism Contrast",
    color: "Violet",
    surface: "Prism",
    radius: "0.875rem",
    category: "brand",
    note: "Bold but still professional",
  },
];

const THEME_PACKS: ThemePack[] = THEME_PACKS_RAW.filter(
  (pack, index, packs) =>
    packs.findIndex(
      (item) =>
        item.color === pack.color &&
        item.surface === pack.surface &&
        item.radius === pack.radius,
    ) === index,
);

const SURFACE_PRESETS: SurfacePreset[] = [
  {
    name: "Mono White",
    tokens: {
      backgroundLight: "0 0% 100%",
      foregroundLight: "240 10% 6%",
      cardLight: "0 0% 100%",
      cardForegroundLight: "240 10% 6%",
      mutedLight: "240 6% 95%",
      mutedForegroundLight: "240 4% 40%",
      accentLight: "240 6% 93%",
      accentForegroundLight: "240 10% 8%",
      borderLight: "240 6% 86%",
      inputLight: "240 6% 86%",
      backgroundDark: "240 8% 8%",
      foregroundDark: "0 0% 96%",
      cardDark: "240 8% 10%",
      cardForegroundDark: "0 0% 96%",
      mutedDark: "240 6% 16%",
      mutedForegroundDark: "240 6% 68%",
      accentDark: "240 6% 18%",
      accentForegroundDark: "0 0% 96%",
      borderDark: "240 5% 22%",
      inputDark: "240 5% 22%",
    },
  },
  {
    name: "Mono Black",
    tokens: {
      backgroundLight: "240 8% 97%",
      foregroundLight: "240 8% 12%",
      cardLight: "240 8% 99%",
      cardForegroundLight: "240 8% 12%",
      mutedLight: "240 6% 93%",
      mutedForegroundLight: "240 5% 38%",
      accentLight: "240 6% 90%",
      accentForegroundLight: "240 8% 12%",
      borderLight: "240 6% 82%",
      inputLight: "240 6% 82%",
      backgroundDark: "240 8% 4%",
      foregroundDark: "0 0% 96%",
      cardDark: "240 7% 7%",
      cardForegroundDark: "0 0% 96%",
      mutedDark: "240 5% 14%",
      mutedForegroundDark: "240 6% 70%",
      accentDark: "240 5% 16%",
      accentForegroundDark: "0 0% 96%",
      borderDark: "240 5% 18%",
      inputDark: "240 5% 18%",
    },
  },
  {
    name: "Quartz",
    tokens: {
      backgroundLight: "0 0% 100%",
      foregroundLight: "240 8% 4%",
      cardLight: "0 0% 100%",
      cardForegroundLight: "240 8% 4%",
      mutedLight: "240 5% 96%",
      mutedForegroundLight: "240 4% 46%",
      accentLight: "240 5% 96%",
      accentForegroundLight: "240 8% 4%",
      borderLight: "240 6% 90%",
      inputLight: "240 6% 90%",
      backgroundDark: "240 10% 4%",
      foregroundDark: "0 0% 98%",
      cardDark: "240 10% 6%",
      cardForegroundDark: "0 0% 98%",
      mutedDark: "240 6% 14%",
      mutedForegroundDark: "240 6% 68%",
      accentDark: "240 5% 14%",
      accentForegroundDark: "0 0% 98%",
      borderDark: "240 5% 16%",
      inputDark: "240 5% 16%",
    },
  },
  {
    name: "Alloy",
    tokens: {
      backgroundLight: "220 20% 98%",
      foregroundLight: "222 28% 13%",
      cardLight: "0 0% 100%",
      cardForegroundLight: "222 28% 13%",
      mutedLight: "220 16% 94%",
      mutedForegroundLight: "220 9% 42%",
      accentLight: "220 14% 92%",
      accentForegroundLight: "222 28% 13%",
      borderLight: "220 12% 86%",
      inputLight: "220 12% 86%",
      backgroundDark: "224 24% 8%",
      foregroundDark: "220 18% 96%",
      cardDark: "224 20% 10%",
      cardForegroundDark: "220 18% 96%",
      mutedDark: "224 14% 14%",
      mutedForegroundDark: "220 10% 66%",
      accentDark: "224 12% 16%",
      accentForegroundDark: "220 18% 96%",
      borderDark: "224 10% 18%",
      inputDark: "224 10% 18%",
    },
  },
  {
    name: "Parchment",
    tokens: {
      backgroundLight: "40 33% 98%",
      foregroundLight: "30 16% 18%",
      cardLight: "40 28% 99%",
      cardForegroundLight: "30 16% 18%",
      mutedLight: "40 18% 93%",
      mutedForegroundLight: "30 8% 40%",
      accentLight: "40 18% 92%",
      accentForegroundLight: "30 16% 18%",
      borderLight: "40 16% 84%",
      inputLight: "40 16% 84%",
      backgroundDark: "35 10% 10%",
      foregroundDark: "40 18% 93%",
      cardDark: "35 10% 12%",
      cardForegroundDark: "40 18% 93%",
      mutedDark: "35 8% 18%",
      mutedForegroundDark: "35 10% 68%",
      accentDark: "35 8% 20%",
      accentForegroundDark: "40 18% 93%",
      borderDark: "35 8% 24%",
      inputDark: "35 8% 24%",
    },
  },
  {
    name: "Ink",
    tokens: {
      backgroundLight: "0 0% 100%",
      foregroundLight: "215 18% 13%",
      cardLight: "0 0% 100%",
      cardForegroundLight: "215 18% 13%",
      mutedLight: "220 14% 95%",
      mutedForegroundLight: "215 10% 42%",
      accentLight: "220 14% 94%",
      accentForegroundLight: "215 18% 13%",
      borderLight: "220 12% 87%",
      inputLight: "220 12% 87%",
      backgroundDark: "215 20% 9%",
      foregroundDark: "220 18% 96%",
      cardDark: "215 18% 11%",
      cardForegroundDark: "220 18% 96%",
      mutedDark: "215 12% 16%",
      mutedForegroundDark: "220 10% 67%",
      accentDark: "215 10% 18%",
      accentForegroundDark: "220 18% 96%",
      borderDark: "215 10% 18%",
      inputDark: "215 10% 18%",
    },
  },
  {
    name: "Prism",
    tokens: {
      backgroundLight: "240 100% 99%",
      foregroundLight: "231 20% 15%",
      cardLight: "240 100% 99%",
      cardForegroundLight: "231 20% 15%",
      mutedLight: "241 33% 95%",
      mutedForegroundLight: "231 12% 42%",
      accentLight: "240 34% 92%",
      accentForegroundLight: "231 20% 15%",
      borderLight: "240 22% 86%",
      inputLight: "240 22% 86%",
      backgroundDark: "232 35% 8%",
      foregroundDark: "240 100% 97%",
      cardDark: "232 30% 10%",
      cardForegroundDark: "240 100% 97%",
      mutedDark: "232 18% 16%",
      mutedForegroundDark: "232 10% 69%",
      accentDark: "232 16% 18%",
      accentForegroundDark: "240 100% 97%",
      borderDark: "232 14% 20%",
      inputDark: "232 14% 20%",
    },
  },
  {
    name: "Canopy",
    tokens: {
      backgroundLight: "154 44% 98%",
      foregroundLight: "152 28% 15%",
      cardLight: "154 40% 99%",
      cardForegroundLight: "152 28% 15%",
      mutedLight: "154 26% 94%",
      mutedForegroundLight: "154 12% 39%",
      accentLight: "154 24% 91%",
      accentForegroundLight: "152 28% 15%",
      borderLight: "154 18% 84%",
      inputLight: "154 18% 84%",
      backgroundDark: "155 18% 8%",
      foregroundDark: "154 28% 96%",
      cardDark: "155 16% 10%",
      cardForegroundDark: "154 28% 96%",
      mutedDark: "155 10% 16%",
      mutedForegroundDark: "154 14% 69%",
      accentDark: "155 10% 18%",
      accentForegroundDark: "154 28% 96%",
      borderDark: "155 10% 18%",
      inputDark: "155 10% 18%",
    },
  },
  {
    name: "Clean",
    tokens: {
      backgroundLight: "0 0% 100%",
      foregroundLight: "240 10% 3.9%",
      cardLight: "0 0% 100%",
      cardForegroundLight: "240 10% 3.9%",
      mutedLight: "240 4.8% 95.9%",
      mutedForegroundLight: "240 3.8% 46.1%",
      accentLight: "240 4.8% 95.9%",
      accentForegroundLight: "240 5.9% 10%",
      borderLight: "240 5.9% 90%",
      inputLight: "240 5.9% 90%",
      backgroundDark: "222 26% 8%",
      foregroundDark: "210 25% 96%",
      cardDark: "222 22% 10%",
      cardForegroundDark: "210 25% 96%",
      mutedDark: "222 16% 14%",
      mutedForegroundDark: "222 10% 64%",
      accentDark: "222 14% 17%",
      accentForegroundDark: "210 25% 96%",
      borderDark: "222 13% 18%",
      inputDark: "222 13% 18%",
    },
  },
  {
    name: "Paper",
    tokens: {
      backgroundLight: "42 35% 97%",
      foregroundLight: "25 20% 18%",
      cardLight: "42 30% 98%",
      cardForegroundLight: "25 20% 18%",
      mutedLight: "42 20% 93%",
      mutedForegroundLight: "26 10% 42%",
      accentLight: "38 35% 92%",
      accentForegroundLight: "25 20% 18%",
      borderLight: "35 20% 84%",
      inputLight: "35 20% 84%",
      backgroundDark: "28 14% 10%",
      foregroundDark: "38 30% 92%",
      cardDark: "28 14% 12%",
      cardForegroundDark: "38 30% 92%",
      mutedDark: "28 10% 18%",
      mutedForegroundDark: "34 14% 68%",
      accentDark: "28 10% 20%",
      accentForegroundDark: "38 30% 92%",
      borderDark: "28 10% 24%",
      inputDark: "28 10% 24%",
    },
  },
  {
    name: "Ocean",
    tokens: {
      backgroundLight: "210 40% 98%",
      foregroundLight: "217 30% 18%",
      cardLight: "210 44% 99%",
      cardForegroundLight: "217 30% 18%",
      mutedLight: "210 25% 93%",
      mutedForegroundLight: "215 16% 42%",
      accentLight: "205 40% 92%",
      accentForegroundLight: "217 30% 18%",
      borderLight: "210 25% 85%",
      inputLight: "210 25% 85%",
      backgroundDark: "216 34% 10%",
      foregroundDark: "210 30% 95%",
      cardDark: "216 30% 12%",
      cardForegroundDark: "210 30% 95%",
      mutedDark: "215 20% 18%",
      mutedForegroundDark: "214 18% 69%",
      accentDark: "213 20% 21%",
      accentForegroundDark: "210 30% 95%",
      borderDark: "214 16% 24%",
      inputDark: "214 16% 24%",
    },
  },
  {
    name: "Graphite",
    tokens: {
      backgroundLight: "210 14% 97%",
      foregroundLight: "222 28% 14%",
      cardLight: "210 16% 99%",
      cardForegroundLight: "222 28% 14%",
      mutedLight: "214 12% 92%",
      mutedForegroundLight: "217 10% 39%",
      accentLight: "214 16% 90%",
      accentForegroundLight: "222 28% 14%",
      borderLight: "214 12% 82%",
      inputLight: "214 12% 82%",
      backgroundDark: "220 18% 8%",
      foregroundDark: "210 20% 95%",
      cardDark: "220 16% 10%",
      cardForegroundDark: "210 20% 95%",
      mutedDark: "220 12% 16%",
      mutedForegroundDark: "217 14% 69%",
      accentDark: "218 12% 20%",
      accentForegroundDark: "210 20% 95%",
      borderDark: "218 10% 24%",
      inputDark: "218 10% 24%",
    },
  },
  {
    name: "Sand",
    tokens: {
      backgroundLight: "44 45% 97%",
      foregroundLight: "26 24% 18%",
      cardLight: "42 42% 99%",
      cardForegroundLight: "26 24% 18%",
      mutedLight: "42 24% 92%",
      mutedForegroundLight: "28 12% 40%",
      accentLight: "38 35% 90%",
      accentForegroundLight: "26 24% 18%",
      borderLight: "36 22% 82%",
      inputLight: "36 22% 82%",
      backgroundDark: "30 12% 10%",
      foregroundDark: "40 25% 93%",
      cardDark: "30 12% 12%",
      cardForegroundDark: "40 25% 93%",
      mutedDark: "28 10% 18%",
      mutedForegroundDark: "34 12% 67%",
      accentDark: "28 10% 22%",
      accentForegroundDark: "40 25% 93%",
      borderDark: "28 8% 25%",
      inputDark: "28 8% 25%",
    },
  },
  {
    name: "Forest",
    tokens: {
      backgroundLight: "138 28% 97%",
      foregroundLight: "150 30% 16%",
      cardLight: "138 24% 99%",
      cardForegroundLight: "150 30% 16%",
      mutedLight: "138 18% 92%",
      mutedForegroundLight: "150 12% 38%",
      accentLight: "136 24% 89%",
      accentForegroundLight: "150 30% 16%",
      borderLight: "136 14% 80%",
      inputLight: "136 14% 80%",
      backgroundDark: "148 22% 9%",
      foregroundDark: "142 20% 94%",
      cardDark: "148 18% 11%",
      cardForegroundDark: "142 20% 94%",
      mutedDark: "148 12% 17%",
      mutedForegroundDark: "142 12% 66%",
      accentDark: "147 12% 20%",
      accentForegroundDark: "142 20% 94%",
      borderDark: "147 10% 24%",
      inputDark: "147 10% 24%",
    },
  },
  {
    name: "Mono Slate",
    tokens: {
      backgroundLight: "220 18% 98%",
      foregroundLight: "222 18% 14%",
      cardLight: "220 20% 99%",
      cardForegroundLight: "222 18% 14%",
      mutedLight: "220 10% 94%",
      mutedForegroundLight: "220 9% 38%",
      accentLight: "220 10% 92%",
      accentForegroundLight: "222 18% 14%",
      borderLight: "220 10% 84%",
      inputLight: "220 10% 84%",
      backgroundDark: "222 20% 8%",
      foregroundDark: "220 14% 94%",
      cardDark: "222 18% 10%",
      cardForegroundDark: "220 14% 94%",
      mutedDark: "222 12% 16%",
      mutedForegroundDark: "220 10% 68%",
      accentDark: "222 12% 18%",
      accentForegroundDark: "220 14% 94%",
      borderDark: "222 10% 22%",
      inputDark: "222 10% 22%",
    },
  },
  {
    name: "Mono Zinc",
    tokens: {
      backgroundLight: "240 10% 98%",
      foregroundLight: "240 8% 15%",
      cardLight: "240 8% 99%",
      cardForegroundLight: "240 8% 15%",
      mutedLight: "240 7% 94%",
      mutedForegroundLight: "240 5% 40%",
      accentLight: "240 7% 92%",
      accentForegroundLight: "240 8% 15%",
      borderLight: "240 6% 84%",
      inputLight: "240 6% 84%",
      backgroundDark: "240 10% 8%",
      foregroundDark: "240 8% 95%",
      cardDark: "240 8% 10%",
      cardForegroundDark: "240 8% 95%",
      mutedDark: "240 6% 16%",
      mutedForegroundDark: "240 6% 68%",
      accentDark: "240 6% 18%",
      accentForegroundDark: "240 8% 95%",
      borderDark: "240 5% 22%",
      inputDark: "240 5% 22%",
    },
  },
  {
    name: "Mono Stone",
    tokens: {
      backgroundLight: "32 18% 97%",
      foregroundLight: "30 10% 18%",
      cardLight: "32 16% 99%",
      cardForegroundLight: "30 10% 18%",
      mutedLight: "30 12% 93%",
      mutedForegroundLight: "30 8% 41%",
      accentLight: "30 12% 91%",
      accentForegroundLight: "30 10% 18%",
      borderLight: "30 10% 83%",
      inputLight: "30 10% 83%",
      backgroundDark: "30 8% 10%",
      foregroundDark: "32 12% 93%",
      cardDark: "30 8% 12%",
      cardForegroundDark: "32 12% 93%",
      mutedDark: "30 8% 18%",
      mutedForegroundDark: "30 8% 66%",
      accentDark: "30 8% 20%",
      accentForegroundDark: "32 12% 93%",
      borderDark: "30 8% 24%",
      inputDark: "30 8% 24%",
    },
  },
];

const SURFACE_NAME_ALIASES: Record<string, string> = {
  "Monochrome White": "Mono White",
  "Monochrome Black": "Mono Black",
  Vercel: "Quartz",
  Linear: "Alloy",
  Notion: "Parchment",
  GitHub: "Ink",
  Stripe: "Prism",
  Supabase: "Canopy",
};

const CURATED_SURFACE_NAMES = new Set<string>([
  "Mono White",
  "Mono Black",
  "Clean",
  "Paper",
  "Ocean",
  "Forest",
  "Graphite",
  "Prism",
] as const);

const CURATED_SURFACE_PRESETS = SURFACE_PRESETS.filter((surface) =>
  CURATED_SURFACE_NAMES.has(surface.name),
);

const CURATED_COLOR_NAMES = new Set<string>([
  "Slate",
  "Blue",
  "Emerald",
  "Cyan",
  "Golden",
  "Rose",
  "Orange",
  "Violet",
] as const);

const CURATED_COLOR_PRESETS = COLOR_PRESETS.filter((preset) =>
  CURATED_COLOR_NAMES.has(preset.name),
);

const STATUS_TOKENS_DEFAULT: StatusTokens = {
  successLight: "142 72% 38%",
  successForegroundLight: "0 0% 100%",
  warningLight: "38 92% 50%",
  warningForegroundLight: "26 83% 14%",
  destructiveLight: "0 84% 60%",
  destructiveForegroundLight: "0 0% 100%",
  successDark: "142 60% 46%",
  successForegroundDark: "145 80% 10%",
  warningDark: "38 90% 56%",
  warningForegroundDark: "26 83% 14%",
  destructiveDark: "0 72% 48%",
  destructiveForegroundDark: "0 0% 98%",
};

const STATUS_TOKENS_MONO: StatusTokens = {
  successLight: "150 22% 40%",
  successForegroundLight: "0 0% 100%",
  warningLight: "36 28% 48%",
  warningForegroundLight: "26 35% 14%",
  destructiveLight: "0 38% 52%",
  destructiveForegroundLight: "0 0% 100%",
  successDark: "150 20% 52%",
  successForegroundDark: "150 50% 10%",
  warningDark: "36 34% 58%",
  warningForegroundDark: "28 52% 12%",
  destructiveDark: "0 42% 56%",
  destructiveForegroundDark: "0 0% 98%",
};

const MOTION_PRESETS: MotionPreset[] = [
  { name: "Snappy", overlayMs: 120, interactiveMs: 100 },
  { name: "Balanced", overlayMs: 180, interactiveMs: 150 },
  { name: "Relaxed", overlayMs: 260, interactiveMs: 220 },
  { name: "Instant", overlayMs: 0, interactiveMs: 0 },
];

const EASING_PRESETS: EasingPreset[] = [
  { name: "Standard", value: "cubic-bezier(0.22,1,0.36,1)" },
  { name: "Smooth", value: "cubic-bezier(0.25,0.46,0.45,0.94)" },
  { name: "Ease", value: "ease" },
  { name: "Linear", value: "linear" },
];

const FALLBACK_COLOR_PRESET: ColorPreset = {
  name: "Golden",
  light: "43 90% 44%",
  dark: "43 92% 58%",
  swatch: "hsl(43 90% 44%)",
};

const FALLBACK_RADIUS_PRESET: RadiusPreset = { name: "Md", value: "0.625rem" };

const FALLBACK_MOTION_PRESET: MotionPreset = {
  name: "Balanced",
  overlayMs: 180,
  interactiveMs: 150,
};

const FALLBACK_EASING_PRESET: EasingPreset = {
  name: "Standard",
  value: "cubic-bezier(0.22,1,0.36,1)",
};

const FALLBACK_SURFACE_TOKENS: SurfaceTokens = {
  backgroundLight: "0 0% 100%",
  foregroundLight: "240 10% 3.9%",
  cardLight: "0 0% 100%",
  cardForegroundLight: "240 10% 3.9%",
  mutedLight: "240 4.8% 95.9%",
  mutedForegroundLight: "240 3.8% 46.1%",
  accentLight: "240 4.8% 95.9%",
  accentForegroundLight: "240 5.9% 10%",
  borderLight: "240 5.9% 90%",
  inputLight: "240 5.9% 90%",
  backgroundDark: "222 26% 8%",
  foregroundDark: "210 25% 96%",
  cardDark: "222 22% 10%",
  cardForegroundDark: "210 25% 96%",
  mutedDark: "222 16% 14%",
  mutedForegroundDark: "222 10% 64%",
  accentDark: "222 14% 17%",
  accentForegroundDark: "210 25% 96%",
  borderDark: "222 13% 18%",
  inputDark: "222 13% 18%",
};

const FALLBACK_SURFACE_PRESET: SurfacePreset = {
  name: "Clean",
  tokens: FALLBACK_SURFACE_TOKENS,
};

const DEFAULT_PRESET = "Golden";
const DEFAULT_RADIUS = "0.625rem";
const DEFAULT_SURFACE = "Clean";
const DEFAULT_OVERLAY_MS = 180;
const DEFAULT_INTERACTIVE_MS = 150;
const DEFAULT_EASE = "cubic-bezier(0.22,1,0.36,1)";
const STORAGE_KEY = "almach-theme";

interface SavedTheme {
  preset: string;
  primaryLight: string;
  primaryDark: string;
  radius: string;
  surfaceName?: string;
  surfaceTokens?: SurfaceTokens;
  statusTokens?: StatusTokens;
  overlayMs?: number;
  interactiveMs?: number;
  ease?: string;
}

interface ThemeJSONPayload {
  preset?: string;
  surfaceName?: string;
  radius?: string;
  overlayMs?: number;
  interactiveMs?: number;
  ease?: string;
}

function hashSeed(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededIndex(seed: number, salt: number, length: number) {
  if (length <= 0) return 0;
  const mixed = (seed ^ Math.imul(salt + 1, 2654435761)) >>> 0;
  return mixed % length;
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function pickFromList<T>(list: T[], fallback: T): T {
  const picked = list[Math.floor(Math.random() * list.length)];
  return picked ?? fallback;
}

function getColorPresetByName(name: string): ColorPreset {
  return COLOR_PRESETS.find((p) => p.name === name) ?? FALLBACK_COLOR_PRESET;
}

function getSurfacePresetByName(name: string): SurfacePreset {
  const normalizedName = SURFACE_NAME_ALIASES[name] ?? name;
  return (
    SURFACE_PRESETS.find((s) => s.name === normalizedName) ??
    FALLBACK_SURFACE_PRESET
  );
}

function getDefaultSurfaceTokens(): SurfaceTokens {
  return getSurfacePresetByName(DEFAULT_SURFACE).tokens;
}

function getStatusTokensForSurface(surfaceName: string): StatusTokens {
  if (surfaceName.startsWith("Mono")) {
    return STATUS_TOKENS_MONO;
  }

  return STATUS_TOKENS_DEFAULT;
}

function applySurfaceVars(tokens: SurfaceTokens, statusTokens: StatusTokens) {
  const root = document.documentElement;
  root.style.setProperty("--theme-background-light", tokens.backgroundLight);
  root.style.setProperty("--theme-foreground-light", tokens.foregroundLight);
  root.style.setProperty("--theme-sidebar-light", tokens.backgroundLight);
  root.style.setProperty(
    "--theme-sidebar-foreground-light",
    tokens.foregroundLight,
  );
  root.style.setProperty("--theme-card-light", tokens.cardLight);
  root.style.setProperty(
    "--theme-card-foreground-light",
    tokens.cardForegroundLight,
  );
  root.style.setProperty("--theme-muted-light", tokens.mutedLight);
  root.style.setProperty(
    "--theme-muted-foreground-light",
    tokens.mutedForegroundLight,
  );
  root.style.setProperty("--theme-accent-light", tokens.accentLight);
  root.style.setProperty(
    "--theme-accent-foreground-light",
    tokens.accentForegroundLight,
  );
  root.style.setProperty("--theme-border-light", tokens.borderLight);
  root.style.setProperty("--theme-input-light", tokens.inputLight);
  root.style.setProperty("--theme-secondary-light", tokens.accentLight);
  root.style.setProperty(
    "--theme-secondary-foreground-light",
    tokens.accentForegroundLight,
  );
  root.style.setProperty("--theme-success-light", statusTokens.successLight);
  root.style.setProperty(
    "--theme-success-foreground-light",
    statusTokens.successForegroundLight,
  );
  root.style.setProperty("--theme-warning-light", statusTokens.warningLight);
  root.style.setProperty(
    "--theme-warning-foreground-light",
    statusTokens.warningForegroundLight,
  );
  root.style.setProperty(
    "--theme-destructive-light",
    statusTokens.destructiveLight,
  );
  root.style.setProperty(
    "--theme-destructive-foreground-light",
    statusTokens.destructiveForegroundLight,
  );
  root.style.setProperty("--theme-sidebar-primary-light", tokens.accentLight);
  root.style.setProperty(
    "--theme-sidebar-primary-foreground-light",
    tokens.accentForegroundLight,
  );
  root.style.setProperty("--theme-sidebar-accent-light", tokens.accentLight);
  root.style.setProperty(
    "--theme-sidebar-accent-foreground-light",
    tokens.accentForegroundLight,
  );
  root.style.setProperty("--theme-sidebar-border-light", tokens.borderLight);
  root.style.setProperty("--theme-sidebar-ring-light", tokens.accentLight);

  root.style.setProperty("--theme-background-dark", tokens.backgroundDark);
  root.style.setProperty("--theme-foreground-dark", tokens.foregroundDark);
  root.style.setProperty("--theme-sidebar-dark", tokens.backgroundDark);
  root.style.setProperty(
    "--theme-sidebar-foreground-dark",
    tokens.foregroundDark,
  );
  root.style.setProperty("--theme-card-dark", tokens.cardDark);
  root.style.setProperty(
    "--theme-card-foreground-dark",
    tokens.cardForegroundDark,
  );
  root.style.setProperty("--theme-muted-dark", tokens.mutedDark);
  root.style.setProperty(
    "--theme-muted-foreground-dark",
    tokens.mutedForegroundDark,
  );
  root.style.setProperty("--theme-accent-dark", tokens.accentDark);
  root.style.setProperty(
    "--theme-accent-foreground-dark",
    tokens.accentForegroundDark,
  );
  root.style.setProperty("--theme-border-dark", tokens.borderDark);
  root.style.setProperty("--theme-input-dark", tokens.inputDark);
  root.style.setProperty("--theme-secondary-dark", tokens.accentDark);
  root.style.setProperty(
    "--theme-secondary-foreground-dark",
    tokens.accentForegroundDark,
  );
  root.style.setProperty("--theme-success-dark", statusTokens.successDark);
  root.style.setProperty(
    "--theme-success-foreground-dark",
    statusTokens.successForegroundDark,
  );
  root.style.setProperty("--theme-warning-dark", statusTokens.warningDark);
  root.style.setProperty(
    "--theme-warning-foreground-dark",
    statusTokens.warningForegroundDark,
  );
  root.style.setProperty(
    "--theme-destructive-dark",
    statusTokens.destructiveDark,
  );
  root.style.setProperty(
    "--theme-destructive-foreground-dark",
    statusTokens.destructiveForegroundDark,
  );
  root.style.setProperty("--theme-sidebar-primary-dark", tokens.accentDark);
  root.style.setProperty(
    "--theme-sidebar-primary-foreground-dark",
    tokens.accentForegroundDark,
  );
  root.style.setProperty("--theme-sidebar-accent-dark", tokens.accentDark);
  root.style.setProperty(
    "--theme-sidebar-accent-foreground-dark",
    tokens.accentForegroundDark,
  );
  root.style.setProperty("--theme-sidebar-border-dark", tokens.borderDark);
  root.style.setProperty("--theme-sidebar-ring-dark", tokens.accentDark);
}

function loadSaved(): SavedTheme | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function save(data: SavedTheme) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // noop
  }
}

function clear() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

function applyVars(
  preset: ColorPreset,
  surfaceName: string,
  radius: string,
  surfaces: SurfaceTokens,
  motion: { overlayMs: number; interactiveMs: number; ease: string },
) {
  const root = document.documentElement;
  const dark = root.classList.contains("dark");
  const statusTokens = getStatusTokensForSurface(surfaceName);
  applySurfaceVars(surfaces, statusTokens);

  // Keep both design-time theme channels and active runtime channels in sync.
  root.style.setProperty("--primary", dark ? preset.dark : preset.light);
  root.style.setProperty("--ring", dark ? preset.dark : preset.light);

  root.style.setProperty("--theme-primary-light", preset.light);
  root.style.setProperty("--theme-primary-dark", preset.dark);
  root.style.setProperty("--radius", radius);
  root.style.setProperty(
    "--theme-motion-overlay-duration-ms",
    String(motion.overlayMs),
  );
  root.style.setProperty(
    "--theme-motion-overlay-duration",
    `${motion.overlayMs}ms`,
  );
  root.style.setProperty(
    "--theme-motion-interactive-duration",
    `${motion.interactiveMs}ms`,
  );
  root.style.setProperty("--theme-motion-ease-standard", motion.ease);
}

function resetVars() {
  const root = document.documentElement;
  root.style.removeProperty("--theme-background-light");
  root.style.removeProperty("--theme-foreground-light");
  root.style.removeProperty("--theme-card-light");
  root.style.removeProperty("--theme-card-foreground-light");
  root.style.removeProperty("--theme-muted-light");
  root.style.removeProperty("--theme-muted-foreground-light");
  root.style.removeProperty("--theme-accent-light");
  root.style.removeProperty("--theme-accent-foreground-light");
  root.style.removeProperty("--theme-secondary-light");
  root.style.removeProperty("--theme-secondary-foreground-light");
  root.style.removeProperty("--theme-success-light");
  root.style.removeProperty("--theme-success-foreground-light");
  root.style.removeProperty("--theme-warning-light");
  root.style.removeProperty("--theme-warning-foreground-light");
  root.style.removeProperty("--theme-destructive-light");
  root.style.removeProperty("--theme-destructive-foreground-light");
  root.style.removeProperty("--theme-border-light");
  root.style.removeProperty("--theme-input-light");
  root.style.removeProperty("--theme-background-dark");
  root.style.removeProperty("--theme-foreground-dark");
  root.style.removeProperty("--theme-card-dark");
  root.style.removeProperty("--theme-card-foreground-dark");
  root.style.removeProperty("--theme-muted-dark");
  root.style.removeProperty("--theme-muted-foreground-dark");
  root.style.removeProperty("--theme-accent-dark");
  root.style.removeProperty("--theme-accent-foreground-dark");
  root.style.removeProperty("--theme-secondary-dark");
  root.style.removeProperty("--theme-secondary-foreground-dark");
  root.style.removeProperty("--theme-success-dark");
  root.style.removeProperty("--theme-success-foreground-dark");
  root.style.removeProperty("--theme-warning-dark");
  root.style.removeProperty("--theme-warning-foreground-dark");
  root.style.removeProperty("--theme-destructive-dark");
  root.style.removeProperty("--theme-destructive-foreground-dark");
  root.style.removeProperty("--theme-border-dark");
  root.style.removeProperty("--theme-input-dark");
  root.style.removeProperty("--theme-primary-light");
  root.style.removeProperty("--theme-primary-dark");
  root.style.removeProperty("--primary");
  root.style.removeProperty("--ring");
  root.style.removeProperty("--radius");
  root.style.removeProperty("--theme-motion-overlay-duration-ms");
  root.style.removeProperty("--theme-motion-overlay-duration");
  root.style.removeProperty("--theme-motion-interactive-duration");
  root.style.removeProperty("--theme-motion-ease-standard");
}

export function ThemeCustomizer() {
  const [open, setOpen] = useState(false);
  const [activePreset, setActivePreset] = useState(DEFAULT_PRESET);
  const [activeRadius, setActiveRadius] = useState(DEFAULT_RADIUS);
  const [activeSurface, setActiveSurface] = useState(DEFAULT_SURFACE);
  const [surfaceTokens, setSurfaceTokens] = useState<SurfaceTokens>(
    getDefaultSurfaceTokens(),
  );
  const [overlayMs, setOverlayMs] = useState(DEFAULT_OVERLAY_MS);
  const [interactiveMs, setInteractiveMs] = useState(DEFAULT_INTERACTIVE_MS);
  const [activeEase, setActiveEase] = useState(DEFAULT_EASE);
  const [copied, setCopied] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);
  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const [jsonDraft, setJsonDraft] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [seedInput, setSeedInput] = useState("");

  const applyThemeAndPersist = useCallback(
    ({
      presetName,
      surfaceName,
      radiusValue,
      overlayDuration,
      interactiveDuration,
      easingValue,
    }: {
      presetName: string;
      surfaceName: string;
      radiusValue: string;
      overlayDuration: number;
      interactiveDuration: number;
      easingValue: string;
    }) => {
      const preset = getColorPresetByName(presetName);
      const surface = getSurfacePresetByName(surfaceName);

      setActivePreset(preset.name);
      setActiveSurface(surface.name);
      setSurfaceTokens(surface.tokens);
      setActiveRadius(radiusValue);
      setOverlayMs(overlayDuration);
      setInteractiveMs(interactiveDuration);
      setActiveEase(easingValue);

      applyVars(preset, surface.name, radiusValue, surface.tokens, {
        overlayMs: overlayDuration,
        interactiveMs: interactiveDuration,
        ease: easingValue,
      });

      const statusTokens = getStatusTokensForSurface(surface.name);

      save({
        preset: preset.name,
        primaryLight: preset.light,
        primaryDark: preset.dark,
        radius: radiusValue,
        surfaceName: surface.name,
        surfaceTokens: surface.tokens,
        statusTokens,
        overlayMs: overlayDuration,
        interactiveMs: interactiveDuration,
        ease: easingValue,
      });
    },
    [],
  );

  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      setActivePreset(saved.preset);
      setActiveRadius(saved.radius);
      setActiveSurface(saved.surfaceName ?? DEFAULT_SURFACE);
      setSurfaceTokens(saved.surfaceTokens ?? getDefaultSurfaceTokens());
      setOverlayMs(saved.overlayMs ?? DEFAULT_OVERLAY_MS);
      setInteractiveMs(saved.interactiveMs ?? DEFAULT_INTERACTIVE_MS);
      setActiveEase(saved.ease ?? DEFAULT_EASE);
    }
  }, []);

  useEffect(() => {
    const handler = () => setOpen((o) => !o);
    const closeOnSwap = () => setOpen(false);

    window.addEventListener("almach-customizer-toggle", handler);
    document.addEventListener("astro:before-swap", closeOnSwap);
    return () => {
      window.removeEventListener("almach-customizer-toggle", handler);
      document.removeEventListener("astro:before-swap", closeOnSwap);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const handler = () => {
      const preset = getColorPresetByName(activePreset);
      applyVars(preset, activeSurface, activeRadius, surfaceTokens, {
        overlayMs,
        interactiveMs,
        ease: activeEase,
      });
    };

    // Apply current theme state immediately (including saved theme on mount).
    handler();

    window.addEventListener("almach-theme-mode-changed", handler);
    return () =>
      window.removeEventListener("almach-theme-mode-changed", handler);
  }, [
    activePreset,
    activeSurface,
    activeRadius,
    surfaceTokens,
    overlayMs,
    interactiveMs,
    activeEase,
  ]);

  const selectPreset = useCallback(
    (preset: ColorPreset) => {
      applyThemeAndPersist({
        presetName: preset.name,
        surfaceName: activeSurface,
        radiusValue: activeRadius,
        overlayDuration: overlayMs,
        interactiveDuration: interactiveMs,
        easingValue: activeEase,
      });
    },
    [
      activeRadius,
      activeSurface,
      overlayMs,
      interactiveMs,
      activeEase,
      applyThemeAndPersist,
    ],
  );

  const selectRadius = useCallback(
    (r: RadiusPreset) => {
      applyThemeAndPersist({
        presetName: activePreset,
        surfaceName: activeSurface,
        radiusValue: r.value,
        overlayDuration: overlayMs,
        interactiveDuration: interactiveMs,
        easingValue: activeEase,
      });
    },
    [
      activePreset,
      activeSurface,
      overlayMs,
      interactiveMs,
      activeEase,
      applyThemeAndPersist,
    ],
  );

  const selectSurface = useCallback(
    (surface: SurfacePreset) => {
      applyThemeAndPersist({
        presetName: activePreset,
        surfaceName: surface.name,
        radiusValue: activeRadius,
        overlayDuration: overlayMs,
        interactiveDuration: interactiveMs,
        easingValue: activeEase,
      });
    },
    [
      activePreset,
      activeRadius,
      overlayMs,
      interactiveMs,
      activeEase,
      applyThemeAndPersist,
    ],
  );

  const applyPack = useCallback(
    (pack: ThemePack) => {
      applyThemeAndPersist({
        presetName: pack.color,
        surfaceName: pack.surface,
        radiusValue: pack.radius,
        overlayDuration: overlayMs,
        interactiveDuration: interactiveMs,
        easingValue: activeEase,
      });
    },
    [
      overlayMs,
      interactiveMs,
      activeEase,
      applyThemeAndPersist,
    ],
  );

  const randomizeTheme = useCallback(() => {
    const color = pickFromList(COLOR_PRESETS, FALLBACK_COLOR_PRESET);
    const surface = pickFromList(SURFACE_PRESETS, FALLBACK_SURFACE_PRESET);
    const radius = pickFromList(RADIUS_PRESETS, FALLBACK_RADIUS_PRESET);
    const motion = pickFromList(MOTION_PRESETS, FALLBACK_MOTION_PRESET);
    const easing = pickFromList(EASING_PRESETS, FALLBACK_EASING_PRESET);

    applyThemeAndPersist({
      presetName: color.name,
      surfaceName: surface.name,
      radiusValue: radius.value,
      overlayDuration: motion.overlayMs,
      interactiveDuration: motion.interactiveMs,
      easingValue: easing.value,
    });
  }, [applyThemeAndPersist]);

  const updateMotion = useCallback(
    (next: { overlayMs?: number; interactiveMs?: number; ease?: string }) => {
      const nextOverlay = next.overlayMs ?? overlayMs;
      const nextInteractive = next.interactiveMs ?? interactiveMs;
      const nextEase = next.ease ?? activeEase;

      applyThemeAndPersist({
        presetName: activePreset,
        surfaceName: activeSurface,
        radiusValue: activeRadius,
        overlayDuration: nextOverlay,
        interactiveDuration: nextInteractive,
        easingValue: nextEase,
      });
    },
    [
      activePreset,
      activeRadius,
      activeSurface,
      overlayMs,
      interactiveMs,
      activeEase,
      applyThemeAndPersist,
    ],
  );

  const buildThemePayload = useCallback(
    (): ThemeJSONPayload => ({
      preset: activePreset,
      surfaceName: activeSurface,
      radius: activeRadius,
      overlayMs,
      interactiveMs,
      ease: activeEase,
    }),
    [
      activePreset,
      activeSurface,
      activeRadius,
      overlayMs,
      interactiveMs,
      activeEase,
    ],
  );

  const generateFromSeed = useCallback(() => {
    const seed = seedInput.trim();
    if (!seed) {
      randomizeTheme();
      return;
    }

    const hash = hashSeed(seed);
    const color = COLOR_PRESETS[seededIndex(hash, 0, COLOR_PRESETS.length)];
    const surface =
      SURFACE_PRESETS[seededIndex(hash, 1, SURFACE_PRESETS.length)];
    const radius = RADIUS_PRESETS[seededIndex(hash, 2, RADIUS_PRESETS.length)];
    const motion = MOTION_PRESETS[seededIndex(hash, 3, MOTION_PRESETS.length)];
    const easing = EASING_PRESETS[seededIndex(hash, 4, EASING_PRESETS.length)];

    applyThemeAndPersist({
      presetName: color?.name ?? FALLBACK_COLOR_PRESET.name,
      surfaceName: surface?.name ?? FALLBACK_SURFACE_PRESET.name,
      radiusValue: radius?.value ?? FALLBACK_RADIUS_PRESET.value,
      overlayDuration: motion?.overlayMs ?? FALLBACK_MOTION_PRESET.overlayMs,
      interactiveDuration:
        motion?.interactiveMs ?? FALLBACK_MOTION_PRESET.interactiveMs,
      easingValue: easing?.value ?? FALLBACK_EASING_PRESET.value,
    });
  }, [applyThemeAndPersist, randomizeTheme, seedInput]);

  const copyThemeJSON = useCallback(() => {
    const payload = JSON.stringify(buildThemePayload(), null, 2);

    navigator.clipboard
      .writeText(payload)
      .then(() => {
        setJsonCopied(true);
        setTimeout(() => setJsonCopied(false), 2000);
      })
      .catch(() => {
        // Clipboard can be denied in some contexts.
      });
  }, [buildThemePayload]);

  const openJSONEditor = useCallback(() => {
    setJsonError(null);
    setShowJsonEditor(true);
    setJsonDraft(JSON.stringify(buildThemePayload(), null, 2));
  }, [buildThemePayload]);

  const applyJSONTheme = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonDraft) as ThemeJSONPayload;

      const presetName =
        typeof parsed.preset === "string" ? parsed.preset : activePreset;
      const surfaceName =
        typeof parsed.surfaceName === "string"
          ? parsed.surfaceName
          : activeSurface;
      const radiusValue =
        typeof parsed.radius === "string" &&
        RADIUS_PRESETS.some((r) => r.value === parsed.radius)
          ? parsed.radius
          : activeRadius;

      const overlayDuration = clampNumber(parsed.overlayMs, 0, 500, overlayMs);
      const interactiveDuration = clampNumber(
        parsed.interactiveMs,
        0,
        400,
        interactiveMs,
      );
      const easingValue =
        typeof parsed.ease === "string" &&
        EASING_PRESETS.some((easing) => easing.value === parsed.ease)
          ? parsed.ease
          : activeEase;

      applyThemeAndPersist({
        presetName,
        surfaceName,
        radiusValue,
        overlayDuration,
        interactiveDuration,
        easingValue,
      });
      setJsonError(null);
    } catch {
      setJsonError("Invalid JSON format. Please paste a valid theme payload.");
    }
  }, [
    jsonDraft,
    activePreset,
    activeSurface,
    activeRadius,
    overlayMs,
    interactiveMs,
    activeEase,
    applyThemeAndPersist,
  ]);

  const copyCSS = useCallback(() => {
    const preset = getColorPresetByName(activePreset);
    const statusTokens = getStatusTokensForSurface(activeSurface);
    const css = [
      `:root {`,
      `  --background: ${surfaceTokens.backgroundLight};`,
      `  --foreground: ${surfaceTokens.foregroundLight};`,
      `  --card: ${surfaceTokens.cardLight};`,
      `  --card-foreground: ${surfaceTokens.cardForegroundLight};`,
      `  --popover: ${surfaceTokens.cardLight};`,
      `  --popover-foreground: ${surfaceTokens.cardForegroundLight};`,
      `  --primary: ${preset.light};`,
      `  --primary-foreground: 0 0% 100%;`,
      `  --secondary: ${surfaceTokens.accentLight};`,
      `  --secondary-foreground: ${surfaceTokens.accentForegroundLight};`,
      `  --muted: ${surfaceTokens.mutedLight};`,
      `  --muted-foreground: ${surfaceTokens.mutedForegroundLight};`,
      `  --accent: ${surfaceTokens.accentLight};`,
      `  --accent-foreground: ${surfaceTokens.accentForegroundLight};`,
      `  --success: ${statusTokens.successLight};`,
      `  --success-foreground: ${statusTokens.successForegroundLight};`,
      `  --warning: ${statusTokens.warningLight};`,
      `  --warning-foreground: ${statusTokens.warningForegroundLight};`,
      `  --destructive: ${statusTokens.destructiveLight};`,
      `  --destructive-foreground: ${statusTokens.destructiveForegroundLight};`,
      `  --border: ${surfaceTokens.borderLight};`,
      `  --input: ${surfaceTokens.inputLight};`,
      `  --ring: ${preset.light};`,
      `  --radius: ${activeRadius};`,
      `  --theme-motion-overlay-duration-ms: ${overlayMs};`,
      `  --theme-motion-overlay-duration: ${overlayMs}ms;`,
      `  --theme-motion-interactive-duration: ${interactiveMs}ms;`,
      `  --theme-motion-ease-standard: ${activeEase};`,
      `}`,
      ``,
      `.dark {`,
      `  --background: ${surfaceTokens.backgroundDark};`,
      `  --foreground: ${surfaceTokens.foregroundDark};`,
      `  --card: ${surfaceTokens.cardDark};`,
      `  --card-foreground: ${surfaceTokens.cardForegroundDark};`,
      `  --popover: ${surfaceTokens.cardDark};`,
      `  --popover-foreground: ${surfaceTokens.cardForegroundDark};`,
      `  --primary: ${preset.dark};`,
      `  --primary-foreground: ${surfaceTokens.backgroundDark};`,
      `  --secondary: ${surfaceTokens.accentDark};`,
      `  --secondary-foreground: ${surfaceTokens.accentForegroundDark};`,
      `  --muted: ${surfaceTokens.mutedDark};`,
      `  --muted-foreground: ${surfaceTokens.mutedForegroundDark};`,
      `  --accent: ${surfaceTokens.accentDark};`,
      `  --accent-foreground: ${surfaceTokens.accentForegroundDark};`,
      `  --success: ${statusTokens.successDark};`,
      `  --success-foreground: ${statusTokens.successForegroundDark};`,
      `  --warning: ${statusTokens.warningDark};`,
      `  --warning-foreground: ${statusTokens.warningForegroundDark};`,
      `  --destructive: ${statusTokens.destructiveDark};`,
      `  --destructive-foreground: ${statusTokens.destructiveForegroundDark};`,
      `  --border: ${surfaceTokens.borderDark};`,
      `  --input: ${surfaceTokens.inputDark};`,
      `  --ring: ${preset.dark};`,
      `}`,
    ].join("\n");

    navigator.clipboard
      .writeText(css)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Clipboard can be denied in some contexts.
      });
  }, [
    activePreset,
    activeSurface,
    activeRadius,
    surfaceTokens,
    overlayMs,
    interactiveMs,
    activeEase,
  ]);

  const reset = useCallback(() => {
    setActivePreset(DEFAULT_PRESET);
    setActiveRadius(DEFAULT_RADIUS);
    setActiveSurface(DEFAULT_SURFACE);
    setSurfaceTokens(getDefaultSurfaceTokens());
    setOverlayMs(DEFAULT_OVERLAY_MS);
    setInteractiveMs(DEFAULT_INTERACTIVE_MS);
    setActiveEase(DEFAULT_EASE);
    clear();
    resetVars();
  }, []);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        role="dialog"
        aria-label="Theme customizer"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-50 flex w-80 flex-col border-l border-border/70 bg-background shadow-xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          transitionDuration: "var(--theme-motion-overlay-duration, 180ms)",
          transitionTimingFunction:
            "var(--theme-motion-ease-standard, cubic-bezier(0.22,1,0.36,1))",
        }}
      >
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
          <div>
            <p className="text-sm font-semibold">Theme Customizer</p>
            <p className="text-xs text-muted-foreground">
              Customize color, surfaces, radius, and clean motion.
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            aria-label="Close customizer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5">
          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Mode
            </p>
            <div className="rounded-lg border border-border/70 bg-card/40 p-2">
              <ThemeModeToggle compact={false} />
            </div>
          </section>

          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Theme presets
            </p>
            <div className="grid grid-cols-2 gap-2">
              {THEME_PACKS.map((pack) => {
                const color = COLOR_PRESETS.find((p) => p.name === pack.color);
                const active =
                  activePreset === pack.color &&
                  activeRadius === pack.radius &&
                  activeSurface === pack.surface;
                return (
                  <button
                    key={pack.name}
                    onClick={() => applyPack(pack)}
                    className={`cursor-pointer rounded-lg border p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                      active
                        ? "border-primary bg-primary/8"
                        : "border-border/70 hover:bg-accent"
                    }`}
                    aria-pressed={active}
                    aria-label={`${pack.name} theme pack`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium">{pack.name}</span>
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-border/70"
                        style={{
                          backgroundColor: color?.swatch ?? "transparent",
                        }}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {pack.note ?? `${pack.color} · ${pack.surface} · radius ${pack.radius}`}
                    </p>
                  </button>
                );
              })}
            </div>
            <button
              onClick={randomizeTheme}
              className="mt-2 w-full cursor-pointer rounded-lg border border-dashed border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            >
              Shuffle theme
            </button>

            <div className="mt-2 space-y-2">
              <label
                htmlFor="theme-seed"
                className="text-[11px] font-medium text-muted-foreground"
              >
                Deterministic generator
              </label>
              <div className="flex gap-2">
                <input
                  id="theme-seed"
                  type="text"
                  value={seedInput}
                  onChange={(event) => setSeedInput(event.target.value)}
                  placeholder="marketing-home-v2"
                  className="h-8 min-w-0 flex-1 rounded-md border border-input bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  onClick={generateFromSeed}
                  className="h-8 shrink-0 rounded-md border border-border/70 px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Generate
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Same seed always yields the same theme.
              </p>
            </div>
          </section>

          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Surface systems
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {CURATED_SURFACE_PRESETS.map((surface) => {
                const active = activeSurface === surface.name;
                return (
                  <button
                    key={surface.name}
                    onClick={() => selectSurface(surface)}
                    aria-pressed={active}
                    className={`cursor-pointer rounded-md border px-2 py-2 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "text-muted-foreground hover:border-primary/30 hover:bg-accent"
                    }`}
                  >
                    {surface.name}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Accent palette
            </p>
            <div className="grid grid-cols-4 gap-2">
              {CURATED_COLOR_PRESETS.map((preset) => {
                const active = activePreset === preset.name;
                return (
                  <button
                    key={preset.name}
                    onClick={() => selectPreset(preset)}
                    title={preset.name}
                    aria-pressed={active}
                    className={`group relative flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border p-2 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                      active
                        ? "border-primary bg-primary/6 text-primary"
                        : "text-muted-foreground hover:border-primary/30 hover:bg-accent"
                    }`}
                  >
                    <span
                      className="relative flex h-7 w-7 items-center justify-center rounded-full"
                      style={{ background: preset.swatch }}
                    >
                      {active && (
                        <Check
                          className="h-3.5 w-3.5 text-white drop-shadow"
                          strokeWidth={3}
                        />
                      )}
                    </span>
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Radius scale
            </p>
            <div className="flex flex-wrap gap-1.5">
              {RADIUS_PRESETS.map((r) => {
                const active = activeRadius === r.value;
                return (
                  <button
                    key={r.value}
                    onClick={() => selectRadius(r)}
                    aria-pressed={active}
                    className={`cursor-pointer rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "text-muted-foreground hover:border-primary/30 hover:bg-accent"
                    }`}
                  >
                    {r.name}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 rounded-lg border border-border/70 bg-card/40 p-3">
              <p className="mb-2 text-[11px] text-muted-foreground">Preview</p>
              <div className="space-y-2">
                <button
                  className="w-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                  style={{ borderRadius: activeRadius }}
                >
                  <Palette className="mr-1 inline h-3 w-3" />
                  Themed Button
                </button>
                <div
                  className="rounded-md border border-border/70 bg-background px-3 py-2 text-xs text-muted-foreground"
                  style={{ borderRadius: activeRadius }}
                >
                  Input preview
                </div>
              </div>
            </div>
          </section>

          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Motion presets
            </p>
            <div className="flex flex-wrap gap-1.5">
              {MOTION_PRESETS.map((preset) => {
                const active =
                  overlayMs === preset.overlayMs &&
                  interactiveMs === preset.interactiveMs;
                return (
                  <button
                    key={preset.name}
                    onClick={() =>
                      updateMotion({
                        overlayMs: preset.overlayMs,
                        interactiveMs: preset.interactiveMs,
                      })
                    }
                    aria-pressed={active}
                    className={`cursor-pointer rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "text-muted-foreground hover:border-primary/30 hover:bg-accent"
                    }`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 space-y-3 rounded-lg border border-border/70 bg-card/40 p-3">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Overlay duration</span>
                  <span>{overlayMs}ms</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={500}
                  step={10}
                  value={overlayMs}
                  onChange={(e) =>
                    updateMotion({ overlayMs: Number(e.target.value) })
                  }
                  className="w-full cursor-pointer"
                  aria-label="Overlay animation duration"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Interactive duration</span>
                  <span>{interactiveMs}ms</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={400}
                  step={10}
                  value={interactiveMs}
                  onChange={(e) =>
                    updateMotion({ interactiveMs: Number(e.target.value) })
                  }
                  className="w-full cursor-pointer"
                  aria-label="Interactive animation duration"
                />
              </div>

              <div className="rounded-md border border-border/70 bg-background px-3 py-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Animation preview</span>
                  <span>{activeEase}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 w-1/3 rounded-full bg-primary"
                    style={{
                      transform: `translateX(${open ? "0%" : "200%"})`,
                      transitionDuration:
                        "var(--theme-motion-interactive-duration, 150ms)",
                      transitionTimingFunction:
                        "var(--theme-motion-ease-standard, cubic-bezier(0.22,1,0.36,1))",
                      transitionProperty: "transform",
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Easing curve
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {EASING_PRESETS.map((easing) => {
                const active = activeEase === easing.value;
                return (
                  <button
                    key={easing.name}
                    onClick={() => updateMotion({ ease: easing.value })}
                    aria-pressed={active}
                    className={`cursor-pointer rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "text-muted-foreground hover:border-primary/30 hover:bg-accent"
                    }`}
                  >
                    {easing.name}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Theme payload
            </p>
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={copyThemeJSON}
                  className={`flex-1 cursor-pointer rounded-md border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                    jsonCopied
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/70 text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {jsonCopied ? "JSON Copied" : "Copy JSON"}
                </button>
                <button
                  onClick={openJSONEditor}
                  className="cursor-pointer rounded-md border border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                >
                  Edit JSON
                </button>
              </div>

              {showJsonEditor && (
                <div className="space-y-2 rounded-lg border border-border/70 bg-card/40 p-2.5">
                  <textarea
                    value={jsonDraft}
                    onChange={(event) => setJsonDraft(event.target.value)}
                    className="min-h-28 w-full rounded-md border border-input bg-background px-2.5 py-2 font-mono text-[11px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Theme JSON editor"
                  />
                  {jsonError && (
                    <p className="text-[11px] text-destructive">{jsonError}</p>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setShowJsonEditor(false);
                        setJsonError(null);
                      }}
                      className="rounded-md border border-border/70 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={applyJSONTheme}
                      className="rounded-md border border-primary/60 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
                    >
                      Apply JSON
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-2 border-t border-border/70 px-5 py-4">
          <button
            onClick={copyCSS}
            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
              copied
                ? "border-primary bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {copied ? (
              <>
                <ClipboardCheck className="h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy CSS Variables
              </>
            )}
          </button>

          <button
            onClick={reset}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to defaults
          </button>
        </div>
      </div>
    </>
  );
}
