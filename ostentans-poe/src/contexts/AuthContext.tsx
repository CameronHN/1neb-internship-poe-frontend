import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authService } from "../services/authService";
import { API_URLS } from "../constants/apiConstants";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

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
      const response = await fetch(`${API_URLS.API_BASE}/User?id=${userId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const userData = await response.json();

      return {
        id: userId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
      };
    } catch (error) {
      console.error("Error fetching user details:", error);
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
        const response = await fetch(`${API_URLS.API_BASE}/auth/me`, {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else if (response.status === 401) {
          setUser(null);
        } else {
          throw new Error("Failed to check authentication status");
        }
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
