import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";
export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid username or password!");
    }
  };
  return (
    <div className="login-container">
      {" "}
      <form className="login-form" onSubmit={handleSubmit}>
        {" "}
        <h2>Login Required</h2>{" "}
        <p>Please enter your credentials to access your dashboard.</p>{" "}
        {error && <div className="login-error">{error}</div>}{" "}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />{" "}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />{" "}
        <button type="submit"> Sign In </button>{" "}
      </form>{" "}
    </div>
  );
}
