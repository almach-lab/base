"use client";

import { Moon, Sun } from "lucide-react";
import * as React from "react";

function getIsDarkMode() {
  return document.documentElement.classList.contains("dark");
}

function applyStoredThemeMode() {
  const root = document.documentElement;
  const nextIsDark = !root.classList.contains("dark");

  localStorage.setItem("theme", nextIsDark ? "dark" : "light");
  root.classList.toggle("dark", nextIsDark);

  const themedWindow = window as Window & {
    __almachApplyTheme?: () => void;
  };

  if (typeof themedWindow.__almachApplyTheme === "function") {
    themedWindow.__almachApplyTheme();
  } else {
    window.dispatchEvent(new CustomEvent("almach-theme-mode-changed"));
  }

  return nextIsDark;
}

interface ThemeModeToggleProps {
  compact?: boolean;
  onToggled?: (isDark: boolean) => void;
}

export function ThemeModeToggle({
  compact = true,
  onToggled,
}: ThemeModeToggleProps) {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const syncMode = () => setIsDark(getIsDarkMode());
    syncMode();

    window.addEventListener("almach-theme-mode-changed", syncMode);
    document.addEventListener("astro:after-swap", syncMode);

    return () => {
      window.removeEventListener("almach-theme-mode-changed", syncMode);
      document.removeEventListener("astro:after-swap", syncMode);
    };
  }, []);

  const toggleMode = () => {
    const nextMode = applyStoredThemeMode();
    setIsDark(nextMode);
    onToggled?.(nextMode);
  };

  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleMode}
        aria-label={label}
        aria-pressed={isDark}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      aria-pressed={isDark}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}
