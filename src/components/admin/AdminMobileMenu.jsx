import { useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "../BrandLogo";
import AdminNavIcon from "./AdminNavIcon";
import { adminNavigationGroups, isAdminNavItemActive } from "./adminNavigation";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminMobileMenu({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        className="absolute inset-0 bg-slate-950/50"
        onClick={onClose}
        aria-label="Close admin menu overlay"
      />

      <aside
        className={cn(
          "absolute left-0 top-0 h-full w-[84%] max-w-[284px] border-r p-3.5 shadow-2xl",
          "border-[#dde3ec] bg-[#edf3fb] text-slate-900"
        )}
      >
        <div className="flex items-center justify-between border-b border-[#dde3ec] pb-3">
          <BrandLogo compact sidebar />
          <button
            onClick={onClose}
            className="grid h-7.5 w-7.5 place-items-center rounded-lg border border-transparent bg-transparent text-slate-700 transition hover:border-[#d4dce8] hover:bg-white/70"
            aria-label="Close admin menu"
          >
            <AdminNavIcon name="menu" />
          </button>
        </div>

        <nav className="mt-3.5 space-y-4.5">
          {adminNavigationGroups.map((group) => (
            <div key={group.label}>
              <div className="px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6b7890]">
                {group.label}
              </div>
              <div className="mt-2 border-t border-[#dde3ec]">
                {group.items.map((item) => {
                  const active = isAdminNavItemActive(location.pathname, item);
                  const disabled = !!item.disabled;

                  return (
                    <button
                      key={item.label}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        if (disabled || !item.path) return;
                        onClose();
                        navigate(item.path);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 border-b border-[#dde3ec] px-2 py-2.25 text-left transition",
                        active
                          ? "rounded-xl bg-white text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
                          : disabled
                            ? "text-[#9ea8b7]"
                            : "text-slate-700 hover:bg-white/60"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className={cn("grid h-6.5 w-6.5 place-items-center rounded-lg", active ? "bg-[#f4f7fb]" : "bg-transparent")}>
                          <AdminNavIcon name={item.icon} />
                        </span>
                        <span className="text-[14px] font-medium tracking-tight text-slate-900">{item.label}</span>
                      </span>
                      {disabled ? (
                        <span className="rounded-full border border-[#d7dee9] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7d8ba2]">
                          {item.note || "Soon"}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </div>
  );
}
