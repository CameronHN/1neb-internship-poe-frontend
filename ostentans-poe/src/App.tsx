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
import { SavedResumesPage } from "./pages/SavedResumesPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DemoPage } from "./pages/DemoPage";
import AddSkillPage from "./pages/AddSkillPage";
import AddSocialMediaPage from "./pages/AddSocialMediaPage";
import AddResumeTitlePage from "./pages/AddResumeTitlePage";
import AddProfessionalSummaryPage from "./pages/AddProfessionalSummaryPage";
import AddWorkExperiencePage from "./pages/AddWorkExperiencePage";
import AddEducationPage from "./pages/AddEducationPage";
import AddCertificationPage from "./pages/AddCertificationPage";
import { UpdateCertificationPage } from "./pages/UpdateCertificationPage";

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
  background: "linear-gradient( #FFBCFB 10%, #F56217 100%)",
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
                <SavedResumesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-skills"
            element={
              <ProtectedRoute>
                <AddSkillPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-socials"
            element={
              <ProtectedRoute>
                <AddSocialMediaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-titles"
            element={
              <ProtectedRoute>
                <AddResumeTitlePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-summaries"
            element={
              <ProtectedRoute>
                <AddProfessionalSummaryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-experiences"
            element={
              <ProtectedRoute>
                <AddWorkExperiencePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-educations"
            element={
              <ProtectedRoute>
                <AddEducationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-certifications"
            element={
              <ProtectedRoute>
                <AddCertificationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-certification/:id"
            element={<UpdateCertificationPage />}
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
