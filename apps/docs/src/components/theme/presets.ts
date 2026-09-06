/**
 * Theme preset data and the CSS-variable plumbing behind the theme page.
 *
 * Kept apart from the UI so the customizer view stays presentational and the
 * preset tables can be read on their own.
 */

export interface ColorPreset {
  name: string;
  light: string;
  dark: string;
  swatch: string;
}

export interface RadiusPreset {
  name: string;
  value: string;
}

export interface ThemePack {
  name: string;
  color: string;
  surface: string;
  radius: string;
  category?: "mono" | "brand";
  note?: string;
}

export interface MotionPreset {
  name: string;
  overlayMs: number;
  interactiveMs: number;
}

export interface EasingPreset {
  name: string;
  value: string;
}

export interface SurfacePreset {
  name: string;
  tokens: SurfaceTokens;
}

export interface SurfaceTokens {
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

export interface StatusTokens {
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

export const COLOR_PRESETS: ColorPreset[] = [
  {
    name: "Golden",
    light: "43 90% 44%",
    dark: "43 92% 58%",
    swatch: "hsl(43, 90%, 44%)",
  },
  {
    name: "Blue",
    light: "217 91% 55%",
    dark: "213 93% 67%",
    swatch: "hsl(217, 91%, 55%)",
  },
  {
    name: "Sky",
    light: "199 89% 48%",
    dark: "198 93% 61%",
    swatch: "hsl(199, 89%, 48%)",
  },
  {
    name: "Cyan",
    light: "189 90% 44%",
    dark: "189 90% 56%",
    swatch: "hsl(189, 90%, 44%)",
  },
  {
    name: "Teal",
    light: "172 70% 40%",
    dark: "171 72% 53%",
    swatch: "hsl(172, 70%, 40%)",
  },
  {
    name: "Emerald",
    light: "158 64% 40%",
    dark: "160 68% 54%",
    swatch: "hsl(158, 64%, 40%)",
  },
  {
    name: "Lime",
    light: "85 76% 44%",
    dark: "85 70% 57%",
    swatch: "hsl(85, 76%, 44%)",
  },
  {
    name: "Orange",
    light: "25 95% 50%",
    dark: "25 95% 63%",
    swatch: "hsl(25, 95%, 50%)",
  },
  {
    name: "Rose",
    light: "346 84% 52%",
    dark: "347 87% 65%",
    swatch: "hsl(346, 84%, 52%)",
  },
  {
    name: "Pink",
    light: "330 81% 57%",
    dark: "330 82% 68%",
    swatch: "hsl(330, 81%, 57%)",
  },
  {
    name: "Violet",
    light: "262 80% 52%",
    dark: "263 85% 70%",
    swatch: "hsl(262, 80%, 52%)",
  },
  {
    name: "Slate",
    light: "221 39% 41%",
    dark: "217 32% 66%",
    swatch: "hsl(221, 39%, 41%)",
  },
];

export const RADIUS_PRESETS: RadiusPreset[] = [
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

export const THEME_PACKS: ThemePack[] = THEME_PACKS_RAW.filter(
  (pack, index, packs) =>
    packs.findIndex(
      (item) =>
        item.color === pack.color &&
        item.surface === pack.surface &&
        item.radius === pack.radius,
    ) === index,
);

export const SURFACE_PRESETS: SurfacePreset[] = [
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

export const CURATED_SURFACE_PRESETS = SURFACE_PRESETS.filter((surface) =>
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

export const CURATED_COLOR_PRESETS = COLOR_PRESETS.filter((preset) =>
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

export const MOTION_PRESETS: MotionPreset[] = [
  { name: "Snappy", overlayMs: 120, interactiveMs: 100 },
  { name: "Balanced", overlayMs: 180, interactiveMs: 150 },
  { name: "Relaxed", overlayMs: 260, interactiveMs: 220 },
  { name: "Instant", overlayMs: 0, interactiveMs: 0 },
];

export const EASING_PRESETS: EasingPreset[] = [
  { name: "Standard", value: "cubic-bezier(0.22,1,0.36,1)" },
  { name: "Smooth", value: "cubic-bezier(0.25,0.46,0.45,0.94)" },
  { name: "Ease", value: "ease" },
  { name: "Linear", value: "linear" },
];

export const FALLBACK_COLOR_PRESET: ColorPreset = {
  name: "Golden",
  light: "43 90% 44%",
  dark: "43 92% 58%",
  swatch: "hsl(43, 90%, 44%)",
};

export const FALLBACK_RADIUS_PRESET: RadiusPreset = {
  name: "Md",
  value: "0.625rem",
};

export const FALLBACK_MOTION_PRESET: MotionPreset = {
  name: "Balanced",
  overlayMs: 180,
  interactiveMs: 150,
};

export const FALLBACK_EASING_PRESET: EasingPreset = {
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

export const FALLBACK_SURFACE_PRESET: SurfacePreset = {
  name: "Clean",
  tokens: FALLBACK_SURFACE_TOKENS,
};

export const DEFAULT_PRESET = "Golden";
export const DEFAULT_RADIUS = "0.625rem";
export const DEFAULT_SURFACE = "Clean";
export const DEFAULT_OVERLAY_MS = 180;
export const DEFAULT_INTERACTIVE_MS = 150;
export const DEFAULT_EASE = "cubic-bezier(0.22,1,0.36,1)";
const STORAGE_KEY = "almach-theme";

export interface SavedTheme {
  preset: string;
  /** Set when the accent came from the colour picker rather than a preset. */
  customAccent?: ColorPreset;
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

export interface ThemeJSONPayload {
  preset?: string;
  surfaceName?: string;
  radius?: string;
  overlayMs?: number;
  interactiveMs?: number;
  ease?: string;
}

export function loadSaved(): SavedTheme | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedTheme) : null;
  } catch {
    return null;
  }
}

export function save(data: SavedTheme) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // noop
  }
}

export function clearSaved() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

export function hashSeed(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededIndex(seed: number, salt: number, length: number) {
  if (length <= 0) return 0;
  const mixed = (seed ^ Math.imul(salt + 1, 2654435761)) >>> 0;
  return mixed % length;
}

export function clampNumber(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
) {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function pickFromList<T>(list: T[], fallback: T): T {
  const picked = list[Math.floor(Math.random() * list.length)];
  return picked ?? fallback;
}

export function getColorPresetByName(name: string): ColorPreset {
  return COLOR_PRESETS.find((p) => p.name === name) ?? FALLBACK_COLOR_PRESET;
}

export function getSurfacePresetByName(name: string): SurfacePreset {
  const normalizedName = SURFACE_NAME_ALIASES[name] ?? name;
  return (
    SURFACE_PRESETS.find((s) => s.name === normalizedName) ??
    FALLBACK_SURFACE_PRESET
  );
}

/**
 * Builds a preset from an arbitrary colour.
 *
 * The token pairs in `COLOR_PRESETS` all share a hue and saturation and
 * differ only in lightness, so a picked colour is used as-is for light mode and
 * lifted for dark mode, where a mid-tone accent would otherwise sit too close
 * to the surface.
 */
/**
 * Turns a stored `"43 90% 44%"` triple into a CSS colour string, which is what
 * `parseColor` and inline styles both expect.
 */
export function hslTripleToCss(triple: string): string {
  const [h, s, l] = triple.trim().split(/\s+/);
  if (!h || !s || !l) return "hsl(0, 0%, 0%)";
  return `hsl(${h}, ${s}, ${l})`;
}

export function deriveAccentPreset(css: string): ColorPreset | null {
  const hsl = cssToHsl(css);
  if (!hsl) return null;

  const { h, s, l } = hsl;
  const round = (value: number) => Math.round(value * 100) / 100;
  // Dark mode wants the accent no darker than mid-lightness to stay legible.
  const darkL = Math.min(Math.max(l, 55), 72);

  // A neutral stays neutral — bumping saturation would invent a hue.
  const darkS = s === 0 ? 0 : Math.min(s + 2, 100);

  return {
    name: "Custom",
    light: `${round(h)} ${round(s)}% ${round(l)}%`,
    dark: `${round(h)} ${round(darkS)}% ${round(darkL)}%`,
    swatch: css,
  };
}

/** Parses hex or `hsl()`/`rgb()` notation into HSL numbers. */
function cssToHsl(css: string): { h: number; s: number; l: number } | null {
  const value = css.trim();

  const hslMatch = /^hsla?\(\s*([\d.]+)[\s,]+([\d.]+)%[\s,]+([\d.]+)%/i.exec(
    value,
  );
  if (hslMatch?.[1] && hslMatch[2] && hslMatch[3]) {
    return {
      h: Number(hslMatch[1]),
      s: Number(hslMatch[2]),
      l: Number(hslMatch[3]),
    };
  }

  const rgb = cssToRgb(value);
  if (!rgb) return null;
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

function cssToRgb(value: string): { r: number; g: number; b: number } | null {
  const hex = /^#([0-9a-f]{3,8})$/i.exec(value);
  if (hex?.[1]) {
    const digits = hex[1];
    const expand = (part: string) => Number.parseInt(part.repeat(2), 16);

    if (digits.length === 3 || digits.length === 4) {
      const [r, g, b] = digits;
      if (!r || !g || !b) return null;
      return { r: expand(r), g: expand(g), b: expand(b) };
    }
    if (digits.length === 6 || digits.length === 8) {
      return {
        r: Number.parseInt(digits.slice(0, 2), 16),
        g: Number.parseInt(digits.slice(2, 4), 16),
        b: Number.parseInt(digits.slice(4, 6), 16),
      };
    }
    return null;
  }

  const rgbMatch = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(
    value,
  );
  if (rgbMatch?.[1] && rgbMatch[2] && rgbMatch[3]) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
    };
  }

  return null;
}

function rgbToHsl(r255: number, g255: number, b255: number) {
  const r = r255 / 255;
  const g = g255 / 255;
  const b = b255 / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;

  if (delta === 0) return { h: 0, s: 0, l: l * 100 };

  const s = delta / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h *= 60;
  if (h < 0) h += 360;

  return { h, s: s * 100, l: l * 100 };
}

export function getDefaultSurfaceTokens(): SurfaceTokens {
  return getSurfacePresetByName(DEFAULT_SURFACE).tokens;
}

export function getStatusTokensForSurface(surfaceName: string): StatusTokens {
  if (surfaceName.startsWith("Mono")) {
    return STATUS_TOKENS_MONO;
  }

  return STATUS_TOKENS_DEFAULT;
}

export function applyVars(
  preset: ColorPreset,
  surfaceName: string,
  radius: string,
  surfaces: SurfaceTokens,
  motion: { overlayMs: number; interactiveMs: number; ease: string },
) {
  const root = document.documentElement;
  const dark = root.classList.contains("dark");
  const statusTokens = getStatusTokensForSurface(surfaceName);

  root.style.setProperty(
    "--background",
    dark ? surfaces.backgroundDark : surfaces.backgroundLight,
  );
  root.style.setProperty(
    "--foreground",
    dark ? surfaces.foregroundDark : surfaces.foregroundLight,
  );
  root.style.setProperty(
    "--card",
    dark ? surfaces.cardDark : surfaces.cardLight,
  );
  root.style.setProperty(
    "--card-foreground",
    dark ? surfaces.cardForegroundDark : surfaces.cardForegroundLight,
  );
  root.style.setProperty(
    "--muted",
    dark ? surfaces.mutedDark : surfaces.mutedLight,
  );
  root.style.setProperty(
    "--muted-foreground",
    dark ? surfaces.mutedForegroundDark : surfaces.mutedForegroundLight,
  );
  root.style.setProperty(
    "--accent",
    dark ? surfaces.accentDark : surfaces.accentLight,
  );
  root.style.setProperty(
    "--accent-foreground",
    dark ? surfaces.accentForegroundDark : surfaces.accentForegroundLight,
  );
  root.style.setProperty(
    "--border",
    dark ? surfaces.borderDark : surfaces.borderLight,
  );
  root.style.setProperty(
    "--input",
    dark ? surfaces.inputDark : surfaces.inputLight,
  );
  root.style.setProperty(
    "--secondary",
    dark ? surfaces.accentDark : surfaces.accentLight,
  );
  root.style.setProperty(
    "--secondary-foreground",
    dark ? surfaces.accentForegroundDark : surfaces.accentForegroundLight,
  );

  root.style.setProperty(
    "--success",
    dark ? statusTokens.successDark : statusTokens.successLight,
  );
  root.style.setProperty(
    "--success-foreground",
    dark
      ? statusTokens.successForegroundDark
      : statusTokens.successForegroundLight,
  );
  root.style.setProperty(
    "--warning",
    dark ? statusTokens.warningDark : statusTokens.warningLight,
  );
  root.style.setProperty(
    "--warning-foreground",
    dark
      ? statusTokens.warningForegroundDark
      : statusTokens.warningForegroundLight,
  );
  root.style.setProperty(
    "--destructive",
    dark ? statusTokens.destructiveDark : statusTokens.destructiveLight,
  );
  root.style.setProperty(
    "--destructive-foreground",
    dark
      ? statusTokens.destructiveForegroundDark
      : statusTokens.destructiveForegroundLight,
  );

  root.style.setProperty("--primary", dark ? preset.dark : preset.light);
  root.style.setProperty("--ring", dark ? preset.dark : preset.light);

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

export function resetVars() {
  const root = document.documentElement;
  const props = [
    "--background",
    "--foreground",
    "--card",
    "--card-foreground",
    "--muted",
    "--muted-foreground",
    "--accent",
    "--accent-foreground",
    "--border",
    "--input",
    "--secondary",
    "--secondary-foreground",
    "--success",
    "--success-foreground",
    "--warning",
    "--warning-foreground",
    "--destructive",
    "--destructive-foreground",
    "--primary",
    "--ring",
    "--radius",
    "--theme-motion-overlay-duration-ms",
    "--theme-motion-overlay-duration",
    "--theme-motion-interactive-duration",
    "--theme-motion-ease-standard",
  ];
  for (const prop of props) {
    root.style.removeProperty(prop);
  }
}
