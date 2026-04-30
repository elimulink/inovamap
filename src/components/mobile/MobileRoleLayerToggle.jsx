export default function MobileRoleLayerToggle({ role, setRole }) {
  return (
    <div className="mobile-role-toggle">
      {["public", "staff", "admin"].map((r) => (
        <button key={r} onClick={() => setRole(r)} className={role === r ? "active" : ""}>
          {r}
        </button>
      ))}
    </div>
  );
}
