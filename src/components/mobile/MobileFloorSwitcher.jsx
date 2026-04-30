export default function MobileFloorSwitcher({ floor }) {
  return (
    <div className="mobile-floor-switcher">
      <button type="button">{floor.floorNumber || floor.floorName}</button>
    </div>
  );
}
