import { Title2 } from "@fluentui/react-components";
import React from "react";
import { AddEducationForm } from "../../components/Education/AddEducationForm";
import { usePageTitle } from "../../hooks/usePageTitle";
import { normalFormContainer } from "../../styles/constants/pageStyling";
import { pageTitleStyle } from "../../styles/constants/textStyling";

const AddEducationPage: React.FC = () => {
  usePageTitle({ title: "Add Education" });

  return (
    <div style={normalFormContainer}>
      <div style={pageTitleStyle}>
        <Title2>Add Education</Title2>
      </div>
      <AddEducationForm />
    </div>
  );
};

export default AddEducationPage;
