import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import AdminSidebar from "../components/AdminSidebar";
import AdminMobileMenu from "../components/admin/AdminMobileMenu";
import { EmptyState, PageLoading } from "../components/PageState";
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
  Cloud: (p) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" {...p}>
      <path d="M7 18h10a4 4 0 0 0 .7-7.94A6 6 0 0 0 6.4 8.4 4.8 4.8 0 0 0 7 18Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Grid: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
      <circle cx="5" cy="5" r="1.6" />
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="19" cy="5" r="1.6" />
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
      <circle cx="5" cy="19" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
      <circle cx="19" cy="19" r="1.6" />
    </svg>
  ),
  TinyChevron: (p) => (
    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" {...p}>
      <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-[#dde3ec] bg-white p-3 shadow-sm">
      <div className="text-[27px] font-semibold leading-none text-slate-900">{value}</div>
      <div className="mt-1.5 text-[14px] font-medium text-slate-800">{label}</div>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}

function ActionButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex min-h-[40px] items-center justify-center rounded-2xl border border-[#dde3ec] bg-white px-4 py-2 text-[14px] font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
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

function Topbar({ building, setBuilding, onOpenMenu }) {
  const buildings = demoBuildings.map((item) => item.name);
  const [activePopover, setActivePopover] = useState(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      const clickedNotification = notificationRef.current?.contains(event.target);
      const clickedProfile = profileRef.current?.contains(event.target);

      if (!clickedNotification && !clickedProfile) {
        setActivePopover(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActivePopover(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const notifications = [
    {
      title: "Floor draft saved",
      detail: "Ground Floor calibration is ready for POI placement.",
      time: "2m",
    },
    {
      title: "Route preview updated",
      detail: "New graph edits are available in the map editor.",
      time: "18m",
    },
    {
      title: "Publish checklist",
      detail: "Add edges before enabling public navigation.",
      time: "1h",
    },
  ];

  return (
    <div className="sticky top-0 z-30 -mx-3.5 -mt-3.5 border-b border-[#dfe3ea] bg-white/95 px-4 py-2.5 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur sm:-mx-4.5 sm:-mt-4.5 lg:-mx-5 lg:-mt-5">
      <div className="flex min-h-[46px] items-center gap-3">
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="grid h-9 w-9 place-items-center border-0 bg-transparent text-slate-800 transition hover:text-slate-950 lg:hidden"
            aria-label="Open menu"
          >
            <Icon.Menu />
          </button>

          <button
            type="button"
            className="grid h-9 w-9 place-items-center border-0 bg-transparent text-slate-800 transition hover:text-slate-950 md:hidden"
            aria-label="Search"
          >
            <Icon.Search />
          </button>

          <div className="grid h-8 w-8 place-items-center overflow-hidden">
            <img
              src="/inovamap-logo.png"
              alt="InovaMap"
              className="h-8 w-8 object-contain"
            />
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-[14px] font-semibold tracking-tight text-slate-950">InovaMap</span>
            <Icon.Cloud className="text-slate-500" />
          </div>
        </div>

        <div className="mx-auto hidden min-w-0 max-w-[520px] flex-1 items-center md:flex">
          <div className="relative w-full">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              <Icon.Search />
            </div>
            <input
              placeholder="Search buildings, POIs, or activities..."
              className="h-9 w-full rounded-full border border-[#d7dee8] bg-[#f8fafc] pl-10 pr-3 text-[13px] text-slate-800 outline-none transition focus:border-[#9fb0c7] focus:bg-white"
            />
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <div className="relative hidden sm:block">
            <select
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              className="h-9 w-[176px] appearance-none rounded-full border border-[#d7dee8] bg-white px-3 pr-8 text-[13px] font-semibold text-slate-800 outline-none transition hover:bg-[#f8fafc]"
              aria-label="Building"
            >
              {buildings.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500">
              <Icon.ChevronDown />
            </div>
          </div>

          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setActivePopover((value) => (value === "notifications" ? null : "notifications"))}
              className="relative grid h-9 w-9 place-items-center rounded-lg border border-transparent bg-transparent text-slate-800 transition hover:bg-[#f2f5f9]"
              aria-label="Notifications"
              aria-expanded={activePopover === "notifications"}
            >
              <Icon.Bell />
              <span className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-[11px] font-bold text-white">
                3
              </span>
            </button>

            {activePopover === "notifications" ? (
              <div className="topbar-popover right-0 w-[300px]">
                <div className="popover-header">
                  <div>
                    <h3>Notifications</h3>
                    <p>Recent admin activity</p>
                  </div>
                  <button type="button">Mark all read</button>
                </div>

                <div className="popover-list">
                  {notifications.map((item) => (
                    <button type="button" className="popover-list-item" key={item.title}>
                      <span className="popover-dot" />
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.detail}</small>
                      </span>
                      <em>{item.time}</em>
                    </button>
                  ))}
                </div>

                <button type="button" className="popover-footer">
                  View notification center
                </button>
              </div>
            ) : null}
          </div>

          <button
            className="hidden h-9 w-9 place-items-center rounded-lg border border-transparent bg-transparent text-slate-800 transition hover:bg-[#f2f5f9] md:grid"
            aria-label="Apps"
          >
            <Icon.Grid />
          </button>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setActivePopover((value) => (value === "profile" ? null : "profile"))}
              className="profile-chip"
              aria-label="Account"
              aria-expanded={activePopover === "profile"}
            >
              <span className="profile-chip-avatar">K</span>
              <span className="hidden leading-tight md:block">
                <span className="profile-chip-name">Kevin</span>
                <span className="profile-chip-role">Admin</span>
              </span>
              <Icon.TinyChevron className="hidden text-slate-500 md:block" />
            </button>

            {activePopover === "profile" ? (
              <div className="topbar-popover right-0 w-[260px]">
                <div className="profile-popover-head">
                  <div className="profile-avatar">K</div>
                  <div>
                    <h3>Kevin</h3>
                    <p>InovaMap Admin</p>
                  </div>
                </div>

                <div className="profile-menu">
                  <button type="button">
                    <span>Account settings</span>
                    <small>Profile, password, access</small>
                  </button>
                  <button type="button">
                    <span>Workspace</span>
                    <small>Manage buildings and roles</small>
                  </button>
                  <button type="button">
                    <span>Billing</span>
                    <small>Plan and invoices</small>
                  </button>
                </div>

                <button type="button" className="profile-signout">
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [building, setBuilding] = useState("Central Mall");
  const [loading] = useState(false);

  const actions = useMemo(
    () => [
      { label: "Add Building", path: "/dashboard/buildings/new" },
      { label: "Upload Floor Map", path: "/dashboard/floors" },
      { label: "Add POI", path: "/dashboard/floors" },
      { label: "Edit Routing Graph", path: "/dashboard/floors" },
      { label: "Open Demo Map", path: "/demo/map" },
      { label: "Prepare Publish", path: "/dashboard/buildings/central-mall" },
    ],
    []
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
      darkMode={false}
      sidebar={<AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />}
    >
      <AdminMobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} darkMode={false} />

      <Topbar
        building={building}
        setBuilding={setBuilding}
        onOpenMenu={() => setMobileMenuOpen(true)}
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
          <section className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
            {actions.map((action) => (
              <ActionButton
                key={action.label}
                onClick={() => navigate(action.path)}
              >
                {action.label}
              </ActionButton>
            ))}
          </section>

          <section className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard label="Buildings Onboarded" value={demoBuildings.length} />
            <StatCard label="Floors Mapped" value="6" />
            <StatCard label="Points of Interest" value="42" />
            <StatCard label="Routes Generated" value="124" hint="24 this week" />
          </section>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr,1fr]">
            <section className="rounded-2xl border border-[#dde3ec] bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-3.5 sm:px-4.5">
                <h2 className="text-[15px] font-semibold text-slate-900">Recent Activity</h2>
                <button className="text-[13px] font-medium text-slate-700 hover:text-slate-900">
                  View all
                </button>
              </div>

              <div className="border-t border-[#eef2f7]">
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
                      className="flex flex-col gap-2 border-b border-[#eef2f7] px-4 py-3.5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-4.5"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                          OK
                        </span>
                        <div className="text-[14px] font-medium text-slate-900">{item.text}</div>
                      </div>
                      <div className="pl-11 text-xs text-slate-500 sm:pl-0 sm:text-[13px]">
                        {item.time}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[#dde3ec] bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-3.5 sm:px-4.5">
                <h2 className="text-[15px] font-semibold text-slate-900">Readiness Checklist</h2>
                <Pill tone="live">6 items</Pill>
              </div>

              <div className="border-t border-[#eef2f7]">
                {checklist.map((item) => (
                  <div key={item} className="flex items-center gap-3 px-4 py-2.5 sm:px-4.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                      OK
                    </span>
                    <div className="text-[14px] font-medium text-slate-900">{item}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-5 rounded-2xl border border-[#dde3ec] bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-3.5 sm:px-4.5">
                <h2 className="text-[15px] font-semibold text-slate-900">Buildings Overview</h2>
              <button className="rounded-xl border border-[#dde3ec] bg-[#f7f9fc] px-3 py-1.75 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-white">
                Publish
              </button>
            </div>

            {demoBuildings.length === 0 ? (
              <div className="p-4 sm:p-5">
                <EmptyState
                  title="No buildings yet"
                  description="Start by adding your first building, then upload floor maps and define POIs."
                  actionLabel="Add Building"
                  onAction={() => navigate("/dashboard/buildings/new")}
                />
              </div>
            ) : (
              <>
                <div className="hidden border-t border-[#eef2f7] lg:block">
                  <div className="grid grid-cols-12 gap-2 bg-[#f7f9fc] px-4.5 py-2.5 text-[11px] font-semibold text-[#75839a]">
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
                      className="grid grid-cols-12 items-center gap-2 px-4.5 py-2.75 text-[14px] hover:bg-[#f7f9fc]"
                    >
                      <div className="col-span-4 flex items-center gap-2 font-medium">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f4f7fb] text-[#75839a]">
                          <Icon.Building />
                        </span>
                        {item.name}
                      </div>
                      <div className="col-span-2">
                        <Pill tone={item.status === "Live" ? "live" : "draft"}>{item.status}</Pill>
                      </div>
                      <div className="col-span-1">{item.floors}</div>
                      <div className="col-span-1">{item.pois}</div>
                      <div className="col-span-2 text-slate-600">{item.updated}</div>
                      <div className="col-span-2 flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/buildings/${item.id}`)}
                          className="rounded-xl border border-[#dde3ec] bg-white px-3 py-1.75 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-[#f7f9fc]"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/buildings/${item.id}/edit`)}
                          className="rounded-xl border border-[#dde3ec] bg-white px-3 py-1.75 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-[#f7f9fc]"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#eef2f7] lg:hidden">
                  <div className="space-y-3 p-4">
                    {demoBuildings.map((item) => (
                      <article key={item.id} className="rounded-2xl border border-[#dde3ec] bg-[#fbfcfe] p-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#75839a] shadow-sm">
                              <Icon.Building />
                            </span>
                            <div>
                              <div className="text-[14px] font-semibold text-slate-900">{item.name}</div>
                              <div className="mt-1 text-xs text-slate-500">Updated {item.updated}</div>
                            </div>
                          </div>

                          <Pill tone={item.status === "Live" ? "live" : "draft"}>{item.status}</Pill>
                        </div>

                        <div className="mt-3.5 grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-xl bg-white p-3">
                            <div className="text-xs text-slate-500">Floors</div>
                            <div className="mt-1 font-semibold">{item.floors}</div>
                          </div>
                          <div className="rounded-xl bg-white p-3">
                            <div className="text-xs text-slate-500">POIs</div>
                            <div className="mt-1 font-semibold">{item.pois}</div>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/buildings/${item.id}`)}
                            className="flex-1 rounded-xl border border-[#dde3ec] bg-white px-3 py-1.75 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-[#f7f9fc]"
                          >
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/dashboard/buildings/${item.id}/edit`)}
                            className="flex-1 rounded-xl border border-[#dde3ec] bg-white px-3 py-1.75 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-[#f7f9fc]"
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
