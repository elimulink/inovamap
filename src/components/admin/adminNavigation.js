export const adminNavigationGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", icon: "home", path: "/dashboard", exact: true },
    ],
  },
  {
    label: "Setup",
    items: [
      { label: "Buildings", icon: "building", path: "/dashboard/buildings/central-mall", match: "/dashboard/buildings" },
      { label: "Floors", icon: "layers", path: "/dashboard/floors", match: "/dashboard/floors" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Preview Map", icon: "map", path: "/demo/map", match: "/demo/map" },
    ],
  },
  {
    label: "Coming Soon",
    items: [
      { label: "POIs", icon: "pin", disabled: true, note: "Soon" },
      { label: "Routing", icon: "route", disabled: true, note: "Soon" },
      { label: "Publish", icon: "publish", disabled: true, note: "Soon" },
    ],
  },
];

export function isAdminNavItemActive(pathname, item) {
  if (!item.path) return false;
  if (item.exact) return pathname === item.path;
  if (item.match) return pathname.startsWith(item.match);
  return pathname.startsWith(item.path);
}
