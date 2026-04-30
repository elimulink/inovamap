import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloorDetailsModal from "../components/floors/FloorDetailsModal";
import FloorDraftList from "../components/floors/FloorDraftList";
import {
  DEFAULT_FLOOR_FORM,
  createFloorDraft,
} from "../lib/floorSchema";
import {
  deleteFloorDraft,
  getFloorDrafts,
  upsertFloorDraft,
} from "../lib/floorDraftStorage";

export default function FloorManagement() {
  const navigate = useNavigate();

  const [drafts, setDrafts] = useState(() => getFloorDrafts());
  const [modalOpen, setModalOpen] = useState(false);
  const [activeDraft, setActiveDraft] = useState(DEFAULT_FLOOR_FORM);

  const refreshDrafts = () => setDrafts(getFloorDrafts());

  const readImageDimensions = (file, dataUrl) => {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          imageWidthPixels: img.naturalWidth,
          imageHeightPixels: img.naturalHeight,
          uploadedImageUrl: dataUrl,
          originalFileName: file.name,
        });
      };

      img.src = dataUrl;
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const dataUrl = reader.result;
      const imageMeta = await readImageDimensions(file, dataUrl);

      setActiveDraft({
        ...DEFAULT_FLOOR_FORM,
        ...imageMeta,
        buildingName: "Sarit Centre",
        floorName: "Ground Floor",
        floorNumber: "G",
      });

      setModalOpen(true);
      event.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  const handleSave = (form) => {
    const saved = upsertFloorDraft(createFloorDraft(form));
    refreshDrafts();
    setModalOpen(false);
    setActiveDraft(saved);
  };

  const handleEdit = (floor) => {
    setActiveDraft(floor);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Delete this floor draft?");
    if (!confirmed) return;

    deleteFloorDraft(id);
    refreshDrafts();
  };

  const handleOpen = (floor) => {
    navigate(`/dashboard/map-editor/${floor.id}`);
  };

  return (
    <main className="floor-page">
      <section className="floor-page-header">
        <div>
          <p className="eyebrow">Admin / Floors</p>
          <h1>Floor Management</h1>
          <p>
            Upload a floor map, enter calibration details, and prepare it for POIs,
            routing nodes, and user navigation.
          </p>
        </div>

        <label className="upload-btn">
          Upload Floor Map
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleImageUpload}
            hidden
          />
        </label>
      </section>

      <section className="floor-info-card">
        <h2>Current onboarding flow</h2>
        <div className="flow-steps">
          <span>1. Upload floor image</span>
          <span>2. Fill floor details</span>
          <span>3. Save draft locally</span>
          <span>4. Open in map editor</span>
          <span>5. Add POIs later</span>
          <span>6. Add nodes/edges later</span>
        </div>
      </section>

      <FloorDraftList
        drafts={drafts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onOpen={handleOpen}
      />

      <FloorDetailsModal
        key={modalOpen ? activeDraft.id || activeDraft.uploadedImageUrl || "new" : "closed"}
        open={modalOpen}
        initialValue={activeDraft}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </main>
  );
}
