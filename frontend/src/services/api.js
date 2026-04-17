const API = "http://localhost:5000";

/* ============================= */
/*       Get all documents       */
/* ============================= */

export const getDocs = async () => {

  const token = localStorage.getItem("token");

  try {

    const res = await fetch(`${API}/docs`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    console.log("DOCS:", data);

    return Array.isArray(data) ? data : [];

  } catch (err) {
    console.log("Error fetching docs:", err);
    return [];
  }

};


/* ============================= */
/*       Create new document     */
/* ============================= */

export const createDoc = async (title) => {

  const token = localStorage.getItem("token");

  try {

    const res = await fetch(`${API}/docs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    });

    return await res.json();

  } catch (err) {
    console.log("Error creating doc:", err);
  }

};


/* ============================= */
/*       Get single document     */
/* ============================= */

export const getDoc = async (id) => {

  const token = localStorage.getItem("token");

  try {

    const res = await fetch(`${API}/docs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return await res.json();

  } catch (err) {
    console.log("Error fetching doc:", err);
  }

};


/* ============================= */
/*       Save document           */
/* ============================= */

export const saveDoc = async (id, content, title) => {

  const token = localStorage.getItem("token");

  try {

    await fetch(`${API}/docs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        content,
        title
      })
    });

  } catch (err) {
    console.log("Error saving doc:", err);
  }

};