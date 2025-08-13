import RegisterForm from "../components/auth/RegisterForm";
import { Link } from "react-router-dom";

const RegisterPage = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
    }}
  >
    <h1>Register</h1>
    <RegisterForm />
    <Link to="/login">Already have an account? Login</Link>
    <Link to="/">Back to Home</Link>
  </div>
);

export default RegisterPage;
