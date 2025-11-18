import React from "react";
import { Title2 } from "@fluentui/react-components";
import usePageTitle from "../../hooks/usePageTitle";
import UpdateCertificationForm from "../../components/Certification/UpdateCertificationForm";
import { normalFormContainer } from "../../styles/constants/pageStyling";
import { pageTitleStyle } from "../../styles/constants/textStyling";

export const UpdateCertificationPage: React.FC = () => {
  usePageTitle({ title: "Update Certification" });

  return (
    <div style={normalFormContainer}>
      <div style={pageTitleStyle}>
        <Title2>Update Certification</Title2>
      </div>
      <UpdateCertificationForm />
    </div>
  );
};
