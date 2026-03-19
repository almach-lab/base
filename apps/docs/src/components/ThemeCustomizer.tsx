import React, { useEffect, useState, useCallback } from "react";
import { Check, X, RotateCcw, Copy, ClipboardCheck } from "lucide-react";

/* ── Preset data ─────────────────────────────────────────────────────────── */

interface ColorPreset {
  name: string;
  light: string;   // HSL values for --primary in light mode
  dark: string;    // HSL values for --primary in dark mode
  swatch: string;  // CSS color string for the swatch circle
}

const COLOR_PRESETS: ColorPreset[] = [
  { name: "Golden",  light: "43 90% 44%",  dark: "43 92% 58%",  swatch: "hsl(43 90% 44%)"  },
  { name: "Blue",    light: "217 91% 55%", dark: "213 93% 67%", swatch: "hsl(217 91% 55%)" },
  { name: "Violet",  light: "262 80% 52%", dark: "263 85% 70%", swatch: "hsl(262 80% 52%)" },
  { name: "Rose",    light: "346 84% 52%", dark: "347 87% 65%", swatch: "hsl(346 84% 52%)" },
  { name: "Emerald", light: "158 64% 40%", dark: "160 68% 54%", swatch: "hsl(158 64% 40%)" },
  { name: "Orange",  light: "25 95% 50%",  dark: "25 95% 63%",  swatch: "hsl(25 95% 50%)"  },
  { name: "Cyan",    light: "189 90% 44%", dark: "189 90% 56%", swatch: "hsl(189 90% 44%)" },
  { name: "Pink",    light: "330 81% 57%", dark: "330 82% 68%", swatch: "hsl(330 81% 57%)" },
];

interface RadiusPreset { name: string; value: string; }

const RADIUS_PRESETS: RadiusPreset[] = [
  { name: "None",  value: "0rem"      },
  { name: "Sm",    value: "0.375rem"  },
  { name: "Md",    value: "0.625rem"  },
  { name: "Lg",    value: "1rem"      },
  { name: "Full",  value: "1.5rem"    },
];

const DEFAULT_PRESET = "Golden";
const DEFAULT_RADIUS = "0.625rem";
const STORAGE_KEY    = "almach-theme";

/* ── Persistence helpers ─────────────────────────────────────────────────── */

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
  } catch { return null; }
}

function save(data: SavedTheme) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* noop */ }
}

function clear() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
}

function isDarkMode() {
  return document.documentElement.classList.contains("dark");
}

/* ── Apply to DOM ────────────────────────────────────────────────────────── */

function applyVars(preset: ColorPreset, radius: string) {
  const root  = document.documentElement;
  const dark  = isDarkMode();
  const color = dark ? preset.dark : preset.light;
  root.style.setProperty("--primary", color);
  root.style.setProperty("--ring",    color);
  root.style.setProperty("--radius",  radius);
}

function resetVars() {
  const root = document.documentElement;
  root.style.removeProperty("--primary");
  root.style.removeProperty("--ring");
  root.style.removeProperty("--radius");
}

/* ── Component ───────────────────────────────────────────────────────────── */

export function ThemeCustomizer() {
  const [open,          setOpen]          = useState(false);
  const [activePreset,  setActivePreset]  = useState(DEFAULT_PRESET);
  const [activeRadius,  setActiveRadius]  = useState(DEFAULT_RADIUS);
  const [copied,        setCopied]        = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      setActivePreset(saved.preset);
      setActiveRadius(saved.radius);
    }
  }, []);

  // Listen for the header button click (dispatched by Layout.astro script)
  useEffect(() => {
    const handler = () => setOpen((o) => !o);
    window.addEventListener("almach-customizer-toggle", handler);
    return () => window.removeEventListener("almach-customizer-toggle", handler);
  }, []);

  // Listen for dark/light mode changes so preview colors stay in sync
  useEffect(() => {
    const handler = () => {
      const preset = COLOR_PRESETS.find((p) => p.name === activePreset) ?? COLOR_PRESETS[0];
      applyVars(preset, activeRadius);
    };
    window.addEventListener("almach-theme-mode-changed", handler);
    return () => window.removeEventListener("almach-theme-mode-changed", handler);
  }, [activePreset, activeRadius]);

  const selectPreset = useCallback((preset: ColorPreset) => {
    setActivePreset(preset.name);
    applyVars(preset, activeRadius);
    save({ preset: preset.name, primaryLight: preset.light, primaryDark: preset.dark, radius: activeRadius });
  }, [activeRadius]);

  const selectRadius = useCallback((r: RadiusPreset) => {
    setActiveRadius(r.value);
    const preset = COLOR_PRESETS.find((p) => p.name === activePreset) ?? COLOR_PRESETS[0];
    applyVars(preset, r.value);
    save({ preset: activePreset, primaryLight: preset.light, primaryDark: preset.dark, radius: r.value });
  }, [activePreset]);

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
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        role="dialog"
        aria-label="Theme customizer"
        className={`
          fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l bg-background shadow-xl
          transition-transform duration-200 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <p className="text-sm font-semibold">Customize</p>
            <p className="text-xs text-muted-foreground">Adjust the theme to match your brand.</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Close customizer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">

          {/* Color */}
          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Color
            </p>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PRESETS.map((preset) => {
                const isActive = activePreset === preset.name;
                return (
                  <button
                    key={preset.name}
                    onClick={() => selectPreset(preset)}
                    title={preset.name}
                    className={`
                      group relative flex flex-col items-center gap-1.5 rounded-lg border p-2 text-[10px] font-medium
                      transition-colors
                      ${isActive
                        ? "border-primary bg-primary/6 text-primary"
                        : "text-muted-foreground hover:border-primary/30 hover:bg-accent"
                      }
                    `}
                  >
                    {/* Swatch */}
                    <span
                      className="relative flex h-7 w-7 items-center justify-center rounded-full"
                      style={{ background: preset.swatch }}
                    >
                      {isActive && (
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

          {/* Radius */}
          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Radius
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {RADIUS_PRESETS.map((r) => {
                const isActive = activeRadius === r.value;
                return (
                  <button
                    key={r.value}
                    onClick={() => selectRadius(r)}
                    className={`
                      rounded-md border px-3 py-1.5 text-xs font-medium transition-colors
                      ${isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "text-muted-foreground hover:border-primary/30 hover:bg-accent"
                      }
                    `}
                  >
                    {r.name}
                  </button>
                );
              })}
            </div>

            {/* Radius preview */}
            <div className="mt-4 grid grid-cols-5 gap-2">
              {RADIUS_PRESETS.map((r) => (
                <div
                  key={r.value}
                  onClick={() => selectRadius(r)}
                  title={r.name}
                  className={`
                    h-8 w-full cursor-pointer border-2 transition-colors
                    ${activeRadius === r.value ? "border-primary bg-primary/10" : "border-border bg-muted/30 hover:border-primary/30"}
                  `}
                  style={{ borderRadius: r.value }}
                />
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="border-t px-5 py-4 space-y-2">
          {/* CSS snippet preview */}
          <div className="rounded-md border bg-muted/40 px-3 py-2.5 font-mono text-[10px] leading-relaxed text-muted-foreground select-all">
            {(() => {
              const preset = COLOR_PRESETS.find((p) => p.name === activePreset) ?? COLOR_PRESETS[0];
              return (
                <>
                  <span className="text-foreground/50">:root {"{"}</span>{"\n"}
                  {"  "}<span className="text-primary/80">--primary</span>
                  {": hsl("}<span className="text-foreground/70">{preset.light}</span>{");"}{"\n"}
                  {"  "}<span className="text-primary/80">--ring</span>
                  {": hsl("}<span className="text-foreground/70">{preset.light}</span>{");"}{"\n"}
                  {"  "}<span className="text-primary/80">--radius</span>
                  {": "}<span className="text-foreground/70">{activeRadius}</span>{";"}{"\n"}
                  <span className="text-foreground/50">{"}"}</span>{"\n"}
                  {"\n"}
                  <span className="text-foreground/50">.dark {"{"}</span>{"\n"}
                  {"  "}<span className="text-primary/80">--primary</span>
                  {": hsl("}<span className="text-foreground/70">{preset.dark}</span>{");"}{"\n"}
                  {"  "}<span className="text-primary/80">--ring</span>
                  {": hsl("}<span className="text-foreground/70">{preset.dark}</span>{");"}{"\n"}
                  <span className="text-foreground/50">{"}"}</span>
                </>
              );
            })()}
          </div>

          {/* Action buttons */}
          <button
            onClick={copyCSS}
            className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              copied
                ? "border-primary bg-primary/10 text-primary"
                : "hover:bg-accent hover:text-foreground text-muted-foreground"
            }`}
          >
            {copied ? (
              <><ClipboardCheck className="h-3.5 w-3.5" />Copied!</>
            ) : (
              <><Copy className="h-3.5 w-3.5" />Copy CSS variables</>
            )}
          </button>

          <button
            onClick={reset}
            className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to defaults
          </button>
        </div>
      </div>
    </>
  );
}
