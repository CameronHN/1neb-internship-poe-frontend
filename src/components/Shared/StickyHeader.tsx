import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, MessageBar, Tooltip } from "@fluentui/react-components";
import {
  Navigation20Regular,
  Dismiss20Regular,
  DismissFilled,
  DocumentBulletList20Regular,
  DocumentMultiple20Regular,
  PersonAccounts20Regular,
  SignOut20Regular,
} from "@fluentui/react-icons";
import { useAuth } from "../../contexts/useAuth";
import { ThemeSwitcherButton } from "./ThemeSwitcherButton";

interface StickyHeaderProps {
  isDarkTheme: boolean;
  setIsDarkTheme: (isDark: boolean) => void;
  showNavigation?: boolean;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({
  isDarkTheme,
  setIsDarkTheme,
  showNavigation = true,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    setLogoutError(null);
    try {
      await logout();
      navigate("/");
    } catch {
      // The session is still active on the server, so stay logged in.
      setLogoutError("Logout failed. Please try again.");
    }
  };

  const navigationItems = [
    ...(isAuthenticated
      ? [
          {
            label: "Resume Builder",
            path: "/builder",
            icon: DocumentBulletList20Regular,
          },
          {
            label: "Saved Resumes",
            path: "/saved",
            icon: DocumentMultiple20Regular,
          },
          {
            label: "Logout",
            path: "#logout",
            icon: SignOut20Regular,
            action: handleLogout,
            tooltip: "Signs you out everywhere",
          },
        ]
      : [
          {
            label: "Login",
            path: "/login",
            icon: PersonAccounts20Regular,
            action: () => navigate("/login"),
          },
          {
            label: "Register",
            path: "/register",
            icon: PersonAccounts20Regular,
            action: () => navigate("/register"),
          },
        ]),
  ];

  const headerStyle = {
    position: "sticky" as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: isDarkTheme
      ? "rgba(6, 38, 56, 0.95)"
      : "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderBottom: `1px solid ${
      isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
    }`,
    padding: "0 24px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const logoStyle = {
    fontSize: "24px",
    fontWeight: "700",
    cursor: "default",
    userSelect: "none" as const,
    marginRight: "24px",
  };

  const mobileNavStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: showNavigation ? "flex-end" : "flex-end",
    gap: "12px",
    flex: 1,
  };

  const mobileMenuOverlayStyle = {
    position: "fixed" as const,
    top: "64px",
    left: 0,
    right: 0,
    bottom: 0,
    background: isDarkTheme
      ? "rgba(6, 38, 56, 0.98)"
      : "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(10px)",
    zIndex: 999,
    padding: "24px",
    transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.3s ease-in-out",
  };

  const mobileMenuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 0",
    fontSize: "18px",
    borderBottom: `1px solid ${
      isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
    }`,
    cursor: "pointer",
  };

  return (
    <>
      <header style={headerStyle}>
        <div style={logoStyle}>Ostentans</div>

        {!isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {showNavigation && (
              <div
                style={{ display: "flex", gap: "24px", alignItems: "center" }}
              >
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const button = (
                    <Button
                      key={item.path}
                      appearance="transparent"
                      onClick={() =>
                        item.action ? item.action() : navigate(item.path)
                      }
                      icon={<item.icon />}
                      style={{
                        fontWeight: isActive ? "bold" : "normal",
                        fontStyle: isActive ? "bold" : "normal",
                      }}
                    >
                      {item.label}
                    </Button>
                  );

                  return item.tooltip ? (
                    <Tooltip
                      key={item.path}
                      content={item.tooltip}
                      relationship="description"
                    >
                      {button}
                    </Tooltip>
                  ) : (
                    button
                  );
                })}
              </div>
            )}

            <ThemeSwitcherButton
              isDarkTheme={isDarkTheme}
              setIsDarkTheme={setIsDarkTheme}
            />
          </div>
        )}

        {isMobile && (
          <div style={mobileNavStyle}>
            <ThemeSwitcherButton
              isDarkTheme={isDarkTheme}
              setIsDarkTheme={setIsDarkTheme}
            />
            {showNavigation && (
              <Button
                appearance="primary"
                icon={
                  isMobileMenuOpen ? (
                    <Dismiss20Regular />
                  ) : (
                    <Navigation20Regular />
                  )
                }
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            )}
          </div>
        )}
      </header>

      {logoutError && (
        <MessageBar
          intent="error"
          style={{
            position: "fixed",
            top: "76px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1001,
          }}
        >
          {logoutError}
          <Button
            size="small"
            appearance="transparent"
            onClick={() => setLogoutError(null)}
            style={{ marginLeft: "auto" }}
          >
            <DismissFilled />
          </Button>
        </MessageBar>
      )}

      {showNavigation && (
        <div style={mobileMenuOverlayStyle}>
          <div>
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={item.path}
                  style={{
                    ...mobileMenuItemStyle,
                    fontWeight: isActive ? "bold" : "normal",
                    fontStyle: isActive ? "bold" : "normal",
                  }}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      navigate(item.path);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <item.icon />
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showNavigation && isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 998,
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};
