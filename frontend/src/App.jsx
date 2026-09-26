import React from "react";
import { Todo } from "./TODOPages/Todo";
import { Workout } from "./WorkoutPages/Workout";
import { Readings } from "./ReadingPages/Reading";
import { useAuth } from "./AuthContext";
import { Aim } from "./AimPages/Aim.jsx";
import "./Header.css";
import "./App.css";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };
  return (
    <header className="app-header">
      <div className="header-top">
        <h1>My Productivity App</h1>

        {user && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout ({user.username})
          </button>
        )}
      </div>

      <p>Organize your day. Get things done.</p>
    </header>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="app-container">
      <main className="content">
        <Aim />
        <Todo />
        <Workout />
        <Readings />
      </main>
    </div>
  );
}
