import MapControlIcon from "./MapControlIcon";

export default function MapSubmenuSection({
  id,
  title,
  icon,
  isOpen,
  onToggle,
  children,
}) {
  return (
    <section className="border-b border-slate-200/90 last:border-b-0 dark:border-slate-800/90">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition hover:bg-slate-50/70 dark:hover:bg-slate-900/40"
      >
        <span className="flex items-center gap-3">
          <span className="text-slate-500 dark:text-slate-400">
            <MapControlIcon name={icon} />
          </span>
          <span className="text-sm font-semibold">{title}</span>
        </span>
        <span
          className={`text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {isOpen ? <div className="px-3 pb-3 pt-0.5">{children}</div> : null}
    </section>
  );
}
