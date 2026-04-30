import { useState } from "react";
import { validateFloorDraft } from "../../lib/floorSchema";
import FloorDetailsTableForm from "./FloorDetailsTableForm";
import FloorImagePreview from "./FloorImagePreview";

export default function FloorDetailsModal({ open, initialValue, onClose, onSave }) {
  const [form, setForm] = useState(initialValue);
  const [errors, setErrors] = useState({});

  if (!open) return null;

  const handleSave = () => {
    const nextErrors = validateFloorDraft(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;
    onSave(form);
  };

  return (
    <div className="floor-modal-backdrop">
      <div className="floor-modal">
        <div className="floor-modal-header">
          <div>
            <h2>Floor Details</h2>
            <p>Enter calibration and setup details for this uploaded floor map.</p>
          </div>
          <button type="button" onClick={onClose} className="ghost-btn">
            Close
          </button>
        </div>

        <div className="floor-modal-body">
          <FloorImagePreview imageUrl={form.uploadedImageUrl} fileName={form.originalFileName} />
          <FloorDetailsTableForm form={form} errors={errors} onChange={setForm} />
        </div>

        <div className="floor-modal-actions">
          <button type="button" onClick={onClose} className="secondary-btn">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="primary-btn">
            Save Floor Draft
          </button>
        </div>
      </div>
    </div>
  );
}
