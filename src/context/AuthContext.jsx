"use client";
import React, { useState, useEffect, useContext, createContext } from "react";
import {authService} from "@/services/authService"; 

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
    handleLogout();
  } finally {
    setLoading(false);
  }
};

  // Load user data and token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");

    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser(storedToken);
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
    alert("Logged out successfully");
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
