import { cn } from "@almach/utils";
import React, { useState } from "react";
import { CodeBlock } from "./code-block";

type PkgManager = "npm" | "pnpm" | "yarn" | "bun";

const MANAGERS: PkgManager[] = ["bun", "npm", "pnpm", "yarn"];

const CMD: Record<PkgManager, (pkg: string) => string> = {
  bun: (p) => `bun add ${p}`,
  npm: (p) => `npm install ${p}`,
  pnpm: (p) => `pnpm add ${p}`,
  yarn: (p) => `yarn add ${p}`,
};

const RUN: Record<PkgManager, (script: string) => string> = {
  bun: (s) => `bun run ${s}`,
  npm: (s) => `npm run ${s}`,
  pnpm: (s) => `pnpm run ${s}`,
  yarn: (s) => `yarn ${s}`,
};

// Shared active manager across page (module-level state + listeners)
// Safe module-level default — localStorage is only accessed in the browser
let _activePM: PkgManager = "bun";
const listeners = new Set<(pm: PkgManager) => void>();
function setGlobalPM(pm: PkgManager) {
  _activePM = pm;
  if (typeof localStorage !== "undefined")
    localStorage.setItem("pkg-manager", pm);
  listeners.forEach((fn) => fn(pm));
}

function usePkgManager(): [PkgManager, (pm: PkgManager) => void] {
  const [pm, setPm] = useState<PkgManager>(() => {
    if (typeof localStorage !== "undefined") {
      return (localStorage.getItem("pkg-manager") as PkgManager) ?? "bun";
    }
    return "bun";
  });
  React.useEffect(() => {
    listeners.add(setPm);
    return () => {
      listeners.delete(setPm);
    };
  }, []);
  return [pm, setGlobalPM];
}

interface PkgTabsProps {
  /** Package name(s) to install, e.g. "@almach/ui" or multiple packages */
  packages: string | string[];
  className?: string;
}

export function PkgTabs({ packages, className }: PkgTabsProps) {
  const [pm, setPm] = usePkgManager();
  const pkgStr = Array.isArray(packages) ? packages.join(" ") : packages;

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Package manager"
        className="mb-1 flex gap-1"
      >
        {MANAGERS.map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={m === pm}
            onClick={() => setPm(m)}
            className={cn(
              "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              m === pm
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {m}
          </button>
        ))}
      </div>
      <CodeBlock code={CMD[pm](pkgStr)} lang="bash" />
    </div>
  );
}

/** Show a run command with correct syntax per package manager */
export function RunCmd({
  script,
  className,
}: {
  script: string;
  className?: string;
}) {
  const [pm] = usePkgManager();
  return <CodeBlock code={RUN[pm](script)} lang="bash" className={className} />;
}
