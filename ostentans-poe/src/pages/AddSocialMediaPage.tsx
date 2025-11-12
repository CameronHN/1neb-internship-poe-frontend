import { Title2 } from "@fluentui/react-components";
import React from "react";
import { AddSocialMediaForm } from "../components/SocialMedia/AddSocialMediaForm";
import usePageTitle from "../hooks/usePageTitle";

const AddSocialMediaPage: React.FC = () => {
  usePageTitle({ title: "Add Social Media" });

  return (
    <div
      style={{
        padding: "4rem 2rem",
        maxWidth: "80vw",
        minWidth: "35vw",
        margin: "0 auto",
      }}
    >
      {" "}
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <Title2>Add Social Media</Title2>
      </div>
      <AddSocialMediaForm />
    </div>
  );
};

export default AddSocialMediaPage;
