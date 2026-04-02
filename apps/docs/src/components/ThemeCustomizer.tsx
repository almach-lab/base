import React, { useEffect, useState, useCallback } from "react";
import { Check, X, RotateCcw, Copy, ClipboardCheck, Palette } from "lucide-react";

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

const COLOR_PRESETS: ColorPreset[] = [
  { name: "Golden", light: "43 90% 44%", dark: "43 92% 58%", swatch: "hsl(43 90% 44%)" },
  { name: "Blue", light: "217 91% 55%", dark: "213 93% 67%", swatch: "hsl(217 91% 55%)" },
  { name: "Sky", light: "199 89% 48%", dark: "198 93% 61%", swatch: "hsl(199 89% 48%)" },
  { name: "Cyan", light: "189 90% 44%", dark: "189 90% 56%", swatch: "hsl(189 90% 44%)" },
  { name: "Teal", light: "172 70% 40%", dark: "171 72% 53%", swatch: "hsl(172 70% 40%)" },
  { name: "Emerald", light: "158 64% 40%", dark: "160 68% 54%", swatch: "hsl(158 64% 40%)" },
  { name: "Lime", light: "85 76% 44%", dark: "85 70% 57%", swatch: "hsl(85 76% 44%)" },
  { name: "Orange", light: "25 95% 50%", dark: "25 95% 63%", swatch: "hsl(25 95% 50%)" },
  { name: "Rose", light: "346 84% 52%", dark: "347 87% 65%", swatch: "hsl(346 84% 52%)" },
  { name: "Pink", light: "330 81% 57%", dark: "330 82% 68%", swatch: "hsl(330 81% 57%)" },
  { name: "Violet", light: "262 80% 52%", dark: "263 85% 70%", swatch: "hsl(262 80% 52%)" },
  { name: "Slate", light: "221 39% 41%", dark: "217 32% 66%", swatch: "hsl(221 39% 41%)" },
];

const RADIUS_PRESETS: RadiusPreset[] = [
  { name: "None", value: "0rem" },
  { name: "Sm", value: "0.375rem" },
  { name: "Md", value: "0.625rem" },
  { name: "Lg", value: "0.875rem" },
  { name: "Xl", value: "1rem" },
  { name: "2xl", value: "1.25rem" },
];

const THEME_PACKS: ThemePack[] = [
  { name: "Core", color: "Golden", radius: "0.625rem" },
  { name: "SaaS", color: "Blue", radius: "0.625rem" },
  { name: "Dashboard", color: "Slate", radius: "0.375rem" },
  { name: "Creator", color: "Violet", radius: "1rem" },
  { name: "Commerce", color: "Orange", radius: "0.875rem" },
  { name: "Social", color: "Rose", radius: "1rem" },
];

const DEFAULT_PRESET = "Golden";
const DEFAULT_RADIUS = "0.625rem";
const STORAGE_KEY = "almach-theme";

interface SavedTheme {
  preset: string;
  primaryLight: string;
  primaryDark: string;
  radius: string;
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

function isDarkMode() {
  return document.documentElement.classList.contains("dark");
}

function applyVars(preset: ColorPreset, radius: string) {
  const root = document.documentElement;
  const dark = isDarkMode();
  const color = dark ? preset.dark : preset.light;
  root.style.setProperty("--primary", color);
  root.style.setProperty("--ring", color);
  root.style.setProperty("--radius", radius);
}

function resetVars() {
  const root = document.documentElement;
  root.style.removeProperty("--primary");
  root.style.removeProperty("--ring");
  root.style.removeProperty("--radius");
}

export function ThemeCustomizer() {
  const [open, setOpen] = useState(false);
  const [activePreset, setActivePreset] = useState(DEFAULT_PRESET);
  const [activeRadius, setActiveRadius] = useState(DEFAULT_RADIUS);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      setActivePreset(saved.preset);
      setActiveRadius(saved.radius);
    }
  }, []);

  useEffect(() => {
    const handler = () => setOpen((o) => !o);
    window.addEventListener("almach-customizer-toggle", handler);
    return () => window.removeEventListener("almach-customizer-toggle", handler);
  }, []);

  useEffect(() => {
    const handler = () => {
      const preset = COLOR_PRESETS.find((p) => p.name === activePreset) ?? COLOR_PRESETS[0];
      applyVars(preset, activeRadius);
    };
    window.addEventListener("almach-theme-mode-changed", handler);
    return () => window.removeEventListener("almach-theme-mode-changed", handler);
  }, [activePreset, activeRadius]);

  const selectPreset = useCallback(
    (preset: ColorPreset) => {
      setActivePreset(preset.name);
      applyVars(preset, activeRadius);
      save({ preset: preset.name, primaryLight: preset.light, primaryDark: preset.dark, radius: activeRadius });
    },
    [activeRadius],
  );

  const selectRadius = useCallback(
    (r: RadiusPreset) => {
      setActiveRadius(r.value);
      const preset = COLOR_PRESETS.find((p) => p.name === activePreset) ?? COLOR_PRESETS[0];
      applyVars(preset, r.value);
      save({ preset: activePreset, primaryLight: preset.light, primaryDark: preset.dark, radius: r.value });
    },
    [activePreset],
  );

  const applyPack = useCallback((pack: ThemePack) => {
    const preset = COLOR_PRESETS.find((p) => p.name === pack.color);
    if (!preset) return;
    setActivePreset(preset.name);
    setActiveRadius(pack.radius);
    applyVars(preset, pack.radius);
    save({ preset: preset.name, primaryLight: preset.light, primaryDark: preset.dark, radius: pack.radius });
  }, []);

  const copyCSS = useCallback(() => {
    const preset = COLOR_PRESETS.find((p) => p.name === activePreset) ?? COLOR_PRESETS[0];
    const css = [
      `:root {`,
      `  --primary: hsl(${preset.light});`,
      `  --ring: hsl(${preset.light});`,
      `  --radius: ${activeRadius};`,
      `}`,
      ``,
      `.dark {`,
      `  --primary: hsl(${preset.dark});`,
      `  --ring: hsl(${preset.dark});`,
      `}`,
    ].join("\n");

    navigator.clipboard.writeText(css).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [activePreset, activeRadius]);

  const reset = useCallback(() => {
    setActivePreset(DEFAULT_PRESET);
    setActiveRadius(DEFAULT_RADIUS);
    clear();
    resetVars();
  }, []);

  return (
    <>
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />}

      <div
        role="dialog"
        aria-label="Theme customizer"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-50 flex w-80 flex-col border-l border-border/70 bg-background shadow-xl transition-transform duration-200 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
          <div>
            <p className="text-sm font-semibold">Theme Customizer</p>
            <p className="text-xs text-muted-foreground">Choose a preset or customize color and radius.</p>
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
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Theme Packs</p>
            <div className="grid grid-cols-2 gap-2">
              {THEME_PACKS.map((pack) => {
                const color = COLOR_PRESETS.find((p) => p.name === pack.color);
                const active = activePreset === pack.color && activeRadius === pack.radius;
                return (
                  <button
                    key={pack.name}
                    onClick={() => applyPack(pack)}
                    className={`cursor-pointer rounded-lg border p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                      active ? "border-primary bg-primary/8" : "border-border/70 hover:bg-accent"
                    }`}
                    aria-pressed={active}
                    aria-label={`${pack.name} theme pack`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium">{pack.name}</span>
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-border/70"
                        style={{ backgroundColor: color?.swatch ?? "transparent" }}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">{pack.color} · radius {pack.radius}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Primary Color</p>
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
                      active ? "border-primary bg-primary/6 text-primary" : "text-muted-foreground hover:border-primary/30 hover:bg-accent"
                    }`}
                  >
                    <span className="relative flex h-7 w-7 items-center justify-center rounded-full" style={{ background: preset.swatch }}>
                      {active && <Check className="h-3.5 w-3.5 text-white drop-shadow" strokeWidth={3} />}
                    </span>
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Radius</p>
            <div className="flex flex-wrap gap-1.5">
              {RADIUS_PRESETS.map((r) => {
                const active = activeRadius === r.value;
                return (
                  <button
                    key={r.value}
                    onClick={() => selectRadius(r)}
                    aria-pressed={active}
                    className={`cursor-pointer rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                      active ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:border-primary/30 hover:bg-accent"
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
                <button className="w-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground" style={{ borderRadius: activeRadius }}>
                  <Palette className="mr-1 inline h-3 w-3" />
                  Themed Button
                </button>
                <div className="rounded-md border border-border/70 bg-background px-3 py-2 text-xs text-muted-foreground" style={{ borderRadius: activeRadius }}>
                  Input preview
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-2 border-t border-border/70 px-5 py-4">
          <button
            onClick={copyCSS}
            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
              copied ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
