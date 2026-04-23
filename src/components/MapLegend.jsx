export default function MapLegend({ darkMode = false }) {
  const cardClasses = darkMode
    ? "rounded-2xl border border-slate-800 bg-slate-900 p-4"
    : "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm";

  const textMuted = darkMode ? "text-slate-400" : "text-slate-600";

  const items = [
    { label: "Start Point", color: "bg-blue-500" },
    { label: "Destination", color: "bg-green-500" },
    { label: "General POI", color: "bg-white border border-slate-400" },
    { label: "Active Route", color: "bg-emerald-500" },
  ];

  return (
    <div className={cardClasses}>
      <div className="text-sm font-semibold">Map Legend</div>
      <div className={`mt-1 text-xs ${textMuted}`}>
        Visual guide for map markers and route colors.
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className={`h-4 w-4 rounded-full ${item.color}`} />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
