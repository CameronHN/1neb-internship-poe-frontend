import RegisterForm from "../../components/auth/RegisterForm";
import { Link } from "react-router-dom";
import { StyledTitle3 } from "../../components/StyledTitle";
import { usePageTitle } from "../../hooks/usePageTitle";

const RegisterPage = () => {
  usePageTitle({ title: "Register" });

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
      <StyledTitle3 text="Register" />

      <RegisterForm />
      <Link to="/login">Already have an account? Login</Link>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default RegisterPage;
