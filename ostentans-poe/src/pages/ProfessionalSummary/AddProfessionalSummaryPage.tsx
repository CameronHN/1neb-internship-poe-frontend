import { Title2 } from "@fluentui/react-components";
import React from "react";
import { AddProfessionalSummaryForm } from "../../components/ProfessionalSummary/AddProfessionalSummaryForm";
import { usePageTitle } from "../../hooks/usePageTitle";
import { narrowFormContainer } from "../../styles/constants/pageStyling";
import { pageTitleStyle } from "../../styles/constants/textStyling";

const AddProfessionalSummaryPage: React.FC = () => {
  usePageTitle({ title: "Add Professional Summary" });

  return (
    <div style={narrowFormContainer}>
      <div style={pageTitleStyle}>
        <Title2>Add Professional Summary</Title2>
      </div>
      <AddProfessionalSummaryForm />
    </div>
  );
};

export default AddProfessionalSummaryPage;
