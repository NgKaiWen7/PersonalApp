import React from "react";
import { Todo } from "./TODOPages/Todo";
import { Workout } from "./WorkoutPages/Workout";
import { useAuth } from "./AuthContext";
import "./Header.css";
import "./App.css";

export function Header() {
  const { logout, user } = useAuth();

  return (
    <header className="app-header">
      <div className="header-top">
        <h1>My Productivity App</h1>

        {user && (
          <button className="logout-btn" onClick={logout}>
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
    return null;
  }

  return (
    <div className="app-container">
      <Header />

      <main className="content">
        <Todo />
        <Workout />
      </main>
    </div>
  );
}
