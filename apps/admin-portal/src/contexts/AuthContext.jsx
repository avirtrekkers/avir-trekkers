import { createContext, useContext, useState } from "react";
import { adminLogin as loginAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = sessionStorage.getItem("adminToken");
    const userData = sessionStorage.getItem("adminUser");
    return token && userData ? JSON.parse(userData) : null;
  });
  const loading = false;

  const login = async (email, password) => {
    const { data } = await loginAPI({ email, password });
    sessionStorage.setItem("adminToken", data.token);
    sessionStorage.setItem("adminUser", JSON.stringify(data.user || { email }));
    setUser(data.user || { email });
    return data;
  };

  const logout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is intentionally co-located with its provider; splitting files would churn all importers
export const useAuth = () => useContext(AuthContext);
