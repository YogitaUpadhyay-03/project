import { useEffect, useState } from "react";
import { getDocs, createDoc } from "../services/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DocumentCard from "../components/DocumentCard";
import "../styles/Dashboard.css"; // ✅ IMPORTANT

const Dashboard = () => {

  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getDocs().then(setDocs);
  }, []);

  const newDoc = async () => {
    const title = prompt("Enter document name:");
    const doc = await createDoc(title);

    if (doc && doc._id) {
      navigate(`/doc/${doc._id}`);
    }
  };

  return (
    <div className="layout">

      <Sidebar onCreate={newDoc} />

      <div className="main">

        <Topbar />

        <div className="documents-grid">
          {docs.map(doc => (
            <DocumentCard key={doc._id} doc={doc} />
          ))}
        </div>

      </div>

    </div>
  );
};

export default Dashboard;