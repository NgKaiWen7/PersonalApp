import { useAuth } from "./AuthContext";
import { Sidebar } from "./Sidebar.jsx";
import { Outlet, Navigate } from "react-router-dom";
import "./App.css"

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
