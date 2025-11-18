import { Title2 } from "@fluentui/react-components";
import React from "react";
import { AddResumeTitleForm } from "../../components/ResumeTitle/AddResumeTitleForm";
import usePageTitle from "../../hooks/usePageTitle";
import { narrowFormContainer } from "../../styles/constants/pageStyling";
import { pageTitleStyle } from "../../styles/constants/textStyling";

const AddResumeTitlePage: React.FC = () => {
  usePageTitle({ title: "Add Resume Title" });

  return (
    <div style={narrowFormContainer}>
      <div style={pageTitleStyle}>
        <Title2>Add Resume Title</Title2>
      </div>
      <AddResumeTitleForm />
    </div>
  );
};

export default AddResumeTitlePage;
