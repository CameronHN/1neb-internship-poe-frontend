import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authService } from "../services/authService";
import type { User } from "../types/userTypes";
import { userService } from "../services/userService";

interface AuthError {
  message: string;
  code?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  const isAuthenticated = !!user;

  // Helper function to fetch user details
  const fetchUserDetails = async (userId: string): Promise<User> => {
    try {
      const userData = await userService.getUserById(userId);

      return {
        id: userId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
      };
    } catch (error) {
      throw error;
    }
  };

  // Check if user is already authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);

      try {
        const userData = await authService.checkAuth();
        setUser(userData);
      } catch (error) {
        setUser(null);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authService.login({ email, password, rememberMe });

      if (response.userId) {
        const userDetails = await fetchUserDetails(response.userId);
        setUser(userDetails);
      }
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : "Login failed",
        code: "LOGIN_FAILED",
      };
      setError(authError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authService.register(userData);

      if (response.userId) {
        const userDetails = await fetchUserDetails(response.userId);
        setUser(userDetails);
      }
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : "Registration failed",
        code: "REGISTRATION_FAILED",
      };
      setError(authError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await authService.changePassword({ currentPassword, newPassword });
    } catch (error) {
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    changePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
