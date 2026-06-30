export function parseScopedPackage(pkg: string) {
  const match = pkg.match(/^@([^/]+)\/(.+)$/);
  if (!match) {
    return { scope: null as string | null, name: pkg };
  }
  return { scope: `@${match[1]}`, name: match[2] };
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
