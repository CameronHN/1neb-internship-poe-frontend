import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { Text, Button } from "@fluentui/react-components";
import { ArrowDown12Regular } from "@fluentui/react-icons";
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
      <Text as="h1" size={1000} style={{ color: "black" }}>
        <span className="font-kapakana">O</span>
        <span className="font-katibeh">stentans</span>
      </Text>

      <LoginForm />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Button
          type="submit"
          appearance="primary"
          className="form-submit-button"
          icon={<ArrowDown12Regular />}
          style={{ alignSelf: "flex-start" }}
        >
          Register
        </Button>

        <Link to="/">Try a demo</Link>
      </div>
    </div>
  );
};

export default HomePage;
