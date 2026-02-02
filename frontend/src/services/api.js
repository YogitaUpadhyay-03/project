const BASE = "http://localhost:5000";

export const getDocs = async () => {
  const res = await fetch(`${BASE}/docs`);
  return res.json();
};

export const createDoc = async () => {
  const res = await fetch(`${BASE}/docs`, { method: "POST" });
  return res.json();
};

export const getDoc = async (id) => {
  const res = await fetch(`${BASE}/docs/${id}`);
  return res.json();
};

export const saveDoc = async (id, content) => {
  await fetch(`${BASE}/docs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  });
};