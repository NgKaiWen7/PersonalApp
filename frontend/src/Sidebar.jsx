import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="sidebar-header"
      >
        <span className="sidebar-title">{isExpanded ? "APPNAME" : " ≡ "}</span>
      </button>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link key={item.label} to={item.path} className="sidebar-item">
            <span className="sidebar-icon">{item.icon}</span>

            {isExpanded && item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
