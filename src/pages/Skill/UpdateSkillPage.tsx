import React from "react";
import { Title2 } from "@fluentui/react-components";
import usePageTitle from "../../hooks/usePageTitle";
import UpdateSkillForm from "../../components/Skill/UpdateSkillForm";
import { narrowFormContainer } from "../../styles/constants/pageStyling";
import { pageTitleStyle } from "../../styles/constants/textStyling";

export const UpdateSkillPage: React.FC = () => {
  usePageTitle({ title: "Update Skill" });

  return (
    <div style={narrowFormContainer}>
      <div style={pageTitleStyle}>
        <Title2>Update Skill</Title2>
      </div>
      <UpdateSkillForm />
    </div>
  );
};
