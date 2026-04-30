export default function NodeToolsPanel({ nodes, onMode, onDelete }) {
  return (
    <div className="editor-panel-section">
      <div className="panel-heading">
        <h3>Nodes</h3>
        <button onClick={onMode}>Add Node</button>
      </div>

      <div className="mini-list">
        {nodes.length ? (
          nodes.map((node, index) => (
            <div key={node.id} className="mini-list-item">
              <div>
                <strong>Node {index + 1}</strong>
                <span>x:{node.x}% - y:{node.y}%</span>
              </div>
              <button onClick={() => onDelete(node.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No walking nodes yet.</p>
        )}
      </div>
    </div>
  );
}
