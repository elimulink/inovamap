import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import AdminSidebar from "../components/AdminSidebar";
import AdminMobileBar from "../components/admin/AdminMobileBar";
import AdminMobileMenu from "../components/admin/AdminMobileMenu";
import { useTheme } from "../context/ThemeContext";
import { demoBuildings } from "../data/demoBuildings";

export default function BuildingForm({ mode = "create" }) {
  const navigate = useNavigate();
  const { buildingId } = useParams();
  useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const existing = useMemo(
    () => demoBuildings.find((b) => b.id === buildingId),
    [buildingId]
  );

  const initialForm = useMemo(
    () => ({
      name: existing?.name || "",
      type: existing?.type || "Mall",
      status: existing?.status || "Draft",
      visibility: "Public searchable",
      description: existing?.description || "",
    }),
    [existing]
  );

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(existing ? `/dashboard/buildings/${existing.id}` : "/dashboard");
  };

  const card = "rounded-2xl border border-[#dde3ec] bg-white p-5 shadow-sm";

  const input = "h-11 w-full rounded-xl border border-[#dde3ec] bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#d4dce8]";

  return (
    <AppShell
      darkMode={false}
      sidebar={<AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />}
    >
      <AdminMobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} darkMode={false} />
      <AdminMobileBar title={mode === "edit" ? "Edit Building" : "Add Building"} onOpenMenu={() => setMobileMenuOpen(true)} />

      <div className="mb-5">
        <Link to="/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
          Back to dashboard
        </Link>
        <h1 className="mt-3 text-2xl font-semibold">
          {mode === "edit" ? "Edit Building" : "Add Building"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Prepare building information for future backend integration.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={card}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Building name</label>
            <input value={form.name} onChange={(e) => update("name", e.target.value)} className={input} required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Building type</label>
            <select value={form.type} onChange={(e) => update("type", e.target.value)} className={input}>
              <option>Mall</option>
              <option>Hospital</option>
              <option>Airport</option>
              <option>University</option>
              <option>Hotel</option>
              <option>Office</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select value={form.status} onChange={(e) => update("status", e.target.value)} className={input}>
              <option>Draft</option>
              <option>Live</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Client visibility</label>
            <select
              value={form.visibility}
              onChange={(e) => update("visibility", e.target.value)}
              className={input}
            >
              <option>Public searchable</option>
              <option>Private/internal only</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className={`${input} min-h-28 py-3`}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white dark:bg-white dark:text-slate-900">
            Save Building
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-[#dde3ec] px-5 py-3 text-sm font-medium text-slate-700 hover:bg-[#f7f9fc]"
          >
            Cancel
          </button>
        </div>
      </form>
    </AppShell>
  );
}
