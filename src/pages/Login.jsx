import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
        <div className="hidden bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-white">
                <img
                  src="/inovamap-logo.png"
                  alt="InovaMap"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="text-sm font-semibold">InovaMap</div>
                <div className="text-xs text-slate-300">Indoor Navigation Platform</div>
              </div>
            </div>
            <h1 className="mt-6 text-3xl font-semibold leading-tight">
              Admin access for managing buildings, floors, and indoor navigation experiences.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Use the dashboard to manage locations, upload floor plans, configure POIs, and prepare navigation flows for clients.
            </p>
          </div>

          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} InovaRoute Tech
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-800">
              ← Back to home
            </Link>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">Admin Login</h2>
            <p className="mt-1 text-sm text-slate-600">
              Sign in to continue to the InovaMap admin dashboard.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="admin@inovamap.com"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
            >
              Continue to dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
