import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={
        darkMode
          ? "rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          : "rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
      }
      aria-label="Toggle theme"
    >
      {darkMode ? "Light" : "Dark"}
    </button>
  );
}
