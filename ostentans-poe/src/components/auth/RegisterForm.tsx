import { Button, Input, Label } from "@fluentui/react-components";
import { ArrowRight12Regular } from "@fluentui/react-icons";
import { useState } from "react";

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: "30vw",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
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
            value={firstName}
            appearance="filled-lighter"
            onChange={(_, data) => setFirstName(data.value)}
            required
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Label htmlFor="last-name" size="large">
            Last Name:
          </Label>
          <Input
            id="last-name"
            type="text"
            value={lastName}
            appearance="filled-lighter"
            onChange={(_, data) => setLastName(data.value)}
            required
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Label htmlFor="contact-number" size="large">
            Contact Number:
          </Label>
          <Input
            id="contact-number"
            type="tel"
            value={contactNumber}
            appearance="filled-lighter"
            onChange={(_, data) => setContactNumber(data.value)}
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        appearance="primary"
        className="register-form-submit-button"
        icon={<ArrowRight12Regular />}
        style={{ alignSelf: "center", marginTop: 8 }}
      >
        Let's move on
      </Button>
    </form>
  );
};

export default RegisterForm;
