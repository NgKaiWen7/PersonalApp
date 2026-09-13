import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if a user session is saved in localStorage when the app boots up
  useEffect(() => {
    const savedUser = localStorage.getItem('app_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // For a local mock prototype:
    if (username === "admin" && password === "password123") {
      const userData = { username };
      setUser(userData);
      localStorage.setItem('app_user', JSON.stringify(userData));
      return true;
    }
    return false; // Invalid credentials
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('app_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for clean usage
export const useAuth = () => useContext(AuthContext);
