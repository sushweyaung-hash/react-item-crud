import { Link, Route, Routes, Navigate } from "react-router-dom";
import ItemsPage from "./pages/ItemsPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>React CRUD</h1>

      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link to="/items">Items</Link>
        <Link to="/users">Users</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/items" replace />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </div>
  );
}
