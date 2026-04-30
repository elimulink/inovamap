import { Navigate, Route, Routes, useParams } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import MapDemo from "./pages/MapDemo";
import BuildingDetails from "./pages/BuildingDetails";
import BuildingForm from "./pages/BuildingForm";
import FloorManagement from "./pages/FloorManagement";
import MapEditor from "./pages/MapEditor";
import MobileMapView from "./pages/MobileMapView";

function RoutedMapDemo() {
  const { buildingId = "default", floorId = "default" } = useParams();

  return <MapDemo key={`${buildingId}-${floorId}`} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/buildings/new" element={<BuildingForm mode="create" />} />
      <Route path="/dashboard/buildings/:buildingId" element={<BuildingDetails />} />
      <Route path="/dashboard/buildings/:buildingId/edit" element={<BuildingForm mode="edit" />} />
      <Route path="/dashboard/floors" element={<FloorManagement />} />
      <Route path="/dashboard/map-editor/:floorId" element={<MapEditor />} />
      <Route path="/mobile/map/:floorId" element={<MobileMapView />} />
      <Route path="/demo/map" element={<RoutedMapDemo />} />
      <Route path="/demo/map/:buildingId/:floorId" element={<RoutedMapDemo />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
