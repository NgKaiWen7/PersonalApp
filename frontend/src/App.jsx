import React from "react";
import { Todo } from "./TODOPages/Todo";
import { Workout } from "./WorkoutPages/Workout";
import { AuthProvider, useAuth } from "./AuthContext";
import { Login } from "./Login";
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

// This helper component decides what view to render based on auth state
function MainAppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading your workspace...</div>;
  }

  // 🛡️ BLOCK: If not authenticated, force render of the Login screen
  if (!user) {
    return <Login />;
  }

  // ✅ ALLOW: Render the main dashboard if logged in
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

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
