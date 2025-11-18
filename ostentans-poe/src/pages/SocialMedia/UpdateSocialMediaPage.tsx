import React from "react";
import { Title2 } from "@fluentui/react-components";
import usePageTitle from "../../hooks/usePageTitle";
import UpdateSocialMediaForm from "../../components/SocialMedia/UpdateSocialMediaForm";

export const UpdateSocialMediaPage: React.FC = () => {
  usePageTitle({ title: "Update Social Media" });

  return (
    <div
      style={{
        padding: "4rem 2rem",
        maxWidth: "80vw",
        minWidth: "35vw",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <Title2>Update Social Media</Title2>
      </div>
      <UpdateSocialMediaForm />
    </div>
  );
};
