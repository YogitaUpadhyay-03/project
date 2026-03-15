const API = "http://localhost:5000";

/* Get all documents */

export const getDocs = async () => {

  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/docs`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  console.log("DOCS:", data);

  return Array.isArray(data) ? data : [];

};


/* Create new document */

export const createDoc = async () => {

  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/docs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();

};


/* Get single document */

export const getDoc = async (id) => {

  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/docs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();

};


/* Save document */

export const saveDoc = async (id, content) => {

  const token = localStorage.getItem("token");

  await fetch(`${API}/docs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ content })
  });

};