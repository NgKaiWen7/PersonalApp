import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('app_user');
    const savedToken = localStorage.getItem('app_token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(
        `https://backend.nkwzotero.uk/api/auth?user=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      // Assuming the API returns { "token": "..." }
      const token = data.token;

      if (!token) {
        return false;
      }

      const userData = {
        username,
      };

      setUser(userData);

      localStorage.setItem('app_user', JSON.stringify(userData));
      localStorage.setItem('app_token', token);

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('app_user');
    localStorage.removeItem('app_token');
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
