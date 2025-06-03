import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI } from "../services/api";
import { toast } from "@/hooks/use-toast";

interface AuthResponse {
  token: string;
  user: {
      id: number;
      name: string;
      email: string;
      role: "PATIENT" | "DOCTOR";
      specialization?: string;
      location?: string;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  role: "PATIENT" | "DOCTOR";
  specialization?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        console.log("Initializing auth state:", {
          token: !!token,
          userData: !!userData,
        });

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          console.log("Setting user:", parsedUser);
          setUser(parsedUser);
        } else {
          console.log("No auth data found");
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      const response = await authAPI.login({ email, password }) as AuthResponse;
      const { token, user } = response;

      console.log("Login successful, received token:", token);
      localStorage.setItem("token", token);

      const userInfo = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        location: user.location,
      };

      console.log("Storing user info:", userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));
      setUser(userInfo);

      toast({
        title: "Login successful",
        description: `Welcome back, ${userInfo.name}!`,
      });
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      console.log("Attempting registration for:", userData.email);
      const response = await authAPI.register(userData);
      const { token } = response;

      console.log("Registration successful, storing token");
      localStorage.setItem("token", token);

      const userInfo = {
        id: Math.floor(Math.random() * 1000),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        specialization: userData.specialization,
        location: userData.location,
      };

      console.log("Storing user info:", userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));
      setUser(userInfo);

      toast({
        title: "Registration successful",
        description: `Welcome to HealFlow, ${userInfo.name}!`,
      });
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration failed",
        description: "Please check your information and try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    console.log("Logging out user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
