export function dijkstraPath(graph, startId, endId) {
  if (!startId || !endId) return [];
  if (startId === endId) return [startId];

  const adj = new Map();
  for (const n of graph.nodes) adj.set(n.id, []);
  for (const e of graph.edges) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    if (!adj.has(e.to)) adj.set(e.to, []);
    adj.get(e.from).push({ to: e.to, w: e.weight });
    adj.get(e.to).push({ to: e.from, w: e.weight });
  }

  const dist = new Map();
  const prev = new Map();
  const visited = new Set();

  for (const id of adj.keys()) dist.set(id, Infinity);
  dist.set(startId, 0);

  while (true) {
    let u = null;
    let best = Infinity;
    for (const [id, d] of dist.entries()) {
      if (!visited.has(id) && d < best) {
        best = d;
        u = id;
      }
    }

    if (u === null) break;
    if (u === endId) break;

    visited.add(u);

    for (const { to, w } of adj.get(u) || []) {
      if (visited.has(to)) continue;
      const alt = dist.get(u) + w;
      if (alt < dist.get(to)) {
        dist.set(to, alt);
        prev.set(to, u);
      }
    }
  }

  if (!prev.has(endId) && startId !== endId) return [];

  const path = [];
  let cur = endId;
  path.push(cur);
  while (cur !== startId) {
    const p = prev.get(cur);
    if (!p) return [];
    cur = p;
    path.push(cur);
  }
  path.reverse();
  return path;
}
