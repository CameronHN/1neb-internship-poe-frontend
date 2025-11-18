import React from "react";
import { Title2 } from "@fluentui/react-components";
import usePageTitle from "../../hooks/usePageTitle";
import UpdateResumeTitleForm from "../../components/ResumeTitle/UpdateResumeTitleForm";
import { narrowFormContainer } from "../../styles/constants/pageStyling";
import { pageTitleStyle } from "../../styles/constants/textStyling";

export const UpdateResumeTitlePage: React.FC = () => {
  usePageTitle({ title: "Update Resume Title" });

  return (
    <div style={narrowFormContainer}>
      <div style={pageTitleStyle}>
        <Title2>Update Resume Title</Title2>
      </div>
      <UpdateResumeTitleForm />
    </div>
  );
};
