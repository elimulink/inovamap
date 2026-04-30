export function getMapClickPoint(event, imageElement) {
  const rect = imageElement.getBoundingClientRect();

  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  return {
    x: Math.max(0, Math.min(100, Number(x.toFixed(2)))),
    y: Math.max(0, Math.min(100, Number(y.toFixed(2)))),
  };
}

export function percentToPixels(point, floor) {
  return {
    x: (point.x / 100) * Number(floor.imageWidthPixels || 1),
    y: (point.y / 100) * Number(floor.imageHeightPixels || 1),
  };
}

export function calculateDistanceMeters(a, b, floor) {
  const ap = percentToPixels(a, floor);
  const bp = percentToPixels(b, floor);

  const dx = bp.x - ap.x;
  const dy = bp.y - ap.y;
  const pixelDistance = Math.sqrt(dx * dx + dy * dy);

  if (floor.scaleType === "pixels_per_meter") {
    return Number((pixelDistance / Number(floor.pixelsPerMeter || 1)).toFixed(2));
  }

  return Number((pixelDistance * Number(floor.metersPerPixel || 0.1)).toFixed(2));
}

export function findNearestNode(poi, nodes, floor) {
  if (!nodes.length) return null;

  let bestNode = null;
  let bestDistance = Infinity;

  nodes.forEach((node) => {
    const distance = calculateDistanceMeters(poi, node, floor);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestNode = node;
    }
  });

  return bestNode;
}

export function buildGraph(nodes, edges) {
  const graph = {};

  nodes.forEach((node) => {
    graph[node.id] = [];
  });

  edges.forEach((edge) => {
    if (!graph[edge.from]) graph[edge.from] = [];
    if (!graph[edge.to]) graph[edge.to] = [];

    graph[edge.from].push({
      node: edge.to,
      weight: Number(edge.distanceMeters || 1),
    });

    if (!edge.oneWay) {
      graph[edge.to].push({
        node: edge.from,
        weight: Number(edge.distanceMeters || 1),
      });
    }
  });

  return graph;
}

export function shortestPath(nodes, edges, startNodeId, endNodeId) {
  const graph = buildGraph(nodes, edges);
  const distances = {};
  const previous = {};
  const queue = new Set(Object.keys(graph));

  Object.keys(graph).forEach((nodeId) => {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
  });

  distances[startNodeId] = 0;

  while (queue.size) {
    let current = null;

    queue.forEach((nodeId) => {
      if (current === null || distances[nodeId] < distances[current]) {
        current = nodeId;
      }
    });

    if (current === null || distances[current] === Infinity) break;
    if (current === endNodeId) break;

    queue.delete(current);

    graph[current].forEach((neighbor) => {
      const alt = distances[current] + neighbor.weight;

      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        previous[neighbor.node] = current;
      }
    });
  }

  const path = [];
  let current = endNodeId;

  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  if (path[0] !== startNodeId) {
    return {
      path: [],
      distance: 0,
    };
  }

  return {
    path,
    distance: Number(distances[endNodeId].toFixed(2)),
  };
}
