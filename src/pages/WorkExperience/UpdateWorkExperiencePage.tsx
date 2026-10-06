import { Title2 } from "@fluentui/react-components";
import React from "react";
import usePageTitle from "../../hooks/usePageTitle";
import UpdateWorkExperienceForm from "../../components/Experience/UpdateWorkExperienceForm";
import { normalFormContainer } from "../../styles/constants/pageStyling";
import { pageTitleStyle } from "../../styles/constants/textStyling";

export const UpdateWorkExperiencePage: React.FC = () => {
  usePageTitle({ title: "Update Work Experience" });

  return (
    <div style={normalFormContainer}>
      <div style={pageTitleStyle}>
        <Title2>Update Work Experience</Title2>
      </div>
      <UpdateWorkExperienceForm />
    </div>
  );
};
