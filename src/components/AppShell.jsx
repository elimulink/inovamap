import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";

export default function AppShell({
  children,
  rightSlot,
  darkMode = false,
  showHeader = true,
  showThemeToggle = true,
  headerClassName = "",
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
        <header className={`${headerClasses} ${headerClassName}`}>
          <div className={`mx-auto flex ${maxWidth} items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 lg:px-6 lg:py-4`}>
            <BrandLogo dark={darkMode} />
            <div className="flex items-center gap-2">
              {showThemeToggle ? <ThemeToggle /> : null}
              {rightSlot}
            </div>
          </div>
        </header>
      ) : null}

      {sidebar ? (
        <div className="flex min-h-screen">
          {sidebar}
          <main className={`min-w-0 flex-1 px-3.5 py-3.5 sm:px-4.5 sm:py-4.5 lg:px-5 lg:py-5 ${contentClassName}`}>
            {children}
          </main>
        </div>
      ) : (
        <main className={`mx-auto ${maxWidth} px-4 py-5 sm:px-5 sm:py-5.5 lg:px-6 lg:py-6 ${contentClassName}`}>
          {children}
        </main>
      )}
    </div>
  );
}
