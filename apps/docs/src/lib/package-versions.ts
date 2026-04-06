import formsPkg from "../../../../packages/forms/package.json";
import queryPkg from "../../../../packages/query/package.json";
import uiPkg from "../../../../packages/ui/package.json";
import utilsPkg from "../../../../packages/utils/package.json";

const PACKAGE_VERSIONS = {
  "@almach/ui": uiPkg.version,
  "@almach/forms": formsPkg.version,
  "@almach/query": queryPkg.version,
  "@almach/utils": utilsPkg.version,
} as const;

function getPackageVersion(name: keyof typeof PACKAGE_VERSIONS) {
  return PACKAGE_VERSIONS[name];
}

export { getPackageVersion, PACKAGE_VERSIONS };
