import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const { data } = await api.get("/api/auth/me");
          setUser(data.user);
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const register = useCallback(async (username, email, password) => {
    const { data } = await api.post("/api/auth/register", { username, email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const updateBookmarks = useCallback((bookmarks) => {
    setUser((prev) => (prev ? { ...prev, bookmarks } : prev));
  }, []);

  const isBookmarked = useCallback(
    (storyId) => {
      if (!user?.bookmarks) return false;
      return user.bookmarks.some((b) => (typeof b === "object" ? b._id : b) === storyId);
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, updateBookmarks, isBookmarked }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
