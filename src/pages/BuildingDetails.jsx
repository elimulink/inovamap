import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AppShell from "../components/AppShell";
import { EmptyState } from "../components/PageState";
import AdminMobileBar from "../components/admin/AdminMobileBar";
import AdminMobileMenu from "../components/admin/AdminMobileMenu";
import { useTheme } from "../context/ThemeContext";
import { demoBuildings, demoFloors } from "../data/demoBuildings";

export default function BuildingDetails() {
  useTheme();
  const { buildingId } = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const building = demoBuildings.find((item) => item.id === buildingId);
  const firstFloor = useMemo(
    () => demoFloors.find((item) => item.buildingId === buildingId),
    [buildingId]
  );

  const cardClasses = "rounded-2xl border border-[#dde3ec] bg-white shadow-sm";

  return (
    <AppShell
      darkMode={false}
      sidebar={<AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />}
    >
      <AdminMobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} darkMode={false} />
      <AdminMobileBar title="Building Details" onOpenMenu={() => setMobileMenuOpen(true)} />

      <div className="mb-4 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="text-sm text-slate-600"
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
                  "mt-2 text-sm text-slate-600"
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
              <div className="rounded-xl bg-[#f7f9fc] p-4">
                <div className="text-xs text-slate-500">
                  Floors
                </div>
                <div className="mt-1 text-xl font-semibold">{building.floors}</div>
              </div>

              <div className="rounded-xl bg-[#f7f9fc] p-4">
                <div className="text-xs text-slate-500">
                  POIs
                </div>
                <div className="mt-1 text-xl font-semibold">{building.pois}</div>
              </div>

              <div className="rounded-xl bg-[#f7f9fc] p-4">
                <div className="text-xs text-slate-500">
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
                  "block rounded-xl border border-[#dde3ec] bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-[#f7f9fc]"
                }
              >
                Manage Floors
              </Link>

              <Link
                to={
                  firstFloor
                    ? `/demo/map/${firstFloor.buildingId}/${firstFloor.id}`
                    : "/demo/map"
                }
                className={
                  "block rounded-xl border border-[#dde3ec] bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-[#f7f9fc]"
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
