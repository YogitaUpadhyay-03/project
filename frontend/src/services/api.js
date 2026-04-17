const API = "http://localhost:5000";

/* GET ALL */
export const getDocs = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/docs`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.json();
};

/* CREATE */
export const createDoc = async (title) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/docs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title })
  });

  return res.json();
};

/* GET ONE */
export const getDoc = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/docs/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.json();
};

/* SAVE + RENAME */
export const saveDoc = async (id, content, title) => {
  const token = localStorage.getItem("token");

  await fetch(`${API}/docs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ content, title })
  });
};

/* DELETE */
export const deleteDoc = async (id) => {
  const token = localStorage.getItem("token");

  await fetch(`${API}/docs/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
};