import { Link } from "react-router-dom";

export default function BrandLogo({
  to = "/",
  compact = false,
  dark = false,
  className = "",
  sidebar = false,
}) {
  const subtitleClasses = dark ? "text-slate-400" : "text-slate-500";
  const logoSizeClasses = sidebar ? "h-8 w-auto object-contain" : "h-9 w-auto object-contain";

  return (
    <Link to={to} className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="shrink-0">
        <img
          src="/inovamap-logo.png"
          alt="InovaMap"
          className={logoSizeClasses}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.innerHTML =
              '<div class="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white">IM</div>';
          }}
        />
      </div>

      {!compact && (
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight">InovaMap</div>
          <div className={`text-xs ${subtitleClasses}`}>Indoor Navigation Platform</div>
        </div>
      )}
    </Link>
  );
}
