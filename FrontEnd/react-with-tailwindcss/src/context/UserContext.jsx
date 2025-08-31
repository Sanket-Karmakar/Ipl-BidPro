import React, { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false); // hydration guard

  // Hydrate from localStorage on app load
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("user");
      const rawToken = localStorage.getItem("accessToken");
      if (rawUser && rawToken) {
        setUser(JSON.parse(rawUser));
        setAccessToken(rawToken);
      }
    } catch (_) {
      // ignore bad JSON
    } finally {
      setReady(true);
    }
  }, []);

  const login = async (email, password) => {
  setLoading(true);
  try {
    const res = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.message || "Login failed");
    }

    const json = await res.json();

    if (json?.data?.user && json?.data?.accessToken) {
      setUser(json.data.user);
      setAccessToken(json.data.accessToken);
      return true;
    } else {
      throw new Error("Invalid server response: missing user/token");
    }
  } catch (e) {
    alert(e.message);
    return false;
  } finally {
    setLoading(false);
  }
};



  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  return (
    <UserContext.Provider
      value={{ user, accessToken, login, logout, loading, ready }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
