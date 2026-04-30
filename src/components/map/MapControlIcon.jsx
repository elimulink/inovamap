const iconClassName = "h-5 w-5";

const icons = {
  menu: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName}>
      <path d="M4 21V4h12v17M20 21V9h-4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 7h2M7 11h2M7 15h2M11 7h2M11 11h2M11 15h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  route: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName}>
      <path d="M7 18a2 2 0 1 0 0-4a2 2 0 0 0 0 4ZM17 10a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 16h2a4 4 0 0 0 4-4V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  floor: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName}>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12l9 5 9-5M3 16l9 5 9-5" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
    </svg>
  ),
  places: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName}>
      <path d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 13a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  preview: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName}>
      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" rx="2" />
      <path d="m8 13 2 2 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  legend: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName}>
      <path d="M6 7h12M6 12h12M6 17h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

export default function MapControlIcon({ name }) {
  return icons[name] || icons.menu;
}
