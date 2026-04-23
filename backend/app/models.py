from pydantic import BaseModel


class GraphNode(BaseModel):
    id: str


class GraphEdge(BaseModel):
    from_node: str
    to_node: str
    weight: float


class FloorNode(BaseModel):
    id: str
    x: float
    y: float


class Building(BaseModel):
    id: str
    name: str


class Floor(BaseModel):
    id: str
    building_id: str
    name: str
    image: str
    nodes: list[FloorNode]
    graph_nodes: list[GraphNode]
    graph_edges: list[GraphEdge]


class POI(BaseModel):
    id: str
    floor_id: str
    name: str
    near_node_id: str


class RouteRequest(BaseModel):
    floor_id: str
    start_poi_id: str
    end_poi_id: str


class RouteResponse(BaseModel):
    floor_id: str
    start_poi_id: str
    end_poi_id: str
    node_path: list[str]
    points: list[dict[str, float]]
