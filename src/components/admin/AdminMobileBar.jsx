import AdminNavIcon from "./AdminNavIcon";

export default function AdminMobileBar({ title, onOpenMenu }) {
  return (
    <div
      className="mb-3.5 flex items-center justify-between gap-3 rounded-2xl border border-[#dde3ec] bg-white px-3.5 py-2.5 shadow-sm lg:hidden"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMenu}
          className="grid h-9 w-9 place-items-center rounded-xl border border-[#dde3ec] bg-[#f7f9fc] text-slate-700"
          aria-label="Open admin menu"
        >
          <AdminNavIcon name="menu" />
        </button>
        <div className="text-[13px] font-semibold tracking-tight text-slate-900">{title}</div>
      </div>
    </div>
  );
}
