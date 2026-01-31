import { useEffect, useState } from "react";

const API = "/api/items";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [form, setForm] = useState({
    itemName: "",
    itemCategory: "",
    itemPrice: "",
    status: "active",
  });

  const [editingId, setEditingId] = useState(null);

  async function loadItems(p = page) {
    const res = await fetch(`${API}?page=${p}&limit=5`);
    const data = await res.json();
    if (data.ok) {
      setItems(data.items);
      setPage(data.page);
      setTotalPages(data.totalPages);
    }
  }

  useEffect(() => {
    loadItems(1);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submitForm(e) {
    e.preventDefault();

    const payload = {
      ...form,
      itemPrice: Number(form.itemPrice),
    };

    const url = editingId ? `${API}/${editingId}` : API;
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setForm({ itemName: "", itemCategory: "", itemPrice: "", status: "active" });
    setEditingId(null);
    loadItems(page);
  }

  function editItem(item) {
    setEditingId(item._id);
    setForm(item);
  }

  async function deleteItem(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadItems(page);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Item Manager</h2>

      <form onSubmit={submitForm}>
        <input name="itemName" placeholder="Name" value={form.itemName} onChange={handleChange} required />
        <input name="itemCategory" placeholder="Category" value={form.itemCategory} onChange={handleChange} required />
        <input name="itemPrice" type="number" placeholder="Price" value={form.itemPrice} onChange={handleChange} required />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Insert"}</button>
      </form>

      <hr />

      <h3>Items</h3>

      {items.map((it) => (
        <div key={it._id}>
          {it.itemName} | {it.itemCategory} | {it.itemPrice} | {it.status}
          <button onClick={() => editItem(it)}>Edit</button>
          <button onClick={() => deleteItem(it._id)}>Delete</button>
        </div>
      ))}

      <div>
        <button disabled={page <= 1} onClick={() => loadItems(page - 1)}>Prev</button>
        Page {page} / {totalPages}
        <button disabled={page >= totalPages} onClick={() => loadItems(page + 1)}>Next</button>
      </div>
    </div>
  );
}
