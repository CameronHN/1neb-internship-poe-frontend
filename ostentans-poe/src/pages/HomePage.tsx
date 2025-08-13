import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { Text } from "@fluentui/react-components";
import "../App.css";

const HomePage = () => {
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
      <Text as="h1" size={1000}>
        <span className="font-kapakana">O</span>
        <span className="font-katibeh">stentans</span>
      </Text>
      <LoginForm />
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  );
};

export default HomePage;
