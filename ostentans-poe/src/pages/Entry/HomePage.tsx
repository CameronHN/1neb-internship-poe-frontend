import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import { Text, Button, Tooltip } from "@fluentui/react-components";
import { StyledTitle1 } from "../../components/StyledTitle";
import { usePageTitle } from "../../hooks/usePageTitle";
import {
  ArrowDown12Regular,
  QuestionCircle12Regular,
} from "@fluentui/react-icons";
import "../../App.css";
import { tooltipStyling } from "../../styles/constants/iconStyling";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  usePageTitle({ title: "Home" });

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
      <StyledTitle1 text="Ostentans" />

      {/* Login Form */}
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
            <Link to="/demo">Try a demo</Link>
          </Text>
          <Tooltip
            content="Try out the application without registering. Features are limited in demo mode."
            relationship="description"
          >
            <QuestionCircle12Regular style={tooltipStyling} />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
