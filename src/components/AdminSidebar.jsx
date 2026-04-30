import { useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import AdminNavIcon from "./admin/AdminNavIcon";
import { adminNavigationGroups, isAdminNavItemActive } from "./admin/adminNavigation";
const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function AdminSidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 border-r text-slate-900 lg:block",
        "border-[#dde3ec] bg-[#edf3fb]",
        collapsed ? "w-[68px]" : "w-[248px]"
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#dde3ec] px-3 py-2.5">
        <BrandLogo compact={collapsed} sidebar />
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="grid h-7.5 w-7.5 place-items-center border-0 bg-transparent text-slate-700 transition hover:text-slate-950"
        >
          <AdminNavIcon name="menu" />
        </button>
      </div>

      <nav className="px-2 py-3">
        {adminNavigationGroups.map((group) => (
          <div key={group.label} className="mb-4.5 last:mb-0">
            {!collapsed ? (
              <div className="px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6b7890]">
                {group.label}
              </div>
            ) : null}

            <div className={cn("mt-2", !collapsed && "border-t border-[#dde3ec]")}>
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
                      navigate(item.path);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 border-b border-[#dde3ec] px-2 py-2.25 text-left text-[14px] transition",
                      collapsed ? "justify-center" : "justify-between",
                      active
                        ? "rounded-xl bg-white text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
                      : disabled
                          ? "text-[#9ea8b7]"
                          : "text-slate-800 hover:bg-white/60"
                    )}
                    title={collapsed ? item.label : undefined}
                    >
                      <span className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                        <span
                          className={cn(
                          "grid h-6.5 w-6.5 place-items-center rounded-lg transition",
                          active ? "bg-[#f4f7fb]" : "bg-transparent"
                        )}
                      >
                        <AdminNavIcon name={item.icon} />
                      </span>
                      {!collapsed ? <span className="font-medium tracking-tight text-slate-850">{item.label}</span> : null}
                    </span>
                    {!collapsed && disabled ? (
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
  );
}
