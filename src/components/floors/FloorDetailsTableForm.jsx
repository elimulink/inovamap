import { FLOOR_SCALE_TYPES } from "../../lib/floorSchema";

export default function FloorDetailsTableForm({ form, errors, onChange }) {
  const update = (field, value) => {
    onChange({
      ...form,
      [field]: value,
    });
  };

  return (
    <div className="floor-table-form">
      <div className="form-row">
        <label>Building name</label>
        <div>
          <input
            value={form.buildingName}
            onChange={(e) => update("buildingName", e.target.value)}
            placeholder="e.g. Sarit Centre"
          />
          {errors.buildingName ? <small>{errors.buildingName}</small> : null}
        </div>
      </div>

      <div className="form-row">
        <label>Floor name</label>
        <div>
          <input
            value={form.floorName}
            onChange={(e) => update("floorName", e.target.value)}
            placeholder="e.g. Ground Floor"
          />
          {errors.floorName ? <small>{errors.floorName}</small> : null}
        </div>
      </div>

      <div className="form-row">
        <label>Floor number</label>
        <div>
          <input
            value={form.floorNumber}
            onChange={(e) => update("floorNumber", e.target.value)}
            placeholder="e.g. G, 0, 1"
          />
          {errors.floorNumber ? <small>{errors.floorNumber}</small> : null}
        </div>
      </div>

      <div className="form-row two-cols">
        <label>Real floor size</label>
        <div className="inline-grid">
          <input
            type="number"
            value={form.floorWidthMeters}
            onChange={(e) => update("floorWidthMeters", e.target.value)}
            placeholder="Width meters"
          />
          <input
            type="number"
            value={form.floorHeightMeters}
            onChange={(e) => update("floorHeightMeters", e.target.value)}
            placeholder="Height meters"
          />
        </div>
      </div>

      <div className="form-row">
        <label>Scale type</label>
        <select value={form.scaleType} onChange={(e) => update("scaleType", e.target.value)}>
          {FLOOR_SCALE_TYPES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row two-cols">
        <label>Scale values</label>
        <div className="inline-grid">
          <input
            type="number"
            step="0.01"
            value={form.metersPerPixel}
            onChange={(e) => update("metersPerPixel", e.target.value)}
            placeholder="Meters per pixel"
          />
          <input
            type="number"
            step="0.01"
            value={form.pixelsPerMeter}
            onChange={(e) => update("pixelsPerMeter", e.target.value)}
            placeholder="Pixels per meter"
          />
        </div>
      </div>

      <div className="form-row two-cols">
        <label>Image size</label>
        <div className="inline-grid">
          <input value={form.imageWidthPixels} readOnly placeholder="Image width px" />
          <input value={form.imageHeightPixels} readOnly placeholder="Image height px" />
        </div>
      </div>

      <div className="form-row two-cols">
        <label>Corridor widths</label>
        <div className="inline-grid">
          <input
            type="number"
            step="0.1"
            value={form.mainCorridorWidthMeters}
            onChange={(e) => update("mainCorridorWidthMeters", e.target.value)}
            placeholder="Main corridor"
          />
          <input
            type="number"
            step="0.1"
            value={form.shopCorridorWidthMeters}
            onChange={(e) => update("shopCorridorWidthMeters", e.target.value)}
            placeholder="Shop corridor"
          />
        </div>
      </div>

      <div className="form-row">
        <label>North orientation</label>
        <select
          value={form.orientationNorth}
          onChange={(e) => update("orientationNorth", e.target.value)}
        >
          <option value="top">Top</option>
          <option value="right">Right</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
        </select>
      </div>

      <div className="form-row">
        <label>Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Optional admin notes"
          rows={3}
        />
      </div>
    </div>
  );
}
