import { useNavigate } from "react-router-dom";

const DocumentCard = ({ doc }) => {

  const navigate = useNavigate();

  return (
    <div
      className="doc-card"
      onClick={() => navigate(`/doc/${doc._id}`)}
    >
      <div className="doc-title">
        {doc.title || "Untitled Document"}
      </div>

      <div className="doc-date">
        Last edited: {new Date(doc.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );

};

export default DocumentCard;