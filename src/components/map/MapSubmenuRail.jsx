import MapControlIcon from "./MapControlIcon";

export default function MapSubmenuRail({
  items,
  activeSection,
  onExpand,
  onSelect,
}) {
  return (
    <aside className="hidden h-full w-full py-4 lg:flex lg:flex-col lg:items-center">
      <button
        type="button"
        onClick={onExpand}
        className="grid h-9 w-9 place-items-center rounded-lg text-slate-700 transition hover:bg-slate-200/80 dark:text-slate-200 dark:hover:bg-slate-800/80"
        aria-label="Expand route controls"
      >
        <MapControlIcon name="menu" />
      </button>

      <div className="mt-5 flex w-full flex-col items-center gap-3 px-2">
        {items.map((item) => {
          const active = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`grid h-9 w-9 place-items-center rounded-lg transition ${
                active
                  ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:bg-slate-800/80"
              }`}
              aria-label={item.label}
              title={item.label}
            >
              <MapControlIcon name={item.icon} />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
