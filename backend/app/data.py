from app.models import Building, Floor, FloorNode, GraphEdge, GraphNode, POI

BUILDINGS = [
    Building(id="sarit_centre", name="Sarit Centre"),
]

FLOORS = [
    Floor(
        id="ground",
        building_id="sarit_centre",
        name="Ground Floor",
        image="/maps/ground.jpg",
        nodes=[
            FloorNode(id="g1", x=220, y=520),
            FloorNode(id="g2", x=360, y=500),
            FloorNode(id="g3", x=520, y=480),
            FloorNode(id="g4", x=650, y=470),
            FloorNode(id="g5", x=760, y=430),
            FloorNode(id="g6", x=640, y=330),
            FloorNode(id="g7", x=480, y=350),
            FloorNode(id="g8", x=340, y=360),
        ],
        graph_nodes=[
            GraphNode(id="g1"),
            GraphNode(id="g2"),
            GraphNode(id="g3"),
            GraphNode(id="g4"),
            GraphNode(id="g5"),
            GraphNode(id="g6"),
            GraphNode(id="g7"),
            GraphNode(id="g8"),
        ],
        graph_edges=[
            GraphEdge(from_node="g1", to_node="g2", weight=10),
            GraphEdge(from_node="g2", to_node="g3", weight=10),
            GraphEdge(from_node="g3", to_node="g4", weight=10),
            GraphEdge(from_node="g4", to_node="g5", weight=10),
            GraphEdge(from_node="g4", to_node="g6", weight=8),
            GraphEdge(from_node="g6", to_node="g7", weight=8),
            GraphEdge(from_node="g7", to_node="g8", weight=8),
            GraphEdge(from_node="g8", to_node="g2", weight=8),
        ],
    ),
    Floor(
        id="second",
        building_id="sarit_centre",
        name="Second Floor",
        image="/maps/second.jpg",
        nodes=[
            FloorNode(id="s1", x=260, y=420),
            FloorNode(id="s2", x=420, y=420),
            FloorNode(id="s3", x=560, y=420),
            FloorNode(id="s4", x=700, y=430),
            FloorNode(id="s5", x=560, y=560),
        ],
        graph_nodes=[
            GraphNode(id="s1"),
            GraphNode(id="s2"),
            GraphNode(id="s3"),
            GraphNode(id="s4"),
            GraphNode(id="s5"),
        ],
        graph_edges=[
            GraphEdge(from_node="s1", to_node="s2", weight=10),
            GraphEdge(from_node="s2", to_node="s3", weight=10),
            GraphEdge(from_node="s3", to_node="s4", weight=10),
            GraphEdge(from_node="s3", to_node="s5", weight=10),
        ],
    ),
]

POIS = [
    POI(id="lc_waikiki", floor_id="ground", name="LC Waikiki", near_node_id="g5"),
    POI(id="mrp_home", floor_id="ground", name="MRP Home", near_node_id="g1"),
    POI(id="im_bank", floor_id="ground", name="I&M Bank", near_node_id="g3"),
    POI(id="kcb_bank", floor_id="ground", name="KCB Bank", near_node_id="g8"),
    POI(id="miniso", floor_id="ground", name="Miniso", near_node_id="g4"),
    POI(id="toyworld", floor_id="ground", name="Toyworld", near_node_id="g6"),
    POI(id="textbook", floor_id="ground", name="Text Book Centre", near_node_id="g4"),
    POI(id="max", floor_id="ground", name="MAX", near_node_id="g2"),
    POI(id="sarit_expo", floor_id="second", name="Sarit Expo Centre", near_node_id="s3"),
    POI(id="jump_extreme", floor_id="second", name="Jump Extreme", near_node_id="s5"),
    POI(id="cinemax", floor_id="second", name="Century Cinemax", near_node_id="s5"),
    POI(id="rocomamas", floor_id="second", name="Rocomamas", near_node_id="s4"),
    POI(id="non_solo", floor_id="second", name="Non Solo Gelato", near_node_id="s4"),
    POI(id="dhaba", floor_id="second", name="The Dhaba", near_node_id="s2"),
]
