from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.data import BUILDINGS, FLOORS, POIS
from app.models import Building, Floor, POI, RouteRequest, RouteResponse
from app.routing_service import dijkstra_path, resolve_route_points

app = FastAPI(title="InovaMap API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "InovaMap backend is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/buildings", response_model=list[Building])
def list_buildings():
    return BUILDINGS


@app.get("/buildings/{building_id}", response_model=Building)
def get_building(building_id: str):
    building = next((b for b in BUILDINGS if b.id == building_id), None)
    if building is None:
        raise HTTPException(status_code=404, detail="Building not found")
    return building


@app.get("/buildings/{building_id}/floors", response_model=list[Floor])
def list_building_floors(building_id: str):
    return [f for f in FLOORS if f.building_id == building_id]


@app.get("/floors", response_model=list[Floor])
def list_floors(building_id: str | None = None):
    if building_id:
        return [f for f in FLOORS if f.building_id == building_id]
    return FLOORS


@app.get("/floors/{floor_id}", response_model=Floor)
def get_floor(floor_id: str):
    floor = next((f for f in FLOORS if f.id == floor_id), None)
    if floor is None:
        raise HTTPException(status_code=404, detail="Floor not found")
    return floor


@app.get("/pois", response_model=list[POI])
def list_pois(floor_id: str | None = None):
    if floor_id:
        return [p for p in POIS if p.floor_id == floor_id]
    return POIS


@app.get("/floors/{floor_id}/pois", response_model=list[POI])
def list_floor_pois(floor_id: str):
    return [p for p in POIS if p.floor_id == floor_id]


@app.post("/routing/path", response_model=RouteResponse)
def route_path(payload: RouteRequest):
    floor = next((f for f in FLOORS if f.id == payload.floor_id), None)
    if floor is None:
        raise HTTPException(status_code=404, detail="Floor not found")

    start_poi = next((p for p in POIS if p.id == payload.start_poi_id and p.floor_id == floor.id), None)
    end_poi = next((p for p in POIS if p.id == payload.end_poi_id and p.floor_id == floor.id), None)

    if start_poi is None:
        raise HTTPException(status_code=404, detail="Start POI not found on floor")
    if end_poi is None:
        raise HTTPException(status_code=404, detail="End POI not found on floor")

    graph_node_ids = [n.id for n in floor.graph_nodes]
    node_path = dijkstra_path(graph_node_ids, floor.graph_edges, start_poi.near_node_id, end_poi.near_node_id)
    points = resolve_route_points(floor, node_path)

    return RouteResponse(
        floor_id=floor.id,
        start_poi_id=start_poi.id,
        end_poi_id=end_poi.id,
        node_path=node_path,
        points=points,
    )
