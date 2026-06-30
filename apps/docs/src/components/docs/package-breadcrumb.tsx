import { cn } from "@almach/utils";
import {
  parsePackageEyebrow,
  parseScopedPackage,
} from "../../lib/docs-package";

interface PackageBreadcrumbProps {
  pkg: string;
  suffix?: string;
  size?: "sm" | "md";
  className?: string;
}

export function PackageBreadcrumb({
  pkg,
  suffix,
  size = "md",
  className,
}: PackageBreadcrumbProps) {
  const { scope, name } = parseScopedPackage(pkg);

  return (
    <nav
      aria-label="Package"
      className={cn(
        "flex min-w-0 items-center gap-1.5 leading-none",
        size === "sm" ? "text-[13px]" : "text-sm",
        className,
      )}
    >
      {scope ? (
        <>
          <span className="truncate text-muted-foreground">{scope}</span>
          <span
            className="shrink-0 text-muted-foreground/45"
            aria-hidden="true"
          >
            /
          </span>
          <span className="truncate font-semibold text-foreground">{name}</span>
        </>
      ) : (
        <span className="truncate font-semibold text-foreground">{name}</span>
      )}
      {suffix ? (
        <span className="ml-1 shrink-0 text-muted-foreground">· {suffix}</span>
      ) : null}
    </nav>
  );
}

export function PackageEyebrow({
  eyebrow,
  className,
}: {
  eyebrow: string;
  className?: string;
}) {
  const { scope, name, suffix } = parsePackageEyebrow(eyebrow);
  const pkg = scope ? `${scope}/${name}` : name;

  return (
    <PackageBreadcrumb
      pkg={pkg}
      {...(suffix ? { suffix } : {})}
      className={className}
    />
  );
}
