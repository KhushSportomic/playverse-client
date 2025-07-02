// src/contexts/AdminContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { apiUrl } from "../contant";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for admin token in localStorage on initial load
    const token = localStorage.getItem("adminToken");
    if (token) {
      // Verify token with backend
      verifyAdminToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyAdminToken = async (token) => {
    try {
      const response = await fetch(`${apiUrl}/admin/verify`, {
        headers: {
          "x-admin-token": token,
        },
      });

      if (response.ok) {
        setIsAdmin(true);
      } else {
        // If token is invalid, clear it
        localStorage.removeItem("adminToken");
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("adminToken");
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (password) => {
    try {
      const response = await fetch(`${apiUrl}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        setIsAdmin(true);
        return { success: true };
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
  };

  const value = {
    isAdmin,
    loading,
    login,
    logout,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === null) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
