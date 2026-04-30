import { useState } from "react";
import { POI_CATEGORIES, POI_VISIBILITY } from "../../lib/mapEditorSchema";

export default function PoiFormModal({ open, point, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    category: "Other",
    visibility: "public",
    description: "",
    accessibility: false,
    restricted: false,
  });

  if (!open) return null;

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      alert("POI name is required.");
      return;
    }

    onSave({
      ...form,
      x: point.x,
      y: point.y,
      restricted: form.visibility !== "public" ? true : form.restricted,
    });

    setForm({
      name: "",
      category: "Other",
      visibility: "public",
      description: "",
      accessibility: false,
      restricted: false,
    });
  };

  return (
    <div className="editor-modal-backdrop">
      <div className="editor-modal">
        <div className="editor-modal-header">
          <h2>Add POI</h2>
          <button onClick={onClose}>Close</button>
        </div>

        <div className="editor-form">
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Pharmacy"
            />
          </label>

          <label>
            Category
            <select value={form.category} onChange={(e) => update("category", e.target.value)}>
              {POI_CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Visibility
            <select
              value={form.visibility}
              onChange={(e) => update("visibility", e.target.value)}
            >
              {POI_VISIBILITY.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Description
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              placeholder="Optional description"
            />
          </label>

          <label className="check-row">
            <input
              type="checkbox"
              checked={form.accessibility}
              onChange={(e) => update("accessibility", e.target.checked)}
            />
            Accessible route available
          </label>

          <label className="check-row">
            <input
              type="checkbox"
              checked={form.restricted}
              onChange={(e) => update("restricted", e.target.checked)}
            />
            Restricted area
          </label>
        </div>

        <div className="editor-modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="primary-btn" onClick={handleSave}>
            Save POI
          </button>
        </div>
      </div>
    </div>
  );
}
