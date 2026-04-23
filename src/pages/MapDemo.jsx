import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import MapCanvas from "../components/MapCanvas";
import MapLegend from "../components/MapLegend";
import PoiBadge from "../components/PoiBadge";
import { useTheme } from "../context/ThemeContext";
import { BUILDING } from "../data/sarit/building";
import { dijkstraPath } from "../routing/dijkstra";

export default function MapDemo() {
  const { darkMode } = useTheme();
  const [floorId, setFloorId] = useState(BUILDING.floors[0].id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeField, setActiveField] = useState("to");

  const floor = BUILDING.floors.find((f) => f.id === floorId) ?? BUILDING.floors[0];

  const [fromQuery, setFromQuery] = useState(floor.pois[0].name);
  const [toQuery, setToQuery] = useState(floor.pois[1].name);
  const [startPoiId, setStartPoiId] = useState(floor.pois[0].id);
  const [destPoiId, setDestPoiId] = useState(floor.pois[1].id);

  const setFloorAndResetRoute = (nextFloorId) => {
    const nextFloor = BUILDING.floors.find((f) => f.id === nextFloorId) ?? BUILDING.floors[0];
    setFloorId(nextFloorId);
    if (nextFloor.pois.length > 1) {
      setStartPoiId(nextFloor.pois[0].id);
      setDestPoiId(nextFloor.pois[1].id);
      setFromQuery(nextFloor.pois[0].name);
      setToQuery(nextFloor.pois[1].name);
    }
  };

  const filteredFromPois = useMemo(() => {
    return floor.pois.filter((poi) =>
      poi.name.toLowerCase().includes(fromQuery.toLowerCase())
    );
  }, [floor.pois, fromQuery]);

  const filteredToPois = useMemo(() => {
    return floor.pois.filter((poi) =>
      poi.name.toLowerCase().includes(toQuery.toLowerCase())
    );
  }, [floor.pois, toQuery]);

  const activeList = activeField === "from" ? filteredFromPois : filteredToPois;

  const routeData = useMemo(() => {
    const startPoi = floor.pois.find((p) => p.id === startPoiId) ?? floor.pois[0];
    const destPoi = floor.pois.find((p) => p.id === destPoiId) ?? floor.pois[1];

    const path = dijkstraPath(
      floor.graph,
      startPoi.nearNodeId,
      destPoi.nearNodeId
    );

    const points = path
      .map((id) => floor.nodes.find((n) => n.id === id))
      .filter(Boolean)
      .map((n) => ({ x: n.x, y: n.y }));

    return { startPoi, destPoi, points };
  }, [floor, startPoiId, destPoiId]);

  const cardClasses = darkMode
    ? "rounded-2xl border border-slate-800 bg-slate-900"
    : "rounded-2xl border border-slate-200 bg-white";

  return (
    <AppShell
      darkMode={darkMode}
      rightSlot={
        <Link
          to="/admin/login"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
        >
          Admin
        </Link>
      }
    >
      <div className="mb-4 flex items-center justify-between">
        <Link to="/" className={darkMode ? "text-sm text-slate-300" : "text-sm text-slate-600"}>
          Back
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px,1fr]">
        <aside className={`${cardClasses} p-4`}>
          <h1 className="text-lg font-semibold">Navigation Demo</h1>
          <p className={darkMode ? "mt-1 text-sm text-slate-400" : "mt-1 text-sm text-slate-600"}>
            Search floor and destination to preview indoor routing.
          </p>

          <div className="mt-4">
            <div className={darkMode ? "mb-2 text-xs font-semibold text-slate-400" : "mb-2 text-xs font-semibold text-slate-500"}>
              Floors
            </div>

            <div className="flex flex-wrap gap-2">
              {BUILDING.floors.map((item) => {
                const active = item.id === floorId;

                return (
                  <button
                    key={item.id}
                    onClick={() => setFloorAndResetRoute(item.id)}
                    className={
                      active
                        ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
                        : darkMode
                          ? "rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-300"
                          : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
                    }
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <button
              onClick={() => {
                setActiveField("from");
                setSearchOpen(true);
              }}
              className={
                darkMode
                  ? "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-left text-sm text-white"
                  : "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-sm text-slate-900"
              }
            >
              <span className={darkMode ? "block text-xs text-slate-400" : "block text-xs text-slate-500"}>
                From
              </span>
              <span className="block font-medium">{routeData.startPoi?.name}</span>
            </button>

            <button
              onClick={() => {
                setActiveField("to");
                setSearchOpen(true);
              }}
              className={
                darkMode
                  ? "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-left text-sm text-white"
                  : "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-sm text-slate-900"
              }
            >
              <span className={darkMode ? "block text-xs text-slate-400" : "block text-xs text-slate-500"}>
                To
              </span>
              <span className="block font-medium">{routeData.destPoi?.name}</span>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <PoiBadge label={routeData.startPoi?.name} active darkMode={darkMode} />
            <PoiBadge label={routeData.destPoi?.name} darkMode={darkMode} />
          </div>

          <div className="mt-4">
            <MapLegend darkMode={darkMode} />
          </div>
        </aside>

        <section className={`${cardClasses} p-4`}>
          <div className="mb-4">
            <h2 className="text-base font-semibold">{BUILDING.name}</h2>
            <p className={darkMode ? "text-sm text-slate-400" : "text-sm text-slate-600"}>
              {floor.name} indoor navigation preview
            </p>
          </div>

          <MapCanvas
            imageSrc={floor.image}
            nodes={floor.nodes}
            pois={floor.pois}
            routePoints={routeData.points}
            highlight={{
              startPoiId: routeData.startPoi?.id,
              destPoiId: routeData.destPoi?.id,
            }}
          />
        </section>
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 sm:items-center sm:justify-center">
          <div
            className={
              darkMode
                ? "w-full rounded-t-3xl border border-slate-800 bg-slate-950 p-5 sm:max-w-lg sm:rounded-3xl"
                : "w-full rounded-t-3xl border border-slate-200 bg-white p-5 shadow-xl sm:max-w-lg sm:rounded-3xl"
            }
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {activeField === "from" ? "Choose start point" : "Choose destination"}
              </h3>
              <button
                onClick={() => setSearchOpen(false)}
                className={darkMode ? "text-sm text-slate-300" : "text-sm text-slate-500"}
              >
                Close
              </button>
            </div>

            <input
              value={activeField === "from" ? fromQuery : toQuery}
              onChange={(e) => {
                if (activeField === "from") setFromQuery(e.target.value);
                else setToQuery(e.target.value);
              }}
              placeholder="Type destination..."
              className={
                darkMode
                  ? "h-12 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-slate-600"
                  : "h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
              }
            />

            <div className="mt-4 max-h-72 space-y-2 overflow-auto">
              {activeList.map((poi) => (
                <button
                  key={poi.id}
                  onClick={() => {
                    if (activeField === "from") {
                      setStartPoiId(poi.id);
                      setFromQuery(poi.name);
                    } else {
                      setDestPoiId(poi.id);
                      setToQuery(poi.name);
                    }
                    setSearchOpen(false);
                  }}
                  className={
                    darkMode
                      ? "block w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-left text-sm hover:bg-slate-800"
                      : "block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm hover:bg-slate-100"
                  }
                >
                  {poi.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
