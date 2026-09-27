import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const menuItems = [
    { label: "Dashboard", icon: "🏠", path: "/" },
    { label: "To Do", icon: "☑️", path: "/todo" },
    { label: "Workout", icon: "🏋️", path: "/workout" },
    { label: "Notes", icon: "📝", path: "/notes" },
    { label: "Readings", icon: "📚", path: "/readings" },
  ];
  function handleLogout() {
    localStorage.removeItem("app_user");
    localStorage.removeItem("app_token");

    window.location.href = "/login";
  }
  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="sidebar-header"
      >
        <span className="sidebar-title">{isExpanded ? "🦜NKW" : "🦜"}</span>
      </button>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            {isExpanded && item.label}
          </NavLink>
        ))}
      </nav>
      <button className="sidebar-logout" onClick={handleLogout}>
        <span className="sidebar-icon">➜🚪</span>
        {isExpanded && "Logout"}
      </button>
    </div>
  );
}
