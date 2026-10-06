import React from "react";
import { Title2 } from "@fluentui/react-components";
import usePageTitle from "../../hooks/usePageTitle";
import UpdateProfessionalSummaryForm from "../../components/ProfessionalSummary/UpdateProfessionalSummaryForm";
import { narrowFormContainer } from "../../styles/constants/pageStyling";
import { pageTitleStyle } from "../../styles/constants/textStyling";

export const UpdateProfessionalSummaryPage: React.FC = () => {
  usePageTitle({ title: "Update Professional Summary" });

  return (
    <div style={narrowFormContainer}>
      <div style={pageTitleStyle}>
        <Title2>Update Professional Summary</Title2>
      </div>
      <UpdateProfessionalSummaryForm />
    </div>
  );
};
