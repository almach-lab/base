import {
  Check,
  ClipboardCheck,
  Copy,
  Palette,
  RotateCcw,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
  radius: string;
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

const THEME_PACKS: ThemePack[] = [
  { name: "Classic", color: "Golden", radius: "0.625rem" },
  { name: "Product", color: "Blue", radius: "0.625rem" },
  { name: "Admin", color: "Slate", radius: "0.375rem" },
  { name: "Studio", color: "Violet", radius: "1rem" },
  { name: "Market", color: "Orange", radius: "0.875rem" },
  { name: "Community", color: "Rose", radius: "1rem" },
  { name: "Fresh", color: "Lime", radius: "0.875rem" },
  { name: "Calm", color: "Sky", radius: "0.625rem" },
  { name: "Mint", color: "Teal", radius: "1rem" },
  { name: "Focus", color: "Cyan", radius: "0.375rem" },
];

const SURFACE_PRESETS: SurfacePreset[] = [
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
];

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
  overlayMs?: number;
  interactiveMs?: number;
  ease?: string;
}

function pickFromList<T>(list: T[], fallback: T): T {
  const picked = list[Math.floor(Math.random() * list.length)];
  return picked ?? fallback;
}

function getColorPresetByName(name: string): ColorPreset {
  return COLOR_PRESETS.find((p) => p.name === name) ?? FALLBACK_COLOR_PRESET;
}

function getSurfacePresetByName(name: string): SurfacePreset {
  return (
    SURFACE_PRESETS.find((s) => s.name === name) ?? FALLBACK_SURFACE_PRESET
  );
}

function getDefaultSurfaceTokens(): SurfaceTokens {
  return getSurfacePresetByName(DEFAULT_SURFACE).tokens;
}

function applySurfaceVars(tokens: SurfaceTokens) {
  const root = document.documentElement;
  root.style.setProperty("--theme-background-light", tokens.backgroundLight);
  root.style.setProperty("--theme-foreground-light", tokens.foregroundLight);
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

  root.style.setProperty("--theme-background-dark", tokens.backgroundDark);
  root.style.setProperty("--theme-foreground-dark", tokens.foregroundDark);
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
  radius: string,
  surfaces: SurfaceTokens,
  motion: { overlayMs: number; interactiveMs: number; ease: string },
) {
  const root = document.documentElement;
  const dark = root.classList.contains("dark");
  applySurfaceVars(surfaces);

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
    window.addEventListener("almach-customizer-toggle", handler);
    return () =>
      window.removeEventListener("almach-customizer-toggle", handler);
  }, []);

  useEffect(() => {
    const handler = () => {
      const preset = getColorPresetByName(activePreset);
      applyVars(preset, activeRadius, surfaceTokens, {
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
    activeRadius,
    surfaceTokens,
    overlayMs,
    interactiveMs,
    activeEase,
  ]);

  const selectPreset = useCallback(
    (preset: ColorPreset) => {
      setActivePreset(preset.name);
      applyVars(preset, activeRadius, surfaceTokens, {
        overlayMs,
        interactiveMs,
        ease: activeEase,
      });
      save({
        preset: preset.name,
        primaryLight: preset.light,
        primaryDark: preset.dark,
        radius: activeRadius,
        surfaceName: activeSurface,
        surfaceTokens,
        overlayMs,
        interactiveMs,
        ease: activeEase,
      });
    },
    [
      activeRadius,
      activeSurface,
      surfaceTokens,
      overlayMs,
      interactiveMs,
      activeEase,
    ],
  );

  const selectRadius = useCallback(
    (r: RadiusPreset) => {
      setActiveRadius(r.value);
      const preset = getColorPresetByName(activePreset);
      applyVars(preset, r.value, surfaceTokens, {
        overlayMs,
        interactiveMs,
        ease: activeEase,
      });
      save({
        preset: activePreset,
        primaryLight: preset.light,
        primaryDark: preset.dark,
        radius: r.value,
        surfaceName: activeSurface,
        surfaceTokens,
        overlayMs,
        interactiveMs,
        ease: activeEase,
      });
    },
    [
      activePreset,
      activeSurface,
      surfaceTokens,
      overlayMs,
      interactiveMs,
      activeEase,
    ],
  );

  const selectSurface = useCallback(
    (preset: SurfacePreset) => {
      const color = getColorPresetByName(activePreset);
      setActiveSurface(preset.name);
      setSurfaceTokens(preset.tokens);
      applyVars(color, activeRadius, preset.tokens, {
        overlayMs,
        interactiveMs,
        ease: activeEase,
      });
      save({
        preset: activePreset,
        primaryLight: color.light,
        primaryDark: color.dark,
        radius: activeRadius,
        surfaceName: preset.name,
        surfaceTokens: preset.tokens,
        overlayMs,
        interactiveMs,
        ease: activeEase,
      });
    },
    [activePreset, activeRadius, overlayMs, interactiveMs, activeEase],
  );

  const applyPack = useCallback(
    (pack: ThemePack) => {
      const preset = getColorPresetByName(pack.color);
      setActivePreset(preset.name);
      setActiveRadius(pack.radius);
      applyVars(preset, pack.radius, surfaceTokens, {
        overlayMs,
        interactiveMs,
        ease: activeEase,
      });
      save({
        preset: preset.name,
        primaryLight: preset.light,
        primaryDark: preset.dark,
        radius: pack.radius,
        surfaceName: activeSurface,
        surfaceTokens,
        overlayMs,
        interactiveMs,
        ease: activeEase,
      });
    },
    [activeSurface, surfaceTokens, overlayMs, interactiveMs, activeEase],
  );

  const randomizeTheme = useCallback(() => {
    const color = pickFromList(COLOR_PRESETS, FALLBACK_COLOR_PRESET);
    const surface = pickFromList(SURFACE_PRESETS, FALLBACK_SURFACE_PRESET);
    const radius = pickFromList(RADIUS_PRESETS, FALLBACK_RADIUS_PRESET);
    const motion = pickFromList(MOTION_PRESETS, FALLBACK_MOTION_PRESET);
    const easing = pickFromList(EASING_PRESETS, FALLBACK_EASING_PRESET);

    setActivePreset(color.name);
    setActiveSurface(surface.name);
    setSurfaceTokens(surface.tokens);
    setActiveRadius(radius.value);
    setOverlayMs(motion.overlayMs);
    setInteractiveMs(motion.interactiveMs);
    setActiveEase(easing.value);

    applyVars(color, radius.value, surface.tokens, {
      overlayMs: motion.overlayMs,
      interactiveMs: motion.interactiveMs,
      ease: easing.value,
    });

    save({
      preset: color.name,
      primaryLight: color.light,
      primaryDark: color.dark,
      radius: radius.value,
      surfaceName: surface.name,
      surfaceTokens: surface.tokens,
      overlayMs: motion.overlayMs,
      interactiveMs: motion.interactiveMs,
      ease: easing.value,
    });
  }, []);

  const updateMotion = useCallback(
    (next: { overlayMs?: number; interactiveMs?: number; ease?: string }) => {
      const nextOverlay = next.overlayMs ?? overlayMs;
      const nextInteractive = next.interactiveMs ?? interactiveMs;
      const nextEase = next.ease ?? activeEase;
      const preset = getColorPresetByName(activePreset);

      setOverlayMs(nextOverlay);
      setInteractiveMs(nextInteractive);
      setActiveEase(nextEase);
      applyVars(preset, activeRadius, surfaceTokens, {
        overlayMs: nextOverlay,
        interactiveMs: nextInteractive,
        ease: nextEase,
      });
      save({
        preset: activePreset,
        primaryLight: preset.light,
        primaryDark: preset.dark,
        radius: activeRadius,
        surfaceName: activeSurface,
        surfaceTokens,
        overlayMs: nextOverlay,
        interactiveMs: nextInteractive,
        ease: nextEase,
      });
    },
    [
      activePreset,
      activeRadius,
      activeSurface,
      surfaceTokens,
      overlayMs,
      interactiveMs,
      activeEase,
    ],
  );

  const copyCSS = useCallback(() => {
    const preset = getColorPresetByName(activePreset);
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
      `  --destructive: 0 84% 60%;`,
      `  --destructive-foreground: 0 0% 100%;`,
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
      `  --destructive: 0 72% 48%;`,
      `  --destructive-foreground: ${surfaceTokens.foregroundDark};`,
      `  --border: ${surfaceTokens.borderDark};`,
      `  --input: ${surfaceTokens.inputDark};`,
      `  --ring: ${preset.dark};`,
      `}`,
    ].join("\n");

    navigator.clipboard.writeText(css).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [
    activePreset,
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
              Theme Collections
            </p>
            <div className="grid grid-cols-2 gap-2">
              {THEME_PACKS.map((pack) => {
                const color = COLOR_PRESETS.find((p) => p.name === pack.color);
                const active =
                  activePreset === pack.color && activeRadius === pack.radius;
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
                      {pack.color} · radius {pack.radius}
                    </p>
                  </button>
                );
              })}
            </div>
            <button
              onClick={randomizeTheme}
              className="mt-2 w-full cursor-pointer rounded-lg border border-dashed border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            >
              Random theme
            </button>
          </section>

          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Surface Styles
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {SURFACE_PRESETS.map((surface) => {
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
              Primary Palette
            </p>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PRESETS.map((preset) => {
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
              Corner Radius
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
              Animation
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
              Easing
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
