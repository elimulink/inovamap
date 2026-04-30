export default function PoiManagerPanel({ pois, role, onMode, onDelete }) {
  const visiblePois = pois.filter((poi) => {
    if (role === "admin") return true;
    if (role === "staff") return poi.visibility === "public" || poi.visibility === "staff";
    return poi.visibility === "public";
  });

  return (
    <div className="editor-panel-section">
      <div className="panel-heading">
        <h3>POIs</h3>
        <button onClick={onMode}>Add POI</button>
      </div>

      <div className="mini-list">
        {visiblePois.length ? (
          visiblePois.map((poi) => (
            <div key={poi.id} className="mini-list-item">
              <div>
                <strong>{poi.name}</strong>
                <span>{poi.category} - {poi.visibility}</span>
              </div>
              <button onClick={() => onDelete(poi.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No POIs for this role view.</p>
        )}
      </div>
    </div>
  );
}
