import MapControlIcon from "./MapControlIcon";

export default function MapMobileControls({ open, onOpen, onClose, children }) {
  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={onOpen}
          className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-[13px] font-medium text-white shadow-md dark:bg-white dark:text-slate-900 lg:hidden"
        >
          <MapControlIcon name="menu" />
          <span>Controls</span>
        </button>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden">
          <button
            type="button"
            onClick={onClose}
            className="absolute inset-0"
            aria-label="Close route controls"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[82vh] rounded-t-[22px] border border-slate-200 bg-white px-3 pb-3.5 pt-2.5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
}
