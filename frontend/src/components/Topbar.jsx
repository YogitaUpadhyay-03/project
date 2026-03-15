import React from "react";

const Topbar = () => {

  const logout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";

  };

  return (
    <div className="topbar">

      <input placeholder="Search documents..." />

      <button onClick={logout} className="logout-btn">
        Logout
      </button>

    </div>
  );

};

export default Topbar;
