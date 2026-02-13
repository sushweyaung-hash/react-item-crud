import { useEffect, useState } from "react";

const API = "/api/profile";

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [file, setFile] = useState(null);

  async function loadProfiles() {
    const res = await fetch(`${API}?page=1&limit=50`);
    const data = await res.json();
    if (data.ok) setProfiles(data.profiles);
    else alert(data.error || "Failed to load");
  }

  useEffect(() => {
    loadProfiles();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(p) {
    setEditingId(p._id);
    setForm({
      firstName: p.firstName || "",
      lastName: p.lastName || "",
      email: p.email || "",
    });
    setFile(null);
  }

  function resetForm() {
    setEditingId(null);
    setForm({ firstName: "", lastName: "", email: "" });
    setFile(null);
  }

  async function submitForm(e) {
    e.preventDefault();

    const fd = new FormData();
    fd.append("firstName", form.firstName);
    fd.append("lastName", form.lastName);
    fd.append("email", form.email);

    // Create requires image, Update image is optional
    if (file) fd.append("profileImage", file);

    const url = editingId ? `${API}/${editingId}` : API;
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, { method, body: fd });
    const data = await res.json();

    if (!data.ok) {
      alert(data.error || "Save failed");
      return;
    }

    resetForm();
    loadProfiles();
  }

  async function deleteProfile(id) {
    const ok = confirm("Delete this profile?");
    if (!ok) return;

    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!data.ok) {
      alert(data.error || "Delete failed");
      return;
    }

    loadProfiles();
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>User Profile Management</h1>

      <form onSubmit={submitForm} style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <input
          name="firstName"
          placeholder="First name"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <input
          name="lastName"
          placeholder="Last name"
          value={form.lastName}
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

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          // require image only when creating
          required={!editingId}
        />

        <button type="submit">{editingId ? "Update Profile" : "Create Profile"}</button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h3>Profiles</h3>

      {profiles.length === 0 ? (
        <p>No profiles found.</p>
      ) : (
        profiles.map((p) => (
          <div
            key={p._id}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              borderBottom: "1px solid #ddd",
              padding: "8px 0",
            }}
          >
            <div style={{ width: 220 }}>
              <div><b>ID:</b> {p._id}</div>
              <div><b>Name:</b> {p.firstName} {p.lastName}</div>
              <div><b>Email:</b> {p.email}</div>
            </div>

            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt="profile"
                style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
              />
            )}

            <button onClick={() => startEdit(p)}>Edit</button>
            <button onClick={() => deleteProfile(p._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}
