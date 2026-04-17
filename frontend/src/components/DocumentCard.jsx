import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteDoc, saveDoc } from "../services/api";

const DocumentCard = ({ doc }) => {

  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);

  const openDoc = () => {
    navigate(`/doc/${doc._id}`);
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    setMenu({ x: e.pageX, y: e.pageY });
  };

  const handleRename = async () => {
    const newName = prompt("Rename document:", doc.title);

    if (newName) {
      await saveDoc(doc._id, doc.content, newName);
      window.location.reload();
    }

    setMenu(null);
  };

  const handleDelete = async () => {
    if (window.confirm("Delete document?")) {
      await deleteDoc(doc._id);
      window.location.reload();
    }
    setMenu(null);
  };

  return (
    <div onClick={openDoc} onContextMenu={handleRightClick} className="doc-card">

      <h3>{doc.title}</h3>

      {menu && (
        <div className="context-menu" style={{ top: menu.y, left: menu.x }}>
          <div onClick={handleRename}>Rename</div>
          <div onClick={handleDelete}>Delete</div>
        </div>
      )}

    </div>
  );
};

export default DocumentCard;