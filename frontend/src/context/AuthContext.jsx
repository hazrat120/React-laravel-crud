import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const { data } = await api.get("/me");
          setUser(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/login", { email, password });
    localStorage.setItem("token", data.access_token);
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.access_token}`;
    const userData = await api.get("/me");
    setUser(userData.data);
  };

  const register = async (name, email, password, password_confirmation) => {
    await api.post("/register", {
      name,
      email,
      password,
      password_confirmation,
    });
    await login(email, password);
  };

  const logout = async () => {
    await api.post("/logout");
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    api,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
