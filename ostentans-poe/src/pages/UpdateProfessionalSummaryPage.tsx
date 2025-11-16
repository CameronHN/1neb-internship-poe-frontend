import React from "react";
import { Title2 } from "@fluentui/react-components";
import usePageTitle from "../hooks/usePageTitle";
import UpdateProfessionalSummaryForm from "../components/ProfessionalSummary/UpdateProfessionalSummaryForm";

export const UpdateProfessionalSummaryPage: React.FC = () => {
  usePageTitle({ title: "Update Professional Summary" });

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
        <Title2>Update Professional Summary</Title2>
      </div>
      <UpdateProfessionalSummaryForm />
    </div>
  );
};
