"use client";
import React, { useState, useEffect, useContext, createContext } from "react";
import { authService } from "@/services/auth.service";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);



  // Validate token format and expiration
  const isValidToken = (token) => {
    if (!token) return false;
    
    // Basic JWT format validation (3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (payload.exp && payload.exp < currentTime) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  };

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

    if (storedToken && isValidToken(storedToken)) {
      setToken(storedToken);

      // ✅ If userData exists locally, use it as a fallback
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
        } catch (error) {
          console.error("Invalid user data in localStorage:", error);
          localStorage.removeItem("userData");
        }
      }

      fetchCurrentUser(); // Still try to update from server
    } else {
      // Clear invalid data
      if (storedToken) {
        localStorage.removeItem("accessToken");
        toast.warn("Session expired. Please login again.");
      }
      if (storedUserData) {
        localStorage.removeItem("userData");
      }
      setLoading(false);
    }
  }, []);

  // Refetch user data when token changes
  useEffect(() => {
    if (token && isValidToken(token)) {
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
    
    // Validate token before setting
    if (!isValidToken(cleanToken)) {
      toast.error("Invalid token received");
      return;
    }
    
    const user = data.user;

    localStorage.setItem("accessToken", cleanToken);
    localStorage.setItem("userData", JSON.stringify(user));

    setToken(cleanToken);
    setUserData(user);
  };

  const getToken = () => token;

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(token && userData && isValidToken(token));
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        handleLogout,
        setAuthData,
        getToken,
        loading,
        isAuthenticated,
        token,
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
