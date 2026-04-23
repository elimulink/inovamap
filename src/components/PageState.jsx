export function PageLoading({ title = "Loading...", description = "Please wait." }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-slate-700 dark:border-t-white" />
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}

export function EmptyState({
  title = "Nothing here yet",
  description = "This section will appear once data is available.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
      <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200">
        InovaMap
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">{description}</p>

      {actionLabel ? (
        <button
          onClick={onAction}
          className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
