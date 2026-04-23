import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";

export default function AppShell({
  children,
  rightSlot,
  darkMode = false,
  showHeader = true,
  maxWidth = "max-w-7xl",
  sidebar = null,
  contentClassName = "",
}) {
  const pageClasses = darkMode
    ? "min-h-screen bg-slate-950 text-white"
    : "min-h-screen bg-slate-100 text-slate-900";

  const headerClasses = darkMode
    ? "sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur"
    : "sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur";

  return (
    <div className={pageClasses}>
      {showHeader && !sidebar ? (
        <header className={headerClasses}>
          <div className={`mx-auto flex ${maxWidth} items-center justify-between px-4 py-4 sm:px-6 lg:px-8`}>
            <BrandLogo dark={darkMode} />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {rightSlot}
            </div>
          </div>
        </header>
      ) : null}

      {sidebar ? (
        <div className="flex min-h-screen">
          {sidebar}
          <main className={`min-w-0 flex-1 px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 ${contentClassName}`}>
            {children}
          </main>
        </div>
      ) : (
        <main className={`mx-auto ${maxWidth} px-4 py-6 sm:px-6 lg:px-8 ${contentClassName}`}>
          {children}
        </main>
      )}
    </div>
  );
}
