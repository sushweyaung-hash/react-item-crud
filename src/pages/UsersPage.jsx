import { useCallback, useEffect, useState } from "react";

const API = "/api/user";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "user",
    status: "active",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadUsers = useCallback(
    async (p = 1) => {
      setLoading(true);
      try {
        const res = await fetch(`${API}?page=${p}&limit=${limit}`);
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || "Failed to load users");

        setUsers(data.users || []);
        setPage(data.page || p);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        alert(String(err));
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    loadUsers(1);
  }, [loadUsers]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function startEdit(u) {
    setEditingId(u._id);
    setForm({
      fullName: u.fullName ?? "",
      email: u.email ?? "",
      role: u.role ?? "user",
      status: u.status ?? "active",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm({ fullName: "", email: "", role: "user", status: "active" });
  }

  async function submitForm(e) {
    e.preventDefault();

    const payload = {
      fullName: String(form.fullName).trim(),
      email: String(form.email).trim(),
      role: form.role,
      status: form.status,
    };

    const url = editingId ? `${API}/${editingId}` : API;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // If backend ever returns empty body, this avoids "Unexpected end of JSON input"
      const text = await res.text();
      const data = text ? JSON.parse(text) : { ok: false, error: "Empty response" };

      if (!data.ok) throw new Error(data.error || "Save failed");

      resetForm();
      await loadUsers(page); // refresh list so you SEE the update
    } catch (err) {
      alert(String(err));
    }
  }

  async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;

    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Delete failed");

      await loadUsers(page);
    } catch (err) {
      alert(String(err));
    }
  }

  return (
    <div>
      <h2>User Management</h2>

      <form onSubmit={submitForm} style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>

        <button type="submit">{editingId ? "Update User" : "Create User"}</button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h3>Users</h3>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((u) => (
          <div key={u._id} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
            <span style={{ minWidth: 160 }}>{u.fullName}</span>
            <span style={{ minWidth: 240 }}>{u.email}</span>
            <span style={{ minWidth: 80 }}>{u.role}</span>
            <span style={{ minWidth: 80 }}>{u.status}</span>

            <button onClick={() => startEdit(u)}>Edit</button>
            <button onClick={() => deleteUser(u._id)}>Delete</button>
          </div>
        ))
      )}

      <div style={{ marginTop: 12 }}>
        <button disabled={page <= 1} onClick={() => loadUsers(page - 1)}>
          Prev
        </button>{" "}
        Page {page} / {totalPages}{" "}
        <button disabled={page >= totalPages} onClick={() => loadUsers(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
