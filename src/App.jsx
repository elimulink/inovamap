import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import MapDemo from "./pages/MapDemo";
import BuildingDetails from "./pages/BuildingDetails";
import FloorManagement from "./pages/FloorManagement";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/demo/map" element={<MapDemo />} />
      <Route path="/dashboard/buildings/:buildingId" element={<BuildingDetails />} />
      <Route path="/dashboard/floors" element={<FloorManagement />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
