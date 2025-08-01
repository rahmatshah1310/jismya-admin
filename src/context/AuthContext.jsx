"use client";
import React, { useState, useEffect, useContext, createContext } from "react";
import { authService } from "@/services/authService";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user data
  const fetchCurrentUser = async () => {
  try {
    const response = await authService.me();
    if (response?.data?.user) {
      setUserData(response.data.user);
    } else if (response?.data) {
      setUserData(response.data);
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);

    // ✅ Only logout if it's unauthorized
    if (error?.response?.status === 401) {
      handleLogout();
    } else {
      toast.warn("You're offline or server is unreachable");
    }
  } finally {
    setLoading(false);
  }
};


  // Load user data and token from localStorage on mount
  useEffect(() => {
   const storedToken = localStorage.getItem("accessToken");
const storedUserData = localStorage.getItem("userData");

if (storedToken) {
  setToken(storedToken);

  // ✅ If userData exists locally, use it as a fallback
  if (storedUserData) {
    setUserData(JSON.parse(storedUserData));
  }

  fetchCurrentUser(); // Still try to update from server
} else {
  setLoading(false);
}

  }, []);

  // Refetch user data when token changes
  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    setToken(null);
    setUserData(null);
    toast.success("Logged out successfully");
  };

  const setAuthData = (responseData) => {
    const data = responseData?.data || responseData;

    if (!data?.token || !data?.user) {
      console.error("Invalid auth data received:", responseData);
      return;
    }

    const rawToken = data.token;
    const cleanToken = rawToken.replace("Bearer ", "");
    const user = data.user;

    localStorage.setItem("accessToken", cleanToken);
    localStorage.setItem("userData", JSON.stringify(user));

    setToken(cleanToken);
    setUserData(user);
  };

  const getToken = () => token;

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        handleLogout,
        setAuthData,
        getToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
