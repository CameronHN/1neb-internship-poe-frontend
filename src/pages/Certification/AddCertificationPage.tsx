import { Title2 } from "@fluentui/react-components";
import React from "react";
import { AddCertificationForm } from "../../components/Certification/AddCertificationForm";
import usePageTitle from "../../hooks/usePageTitle";
import { normalFormContainer } from "../../styles/constants/pageStyling";
import { pageTitleStyle } from "../../styles/constants/textStyling";

const AddCertificationPage: React.FC = () => {
  usePageTitle({ title: "Add Certification" });

  return (
    <div style={normalFormContainer}>
      <div style={pageTitleStyle}>
        <Title2>Add Certification</Title2>
      </div>
      <AddCertificationForm />
    </div>
  );
};

export default AddCertificationPage;
