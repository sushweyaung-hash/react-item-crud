import { Routes, Route, Navigate } from "react-router-dom";
import ItemsPage from "./pages/ItemsPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/items" replace />} />
      <Route path="/items" element={<ItemsPage />} />
    </Routes>
  );
}
