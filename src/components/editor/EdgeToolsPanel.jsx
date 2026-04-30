export default function EdgeToolsPanel({ edges, selectedEdgeNodes, onMode, onClear, onDelete }) {
  return (
    <div className="editor-panel-section">
      <div className="panel-heading">
        <h3>Edges</h3>
        <button onClick={onMode}>Add Edge</button>
      </div>

      {selectedEdgeNodes.length ? (
        <div className="edge-select-info">
          Selected {selectedEdgeNodes.length}/2 nodes
          <button onClick={onClear}>Clear</button>
        </div>
      ) : null}

      <div className="mini-list">
        {edges.length ? (
          edges.map((edge, index) => (
            <div key={edge.id} className="mini-list-item">
              <div>
                <strong>Edge {index + 1}</strong>
                <span>{edge.distanceMeters}m</span>
              </div>
              <button onClick={() => onDelete(edge.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No edges connected yet.</p>
        )}
      </div>
    </div>
  );
}
