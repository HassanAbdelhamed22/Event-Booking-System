import React, { createContext, useContext, useState, useEffect } from "react";
import type { AuthContextType, User } from "../types";
import { getCurrentUser, login, register, signOut } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { removeUserData, saveUserData } from "../utils/helpers";
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await getCurrentUser();
        const currentUser = response.data as User;
        setUser(currentUser);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await login({ email, password });
      const currentUser = res.data.user as User;
      saveUserData({
        token: res.data.token,
        name: currentUser.name,
        role: currentUser.role,
      });

      setUser(currentUser);

      if (currentUser.role === "admin") {
        navigate("/admin/dashboard"); // Redirect to admin dashboard
      } else if (currentUser.role === "user") {
        navigate("/"); // Redirect to user dashboard
      } else {
        navigate("/unauthorized"); // Redirect to unauthorized page
      }
    } catch (error) {
      console.error("Error signing in:", error);
      removeUserData();
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    name: string,
    password_confirmation: string
  ) => {
    try {
      setLoading(true);
      const res = await register({
        email,
        password,
        name,
        password_confirmation,
      });
      setUser(res.data);
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      removeUserData();
      setUser(null);
      toast.success("Successfully logged out");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
