import LoginForm from "../../components/auth/LoginForm";
import { Link } from "react-router-dom";
import { StyledTitle3 } from "../../components/Shared/StyledTitle";
import { usePageTitle } from "../../hooks/usePageTitle";

const LoginPage = () => {
  usePageTitle({ title: "Login" });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        justifyContent: "center",
      }}
    >
      <StyledTitle3 text="Login" />

      <LoginForm />

      <Link to="/register">Don't have an account? Register</Link>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default LoginPage;
