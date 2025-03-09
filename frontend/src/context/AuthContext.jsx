import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  loading: true,
  api: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const api = axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:8000/api",
    withCredentials: true,
  });

  // Add response interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const { data } = await api.get("/me");
          setUser(data);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/login", { email, password });
      localStorage.setItem("token", data.access_token);
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.access_token}`;
      const { data: userData } = await api.get("/me");
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      throw error.response?.data?.message || "Login failed";
    }
  };

  const register = async (name, email, password, password_confirmation) => {
    try {
      await api.post("/register", {
        name,
        email,
        password,
        password_confirmation,
      });
      await login(email, password);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error.response?.data?.message || "Registration failed";
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } finally {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
      navigate("/login");
    }
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
