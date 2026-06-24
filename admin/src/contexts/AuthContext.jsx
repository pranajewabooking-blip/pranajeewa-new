import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { http } from "../api/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => window.localStorage.getItem("pranajeewa_admin_token"));
  const [booting, setBooting] = useState(Boolean(token));

  useEffect(() => {
    const loadAdmin = async () => {
      if (!token) {
        setBooting(false);
        return;
      }

      try {
        const response = await http.get("/auth/me");
        setAdmin(response.data.admin);
      } catch {
        window.localStorage.removeItem("pranajeewa_admin_token");
        setToken(null);
        setAdmin(null);
      } finally {
        setBooting(false);
      }
    };

    loadAdmin();
  }, [token]);

  const login = async (credentials) => {
    const response = await http.post("/auth/login", credentials);
    window.localStorage.setItem("pranajeewa_admin_token", response.data.token);
    setToken(response.data.token);
    setAdmin(response.data.admin);
  };

  const logout = () => {
    window.localStorage.removeItem("pranajeewa_admin_token");
    setToken(null);
    setAdmin(null);
  };

  const value = useMemo(
    () => ({
      admin,
      token,
      booting,
      isAuthenticated: Boolean(token && admin),
      login,
      logout
    }),
    [admin, token, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
};
