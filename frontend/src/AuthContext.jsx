import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      const savedUser = localStorage.getItem("app_user");
      const savedToken = localStorage.getItem("app_token");

      if (!savedUser || !savedToken) {
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        const { username } = JSON.parse(savedUser);

        const response = await fetch(
          `https://backend.nkwzotero.uk/api/auth?user=${encodeURIComponent(username)}&token=${encodeURIComponent(savedToken)}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          localStorage.removeItem("app_user");
          localStorage.removeItem("app_token");
          setUser(null);
          navigate("/login");
          return;
        }

        setUser({ username });
      } catch (error) {
        console.error("Login check failed:", error);

        localStorage.removeItem("app_user");
        localStorage.removeItem("app_token");
        setUser(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, [navigate]);

  const login = async (username, password) => {
    try {
      const response = await fetch(
        `https://backend.nkwzotero.uk/api/auth?user=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        navigate("/login");
        return false;
      }

      const data = await response.json();

      // Assuming the API returns { "token": "..." }
      const token = data.token;

      if (!token) {
        navigate("/login");
        return false;
      }

      const userData = { username };

      setUser(userData);

      localStorage.setItem("app_user", JSON.stringify(userData));
      localStorage.setItem("app_token", token);
      return true;
    } catch (error) {
      navigate("/login");
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("app_user");
    localStorage.removeItem("app_token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
