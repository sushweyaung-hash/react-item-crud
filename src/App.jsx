import { useState } from "react";
import ItemsPage from "./pages/ItemsPage";
import UsersPage from "./pages/UsersPage";
import ProfilesPage from "./pages/ProfilesPage";

export default function App() {
  const [tab, setTab] = useState("profiles");

  return (
    <div style={{ padding: 20 }}>
      <h1>React CRUD</h1>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setTab("items")}>Items</button>
        <button onClick={() => setTab("users")}>Users</button>
        <button onClick={() => setTab("profiles")}>Profiles</button>
      </div>
      <hr />
      {tab === "items" && <ItemsPage />}
      {tab === "users" && <UsersPage />}
      {tab === "profiles" && <ProfilesPage />}
    </div>
  );
}
