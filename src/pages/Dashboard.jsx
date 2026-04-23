import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import BrandLogo from "../components/BrandLogo";
import ThemeToggle from "../components/ThemeToggle";
import { EmptyState, PageLoading } from "../components/PageState";
import { useTheme } from "../context/ThemeContext";
import { demoBuildings } from "../data/demoBuildings";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const Icon = {
  Menu: (p) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Close: (p) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" {...p}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Search: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Bell: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  ChevronDown: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Home: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  Building: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <path d="M4 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20 21V9a1 1 0 0 0-1-1h-3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 7h2M7 11h2M7 15h2M11 7h2M11 11h2M11 15h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.65" />
    </svg>
  ),
  Layers: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 12l9 5 9-5M3 16l9 5 9-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" opacity="0.55" />
    </svg>
  ),
  Map: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 3v15M15 6v15" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
    </svg>
  ),
  Gear: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M19 12a7 7 0 0 0-.2-1.6l2-1.2-2-3.4-2.3.7A7 7 0 0 0 14 5l-.4-2h-3.2L10 5a7 7 0 0 0-2.5 1.5l-2.3-.7-2 3.4 2 1.2A7 7 0 0 0 5 12c0 .6.1 1.1.2 1.6l-2 1.2 2 3.4 2.3-.7A7 7 0 0 0 10 19l.4 2h3.2l.4-2a7 7 0 0 0 2.5-1.5l2.3.7 2-3.4-2-1.2c.1-.5.2-1 .2-1.6Z" stroke="currentColor" strokeWidth="1.6" opacity="0.45" />
    </svg>
  ),
  Chart: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <path d="M4 19V5M4 19h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 16v-5M12 16v-8M16 16v-3M20 16v-10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    </svg>
  ),
};

function StatCard({ label, value, hint, darkMode }) {
  return (
    <div className={darkMode ? "rounded-2xl border border-slate-800 bg-slate-900 p-4" : "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"}>
      <div className="text-2xl font-semibold sm:text-3xl">{value}</div>
      <div className={darkMode ? "mt-1 text-sm font-medium text-slate-200" : "mt-1 text-sm font-medium text-slate-700"}>{label}</div>
      {hint ? <div className={darkMode ? "mt-1 text-xs text-slate-400" : "mt-1 text-xs text-slate-500"}>{hint}</div> : null}
    </div>
  );
}

function ActionButton({ children, darkMode, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        darkMode
          ? "inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          : "inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
      }
    >
      {children}
    </button>
  );
}

function Pill({ children, tone = "neutral" }) {
  const toneClass = {
    neutral: "border-slate-200 bg-slate-100 text-slate-700",
    live: "border-emerald-200 bg-emerald-50 text-emerald-700",
    draft: "border-amber-200 bg-amber-50 text-amber-700",
  };

  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-medium", toneClass[tone])}>
      {children}
    </span>
  );
}

function SidebarContent({ collapsed, active, onNavigate }) {
  const itemsTop = [
    { label: "Dashboard", icon: Icon.Home, path: "/dashboard" },
    { label: "Buildings", icon: Icon.Building, path: "/dashboard/buildings/central-mall" },
    { label: "Floors", icon: Icon.Layers, path: "/dashboard/floors" },
    { label: "Maps & POIs", icon: Icon.Map, path: "/demo/map" },
  ];

  const itemsBottom = [
    { label: "Settings", icon: Icon.Gear, path: "/dashboard" },
    { label: "Analytics", icon: Icon.Chart, path: "/dashboard" },
  ];

  const NavItem = ({ label, icon, path }) => {
    const isActive = active === label;

    return (
      <button
        onClick={() => onNavigate(path)}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
          isActive ? "bg-slate-700 text-white" : "text-slate-200 hover:bg-slate-700/60 hover:text-white"
        )}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10">
          {React.createElement(icon, { className: "text-white" })}
        </span>
        {!collapsed ? <span>{label}</span> : null}
      </button>
    );
  };

  return (
    <>
      <div className="px-3">
        <div className="mt-2 space-y-1">
          {itemsTop.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </div>

        <div className="my-4 border-t border-white/10" />

        <div className="space-y-1">
          {itemsBottom.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </div>
      </div>

      {!collapsed ? (
        <div className="mt-6 px-4 pb-4 text-xs text-slate-300">
          <div className="rounded-xl bg-white/10 px-3 py-3">
            <div className="font-medium text-white">Tip</div>
            <div className="mt-1">Publish only after the building checklist is complete.</div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function DesktopSidebar({ collapsed, setCollapsed, onNavigate }) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 border-r border-slate-700/40 bg-slate-800 text-white lg:block",
        collapsed ? "w-[88px]" : "w-[280px]"
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <BrandLogo compact={collapsed} dark sidebar />
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 hover:bg-white/15"
          aria-label="Toggle sidebar"
        >
          <Icon.Menu className="text-white" />
        </button>
      </div>

      <SidebarContent collapsed={collapsed} active="Dashboard" onNavigate={onNavigate} />
    </aside>
  );
}

function MobileDrawer({ open, onClose, onNavigate }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button className="absolute inset-0 bg-slate-950/50" onClick={onClose} aria-label="Close menu overlay" />
      <aside className="absolute left-0 top-0 h-full w-[88%] max-w-xs bg-slate-800 text-white shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4">
          <BrandLogo dark sidebar />
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 hover:bg-white/15"
            aria-label="Close menu"
          >
            <Icon.Close className="text-white" />
          </button>
        </div>

        <SidebarContent
          collapsed={false}
          active="Dashboard"
          onNavigate={(path) => {
            onClose();
            onNavigate(path);
          }}
        />
      </aside>
    </div>
  );
}

function Topbar({ building, setBuilding, onOpenMenu, darkMode }) {
  const buildings = ["Central Mall", "City Hospital", "Airport Terminal"];

  return (
    <div className={darkMode ? "sticky top-0 z-30 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-4 backdrop-blur" : "sticky top-0 z-30 rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur"}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMenu}
            className={darkMode ? "grid h-10 w-10 place-items-center rounded-xl border border-slate-700 bg-slate-900 text-white lg:hidden" : "grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"}
            aria-label="Open menu"
          >
            <Icon.Menu />
          </button>

          <div>
            <div className="text-sm font-semibold sm:text-base">InovaMap Dashboard</div>
            <div className={darkMode ? "text-xs text-slate-400" : "text-xs text-slate-500"}>
              Manage indoor maps and building visibility
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className={darkMode ? "relative grid h-10 w-10 place-items-center rounded-xl border border-slate-700 bg-slate-900 text-white" : "relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"}
            aria-label="Notifications"
          >
            <Icon.Bell />
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-[11px] font-bold text-white">
              3
            </span>
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[220px,1fr]">
        <div className="relative">
          <label className={darkMode ? "mb-1 block text-xs font-semibold text-slate-400" : "mb-1 block text-xs font-semibold text-slate-500"}>
            Building
          </label>
          <select
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            className={darkMode ? "h-11 w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 px-3 pr-10 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-slate-600" : "h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-10 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-slate-300"}
          >
            {buildings.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-[38px] -translate-y-1/2 text-slate-500">
            <Icon.ChevronDown />
          </div>
        </div>

        <div className="relative">
          <label className={darkMode ? "mb-1 block text-xs font-semibold text-slate-400" : "mb-1 block text-xs font-semibold text-slate-500"}>
            Search
          </label>
          <div className="pointer-events-none absolute left-3 top-[38px] -translate-y-1/2 text-slate-500">
            <Icon.Search />
          </div>
          <input
            placeholder="Search buildings, POIs, or activities..."
            className={darkMode ? "h-11 w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-3 text-sm text-white outline-none focus:ring-2 focus:ring-slate-600" : "h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"}
          />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [building, setBuilding] = useState("Central Mall");
  const [loading] = useState(false);

  const actions = useMemo(
    () => [
      { label: "Add Building", onClick: () => navigate("/dashboard/buildings/central-mall") },
      { label: "Upload Floor Map", onClick: () => navigate("/dashboard/floors") },
      { label: "Add POI", onClick: () => navigate("/demo/map") },
      { label: "Edit Routing Graph", onClick: () => navigate("/demo/map") },
      { label: "Open Demo Map", onClick: () => navigate("/demo/map") },
      { label: "Prepare Publish", onClick: () => navigate("/dashboard/buildings/central-mall") },
    ],
    [navigate]
  );

  const activity = useMemo(
    () => [
      { text: "POI Added: Pharmacy on 2nd Floor", time: "Just now" },
      { text: "Floor Map Updated for City Hospital", time: "30 mins ago" },
      { text: "Route Created: Lobby to Cafeteria", time: "Today 11:15 AM" },
      { text: "Routing Node Edited on Central Mall", time: "Yesterday" },
    ],
    []
  );

  const checklist = useMemo(
    () => [
      "Floor maps uploaded",
      "POIs configured",
      "Routing graph complete",
      "Stair & lift connectors set",
      "Demo route tested",
      "Ready to publish",
    ],
    []
  );

  return (
    <AppShell
      darkMode={darkMode}
      sidebar={
        <DesktopSidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onNavigate={navigate}
        />
      }
    >
      <MobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} onNavigate={navigate} />

      <Topbar
        building={building}
        setBuilding={setBuilding}
        onOpenMenu={() => setMobileMenuOpen(true)}
        darkMode={darkMode}
      />

      {loading ? (
        <div className="mt-6">
          <PageLoading
            title="Loading dashboard"
            description="Preparing buildings, activities, and indoor mapping tools."
          />
        </div>
      ) : (
        <>
          <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
            {actions.map((action) => (
              <ActionButton key={action.label} darkMode={darkMode} onClick={action.onClick}>
                {action.label}
              </ActionButton>
            ))}
          </section>

          <section className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard label="Buildings Onboarded" value={demoBuildings.length} darkMode={darkMode} />
            <StatCard label="Floors Mapped" value="12" darkMode={darkMode} />
            <StatCard label="Points of Interest" value="38" darkMode={darkMode} />
            <StatCard label="Routes Generated" value="124" hint="24 this week" darkMode={darkMode} />
          </section>

          <div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr,1fr]">
            <section className={darkMode ? "rounded-2xl border border-slate-800 bg-slate-900" : "rounded-2xl border border-slate-200 bg-white shadow-sm"}>
              <div className="flex items-center justify-between px-4 py-4 sm:px-5">
                <h2 className="text-base font-semibold">Recent Activity</h2>
                <button className={darkMode ? "text-sm font-medium text-slate-400 hover:text-white" : "text-sm font-medium text-slate-600 hover:text-slate-900"}>
                  View all
                </button>
              </div>

              <div className={darkMode ? "border-t border-slate-800" : "border-t border-slate-100"}>
                {activity.length === 0 ? (
                  <div className="p-4 sm:p-5">
                    <EmptyState
                      title="No recent activity"
                      description="Activity will appear here after buildings, POIs, and routes are updated."
                    />
                  </div>
                ) : (
                  activity.map((item, idx) => (
                    <div
                      key={idx}
                      className={darkMode ? "flex flex-col gap-2 border-b border-slate-800 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-5" : "flex flex-col gap-2 border-b border-slate-100 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-5"}
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                          ✓
                        </span>
                        <div className="text-sm font-medium">{item.text}</div>
                      </div>
                      <div className={darkMode ? "pl-11 text-xs text-slate-400 sm:pl-0 sm:text-sm" : "pl-11 text-xs text-slate-500 sm:pl-0 sm:text-sm"}>
                        {item.time}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className={darkMode ? "rounded-2xl border border-slate-800 bg-slate-900" : "rounded-2xl border border-slate-200 bg-white shadow-sm"}>
              <div className="flex items-center justify-between px-4 py-4 sm:px-5">
                <h2 className="text-base font-semibold">Readiness Checklist</h2>
                <Pill tone="live">6 items</Pill>
              </div>

              <div className={darkMode ? "border-t border-slate-800" : "border-t border-slate-100"}>
                {checklist.map((item) => (
                  <div key={item} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                      ✓
                    </span>
                    <div className="text-sm font-medium">{item}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className={darkMode ? "mt-6 rounded-2xl border border-slate-800 bg-slate-900" : "mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm"}>
            <div className="flex items-center justify-between px-4 py-4 sm:px-5">
              <h2 className="text-base font-semibold">Buildings Overview</h2>
              <button className={darkMode ? "rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800" : "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"}>
                Publish
              </button>
            </div>

            {demoBuildings.length === 0 ? (
              <div className="p-4 sm:p-5">
                <EmptyState
                  title="No buildings yet"
                  description="Start by adding your first building, then upload floor maps and define POIs."
                  actionLabel="Add Building"
                  onAction={() => navigate("/dashboard/buildings/central-mall")}
                />
              </div>
            ) : (
              <>
                <div className={darkMode ? "hidden border-t border-slate-800 lg:block" : "hidden border-t border-slate-100 lg:block"}>
                  <div className={darkMode ? "grid grid-cols-12 gap-2 bg-slate-950 px-5 py-3 text-xs font-semibold text-slate-400" : "grid grid-cols-12 gap-2 bg-slate-50 px-5 py-3 text-xs font-semibold text-slate-600"}>
                    <div className="col-span-4">Building</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1">Floors</div>
                    <div className="col-span-1">POIs</div>
                    <div className="col-span-2">Last Updated</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>

                  {demoBuildings.map((item) => (
                    <div
                      key={item.id}
                      className={darkMode ? "grid grid-cols-12 items-center gap-2 px-5 py-3 text-sm hover:bg-slate-800/50" : "grid grid-cols-12 items-center gap-2 px-5 py-3 text-sm hover:bg-slate-50"}
                    >
                      <div className="col-span-4 flex items-center gap-2 font-medium">
                        <span className={darkMode ? "grid h-8 w-8 place-items-center rounded-lg bg-slate-800 text-slate-300" : "grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-700"}>
                          <Icon.Building />
                        </span>
                        {item.name}
                      </div>
                      <div className="col-span-2">
                        <Pill tone={item.status === "Live" ? "live" : "draft"}>{item.status}</Pill>
                      </div>
                      <div className="col-span-1">{item.floors}</div>
                      <div className="col-span-1">{item.pois}</div>
                      <div className={darkMode ? "col-span-2 text-slate-400" : "col-span-2 text-slate-600"}>{item.updated}</div>
                      <div className="col-span-2 flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/buildings/${item.id}`)}
                          className={darkMode ? "rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800" : "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"}
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate("/dashboard/floors")}
                          className={darkMode ? "rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800" : "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={darkMode ? "border-t border-slate-800 lg:hidden" : "border-t border-slate-100 lg:hidden"}>
                  <div className="space-y-3 p-4">
                    {demoBuildings.map((item) => (
                      <article key={item.id} className={darkMode ? "rounded-2xl border border-slate-800 bg-slate-950 p-4" : "rounded-2xl border border-slate-200 bg-slate-50 p-4"}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className={darkMode ? "grid h-10 w-10 place-items-center rounded-xl bg-slate-800 text-slate-300" : "grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-700 shadow-sm"}>
                              <Icon.Building />
                            </span>
                            <div>
                              <div className="font-semibold">{item.name}</div>
                              <div className={darkMode ? "mt-1 text-xs text-slate-400" : "mt-1 text-xs text-slate-500"}>Updated {item.updated}</div>
                            </div>
                          </div>

                          <Pill tone={item.status === "Live" ? "live" : "draft"}>{item.status}</Pill>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <div className={darkMode ? "rounded-xl bg-slate-900 p-3" : "rounded-xl bg-white p-3"}>
                            <div className={darkMode ? "text-xs text-slate-400" : "text-xs text-slate-500"}>Floors</div>
                            <div className="mt-1 font-semibold">{item.floors}</div>
                          </div>
                          <div className={darkMode ? "rounded-xl bg-slate-900 p-3" : "rounded-xl bg-white p-3"}>
                            <div className={darkMode ? "text-xs text-slate-400" : "text-xs text-slate-500"}>POIs</div>
                            <div className="mt-1 font-semibold">{item.pois}</div>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/buildings/${item.id}`)}
                            className={darkMode ? "flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800" : "flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"}
                          >
                            View
                          </button>
                          <button
                            onClick={() => navigate("/dashboard/floors")}
                            className={darkMode ? "flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800" : "flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"}
                          >
                            Edit
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </>
            )}
          </section>
        </>
      )}
    </AppShell>
  );
}
