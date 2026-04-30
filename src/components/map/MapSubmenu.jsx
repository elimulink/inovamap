import MapControlIcon from "./MapControlIcon";
import MapSubmenuSection from "./MapSubmenuSection";

export default function MapSubmenu({
  title,
  description,
  items,
  openSections,
  onToggleSection,
  onCollapse,
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 px-3 py-2.5 dark:border-slate-800 lg:px-4 lg:py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[17px] font-semibold tracking-tight text-slate-950 dark:text-white">
              {title}
            </div>
          </div>

          <button
            type="button"
            onClick={onCollapse}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Collapse route controls"
          >
            <MapControlIcon name="menu" />
          </button>
        </div>

        <p className="mt-1.5 max-w-[17rem] text-[13px] leading-6 text-slate-700 dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="overflow-y-auto pr-1">
        {items.map((item) => (
          <MapSubmenuSection
            key={item.id}
            id={item.id}
            title={item.label}
            icon={item.icon}
            isOpen={!!openSections[item.id]}
            onToggle={onToggleSection}
          >
            {item.content}
          </MapSubmenuSection>
        ))}
      </div>
    </div>
  );
}
