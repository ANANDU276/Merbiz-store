// src/context/AuthContext.js
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Validate token and fetch user on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        setAuthToken(storedToken);

        try {
          const res = await axios.get(`${API_BASE_URL}/auth/me`);
          const userData = res.data;

          setUser(userData);
          setToken(storedToken);
          localStorage.setItem("user", JSON.stringify(userData));

          console.log("User authenticated from stored token");
        } catch (err) {
          console.warn("Invalid or expired token:", err.response?.data?.message || err.message);
          logout();
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token: jwt, user: userData } = res.data;

      localStorage.setItem("token", jwt);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(jwt);
      setUser(userData);
      setAuthToken(jwt);

      console.log("User logged in and token set");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
      });
      console.log("User registered successfully");
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      throw err;
    }
  };

  const logout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
