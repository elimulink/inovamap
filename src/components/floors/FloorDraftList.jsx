export default function FloorDraftList({ drafts, onEdit, onDelete, onOpen }) {
  if (!drafts.length) {
    return (
      <div className="empty-floor-list">
        <h3>No uploaded floors yet</h3>
        <p>Upload a floor map and fill in the floor details to create your first draft.</p>
      </div>
    );
  }

  return (
    <div className="floor-draft-grid">
      {drafts.map((floor) => (
        <div className="floor-draft-card" key={floor.id}>
          <div className="floor-thumb">
            {floor.uploadedImageUrl ? <img src={floor.uploadedImageUrl} alt={floor.floorName} /> : null}
          </div>

          <div className="floor-draft-content">
            <span className="draft-status">{floor.status}</span>
            <h3>{floor.floorName}</h3>
            <p>{floor.buildingName}</p>

            <div className="floor-meta">
              <span>{floor.floorWidthMeters}m x {floor.floorHeightMeters}m</span>
              <span>Floor {floor.floorNumber}</span>
              <span>{floor.pois?.length || 0} POIs</span>
            </div>

            <div className="floor-draft-actions">
              <button type="button" onClick={() => onOpen(floor)}>
                Open
              </button>
              <button type="button" onClick={() => onEdit(floor)}>
                Edit
              </button>
              <button type="button" className="danger-btn" onClick={() => onDelete(floor.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
