import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { Text, Button, Tooltip } from "@fluentui/react-components";
import {
  ArrowDown12Regular,
  QuestionCircle12Regular,
} from "@fluentui/react-icons";
import "../App.css";

const HomePage = () => {
  const navigate = useNavigate();
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Button
          onClick={() => navigate("/register")}
          type="submit"
          appearance="primary"
          className="form-submit-button"
          icon={<ArrowDown12Regular />}
          style={{ alignSelf: "flex-start" }}
        >
          Register
        </Button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Text className="text-size-400">
            <Link to="/">Try a demo</Link>
          </Text>
          <Tooltip
            content="Try out the application without registering. Features are limited in demo mode."
            relationship="description"
          >
            <QuestionCircle12Regular
              style={{ cursor: "pointer", color: "#666" }}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
