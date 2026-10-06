import { useState } from "react";
import {
  Button,
  Input,
  Label,
  Checkbox,
  MessageBar,
} from "@fluentui/react-components";
import { ArrowRight12Regular } from "@fluentui/react-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/form.css";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password, rememberMe);
      navigate("/builder"); // Redirect after successful login
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: "30vw",
        alignItems: "center",
      }}
    >
      {error && (
        <MessageBar intent="error" style={{ width: "100%" }}>
          {error}
        </MessageBar>
      )}

      <Label htmlFor="email" size="large">
        Email:
      </Label>
      <Input
        id="email"
        type="email"
        value={email}
        appearance="filled-lighter"
        onChange={(_, data) => setEmail(data.value)}
        required
        disabled={isLoading}
        maxLength={256}
      />
      <Label htmlFor="password" size="large">
        Password:
      </Label>
      <Input
        id="password"
        type="password"
        value={password}
        appearance="filled-lighter"
        onChange={(_, data) => setPassword(data.value)}
        required
        disabled={isLoading}
        minLength={8}
      />

      <Checkbox
        label="Remember me"
        className="text-size-400"
        style={{}}
        checked={rememberMe}
        onChange={(_, data) => setRememberMe(data.checked === true)}
        disabled={isLoading}
      />

      <Button
        type="submit"
        appearance="primary"
        className="form-submit-button"
        icon={<ArrowRight12Regular />}
        style={{ alignSelf: "center", marginTop: 8 }}
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
