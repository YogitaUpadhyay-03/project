const Sidebar = ({ onCreate }) => (
  <div className="sidebar">
    <h2>Lumina Docs</h2>
    <button onClick={onCreate}>+ Create New</button>
    <p>Recent</p>
    <p>Shared</p>
    <p>Drafts</p>
  </div>
);

export default Sidebar;
