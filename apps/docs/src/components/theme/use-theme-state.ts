import { useCallback, useEffect, useState } from "react";
import {
  applyVars,
  clampNumber,
  clearSaved,
  type ColorPreset,
  COLOR_PRESETS,
  DEFAULT_EASE,
  DEFAULT_INTERACTIVE_MS,
  DEFAULT_OVERLAY_MS,
  DEFAULT_PRESET,
  DEFAULT_RADIUS,
  DEFAULT_SURFACE,
  deriveAccentPreset,
  EASING_PRESETS,
  FALLBACK_COLOR_PRESET,
  FALLBACK_EASING_PRESET,
  FALLBACK_MOTION_PRESET,
  FALLBACK_RADIUS_PRESET,
  FALLBACK_SURFACE_PRESET,
  getColorPresetByName,
  getDefaultSurfaceTokens,
  getStatusTokensForSurface,
  getSurfacePresetByName,
  hashSeed,
  loadSaved,
  MOTION_PRESETS,
  pickFromList,
  RADIUS_PRESETS,
  resetVars,
  save,
  seededIndex,
  type SurfacePreset,
  SURFACE_PRESETS,
  type SurfaceTokens,
  type ThemeJSONPayload,
  type ThemePack,
} from "./presets";

/** Every value the theme page can change, in one object. */
export interface ThemeSelection {
  preset: string;
  /**
   * Set when the accent came from the colour picker. It wins over `preset`,
   * and picking a named preset clears it.
   */
  customAccent?: ColorPreset | undefined;
  surface: string;
  radius: string;
  overlayMs: number;
  interactiveMs: number;
  ease: string;
}

const DEFAULT_SELECTION: ThemeSelection = {
  preset: DEFAULT_PRESET,
  surface: DEFAULT_SURFACE,
  radius: DEFAULT_RADIUS,
  overlayMs: DEFAULT_OVERLAY_MS,
  interactiveMs: DEFAULT_INTERACTIVE_MS,
  ease: DEFAULT_EASE,
};

function initialSelection(): ThemeSelection {
  if (typeof window === "undefined") return DEFAULT_SELECTION;

  const saved = loadSaved();
  if (!saved) return DEFAULT_SELECTION;

  return {
    preset: saved.preset ?? DEFAULT_SELECTION.preset,
    ...(saved.customAccent ? { customAccent: saved.customAccent } : {}),
    surface: saved.surfaceName ?? DEFAULT_SELECTION.surface,
    radius: saved.radius ?? DEFAULT_SELECTION.radius,
    overlayMs: saved.overlayMs ?? DEFAULT_SELECTION.overlayMs,
    interactiveMs: saved.interactiveMs ?? DEFAULT_SELECTION.interactiveMs,
    ease: saved.ease ?? DEFAULT_SELECTION.ease,
  };
}

export interface ThemeState {
  selection: ThemeSelection;
  surfaceTokens: SurfaceTokens;
  /** Patch one or more fields; the rest are carried over. */
  update: (patch: Partial<ThemeSelection>) => void;
  applyPack: (pack: ThemePack) => void;
  /** Applies an arbitrary colour as the accent, deriving its dark variant. */
  setCustomAccent: (css: string) => void;
  shuffle: () => void;
  /** Same seed always produces the same theme. Empty seed shuffles instead. */
  applySeed: (seed: string) => void;
  reset: () => void;
  /** Serialisable form of the current selection. */
  toJSON: () => ThemeJSONPayload;
  /** Applies a payload, ignoring any field that is missing or out of range. */
  fromJSON: (payload: ThemeJSONPayload) => void;
  toCSS: () => string;
}

/**
 * Owns the theme selection: React state, the CSS variables on `<html>`, and
 * the persisted copy in localStorage, kept in step by a single `update` path.
 */
export function useThemeState(): ThemeState {
  const [selection, setSelection] = useState<ThemeSelection>(initialSelection);
  const [surfaceTokens, setSurfaceTokens] = useState<SurfaceTokens>(() =>
    typeof window === "undefined"
      ? getDefaultSurfaceTokens()
      : (loadSaved()?.surfaceTokens ?? getDefaultSurfaceTokens()),
  );

  const update = useCallback((patch: Partial<ThemeSelection>) => {
    setSelection((previous) => {
      const next: ThemeSelection = { ...previous, ...patch };
      // A named preset and a picked colour are mutually exclusive.
      if (patch.preset !== undefined && patch.customAccent === undefined) {
        next.customAccent = undefined;
      }

      const color = next.customAccent ?? getColorPresetByName(next.preset);
      const surface = getSurfacePresetByName(next.surface);

      if (!next.customAccent) next.preset = color.name;
      next.surface = surface.name;
      setSurfaceTokens(surface.tokens);

      applyVars(color, surface.name, next.radius, surface.tokens, {
        overlayMs: next.overlayMs,
        interactiveMs: next.interactiveMs,
        ease: next.ease,
      });

      save({
        preset: next.preset,
        ...(next.customAccent ? { customAccent: next.customAccent } : {}),
        primaryLight: color.light,
        primaryDark: color.dark,
        radius: next.radius,
        surfaceName: surface.name,
        surfaceTokens: surface.tokens,
        statusTokens: getStatusTokensForSurface(surface.name),
        overlayMs: next.overlayMs,
        interactiveMs: next.interactiveMs,
        ease: next.ease,
      });

      return next;
    });
  }, []);

  // Re-apply on mount, and whenever light/dark flips, since the variables
  // differ per mode.
  useEffect(() => {
    const apply = () => {
      applyVars(
        selection.customAccent ?? getColorPresetByName(selection.preset),
        selection.surface,
        selection.radius,
        surfaceTokens,
        {
          overlayMs: selection.overlayMs,
          interactiveMs: selection.interactiveMs,
          ease: selection.ease,
        },
      );
    };

    apply();
    window.addEventListener("almach-theme-mode-changed", apply);
    return () => window.removeEventListener("almach-theme-mode-changed", apply);
  }, [selection, surfaceTokens]);

  const applyPack = useCallback(
    (pack: ThemePack) => {
      update({
        preset: pack.color,
        surface: pack.surface,
        radius: pack.radius,
      });
    },
    [update],
  );

  const shuffle = useCallback(() => {
    const color = pickFromList(COLOR_PRESETS, FALLBACK_COLOR_PRESET);
    const surface = pickFromList(SURFACE_PRESETS, FALLBACK_SURFACE_PRESET);
    const radius = pickFromList(RADIUS_PRESETS, FALLBACK_RADIUS_PRESET);
    const motion = pickFromList(MOTION_PRESETS, FALLBACK_MOTION_PRESET);
    const easing = pickFromList(EASING_PRESETS, FALLBACK_EASING_PRESET);

    update({
      preset: color.name,
      surface: surface.name,
      radius: radius.value,
      overlayMs: motion.overlayMs,
      interactiveMs: motion.interactiveMs,
      ease: easing.value,
    });
  }, [update]);

  const applySeed = useCallback(
    (seed: string) => {
      const trimmed = seed.trim();
      if (!trimmed) {
        shuffle();
        return;
      }

      const hash = hashSeed(trimmed);
      const color = COLOR_PRESETS[seededIndex(hash, 0, COLOR_PRESETS.length)];
      const surface =
        SURFACE_PRESETS[seededIndex(hash, 1, SURFACE_PRESETS.length)];
      const radius =
        RADIUS_PRESETS[seededIndex(hash, 2, RADIUS_PRESETS.length)];
      const motion =
        MOTION_PRESETS[seededIndex(hash, 3, MOTION_PRESETS.length)];
      const easing =
        EASING_PRESETS[seededIndex(hash, 4, EASING_PRESETS.length)];

      update({
        preset: color?.name ?? FALLBACK_COLOR_PRESET.name,
        surface: surface?.name ?? FALLBACK_SURFACE_PRESET.name,
        radius: radius?.value ?? FALLBACK_RADIUS_PRESET.value,
        overlayMs: motion?.overlayMs ?? FALLBACK_MOTION_PRESET.overlayMs,
        interactiveMs:
          motion?.interactiveMs ?? FALLBACK_MOTION_PRESET.interactiveMs,
        ease: easing?.value ?? FALLBACK_EASING_PRESET.value,
      });
    },
    [shuffle, update],
  );

  /** Applies an arbitrary colour as the accent, deriving its dark variant. */
  const setCustomAccent = useCallback(
    (css: string) => {
      const derived = deriveAccentPreset(css);
      if (derived) update({ customAccent: derived });
    },
    [update],
  );

  const reset = useCallback(() => {
    setSelection(DEFAULT_SELECTION);
    setSurfaceTokens(getDefaultSurfaceTokens());
    clearSaved();
    // Drop the inline variables so the stylesheet defaults take over again.
    resetVars();
  }, []);

  const toJSON = useCallback(
    (): ThemeJSONPayload => ({
      preset: selection.preset,
      surfaceName: selection.surface,
      radius: selection.radius,
      overlayMs: selection.overlayMs,
      interactiveMs: selection.interactiveMs,
      ease: selection.ease,
    }),
    [selection],
  );

  const fromJSON = useCallback(
    (payload: ThemeJSONPayload) => {
      const isKnownRadius =
        typeof payload.radius === "string" &&
        RADIUS_PRESETS.some((entry) => entry.value === payload.radius);
      const isKnownEase =
        typeof payload.ease === "string" &&
        EASING_PRESETS.some((entry) => entry.value === payload.ease);

      update({
        ...(typeof payload.preset === "string"
          ? { preset: payload.preset }
          : {}),
        ...(typeof payload.surfaceName === "string"
          ? { surface: payload.surfaceName }
          : {}),
        ...(isKnownRadius ? { radius: payload.radius as string } : {}),
        ...(isKnownEase ? { ease: payload.ease as string } : {}),
        overlayMs: clampNumber(payload.overlayMs, 0, 500, selection.overlayMs),
        interactiveMs: clampNumber(
          payload.interactiveMs,
          0,
          400,
          selection.interactiveMs,
        ),
      });
    },
    [selection.interactiveMs, selection.overlayMs, update],
  );

  const toCSS = useCallback(() => {
    const color =
      selection.customAccent ?? getColorPresetByName(selection.preset);
    const status = getStatusTokensForSurface(selection.surface);
    const t = surfaceTokens;

    const light: Array<[string, string]> = [
      ["background", t.backgroundLight],
      ["foreground", t.foregroundLight],
      ["card", t.cardLight],
      ["card-foreground", t.cardForegroundLight],
      ["popover", t.cardLight],
      ["popover-foreground", t.cardForegroundLight],
      ["primary", color.light],
      ["primary-foreground", "0 0% 100%"],
      ["secondary", t.accentLight],
      ["secondary-foreground", t.accentForegroundLight],
      ["muted", t.mutedLight],
      ["muted-foreground", t.mutedForegroundLight],
      ["accent", t.accentLight],
      ["accent-foreground", t.accentForegroundLight],
      ["success", status.successLight],
      ["success-foreground", status.successForegroundLight],
      ["warning", status.warningLight],
      ["warning-foreground", status.warningForegroundLight],
      ["destructive", status.destructiveLight],
      ["destructive-foreground", status.destructiveForegroundLight],
      ["border", t.borderLight],
      ["input", t.inputLight],
      ["ring", color.light],
      ["radius", selection.radius],
      ["theme-motion-overlay-duration", `${selection.overlayMs}ms`],
      ["theme-motion-interactive-duration", `${selection.interactiveMs}ms`],
      ["theme-motion-ease-standard", selection.ease],
    ];

    const dark: Array<[string, string]> = [
      ["background", t.backgroundDark],
      ["foreground", t.foregroundDark],
      ["card", t.cardDark],
      ["card-foreground", t.cardForegroundDark],
      ["popover", t.cardDark],
      ["popover-foreground", t.cardForegroundDark],
      ["primary", color.dark],
      ["primary-foreground", t.backgroundDark],
      ["secondary", t.accentDark],
      ["secondary-foreground", t.accentForegroundDark],
      ["muted", t.mutedDark],
      ["muted-foreground", t.mutedForegroundDark],
      ["accent", t.accentDark],
      ["accent-foreground", t.accentForegroundDark],
      ["success", status.successDark],
      ["success-foreground", status.successForegroundDark],
      ["warning", status.warningDark],
      ["warning-foreground", status.warningForegroundDark],
      ["destructive", status.destructiveDark],
      ["destructive-foreground", status.destructiveForegroundDark],
      ["border", t.borderDark],
      ["input", t.inputDark],
      ["ring", color.dark],
    ];

    const block = (selector: string, entries: Array<[string, string]>) =>
      [
        `${selector} {`,
        ...entries.map(([name, value]) => `  --${name}: ${value};`),
        "}",
      ].join("\n");

    return `${block(":root", light)}\n\n${block(".dark", dark)}`;
  }, [selection, surfaceTokens]);

  return {
    selection,
    surfaceTokens,
    update,
    applyPack,
    setCustomAccent,
    shuffle,
    applySeed,
    reset,
    toJSON,
    fromJSON,
    toCSS,
  };
}

/** Named export so the view can offer the same list without re-importing. */
export type { ColorPreset, SurfacePreset, ThemePack };
