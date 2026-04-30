import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PoiFormModal from "../components/editor/PoiFormModal";
import PoiManagerPanel from "../components/editor/PoiManagerPanel";
import NodeToolsPanel from "../components/editor/NodeToolsPanel";
import EdgeToolsPanel from "../components/editor/EdgeToolsPanel";
import RolePreviewSwitcher from "../components/editor/RolePreviewSwitcher";
import { getFloorDraftById, updateFloorDraft } from "../lib/floorDraftStorage";
import { createEdge, createNode, createPoi, EDITOR_MODES } from "../lib/mapEditorSchema";
import { generateInstructions } from "../lib/navigationUtils";
import {
  calculateDistanceMeters,
  findNearestNode,
  getMapClickPoint,
  shortestPath,
} from "../lib/mapEditorUtils";

export default function MapEditor() {
  const { floorId } = useParams();
  const navigate = useNavigate();
  const imageRef = useRef(null);

  const [floor, setFloor] = useState(() => getFloorDraftById(floorId));
  const [mode, setMode] = useState(EDITOR_MODES.SELECT);
  const [role, setRole] = useState("admin");

  const [poiPoint, setPoiPoint] = useState(null);
  const [poiModalOpen, setPoiModalOpen] = useState(false);

  const [selectedEdgeNodes, setSelectedEdgeNodes] = useState([]);
  const [routeStartPoiId, setRouteStartPoiId] = useState("");
  const [routeEndPoiId, setRouteEndPoiId] = useState("");

  const pois = floor?.pois || [];
  const nodes = floor?.nodes || [];
  const edges = floor?.edges || [];

  const visiblePois = pois.filter((poi) => {
    if (role === "admin") return true;
    if (role === "staff") return poi.visibility === "public" || poi.visibility === "staff";
    return poi.visibility === "public";
  });

  const routePreview = (() => {
    if (!floor || !routeStartPoiId || !routeEndPoiId) return null;

    const startPoi = pois.find((item) => item.id === routeStartPoiId);
    const endPoi = pois.find((item) => item.id === routeEndPoiId);

    if (!startPoi || !endPoi) return null;

    const startNode = startPoi.nearNodeId
      ? nodes.find((node) => node.id === startPoi.nearNodeId)
      : findNearestNode(startPoi, nodes, floor);

    const endNode = endPoi.nearNodeId
      ? nodes.find((node) => node.id === endPoi.nearNodeId)
      : findNearestNode(endPoi, nodes, floor);

    if (!startNode || !endNode) return null;

    const result = shortestPath(nodes, edges, startNode.id, endNode.id);

    return {
      ...result,
      startNode,
      endNode,
      nodePath: result.path.map((id) => nodes.find((node) => node.id === id)).filter(Boolean),
    };
  })();

  const instructions = routePreview?.nodePath?.length
    ? generateInstructions(routePreview.nodePath, floor)
    : [];

  if (!floor) {
    return (
      <main className="map-editor-page">
        <div className="editor-empty">
          <h1>Floor not found</h1>
          <p>This floor draft may have been deleted or not saved.</p>
          <button type="button" onClick={() => navigate("/dashboard/floors")}>
            Back to Floors
          </button>
        </div>
      </main>
    );
  }

  const saveFloor = (patch) => {
    const updated = updateFloorDraft(floor.id, patch);
    if (updated) setFloor(updated);
  };

  const handleMapClick = (event) => {
    if (!imageRef.current) return;

    const point = getMapClickPoint(event, imageRef.current);

    if (mode === EDITOR_MODES.ADD_POI) {
      setPoiPoint(point);
      setPoiModalOpen(true);
      return;
    }

    if (mode === EDITOR_MODES.ADD_NODE) {
      const node = createNode(point);
      saveFloor({ nodes: [...nodes, node] });
      return;
    }
  };

  const handleSavePoi = (payload) => {
    const tempPoi = createPoi(payload);
    const nearestNode = findNearestNode(tempPoi, nodes, floor);

    const poi = {
      ...tempPoi,
      nearNodeId: nearestNode?.id || null,
    };

    saveFloor({ pois: [...pois, poi] });
    setPoiModalOpen(false);
    setPoiPoint(null);
    setMode(EDITOR_MODES.SELECT);
  };

  const handleNodeClick = (node) => {
    if (mode !== EDITOR_MODES.ADD_EDGE) return;

    const exists = selectedEdgeNodes.find((item) => item.id === node.id);
    if (exists) return;

    const nextSelected = [...selectedEdgeNodes, node];
    setSelectedEdgeNodes(nextSelected);

    if (nextSelected.length === 2) {
      const [fromNode, toNode] = nextSelected;
      const distanceMeters = calculateDistanceMeters(fromNode, toNode, floor);

      const edge = createEdge({
        from: fromNode.id,
        to: toNode.id,
        distanceMeters,
      });

      saveFloor({ edges: [...edges, edge] });
      setSelectedEdgeNodes([]);
      setMode(EDITOR_MODES.SELECT);
    }
  };

  const deletePoi = (id) => {
    saveFloor({ pois: pois.filter((item) => item.id !== id) });
  };

  const deleteNode = (id) => {
    saveFloor({
      nodes: nodes.filter((item) => item.id !== id),
      edges: edges.filter((edge) => edge.from !== id && edge.to !== id),
      pois: pois.map((poi) => (poi.nearNodeId === id ? { ...poi, nearNodeId: null } : poi)),
    });
  };

  const deleteEdge = (id) => {
    saveFloor({ edges: edges.filter((item) => item.id !== id) });
  };

  return (
    <main className="map-editor-page">
      <section className="map-editor-topbar">
        <div>
          <p className="eyebrow">Admin Map Editor</p>
          <h1>{floor.floorName}</h1>
          <p>{floor.buildingName} - Floor {floor.floorNumber}</p>
        </div>

        <div className="editor-top-actions">
          <RolePreviewSwitcher role={role} onChange={setRole} />
          <button type="button" onClick={() => navigate("/dashboard/floors")}>
            Back
          </button>
        </div>
      </section>

      <section className="map-editor-layout">
        <aside className="editor-left-panel">
          <h2>Tools</h2>

          <div className="mode-box">
            <span>Current mode</span>
            <strong>{mode.replace("_", " ")}</strong>
          </div>

          <PoiManagerPanel
            pois={pois}
            role={role}
            onMode={() => setMode(EDITOR_MODES.ADD_POI)}
            onDelete={deletePoi}
          />

          <NodeToolsPanel
            nodes={nodes}
            onMode={() => setMode(EDITOR_MODES.ADD_NODE)}
            onDelete={deleteNode}
          />

          <EdgeToolsPanel
            edges={edges}
            selectedEdgeNodes={selectedEdgeNodes}
            onMode={() => setMode(EDITOR_MODES.ADD_EDGE)}
            onClear={() => setSelectedEdgeNodes([])}
            onDelete={deleteEdge}
          />
        </aside>

        <section className="editor-map-canvas interactive">
          <div className="map-image-wrap" onClick={handleMapClick}>
            <img ref={imageRef} src={floor.uploadedImageUrl} alt={floor.floorName} />

            <svg className="editor-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
              {edges.map((edge) => {
                const from = nodes.find((node) => node.id === edge.from);
                const to = nodes.find((node) => node.id === edge.to);
                if (!from || !to) return null;

                return (
                  <line
                    key={edge.id}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    className="edge-line"
                  />
                );
              })}

              {routePreview?.nodePath?.length > 1
                ? routePreview.nodePath.slice(0, -1).map((node, index) => {
                    const nextNode = routePreview.nodePath[index + 1];

                    return (
                      <line
                        key={`${node.id}_${nextNode.id}`}
                        x1={node.x}
                        y1={node.y}
                        x2={nextNode.x}
                        y2={nextNode.y}
                        className="route-line"
                      />
                    );
                  })
                : null}
            </svg>

            {nodes.map((node, index) => (
              <button
                key={node.id}
                type="button"
                className={`map-node ${
                  selectedEdgeNodes.find((item) => item.id === node.id) ? "selected" : ""
                }`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNodeClick(node);
                }}
                title={`Node ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}

            {visiblePois.map((poi) => (
              <div
                key={poi.id}
                className={`map-poi ${poi.visibility}`}
                style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
                title={poi.name}
              >
                <span>{poi.name}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="editor-right-panel">
          <h2>Route Preview</h2>

          <div className="route-preview-box">
            <label>
              Start POI
              <select value={routeStartPoiId} onChange={(e) => setRouteStartPoiId(e.target.value)}>
                <option value="">Select start</option>
                {pois.map((poi) => (
                  <option key={poi.id} value={poi.id}>
                    {poi.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Destination POI
              <select value={routeEndPoiId} onChange={(e) => setRouteEndPoiId(e.target.value)}>
                <option value="">Select destination</option>
                {pois.map((poi) => (
                  <option key={poi.id} value={poi.id}>
                    {poi.name}
                  </option>
                ))}
              </select>
            </label>

            {routePreview ? (
              routePreview.path.length ? (
                <div className="route-result ready">
                  <strong>{routePreview.distance} meters</strong>
                  <span>{routePreview.path.length} nodes used</span>
                </div>
              ) : (
                <div className="route-result pending">
                  No connected route found.
                </div>
              )
            ) : (
              <div className="route-result pending">
                Select start and destination POIs.
              </div>
            )}

            <div className="route-steps-admin">
              {instructions.map((step, i) => (
                <div key={i}>{step.text}</div>
              ))}
            </div>
          </div>

          <h2>Readiness</h2>
          <div className="readiness-list">
            <span className="ready">Floor image uploaded</span>
            <span className="ready">Floor details saved</span>
            <span className={pois.length ? "ready" : "pending"}>{pois.length} POIs added</span>
            <span className={nodes.length ? "ready" : "pending"}>{nodes.length} nodes added</span>
            <span className={edges.length ? "ready" : "pending"}>{edges.length} edges added</span>
            <span className={pois.length && nodes.length && edges.length ? "ready" : "pending"}>
              {pois.length && nodes.length && edges.length
                ? "Ready for route testing"
                : "Not ready for public navigation"}
            </span>
          </div>
        </aside>
      </section>

      <PoiFormModal
        open={poiModalOpen}
        point={poiPoint}
        onClose={() => {
          setPoiModalOpen(false);
          setPoiPoint(null);
        }}
        onSave={handleSavePoi}
      />
    </main>
  );
}
