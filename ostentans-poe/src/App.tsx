import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
} from "@fluentui/react-components";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { StickyHeader } from "./components/StickyHeader";
import { useState } from "react";
import { ResumeBuilderPage } from "./pages/ResumeBuilderPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DemoPage } from "./pages/DemoPage";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const lightThemeBg = {
  minHeight: "100%",
  minWidth: "100%",
  background: "linear-gradient( #FFBCFB 10%, #F56217 100%)",
  display: "flex",
  flexDirection: "column" as const,
  position: "relative" as const,
};

const darkThemeBg = {
  minHeight: "100%",
  minWidth: "100%",
  background: "#062638ff",
  display: "flex",
  flexDirection: "column" as const,
  position: "relative" as const,
};

const mainContentStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column" as const,
};

const AppContent: React.FC<{
  isDarkTheme: boolean;
  setIsDarkTheme: (isDark: boolean) => void;
}> = ({ isDarkTheme, setIsDarkTheme }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div
      style={!isDarkTheme ? lightThemeBg : darkThemeBg}
      className={isDarkTheme ? "dark-theme" : "light-theme"}
    >
      <StickyHeader
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
        showNavigation={isAuthenticated}
      />

      <div style={mainContentStyle}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/builder"
            element={
              <ProtectedRoute>
                <ResumeBuilderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <ResumeBuilderPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <AuthProvider>
      <FluentProvider theme={isDarkTheme ? webDarkTheme : webLightTheme}>
        <BrowserRouter>
          <AppContent
            isDarkTheme={isDarkTheme}
            setIsDarkTheme={setIsDarkTheme}
          />
        </BrowserRouter>
      </FluentProvider>
    </AuthProvider>
  );
};

export default App;
