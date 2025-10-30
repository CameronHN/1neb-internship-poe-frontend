import RegisterForm from "../components/auth/RegisterForm";
import { Link } from "react-router-dom";

const RegisterPage = () => (
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
    <h1>Register</h1>
    <RegisterForm />
    <Link to="/login">Already have an account? Login</Link>
    <Link to="/">Back to Home</Link>
  </div>
);

export default RegisterPage;
