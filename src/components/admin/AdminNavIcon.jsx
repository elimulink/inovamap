const iconClassName = "h-[18px] w-[18px]";

const icons = {
  menu: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName}>
      <path d="M3 10.5 12 3l9 7.5V21h-6v-7H9v7H3V10.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName}>
      <path d="M4 21V4h12v17M20 21V9h-4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 7h2M7 11h2M7 15h2M11 7h2M11 11h2M11 15h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName}>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12l9 5 9-5M3 16l9 5 9-5" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName}>
      <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 3v15M15 6v15" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName}>
      <path d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 13a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  route: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName}>
      <path d="M7 18a2 2 0 1 0 0-4a2 2 0 0 0 0 4ZM17 10a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 16h2a4 4 0 0 0 4-4V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  publish: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName}>
      <path d="M12 16V4M12 4l-4 4M12 4l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 20h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

export default function AdminNavIcon({ name }) {
  return icons[name] || icons.menu;
}
