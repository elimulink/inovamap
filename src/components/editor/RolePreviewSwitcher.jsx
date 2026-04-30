export default function RolePreviewSwitcher({ role, onChange }) {
  return (
    <div className="role-switcher">
      {["public", "staff", "admin"].map((item) => (
        <button
          key={item}
          className={role === item ? "active" : ""}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
