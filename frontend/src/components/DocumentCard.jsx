import { useNavigate } from "react-router-dom";

const DocumentCard = ({ doc }) => {
  const nav = useNavigate();
  return (
    <div className="doc-card" onClick={() => nav(`/doc/${doc._id}`)}>
      <h4>{doc.title}</h4>
      <p>Edited {new Date(doc.updatedAt).toLocaleString()}</p>
    </div>
  );
};

export default DocumentCard;
