from collections import defaultdict
from fastapi import HTTPException

from app.models import Floor, GraphEdge


def dijkstra_path(nodes: list[str], edges: list[GraphEdge], start_id: str, end_id: str) -> list[str]:
    if start_id == end_id:
        return [start_id]

    adj = defaultdict(list)
    for node_id in nodes:
        adj[node_id] = []

    for edge in edges:
        adj[edge.from_node].append((edge.to_node, edge.weight))
        adj[edge.to_node].append((edge.from_node, edge.weight))

    dist = {node_id: float("inf") for node_id in nodes}
    prev: dict[str, str] = {}
    visited = set()
    dist[start_id] = 0.0

    while True:
        current = None
        best = float("inf")
        for node_id, node_dist in dist.items():
            if node_id not in visited and node_dist < best:
                best = node_dist
                current = node_id

        if current is None:
            break
        if current == end_id:
            break

        visited.add(current)

        for neighbor, weight in adj[current]:
            if neighbor in visited:
                continue
            alt = dist[current] + weight
            if alt < dist[neighbor]:
                dist[neighbor] = alt
                prev[neighbor] = current

    if end_id not in prev:
        return []

    path = [end_id]
    cur = end_id
    while cur != start_id:
        cur = prev.get(cur)
        if cur is None:
            return []
        path.append(cur)

    path.reverse()
    return path


def resolve_route_points(floor: Floor, node_path: list[str]) -> list[dict[str, float]]:
    node_map = {node.id: node for node in floor.nodes}
    points: list[dict[str, float]] = []
    for node_id in node_path:
        node = node_map.get(node_id)
        if node is None:
            raise HTTPException(status_code=400, detail=f"Node {node_id} not found on floor {floor.id}")
        points.append({"x": node.x, "y": node.y})
    return points
