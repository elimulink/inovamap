import NavigationSteps from "./NavigationSteps";

export default function MobileBottomSheet({
  route,
  steps,
  currentStepIndex,
  pois,
  setEndPoiId,
}) {
  return (
    <div className="mobile-bottom-sheet">
      {route ? (
        <>
          <h3>{route.distance} meters</h3>
          <NavigationSteps steps={steps} currentStepIndex={currentStepIndex} />
        </>
      ) : (
        <>
          <h3>Select destination</h3>
          {pois.map((p) => (
            <button key={p.id} onClick={() => setEndPoiId(p.id)}>
              {p.name}
            </button>
          ))}
        </>
      )}
    </div>
  );
}
