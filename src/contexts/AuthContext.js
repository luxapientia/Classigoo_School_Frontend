"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@lib/axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = Cookies.get("token");
      if (!token) {
        setLoading(false);
        // router.push("/auth");
        return;
      }

      const { data: response } = await axios.get("v1/account/me");

      if (response.status === "success" && response.data) {
        setUser(response.data);
      } else {
        setError("Failed to fetch user data");
        logout();
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setError(error.message || "Authentication failed");
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (token, maxAge) => {
    Cookies.set("token", token, { expires: maxAge / (24 * 60 * 60) });
    await checkAuth();
  }

  const logout = () => {
    // Clear auth token
    Cookies.remove("token");
    
    // Reset context state
    setUser(null);
    setError(null);
    setLoading(false);

    // Redirect to login
    router.push("/auth");
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 