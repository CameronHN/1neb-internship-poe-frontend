import React from "react";
import { Title2 } from "@fluentui/react-components";
import usePageTitle from "../../hooks/usePageTitle";
import UpdateProfessionalLinkForm from "../../components/SocialMedia/UpdateProfessionalLinkForm";
import { narrowFormContainer } from "../../styles/constants/pageStyling";
import { pageTitleStyle } from "../../styles/constants/textStyling";

export const UpdateSocialMediaPage: React.FC = () => {
  usePageTitle({ title: "Update Social Media" });

  return (
    <div style={narrowFormContainer}>
      <div style={pageTitleStyle}>
        <Title2>Update Social Media</Title2>
      </div>
      <UpdateProfessionalLinkForm />
    </div>
  );
};
