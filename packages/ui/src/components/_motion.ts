export const MOTION_EASE_STANDARD = "cubic-bezier(0.22,1,0.36,1)";

export const MOTION_DURATION_FAST = 120;
export const MOTION_DURATION_BASE = 160;
export const MOTION_DURATION_SLOW = 220;

export const MOTION_VAR_OVERLAY_DURATION = "--theme-motion-overlay-duration-ms";
export const MOTION_VAR_EASE = "--theme-motion-ease-standard";

function parseDurationToMs(raw: string): number | null {
	const value = raw.trim().toLowerCase();
	if (!value) return null;

	if (value.endsWith("ms")) {
		const ms = Number(value.slice(0, -2).trim());
		return Number.isFinite(ms) && ms >= 0 ? ms : null;
	}

	if (value.endsWith("s")) {
		const seconds = Number(value.slice(0, -1).trim());
		return Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : null;
	}

	const numeric = Number(value);
	return Number.isFinite(numeric) && numeric >= 0 ? numeric : null;
}

export function resolveMotionDurationMs(variableName: string, fallbackMs: number): number {
	if (typeof window === "undefined") return fallbackMs;
	const raw = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
	const parsed = parseDurationToMs(raw);
	return parsed ?? fallbackMs;
}

export const MOTION_INTERACTIVE =
	"transition-[background-color,color,border-color,box-shadow,transform,opacity] [--tw-duration:var(--theme-motion-interactive-duration,0.15s)] [--tw-ease:var(--theme-motion-ease-standard,cubic-bezier(0.22,1,0.36,1))] motion-reduce:transition-none";

export const MOTION_OVERLAY =
	"transition-[opacity,transform] [--tw-duration:var(--theme-motion-overlay-duration,0.16s)] [--tw-ease:var(--theme-motion-ease-standard,cubic-bezier(0.22,1,0.36,1))] motion-reduce:transition-none";

export const MOTION_OVERLAY_ENTER = "data-[state=open]:opacity-100 data-[state=open]:scale-100";

export const MOTION_OVERLAY_EXIT = "data-[state=closed]:opacity-0 data-[state=closed]:scale-[0.98]";
