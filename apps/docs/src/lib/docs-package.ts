export interface ScopedPackage {
  /** Leading `@scope`, or null for an unscoped package. */
  scope: string | null;
  /** Package name without the scope. Never empty. */
  name: string;
}

export function parseScopedPackage(pkg: string): ScopedPackage {
  const match = /^@([^/]+)\/(.+)$/.exec(pkg);
  const scope = match?.[1];
  const name = match?.[2];

  if (!scope || !name) {
    return { scope: null, name: pkg };
  }

  return { scope: `@${scope}`, name };
}

export function parsePackageEyebrow(eyebrow: string) {
  const parts = eyebrow.split(/\s*·\s*/);
  const pkg = parts[0] ?? eyebrow;
  const suffix = parts.slice(1).join(" · ");
  return {
    ...parseScopedPackage(pkg),
    suffix: suffix || undefined,
  };
}

export function isPackageEyebrow(eyebrow: string) {
  return eyebrow.startsWith("@") && eyebrow.includes("/");
}

export function getDocsPackageForPath(path: string) {
  if (path.startsWith("/forms")) return "@almach/forms";
  if (path.startsWith("/query")) return "@almach/query";
  return "@almach/ui";
}
