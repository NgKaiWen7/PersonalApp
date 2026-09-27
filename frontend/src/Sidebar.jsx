import React, { useState } from "react";
import "./Sidebar.css";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const menuItems = ["Dashboard", "Analytics", "Projects", "Settings"];
  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      {" "}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="sidebar-header"
      >
        {" "}
        <span className="sidebar-title">
          {" "}
          {isExpanded ? "APPNAME" : "≡"}
        </span>{" "}
      </button>{" "}
      <nav className="sidebar-nav">
        {" "}
        {menuItems.map((item) => (
          <a key={item} href="#" className="sidebar-item">
            {" "}
            {isExpanded && item}
          </a>
        ))}{" "}
      </nav>{" "}
    </div>
  );
}
