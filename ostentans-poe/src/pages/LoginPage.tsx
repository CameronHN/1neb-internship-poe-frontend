import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router-dom";

const LoginPage = () => (
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
    <h1>Login</h1>
    <LoginForm />
    <Link to="/register">Don't have an account? Register</Link>
    <Link to="/">Back to Home</Link>
  </div>
);

export default LoginPage;
