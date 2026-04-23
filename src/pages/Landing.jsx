import { useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useTheme } from "../context/ThemeContext";

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

export default function Landing() {
  const { darkMode } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cardClasses = darkMode
    ? "rounded-2xl border border-slate-800 bg-slate-900 p-5"
    : "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

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
      <section className="grid gap-10 py-8 lg:grid-cols-2 lg:py-14">
        <div className="flex flex-col justify-center">
          <span
            className={
              darkMode
                ? "inline-flex w-fit rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300"
                : "inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
            }
          >
            Smart buildings - Digital movement - Indoor visibility
          </span>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Search buildings. Open floors. Find destinations with clarity.
          </h1>

          <p
            className={
              darkMode
                ? "mt-5 max-w-xl text-base leading-7 text-slate-300"
                : "mt-5 max-w-xl text-base leading-7 text-slate-600"
            }
          >
            InovaMap digitalizes movement inside large buildings and enables a premium indoor navigation experience for airports, hospitals, malls, hotels, and universities.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/demo/map"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
            >
              Explore Demo
            </Link>

            <button
              onClick={() => setSearchOpen(true)}
              className={
                darkMode
                  ? "rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-white hover:bg-slate-900"
                  : "rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              }
            >
              Search Building
            </button>
          </div>
        </div>

        <div
          className={
            darkMode
              ? "overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6"
              : "overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
          }
        >
          <div className={darkMode ? "rounded-2xl bg-slate-950 p-4" : "rounded-2xl bg-white p-4"}>
            <div className="text-sm font-semibold">Demo Experience Preview</div>
            <div className={darkMode ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-600"}>
              Search a building, open a floor map, select destination, and preview a route instantly.
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Building Search", "Floor View", "Destination Search", "Route Preview"].map((item) => (
                <div
                  key={item}
                  className={
                    darkMode
                      ? "rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm"
                      : "rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm"
                  }
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Where InovaMap works</h2>
          <p className={darkMode ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-600"}>
            Built for large facilities that need structure, movement guidance, and better user visibility.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {sectors.map((sector) => (
            <article key={sector.title} className={cardClasses}>
              <h3 className="text-lg font-semibold">{sector.title}</h3>
              <p className={darkMode ? "mt-2 text-sm leading-6 text-slate-400" : "mt-2 text-sm leading-6 text-slate-600"}>
                {sector.text}
              </p>
            </article>
          ))}
        </div>
      </section>

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
              <h3 className="text-lg font-semibold">Search Building</h3>
              <button
                onClick={() => setSearchOpen(false)}
                className={darkMode ? "text-sm text-slate-300" : "text-sm text-slate-500"}
              >
                Close
              </button>
            </div>

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type airport, hospital, mall..."
              className={
                darkMode
                  ? "h-12 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-slate-600"
                  : "h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
              }
            />

            <div className="mt-4 space-y-2">
              {["Central Mall", "City Hospital", "Airport Terminal"]
                .filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item) => (
                  <Link
                    key={item}
                    to="/demo/map"
                    className={
                      darkMode
                        ? "block rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm hover:bg-slate-800"
                        : "block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm hover:bg-slate-100"
                    }
                  >
                    {item}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
