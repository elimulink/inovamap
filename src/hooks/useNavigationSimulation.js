import { useEffect, useMemo, useState } from "react";
import { buildRouteSegments, interpolate } from "../lib/navigationEngine";

export default function useNavigationSimulation(pathNodes) {
  const [tickState, setTickState] = useState({ routeKey: "", tick: 0 });

  const segments = useMemo(() => buildRouteSegments(pathNodes || []), [pathNodes]);
  const routeKey = useMemo(
    () => (pathNodes || []).map((node) => `${node.id}:${node.x}:${node.y}`).join("|"),
    [pathNodes]
  );

  useEffect(() => {
    if (!segments.length) return undefined;

    const interval = setInterval(() => {
      setTickState((prev) => {
        if (prev.routeKey !== routeKey) {
          return { routeKey, tick: 1 };
        }

        return { routeKey, tick: prev.tick + 1 };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [routeKey, segments.length]);

  if (!pathNodes?.length || !segments.length) {
    return {
      position: null,
      currentIndex: 0,
    };
  }

  const localTick = tickState.routeKey === routeKey ? tickState.tick : 0;
  const routeProgress = localTick * 0.01;
  const currentIndex = Math.min(Math.floor(routeProgress), segments.length - 1);
  const segmentProgress = Math.min(1, routeProgress - currentIndex);
  const currentSegment = segments[currentIndex];

  return {
    position: currentSegment
      ? interpolate(currentSegment.from, currentSegment.to, segmentProgress)
      : pathNodes[pathNodes.length - 1],
    currentIndex,
  };
}
