import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
} from "@fluentui/react-components";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ThemeSwitcher from "./components/ThemeSwitcher";
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
  minHeight: "100vh",
  minWidth: "100vw",
  background: "linear-gradient(  #0B486B 0%, #FFBCFB 50%, #F56217 100%)",
  display: "flex",
  flexDirection: "column" as const,
  position: "relative" as const,
};

const darkThemeBg = {
  minHeight: "100vh",
  minWidth: "100vw",
  background: "#062638ff",
  display: "flex",
  flexDirection: "column" as const,
  position: "relative" as const,
};

const themeSwitcherWrapper = {
  position: "absolute" as const,
  top: 24,
  right: 32,
  zIndex: 100,
};

const App: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <AuthProvider>
      <FluentProvider theme={isDarkTheme ? webDarkTheme : webLightTheme}>
        <div
          style={!isDarkTheme ? lightThemeBg : darkThemeBg}
          className={isDarkTheme ? "dark-theme" : "light-theme"}
        >
          <div style={themeSwitcherWrapper}>
            <ThemeSwitcher
              isDarkTheme={isDarkTheme}
              setIsDarkTheme={setIsDarkTheme}
            />
          </div>
          <BrowserRouter>
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
            </Routes>
          </BrowserRouter>
        </div>
      </FluentProvider>
    </AuthProvider>
  );
};

export default App;
