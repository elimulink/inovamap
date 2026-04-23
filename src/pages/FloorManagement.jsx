import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useTheme } from "../context/ThemeContext";

const floors = [
  { id: "ground", name: "Ground Floor", building: "Central Mall", status: "Mapped" },
  { id: "first", name: "First Floor", building: "Central Mall", status: "Mapped" },
  { id: "second", name: "Second Floor", building: "City Hospital", status: "Draft" },
];

export default function FloorManagement() {
  const { darkMode } = useTheme();

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

      <section className={`${cardClasses} p-5`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Floor Management</h1>
            <p className={darkMode ? "mt-1 text-sm text-slate-400" : "mt-1 text-sm text-slate-600"}>
              Manage floor structure, readiness, and future map uploads.
            </p>
          </div>

          <button
            className={
              darkMode
                ? "rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                : "rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            }
          >
            Add Floor
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {floors.map((floor) => (
            <div
              key={floor.id}
              className={
                darkMode
                  ? "rounded-xl border border-slate-800 bg-slate-950 p-4"
                  : "rounded-xl border border-slate-200 bg-slate-50 p-4"
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{floor.name}</div>
                  <div
                    className={
                      darkMode ? "mt-1 text-sm text-slate-400" : "mt-1 text-sm text-slate-600"
                    }
                  >
                    {floor.building}
                  </div>
                </div>

                <span
                  className={
                    floor.status === "Mapped"
                      ? "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                      : "rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
                  }
                >
                  {floor.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
