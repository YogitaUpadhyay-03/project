import { useEffect, useState } from "react";
import { getDocs, createDoc } from "../services/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/Dashboard.css";
import DocumentCard from "../components/DocumentCard";

const Dashboard = () => {

  const [docs, setDocs] = useState([]);
  const [menu, setMenu] = useState(null); // right click menu
  const navigate = useNavigate();

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    const data = await getDocs();
    setDocs(Array.isArray(data) ? data : []);
  };

  /* Create doc */

  const newDoc = async () => {

    const title = prompt("Enter document name:");
    if (!title) return;

    const doc = await createDoc(title);

    if (doc && doc._id) {
      navigate(`/doc/${doc._id}`);
    }

  };

  /* RIGHT CLICK */

  const handleRightClick = (e, doc) => {
    e.preventDefault();

    setMenu({
      x: e.pageX,
      y: e.pageY,
      doc
    });
  };

  /* RENAME */

  const handleRename = async () => {

    const newTitle = prompt("Enter new name:", menu.doc.title);
    if (!newTitle) return;

    await fetch(`http://localhost:5000/docs/${menu.doc._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        title: newTitle,
        content: menu.doc.content
      })
    });

    setMenu(null);
    loadDocs();
  };

  /* DELETE */

  const handleDelete = async () => {

    const confirmDelete = window.confirm("Delete this document?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:5000/docs/${menu.doc._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    setMenu(null);
    loadDocs();
  };

  return (

    <div
      className="layout"
      onClick={() => setMenu(null)} // click anywhere close menu
    >

      <Sidebar onCreate={newDoc} />

      <div className="main">

        <Topbar />

        <div className="documents-grid">

          {docs.map((doc) => (
            <div
              key={doc._id}
              onContextMenu={(e) => handleRightClick(e, doc)}
            >
              <DocumentCard doc={doc} />
            </div>
          ))}

        </div>

      </div>

      {/* RIGHT CLICK MENU */}
      {menu && (
        <div
          className="context-menu"
          style={{ top: menu.y, left: menu.x }}
        >
          <div onClick={handleRename}>Rename</div>
          <div onClick={handleDelete}>Delete</div>
        </div>
      )}

    </div>

  );

};

export default Dashboard;