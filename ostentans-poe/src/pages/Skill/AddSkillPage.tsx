import { Title2 } from "@fluentui/react-components";
import React from "react";
import { AddSkillForm } from "../../components/Skill/AddSkillForm";
import { usePageTitle } from "../../hooks/usePageTitle";
import { narrowFormContainer } from "../../styles/constants/pageStyling";
import { pageTitleStyle } from "../../styles/constants/textStyling";

const AddSkillPage: React.FC = () => {
  usePageTitle({ title: "Add Skills" });

  return (
    <div style={narrowFormContainer}>
      <div style={pageTitleStyle}>
        <Title2>Add Skills</Title2>
      </div>
      <AddSkillForm />
    </div>
  );
};

export default AddSkillPage;
