import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { demoBuildings, demoFloors } from "../data/demoBuildings";
import { BUILDING } from "../data/sarit/building";

const sectors = [
  {
    title: "Airports",
    text: "Guide passengers through terminals, gates, lounges, and support services.",
  },
  {
    title: "Hospitals",
    text: "Help visitors find wards, radiology, pharmacy, emergency, and billing faster.",
  },
  {
    title: "Malls",
    text: "Enable customers to locate shops, cafes, ATMs, washrooms, and exits easily.",
  },
  {
    title: "Universities",
    text: "Support movement across lecture halls, offices, departments, and libraries.",
  },
];

const venueStories = [
  {
    title: "Airports",
    label: "Gate-to-service routing",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Suvarnabhumi_Airport_Terminal_E_interior_(I).jpg?width=1200",
  },
  {
    title: "Malls",
    label: "Shop, amenity, and exit discovery",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Robinsons_Galleria_Mall_Interior_Atrium_Quezon_City.jpg?width=1200",
  },
  {
    title: "Hospitals",
    label: "Ward, desk, and department guidance",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Southland_Hospital_Lobby.jpg?width=1200",
  },
];

function getDefaultFloorId(buildingId) {
  return demoFloors.find((item) => item.buildingId === buildingId)?.id || BUILDING.floors[0].id;
}

export default function Landing() {
  const navigate = useNavigate();
  const darkMode = false;
  const searchRef = useRef(null);
  const previewRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuildingId, setSelectedBuildingId] = useState(demoBuildings[0]?.id || BUILDING.id);

  const selectedBuilding =
    demoBuildings.find((item) => item.id === selectedBuildingId) || demoBuildings[0] || BUILDING;

  const selectedFloors = useMemo(
    () => demoFloors.filter((item) => item.buildingId === selectedBuilding.id),
    [selectedBuilding.id]
  );

  const filteredBuildings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return demoBuildings;

    return demoBuildings.filter((item) => {
      const haystack = `${item.name} ${item.type} ${item.description}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [searchQuery]);

  const previewImage = selectedFloors[0]?.image || BUILDING.floors[0].image;
  const defaultFloorId = getDefaultFloorId(selectedBuilding?.id);
  const cardClasses = darkMode
    ? "rounded-3xl border border-slate-800 bg-slate-900"
    : "rounded-3xl border border-slate-200 bg-white shadow-sm";

  const mutedText = darkMode ? "text-slate-400" : "text-slate-600";

  const openSelectedBuilding = () => {
    navigate(`/demo/map/${selectedBuilding.id}/${defaultFloorId}`);
  };

  const focusSearch = () => {
    searchRef.current?.focus();
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AppShell
      darkMode={false}
      showThemeToggle={false}
      headerClassName="hidden md:block"
      maxWidth="max-w-none"
      rightSlot={
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-sm font-medium text-slate-700 hover:text-slate-950"
          >
            Feedback
          </button>
          <button
            type="button"
            onClick={focusSearch}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-500 shadow-sm hover:bg-slate-50"
          >
            <span aria-hidden="true">⌕</span>
            <span>Search...</span>
            <kbd className="rounded border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-500">
              Ctrl K
            </kbd>
          </button>
          <Link
            to="/admin/login"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Add Building
          </Link>
        </div>
      }
    >
      <section className="landing-hero-section grid gap-6 py-8 lg:grid-cols-[1.05fr,0.95fr] lg:items-stretch lg:py-12">
        <div className="home-hero-images" aria-hidden="true">
          {venueStories.map((story) => (
            <figure key={story.title} className={`home-hero-image ${story.title.toLowerCase()}`}>
              <img src={story.image} alt="" />
              <figcaption>
                <strong>{story.title}</strong>
                <span>{story.label}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="relative z-[1] flex flex-col justify-center">
          <span
            className={
              darkMode
                ? "inline-flex w-fit rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300"
                : "inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
            }
          >
            Smart buildings - Digital movement - Indoor visibility
          </span>

          <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight sm:text-[44px] sm:leading-[1.05]">
            Preview the building first, then open the map right where navigation happens.
          </h1>

          <p className={`mt-5 max-w-xl text-base leading-7 ${mutedText}`}>
            InovaMap gives visitors a clean way to search a facility, preview its floors, and jump
            straight into indoor routing without getting lost in long mobile scrolling.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={openSelectedBuilding}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
            >
              Explore Demo
            </button>

            <button
              onClick={focusSearch}
              className={
                darkMode
                  ? "rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-white hover:bg-slate-900"
                  : "rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              }
            >
              Search Building
            </button>

            <Link
              to="/admin/login"
              className={
                darkMode
                  ? "rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-white hover:bg-slate-900"
                  : "rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              }
            >
              Add Building
            </Link>
          </div>
        </div>

        <div ref={previewRef} className={`relative z-[1] ${cardClasses} overflow-hidden p-4 sm:p-5`}>
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-950">
            <img
              src={previewImage}
              alt={`${selectedBuilding.name} preview`}
              className="h-64 w-full object-cover opacity-80 sm:h-72"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">
                {selectedBuilding.type} preview
              </div>
              <h2 className="mt-3 text-2xl font-semibold">{selectedBuilding.name}</h2>
              <p className="mt-2 max-w-lg text-sm text-slate-200">{selectedBuilding.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                  {selectedBuilding.floors} floors
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                  {selectedBuilding.pois} POIs
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                  Status: {selectedBuilding.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className={darkMode ? "rounded-2xl bg-slate-950 p-4" : "rounded-2xl bg-slate-50 p-4"}>
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Floors
              </div>
              <div className="mt-2 text-lg font-semibold">{selectedBuilding.floors}</div>
            </div>
            <div className={darkMode ? "rounded-2xl bg-slate-950 p-4" : "rounded-2xl bg-slate-50 p-4"}>
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Destinations
              </div>
              <div className="mt-2 text-lg font-semibold">{selectedBuilding.pois}</div>
            </div>
            <div className={darkMode ? "rounded-2xl bg-slate-950 p-4" : "rounded-2xl bg-slate-50 p-4"}>
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Next step
              </div>
              <div className="mt-2 text-lg font-semibold">Open map</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 pb-10 lg:grid-cols-[0.95fr,1.05fr]">
        <div className={`${cardClasses} p-5 sm:p-6`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">Search a building</h2>
              <p className={`mt-2 text-sm ${mutedText}`}>
                Pick a facility and jump straight into its live demo map.
              </p>
            </div>
            <button
              onClick={openSelectedBuilding}
              className="hidden rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 sm:block"
            >
              Open map
            </button>
          </div>

          <div className="mt-5">
            <label className={`mb-2 block text-sm font-medium ${mutedText}`} htmlFor="building-search">
              Building search
            </label>
            <input
              id="building-search"
              ref={searchRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by building, facility type, or destination style"
              className={
                darkMode
                  ? "h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-slate-600"
                  : "h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
              }
            />
          </div>

          <div className="mt-4 space-y-3">
            {filteredBuildings.map((building) => {
              const isActive = building.id === selectedBuildingId;

              return (
                <button
                  key={building.id}
                  onClick={() => setSelectedBuildingId(building.id)}
                  className={
                    isActive
                      ? "w-full rounded-2xl border border-slate-900 bg-slate-900 p-4 text-left text-white dark:border-white dark:bg-white dark:text-slate-900"
                      : darkMode
                        ? "w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left text-white hover:bg-slate-900"
                        : "w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left hover:bg-white"
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold">{building.name}</div>
                      <div className={isActive ? "mt-1 text-sm text-slate-200 dark:text-slate-700" : `mt-1 text-sm ${mutedText}`}>
                        {building.description}
                      </div>
                    </div>
                    <span
                      className={
                        isActive
                          ? "rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs dark:border-slate-300 dark:bg-slate-100"
                          : darkMode
                            ? "rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300"
                            : "rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
                      }
                    >
                      {building.type}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredBuildings.length === 0 ? (
            <div className={`mt-4 rounded-2xl border border-dashed p-4 text-sm ${mutedText}`}>
              No buildings matched that search. Try "mall", "hospital", or "airport".
            </div>
          ) : null}

          <button
            onClick={openSelectedBuilding}
            className="mt-5 w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 sm:hidden"
          >
            Open selected building map
          </button>
        </div>

        <div className={`${cardClasses} p-5 sm:p-6`}>
          <div>
            <h2 className="text-2xl font-semibold">What the public user gets</h2>
            <p className={`mt-2 text-sm ${mutedText}`}>
              A guided facility preview on landing, then a focused map screen with collapsible route
              controls.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              "Building search with immediate facility preview",
              "Map-first layout after selection",
              "Floor switching inside the route controls",
              "Destination search and route summary in one drawer",
            ].map((item) => (
              <div
                key={item}
                className={
                  darkMode
                    ? "rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300"
                    : "rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
                }
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold">Where InovaMap works</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {sectors.map((sector) => (
                <article
                  key={sector.title}
                  className={
                    darkMode
                      ? "rounded-2xl border border-slate-800 bg-slate-950 p-4"
                      : "rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  }
                >
                  <h4 className="text-base font-semibold">{sector.title}</h4>
                  <p className={`mt-2 text-sm leading-6 ${mutedText}`}>{sector.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
