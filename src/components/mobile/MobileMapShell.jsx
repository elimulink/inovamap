import { useMemo, useRef, useState } from "react";
import { generateInstructions } from "../../lib/navigationUtils";
import { shortestPath, findNearestNode } from "../../lib/mapEditorUtils";
import useNavigationSimulation from "../../hooks/useNavigationSimulation";
import BlueDot from "./BlueDot";
import MobileSearchBar from "./MobileSearchBar";
import MobileBottomSheet from "./MobileBottomSheet";
import MobileFloorSwitcher from "./MobileFloorSwitcher";
import MobileRoleLayerToggle from "./MobileRoleLayerToggle";

export default function MobileMapShell({ floor }) {
  const imageRef = useRef(null);

  const [role, setRole] = useState("public");
  const [startPoiId, setStartPoiId] = useState("");
  const [endPoiId, setEndPoiId] = useState("");

  const pois = useMemo(() => floor.pois || [], [floor.pois]);
  const nodes = useMemo(() => floor.nodes || [], [floor.nodes]);
  const edges = useMemo(() => floor.edges || [], [floor.edges]);

  const visiblePois = useMemo(() => {
    if (role === "admin") return pois;
    if (role === "staff")
      return pois.filter((p) => p.visibility === "public" || p.visibility === "staff");
    return pois.filter((p) => p.visibility === "public");
  }, [role, pois]);

  const route = useMemo(() => {
    if (!startPoiId || !endPoiId) return null;

    const startPoi = pois.find((p) => p.id === startPoiId);
    const endPoi = pois.find((p) => p.id === endPoiId);

    if (!startPoi || !endPoi) return null;

    const startNode = findNearestNode(startPoi, nodes, floor);
    const endNode = findNearestNode(endPoi, nodes, floor);

    if (!startNode || !endNode) return null;

    return shortestPath(nodes, edges, startNode.id, endNode.id);
  }, [startPoiId, endPoiId, pois, nodes, edges, floor]);

  const pathNodes = useMemo(() => {
    if (!route?.path?.length) return [];

    return route.path.map((id) =>
      nodes.find((n) => n.id === id)
    ).filter(Boolean);
  }, [route, nodes]);

  const instructions = useMemo(() => {
    return generateInstructions(pathNodes, floor);
  }, [pathNodes, floor]);

  const { position, currentIndex } = useNavigationSimulation(pathNodes);

  return (
    <div className="mobile-map-container">
      <MobileSearchBar
        pois={visiblePois}
        startPoiId={startPoiId}
        endPoiId={endPoiId}
        setStartPoiId={setStartPoiId}
        setEndPoiId={setEndPoiId}
      />

      <div className="mobile-map">
        <img ref={imageRef} src={floor.uploadedImageUrl} alt="map" />

        <svg viewBox="0 0 100 100" className="mobile-overlay">
          {route?.path?.length > 1 &&
            route.path.map((nodeId, i) => {
              if (i === route.path.length - 1) return null;
              const a = nodes.find((n) => n.id === nodeId);
              const b = nodes.find((n) => n.id === route.path[i + 1]);
              if (!a || !b) return null;

              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  className="route-line"
                />
              );
            })}
        </svg>

        {visiblePois.map((poi) => (
          <div
            key={poi.id}
            className={`mobile-poi ${poi.visibility}`}
            style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
          />
        ))}

        <BlueDot position={position} />
      </div>

      <MobileBottomSheet
        route={route}
        steps={instructions}
        currentStepIndex={currentIndex}
        pois={visiblePois}
        setEndPoiId={setEndPoiId}
      />

      <MobileFloorSwitcher floor={floor} />
      <MobileRoleLayerToggle role={role} setRole={setRole} />
    </div>
  );
}
