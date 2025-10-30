import { useState } from "react";
import { Button, Input, Label } from "@fluentui/react-components";
import { ArrowRight12Regular } from "@fluentui/react-icons";
import "../../styles/form.css";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    alert(`Email: ${email}\nPassword: ${password}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: "15vw",
      }}
    >
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
      />

      <Button
        type="submit"
        appearance="primary"
        className="form-submit-button"
        icon={<ArrowRight12Regular />}
        style={{ alignSelf: "center", marginTop: 8 }}
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
