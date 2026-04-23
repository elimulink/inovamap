import { Link } from "react-router-dom";

export default function BrandLogo({
  to = "/",
  compact = false,
  dark = false,
  className = "",
  sidebar = false,
}) {
  const subtitleClasses = dark ? "text-slate-400" : "text-slate-500";

  return (
    <Link to={to} className={`inline-flex items-center gap-3 ${className}`}>
      <div className={sidebar ? "rounded-xl bg-white p-2" : dark ? "rounded-xl bg-white p-2" : "rounded-xl bg-white p-2 shadow-sm"}>
        <img
          src="/inovamap-logo.png"
          alt="InovaMap"
          className={sidebar ? "h-8 w-auto object-contain" : "h-8 w-auto object-contain"}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.innerHTML =
              '<div class="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white">IM</div>';
          }}
        />
      </div>

      {!compact && (
        <div className="leading-tight">
          <div className="text-base font-semibold">InovaMap</div>
          <div className={`text-xs ${subtitleClasses}`}>Indoor Navigation Platform</div>
        </div>
      )}
    </Link>
  );
}
