export default function PoiBadge({ label, active = false, darkMode = false }) {
  const base = "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium";

  if (active) {
    return (
      <span className={`${base} bg-slate-900 text-white dark:bg-white dark:text-slate-900`}>
        {label}
      </span>
    );
  }

  return (
    <span
      className={
        darkMode
          ? `${base} border border-slate-700 bg-slate-900 text-slate-300`
          : `${base} border border-slate-200 bg-slate-50 text-slate-700`
      }
    >
      {label}
    </span>
  );
}
