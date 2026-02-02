import { useEffect, useState } from "react";
import { getDocs, createDoc } from "../services/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DocumentCard from "../components/DocumentCard";

const Dashboard = () => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    getDocs().then(setDocs);
  }, []);

  const newDoc = async () => {
    const doc = await createDoc();
    setDocs([doc, ...docs]);
  };

  return (
    <div className="layout">
      <Sidebar onCreate={newDoc} />
      <div className="main">
        <Topbar />
        <div className="documents-grid">
          {docs.map(d => (
            <DocumentCard key={d._id} doc={d} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;