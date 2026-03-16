const Sidebar = ({ onCreate }) => {

return(

<div className="sidebar">

<h2>Lumina Docs</h2>

<button
className="create-btn"
onClick={onCreate}
>
+ Create New
</button>

<ul>
<li>Recent</li>
<li>Shared</li>
<li>Drafts</li>
</ul>

</div>

);

};

export default Sidebar;