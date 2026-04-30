export const EDITOR_MODES = {
  SELECT: "select",
  ADD_POI: "add_poi",
  ADD_NODE: "add_node",
  ADD_EDGE: "add_edge",
};

export const POI_VISIBILITY = [
  { value: "public", label: "Public" },
  { value: "staff", label: "Staff only" },
  { value: "admin", label: "Admin only" },
];

export const POI_CATEGORIES = [
  "Entrance",
  "Information",
  "Supermarket",
  "Pharmacy",
  "Food Court",
  "Clothing",
  "Electronics",
  "Bank/ATM",
  "Toilets",
  "Escalator",
  "Lift",
  "Emergency Exit",
  "Security",
  "Staff Corridor",
  "Storage",
  "Management",
  "Parking",
  "Other",
];

export function createPoi(input = {}) {
  return {
    id: input.id || `poi_${Date.now()}`,
    name: input.name || "",
    category: input.category || "Other",
    x: Number(input.x || 0),
    y: Number(input.y || 0),
    visibility: input.visibility || "public",
    iconType: input.iconType || "pin",
    description: input.description || "",
    accessibility: Boolean(input.accessibility),
    restricted: Boolean(input.restricted),
    nearNodeId: input.nearNodeId || null,
  };
}

export function createNode(input = {}) {
  return {
    id: input.id || `node_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
    x: Number(input.x || 0),
    y: Number(input.y || 0),
    type: input.type || "walkway",
  };
}

export function createEdge(input = {}) {
  return {
    id: input.id || `edge_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
    from: input.from,
    to: input.to,
    distanceMeters: Number(input.distanceMeters || 0),
    accessible: input.accessible ?? true,
    oneWay: input.oneWay ?? false,
  };
}
