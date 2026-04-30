export const FLOOR_SCALE_TYPES = [
  { value: "meters_per_pixel", label: "Meters per pixel" },
  { value: "pixels_per_meter", label: "Pixels per meter" },
  { value: "custom_calibration", label: "Custom calibration" },
];

export const DEFAULT_FLOOR_FORM = {
  buildingName: "",
  floorName: "",
  floorNumber: "",
  floorWidthMeters: 80,
  floorHeightMeters: 45,
  scaleType: "meters_per_pixel",
  metersPerPixel: 0.1,
  pixelsPerMeter: 10,
  imageWidthPixels: "",
  imageHeightPixels: "",
  mainCorridorWidthMeters: 4,
  shopCorridorWidthMeters: 2.5,
  orientationNorth: "top",
  uploadedImageUrl: "",
  originalFileName: "",
  notes: "",
};

export function createFloorDraft(input = {}) {
  const now = new Date().toISOString();

  return {
    id: input.id || `floor_${Date.now()}`,
    status: input.status || "draft",
    createdAt: input.createdAt || now,
    updatedAt: now,

    buildingName: input.buildingName || DEFAULT_FLOOR_FORM.buildingName,
    floorName: input.floorName || DEFAULT_FLOOR_FORM.floorName,
    floorNumber: input.floorNumber || DEFAULT_FLOOR_FORM.floorNumber,

    floorWidthMeters: Number(input.floorWidthMeters || DEFAULT_FLOOR_FORM.floorWidthMeters),
    floorHeightMeters: Number(input.floorHeightMeters || DEFAULT_FLOOR_FORM.floorHeightMeters),

    scaleType: input.scaleType || DEFAULT_FLOOR_FORM.scaleType,
    metersPerPixel: Number(input.metersPerPixel || DEFAULT_FLOOR_FORM.metersPerPixel),
    pixelsPerMeter: Number(input.pixelsPerMeter || DEFAULT_FLOOR_FORM.pixelsPerMeter),

    imageWidthPixels: Number(input.imageWidthPixels || 0),
    imageHeightPixels: Number(input.imageHeightPixels || 0),

    mainCorridorWidthMeters: Number(
      input.mainCorridorWidthMeters || DEFAULT_FLOOR_FORM.mainCorridorWidthMeters
    ),
    shopCorridorWidthMeters: Number(
      input.shopCorridorWidthMeters || DEFAULT_FLOOR_FORM.shopCorridorWidthMeters
    ),

    orientationNorth: input.orientationNorth || DEFAULT_FLOOR_FORM.orientationNorth,
    uploadedImageUrl: input.uploadedImageUrl || "",
    originalFileName: input.originalFileName || "",
    notes: input.notes || "",

    pois: input.pois || [],
    nodes: input.nodes || [],
    edges: input.edges || [],
  };
}

export function validateFloorDraft(form) {
  const errors = {};

  if (!form.buildingName?.trim()) errors.buildingName = "Building name is required.";
  if (!form.floorName?.trim()) errors.floorName = "Floor name is required.";
  if (!String(form.floorNumber || "").trim()) errors.floorNumber = "Floor number is required.";
  if (!form.uploadedImageUrl) errors.uploadedImageUrl = "Floor image is required.";

  if (!Number(form.floorWidthMeters) || Number(form.floorWidthMeters) <= 0) {
    errors.floorWidthMeters = "Enter valid floor width.";
  }

  if (!Number(form.floorHeightMeters) || Number(form.floorHeightMeters) <= 0) {
    errors.floorHeightMeters = "Enter valid floor height.";
  }

  if (!Number(form.imageWidthPixels) || Number(form.imageWidthPixels) <= 0) {
    errors.imageWidthPixels = "Image width is missing.";
  }

  if (!Number(form.imageHeightPixels) || Number(form.imageHeightPixels) <= 0) {
    errors.imageHeightPixels = "Image height is missing.";
  }

  return errors;
}
