import React from "react";
import { Title2 } from "@fluentui/react-components";
import usePageTitle from "../hooks/usePageTitle";
import UpdateCertificationForm from "../components/Certification/UpdateCertificationForm";

export const UpdateCertificationPage: React.FC = () => {
  usePageTitle({ title: "Update Certification" });

  return (
    <div
      style={{
        padding: "4rem 2rem",
        minWidth: "60vw",
        maxWidth: "90vw",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <Title2>Update Certification</Title2>
      </div>
      <UpdateCertificationForm />
    </div>
  );
};
