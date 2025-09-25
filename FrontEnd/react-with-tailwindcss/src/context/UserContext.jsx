// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Load user + token from localStorage when app starts
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("accessToken");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) setAccessToken(savedToken);
  }, []);

  // ✅ Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Login failed");

      // ⚡ Store everything in localStorage
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      setUser(data.data.user);
      setAccessToken(data.data.accessToken);

      return true;
    } catch (err) {
      console.error("Login failed:", err.message);
      alert(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token: accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
