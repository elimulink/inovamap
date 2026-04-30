import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import MapCanvas from "../components/MapCanvas";
import MapLegend from "../components/MapLegend";
import PoiBadge from "../components/PoiBadge";
import MapMobileControls from "../components/map/MapMobileControls";
import MapSubmenu from "../components/map/MapSubmenu";
import MapSubmenuRail from "../components/map/MapSubmenuRail";
import { useTheme } from "../context/ThemeContext";
import { BUILDING } from "../data/sarit/building";
import { demoBuildings, demoFloors } from "../data/demoBuildings";
import { dijkstraPath } from "../routing/dijkstra";

const routeModes = ["Fastest", "Accessible", "Nearest Exit"];
const defaultOpenSections = {
  building: false,
  route: false,
  floor: false,
  places: false,
  preview: false,
  legend: false,
};
const storageKey = "inovamap-map-submenu-expanded-v2";

function getBuildingFloorOptions(selectedBuildingId) {
  const matchedFloors = demoFloors.filter((item) => item.buildingId === selectedBuildingId);

  if (matchedFloors.length === 0) {
    return BUILDING.floors.map((item) => ({
      id: item.id,
      name: item.name,
      graphFloorId: item.id,
      image: item.image,
    }));
  }

  return matchedFloors.map((item) => {
    const key = `${item.id} ${item.name}`.toLowerCase();
    const graphFloorId = key.includes("second") ? "second" : BUILDING.floors[0].id;

    return {
      id: item.id,
      name: item.name,
      graphFloorId,
      image: item.image,
    };
  });
}

export default function MapDemo() {
  const navigate = useNavigate();
  const { buildingId, floorId: routeFloorId } = useParams();
  const { darkMode } = useTheme();
  const [submenuExpanded, setSubmenuExpanded] = useState(() => {
    const saved =
      typeof window !== "undefined" ? window.localStorage.getItem(storageKey) : null;
    return saved === null ? true : saved !== "false";
  });
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeField, setActiveField] = useState("to");
  const [activeSection, setActiveSection] = useState("route");
  const [openSections, setOpenSections] = useState(defaultOpenSections);
  const [buildingMenuOpen, setBuildingMenuOpen] = useState(false);
  const [buildingPickerOpen, setBuildingPickerOpen] = useState(false);
  const [buildingPickerStyle, setBuildingPickerStyle] = useState(null);
  const [poiSearch, setPoiSearch] = useState("");
  const [routeMode, setRouteMode] = useState(routeModes[0]);
  const buildingPickerRef = useRef(null);
  const buildingPickerPopoverRef = useRef(null);

  const selectedBuilding = demoBuildings.find((b) => b.id === buildingId) || {
    id: BUILDING.id,
    name: BUILDING.name,
    type: "Retail",
    description: "Indoor navigation demo experience.",
    status: "Live",
    floors: BUILDING.floors.length,
    pois: BUILDING.floors.reduce((total, floor) => total + floor.pois.length, 0),
  };

  const buildingFloorOptions = useMemo(
    () => getBuildingFloorOptions(selectedBuilding.id),
    [selectedBuilding.id]
  );

  const selectedFloorOption =
    buildingFloorOptions.find((item) => item.id === routeFloorId) || buildingFloorOptions[0];

  const floor =
    BUILDING.floors.find((item) => item.id === selectedFloorOption?.graphFloorId) ||
    BUILDING.floors[0];

  const [fromQuery, setFromQuery] = useState(floor.pois[0]?.name || "");
  const [toQuery, setToQuery] = useState(floor.pois[1]?.name || floor.pois[0]?.name || "");
  const [startPoiId, setStartPoiId] = useState(floor.pois[0]?.id || "");
  const [destPoiId, setDestPoiId] = useState(floor.pois[1]?.id || floor.pois[0]?.id || "");

  useEffect(() => {
    window.localStorage.setItem(storageKey, submenuExpanded ? "true" : "false");
  }, [submenuExpanded]);

  useEffect(() => {
    if (!buildingPickerOpen) return undefined;

    const handlePointerDown = (event) => {
      const insideTrigger =
        buildingPickerRef.current && buildingPickerRef.current.contains(event.target);
      const insidePopover =
        buildingPickerPopoverRef.current &&
        buildingPickerPopoverRef.current.contains(event.target);

      if (!insideTrigger && !insidePopover) {
        setBuildingPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [buildingPickerOpen]);

  useEffect(() => {
    if (!buildingPickerOpen) return undefined;

    const updatePickerPosition = () => {
      if (!buildingPickerRef.current) return;

      const rect = buildingPickerRef.current.getBoundingClientRect();
      const gap = 8;
      const viewportPadding = 16;
      const isCompactViewport = window.innerWidth < 1024;
      const desiredWidth = isCompactViewport
        ? Math.min(window.innerWidth - viewportPadding * 2, Math.max(rect.width, 320))
        : Math.max(rect.width, 300);
      const maxWidth = Math.min(desiredWidth, window.innerWidth - viewportPadding * 2);
      const centeredLeft = rect.left + rect.width / 2 - maxWidth / 2;
      const left = Math.min(
        Math.max(viewportPadding, centeredLeft),
        window.innerWidth - viewportPadding - maxWidth
      );
      const maxHeight = Math.min(320, window.innerHeight - rect.bottom - gap - viewportPadding);

      setBuildingPickerStyle({
        left,
        top: rect.bottom + gap,
        width: maxWidth,
        maxHeight: Math.max(200, maxHeight),
      });
    };

    updatePickerPosition();
    window.addEventListener("resize", updatePickerPosition);
    window.addEventListener("scroll", updatePickerPosition, true);

    return () => {
      window.removeEventListener("resize", updatePickerPosition);
      window.removeEventListener("scroll", updatePickerPosition, true);
    };
  }, [buildingPickerOpen]);

  useEffect(() => {
    setBuildingMenuOpen(false);
    setBuildingPickerOpen(false);
  }, [selectedBuilding.id, selectedFloorOption?.id]);

  useEffect(() => {
    setFromQuery(floor.pois[0]?.name || "");
    setToQuery(floor.pois[1]?.name || floor.pois[0]?.name || "");
    setStartPoiId(floor.pois[0]?.id || "");
    setDestPoiId(floor.pois[1]?.id || floor.pois[0]?.id || "");
    setPoiSearch("");
  }, [floor.id]);

  const activeList = useMemo(() => {
    const query = activeField === "from" ? fromQuery : toQuery;
    return floor.pois.filter((poi) => poi.name.toLowerCase().includes(query.toLowerCase()));
  }, [activeField, floor.pois, fromQuery, toQuery]);

  const filteredPoiList = useMemo(() => {
    if (!poiSearch.trim()) return floor.pois;
    return floor.pois.filter((poi) => poi.name.toLowerCase().includes(poiSearch.toLowerCase()));
  }, [floor.pois, poiSearch]);

  const routeData = useMemo(() => {
    const startPoi = floor.pois.find((p) => p.id === startPoiId) ?? floor.pois[0];
    const destPoi = floor.pois.find((p) => p.id === destPoiId) ?? floor.pois[1] ?? floor.pois[0];

    if (!startPoi || !destPoi) {
      return { startPoi: null, destPoi: null, points: [] };
    }

    const path = dijkstraPath(floor.graph, startPoi.nearNodeId, destPoi.nearNodeId);

    const points = path
      .map((id) => floor.nodes.find((n) => n.id === id))
      .filter(Boolean)
      .map((n) => ({ x: n.x, y: n.y }));

    return { startPoi, destPoi, points };
  }, [destPoiId, floor, startPoiId]);

  const mapShell = darkMode
    ? "bg-slate-950 text-white"
    : "bg-[#eef3fb] text-slate-900";
  const sidebarShell = darkMode
    ? "bg-slate-900 border-slate-800"
    : "bg-[#edf3fb] border-slate-200/80";

  const inputClasses = darkMode
    ? "h-10.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 text-[14px] text-white outline-none focus:ring-2 focus:ring-slate-600 lg:h-11 lg:px-4"
    : "h-10.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-[14px] text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 lg:h-11 lg:px-4";

  const openPoiPicker = (field) => {
    setActiveField(field);
    setSearchOpen(true);
  };

  const navigateToBuilding = (nextBuildingId) => {
    const nextFloorId = getBuildingFloorOptions(nextBuildingId)[0]?.id || BUILDING.floors[0].id;
    navigate(`/demo/map/${nextBuildingId}/${nextFloorId}`);
  };

  const navigateToFloor = (nextFloorOptionId) => {
    navigate(`/demo/map/${selectedBuilding.id}/${nextFloorOptionId}`);
  };

  const selectPoi = (poi, field) => {
    if (field === "from") {
      setStartPoiId(poi.id);
      setFromQuery(poi.name);
    } else {
      setDestPoiId(poi.id);
      setToQuery(poi.name);
    }
    setSearchOpen(false);
  };

  const handleToggleSection = (sectionId) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
    setActiveSection(sectionId);
  };

  const handleExpandForSection = (sectionId) => {
    setSubmenuExpanded(true);
    setActiveSection(sectionId);
    setOpenSections((prev) => ({ ...prev, [sectionId]: true }));
  };

  const routeSummaryText =
    routeData.points.length >= 2
      ? `${routeData.points.length - 1} route segments across ${selectedFloorOption?.name || floor.name}.`
      : "Pick start and destination points to preview a route.";

  const railItems = [
    { id: "building", label: "Building", icon: "building" },
    { id: "route", label: "Route", icon: "route" },
    { id: "floor", label: "Floor", icon: "floor" },
    { id: "places", label: "Places", icon: "places" },
    { id: "preview", label: "Route Preview", icon: "preview" },
    { id: "legend", label: "Legend", icon: "legend" },
  ];

  const sectionItems = [
    {
      id: "building",
      label: "Building",
      icon: "building",
      content: (
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Building
          </label>
          <div className="relative" ref={buildingPickerRef}>
            <button
              type="button"
              onClick={() => setBuildingPickerOpen((prev) => !prev)}
              className={`${inputClasses} flex items-center justify-between`}
              aria-expanded={buildingPickerOpen}
              aria-haspopup="dialog"
            >
              <span className="truncate">{selectedBuilding.name}</span>
              <span
                className={`text-slate-500 transition-transform ${
                  buildingPickerOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>
          {buildingPickerOpen && buildingPickerStyle && typeof document !== "undefined"
            ? createPortal(
                <div
                  ref={buildingPickerPopoverRef}
                  className="fixed z-[120] overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
                  style={{
                    left: buildingPickerStyle.left,
                    top: buildingPickerStyle.top,
                    width: buildingPickerStyle.width,
                    maxHeight: buildingPickerStyle.maxHeight,
                  }}
                >
                  <div className="border-b border-slate-200 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    Choose building
                  </div>
                  <div className="overflow-y-auto px-2 py-1.5" style={{ maxHeight: buildingPickerStyle.maxHeight - 44 }}>
                    {demoBuildings.map((building) => {
                      const active = building.id === selectedBuilding.id;

                      return (
                        <button
                          key={building.id}
                          type="button"
                          onClick={() => {
                            setBuildingPickerOpen(false);
                            navigateToBuilding(building.id);
                          }}
                          className={`block w-full border-b border-slate-200 px-2.5 py-3.5 text-left transition last:border-b-0 ${
                            active
                              ? "rounded-xl bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white"
                              : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold tracking-tight">{building.name}</span>
                            <span
                              className={`text-xs ${
                                active
                                  ? "text-slate-500 dark:text-slate-400"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              {building.type}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>,
                document.body
              )
            : null}

          <input
            value={poiSearch}
            onChange={(e) => setPoiSearch(e.target.value)}
            placeholder="Search shops, clinics, lounges, cafes..."
            className={inputClasses}
          />
        </div>
      ),
    },
    {
      id: "route",
      label: "Route",
      icon: "route",
      content: (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => openPoiPicker("from")}
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-left text-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 dark:hover:bg-slate-900"
          >
            <span className="block text-xs text-slate-500">From</span>
            <span className="font-medium">{routeData.startPoi?.name || "Choose start point"}</span>
          </button>

          <button
            type="button"
            onClick={() => openPoiPicker("to")}
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-left text-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 dark:hover:bg-slate-900"
          >
            <span className="block text-xs text-slate-500">To</span>
            <span className="font-medium">{routeData.destPoi?.name || "Choose destination"}</span>
          </button>

          <div className="flex flex-wrap gap-2 pt-1">
            {routeModes.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setRouteMode(mode)}
                className={
                  mode === routeMode
                    ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
                    : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                }
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "floor",
      label: "Floor",
      icon: "floor",
      content: (
        <div className="flex flex-wrap gap-2">
          {buildingFloorOptions.map((item) => {
            const active = item.id === selectedFloorOption?.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateToFloor(item.id)}
                className={
                  active
                    ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
                    : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                }
              >
                {item.name}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      id: "places",
      label: "Places",
      icon: "places",
      content: (
        <div className="space-y-1 border-t border-slate-200 pt-2 dark:border-slate-800">
          {filteredPoiList.map((poi) => (
            <button
              key={poi.id}
              type="button"
              onClick={() => {
                setDestPoiId(poi.id);
                setToQuery(poi.name);
              }}
              className="block w-full rounded-lg px-2.5 py-2.5 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              {poi.name}
            </button>
          ))}
          {filteredPoiList.length === 0 ? (
            <div className="px-2.5 py-3 text-sm text-slate-500 dark:text-slate-400">
              No POIs matched that search on this floor.
            </div>
          ) : null}
        </div>
      ),
    },
    {
      id: "preview",
      label: "Route Preview",
      icon: "preview",
      content: (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <PoiBadge label={routeData.startPoi?.name || "Start"} active darkMode={darkMode} />
            <PoiBadge label={routeData.destPoi?.name || "Destination"} darkMode={darkMode} />
          </div>

          <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
            <div className="text-sm font-semibold">{routeMode} route</div>
            <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {routeSummaryText}
            </div>
            <div className="mt-3 text-xs uppercase tracking-[0.12em] text-slate-500">
              Floor: {selectedFloorOption?.name || floor.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "legend",
      label: "Legend",
      icon: "legend",
      content: <MapLegend darkMode={darkMode} />,
    },
  ];

  return (
    <AppShell
      darkMode={darkMode}
      showHeader={false}
      maxWidth="max-w-none"
      contentClassName="!px-0 !py-0"
    >
      <div className={`min-h-screen ${mapShell} lg:flex lg:h-screen lg:overflow-hidden`}>
        <aside
          className={`hidden lg:flex lg:h-screen lg:shrink-0 lg:flex-col lg:overflow-hidden lg:border-r lg:transition-[width] lg:duration-300 ${sidebarShell} ${
            submenuExpanded ? "lg:w-[264px]" : "lg:w-[60px]"
          }`}
        >
          {submenuExpanded ? (
            <MapSubmenu
              title={selectedBuilding.name}
              description="Search the building, switch floors, and refine the route without losing the map."
              items={sectionItems}
              openSections={openSections}
              onToggleSection={handleToggleSection}
              onCollapse={() => setSubmenuExpanded(false)}
            />
          ) : (
            <div className="h-full py-6">
              <MapSubmenuRail
                items={railItems}
                activeSection={activeSection}
                onExpand={() => setSubmenuExpanded(true)}
                onSelect={handleExpandForSection}
              />
            </div>
          )}
        </aside>

        <section className="min-w-0 lg:flex lg:h-screen lg:flex-1 lg:flex-col lg:overflow-hidden">
          <div className="relative px-3 py-3 lg:flex-1 lg:min-h-0 lg:px-4 lg:py-4">
            <div className="absolute left-5 top-5 z-20 lg:left-5 lg:top-5">
              <button
                type="button"
                onClick={() => setBuildingMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-[16px] border border-slate-200 bg-white/92 px-3.5 py-1.75 text-left text-[15px] font-semibold tracking-tight text-slate-900 shadow-sm backdrop-blur hover:bg-white dark:border-slate-800 dark:bg-slate-950/92 dark:text-white dark:hover:bg-slate-950"
              >
                <span>{selectedBuilding.name}</span>
                <span
                  className={`text-slate-500 transition-transform ${buildingMenuOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>

              {buildingMenuOpen ? (
                <div className="mt-2 min-w-[210px] overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                  <div className="border-b border-slate-200 px-3.5 py-2.5 dark:border-slate-800">
                    <div className="text-[13px] font-semibold">{selectedBuilding.name}</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {selectedBuilding.type}
                    </div>
                  </div>
                  <div className="px-3.5 py-2.5 text-[13px]">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500 dark:text-slate-400">Current floor</span>
                      <span className="font-medium">{selectedFloorOption?.name || floor.name}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="absolute right-5 top-5 z-20 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileControlsOpen(true)}
                className="rounded-xl bg-slate-900 px-3 py-1.75 text-[13px] font-medium text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-900"
              >
                Controls
              </button>
            </div>

            <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:h-full lg:rounded-[20px]">
              <MapCanvas
                imageSrc={selectedFloorOption?.image || floor.image}
                nodes={floor.nodes}
                pois={floor.pois}
                routePoints={routeData.points}
                highlight={{
                  startPoiId: routeData.startPoi?.id,
                  destPoiId: routeData.destPoi?.id,
                }}
                heightClassName="h-[72vh] min-h-[420px] lg:h-full"
              />
            </div>
          </div>
        </section>
      </div>

      <MapMobileControls
        open={mobileControlsOpen}
        onOpen={() => setMobileControlsOpen(true)}
        onClose={() => setMobileControlsOpen(false)}
      >
        <MapSubmenu
          title={selectedBuilding.name}
          description="Search the building, switch floors, and refine the route without losing the map."
          items={sectionItems}
          openSections={openSections}
          onToggleSection={handleToggleSection}
          onCollapse={() => setMobileControlsOpen(false)}
        />
      </MapMobileControls>

      {searchOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 sm:items-center sm:justify-center">
          <div className="w-full rounded-t-3xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-950 sm:max-w-lg sm:rounded-3xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {activeField === "from" ? "Choose start point" : "Choose destination"}
              </h3>
              <button onClick={() => setSearchOpen(false)} className="text-sm text-slate-500">
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
              className={inputClasses}
            />

            <div className="mt-3 max-h-72 space-y-2 overflow-auto">
              {activeList.map((poi) => (
                <button
                  key={poi.id}
                  onClick={() => selectPoi(poi, activeField)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-left text-sm hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  {poi.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
