import { Title2 } from "@fluentui/react-components";
import React from "react";
import { AddProfessionalSummaryForm } from "../../components/ProfessionalSummary/AddProfessionalSummaryForm";
import { usePageTitle } from "../../hooks/usePageTitle";

const AddProfessionalSummaryPage: React.FC = () => {
  usePageTitle({ title: "Add Professional Summary" });

  return (
    <div
      style={{
        padding: "4rem 2rem",
        maxWidth: "80vw",
        minWidth: "40vw",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <Title2>Add Professional Summary</Title2>
      </div>
      <AddProfessionalSummaryForm />
    </div>
  );
};

export default AddProfessionalSummaryPage;
