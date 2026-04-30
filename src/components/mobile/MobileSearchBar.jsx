export default function MobileSearchBar({
  pois,
  startPoiId,
  endPoiId,
  setStartPoiId,
  setEndPoiId,
}) {
  return (
    <div className="mobile-search-bar">
      <select value={startPoiId} onChange={(e) => setStartPoiId(e.target.value)}>
        <option value="">Start</option>
        {pois.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <select value={endPoiId} onChange={(e) => setEndPoiId(e.target.value)}>
        <option value="">Destination</option>
        {pois.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  );
}
