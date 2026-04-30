import { useParams } from "react-router-dom";
import { getFloorDraftById } from "../lib/floorDraftStorage";
import MobileMapShell from "../components/mobile/MobileMapShell";

export default function MobileMapView() {
  const { floorId } = useParams();
  const floor = getFloorDraftById(floorId);

  if (!floor) {
    return (
      <main className="mobile-empty">
        <h2>Floor not found</h2>
      </main>
    );
  }

  return <MobileMapShell floor={floor} />;
}
