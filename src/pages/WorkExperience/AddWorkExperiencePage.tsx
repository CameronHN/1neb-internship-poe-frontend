import { Title2 } from "@fluentui/react-components";
import React from "react";
import { AddWorkExperienceForm } from "../../components/Experience/AddWorkExperienceForm";
import usePageTitle from "../../hooks/usePageTitle";
import { normalFormContainer } from "../../styles/constants/pageStyling";
import { pageTitleStyle } from "../../styles/constants/textStyling";

const AddWorkExperiencePage: React.FC = () => {
  usePageTitle({ title: "Add Work Experience" });

  return (
    <div style={normalFormContainer}>
      <div style={pageTitleStyle}>
        <Title2>Add Work Experience</Title2>
      </div>
      <AddWorkExperienceForm />
    </div>
  );
};

export default AddWorkExperiencePage;
