import { Input, Label, MessageBar } from "@fluentui/react-components";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CustomProceedButton from "../Shared/CustomProceedButton";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      navigate("/builder"); // Redirect after successful registration
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
        width: "100%",
        maxWidth: "600px",
        minWidth: "280px",
        margin: "0 auto",
        padding: "0 16px",
      }}
    >
      {error && (
        <MessageBar intent="error" style={{ width: "100%" }}>
          {error}
        </MessageBar>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Label htmlFor="first-name" size="large">
            First Name:
          </Label>
          <Input
            id="first-name"
            type="text"
            value={formData.firstName}
            appearance="filled-lighter"
            onChange={(_, data) => handleChange("firstName", data.value)}
            required
            disabled={isLoading}
            maxLength={100}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Label htmlFor="last-name" size="large">
            Last Name:
          </Label>
          <Input
            id="last-name"
            type="text"
            value={formData.lastName}
            appearance="filled-lighter"
            onChange={(_, data) => handleChange("lastName", data.value)}
            required
            disabled={isLoading}
            maxLength={100}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Label htmlFor="email" size="large">
            Email:
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            appearance="filled-lighter"
            onChange={(_, data) => handleChange("email", data.value)}
            required
            disabled={isLoading}
            maxLength={256}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Label htmlFor="contact-number" size="large">
            Contact Number:
          </Label>
          <Input
            id="contact-number"
            type="tel"
            value={formData.phone}
            appearance="filled-lighter"
            onChange={(_, data) => handleChange("phone", data.value)}
            required
            disabled={isLoading}
            maxLength={15}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Label htmlFor="password" size="large">
            Password:
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            appearance="filled-lighter"
            onChange={(_, data) => handleChange("password", data.value)}
            required
            disabled={isLoading}
            minLength={8}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Label htmlFor="confirm-password" size="large">
            Confirm Password:
          </Label>
          <Input
            id="confirm-password"
            type="password"
            value={formData.confirmPassword}
            appearance="filled-lighter"
            onChange={(_, data) => handleChange("confirmPassword", data.value)}
            required
            disabled={isLoading}
            minLength={8}
          />
        </div>
      </div>
      <CustomProceedButton
        type="submit"
        isLoading={isLoading}
        className="register-form-submit-button"
      >
        {isLoading ? "Registering..." : "Let's move on"}
      </CustomProceedButton>
    </form>
  );
};

export default RegisterForm;
