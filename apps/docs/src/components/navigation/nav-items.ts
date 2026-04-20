export interface NavItem {
  name: string;
  href: string;
}

export const LANDING_NAV_ITEMS: NavItem[] = [
  { name: "Docs", href: "/getting-started" },
  { name: "Components", href: "/components" },
  { name: "Blocks", href: "/blocks" },
];

export function isNavItemActive(currentPath: string, href: string): boolean {
  return currentPath === href || currentPath.startsWith(`${href}/`);
}
