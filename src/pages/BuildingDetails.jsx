import { Link, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import { EmptyState } from "../components/PageState";
import { useTheme } from "../context/ThemeContext";
import { demoBuildings } from "../data/demoBuildings";

export default function BuildingDetails() {
  const { darkMode } = useTheme();
  const { buildingId } = useParams();
  const building = demoBuildings.find((item) => item.id === buildingId);

  const cardClasses = darkMode
    ? "rounded-2xl border border-slate-800 bg-slate-900"
    : "rounded-2xl border border-slate-200 bg-white shadow-sm";

  return (
    <AppShell darkMode={darkMode}>
      <div className="mb-4 flex items-center justify-between">
        <Link
          to="/dashboard"
          className={darkMode ? "text-sm text-slate-300" : "text-sm text-slate-600"}
        >
          Back to dashboard
        </Link>
      </div>

      {!building ? (
        <EmptyState
          title="Building not found"
          description="The selected building does not exist in the current demo dataset."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <section className={`${cardClasses} p-5`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold">{building.name}</h1>
                <p
                  className={
                    darkMode ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-600"
                  }
                >
                  {building.description}
                </p>
              </div>

              <span
                className={
                  building.status === "Live"
                    ? "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                    : "rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
                }
              >
                {building.status}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className={darkMode ? "rounded-xl bg-slate-950 p-4" : "rounded-xl bg-slate-50 p-4"}>
                <div className={darkMode ? "text-xs text-slate-400" : "text-xs text-slate-500"}>
                  Floors
                </div>
                <div className="mt-1 text-xl font-semibold">{building.floors}</div>
              </div>

              <div className={darkMode ? "rounded-xl bg-slate-950 p-4" : "rounded-xl bg-slate-50 p-4"}>
                <div className={darkMode ? "text-xs text-slate-400" : "text-xs text-slate-500"}>
                  POIs
                </div>
                <div className="mt-1 text-xl font-semibold">{building.pois}</div>
              </div>

              <div className={darkMode ? "rounded-xl bg-slate-950 p-4" : "rounded-xl bg-slate-50 p-4"}>
                <div className={darkMode ? "text-xs text-slate-400" : "text-xs text-slate-500"}>
                  Last Updated
                </div>
                <div className="mt-1 text-sm font-semibold">{building.updated}</div>
              </div>
            </div>
          </section>

          <aside className={`${cardClasses} p-5`}>
            <h2 className="text-base font-semibold">Quick actions</h2>
            <div className="mt-4 space-y-3">
              <Link
                to="/dashboard/floors"
                className={
                  darkMode
                    ? "block rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
                    : "block rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                }
              >
                Manage Floors
              </Link>

              <Link
                to="/demo/map"
                className={
                  darkMode
                    ? "block rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
                    : "block rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                }
              >
                Open Demo Map
              </Link>
            </div>
          </aside>
        </div>
      )}
    </AppShell>
  );
}
