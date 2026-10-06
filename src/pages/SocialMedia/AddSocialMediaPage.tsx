import { Title2 } from "@fluentui/react-components";
import React from "react";
import { AddProfessionalLinkForm } from "../../components/SocialMedia/AddProfessionalLinkForm";
import usePageTitle from "../../hooks/usePageTitle";
import { narrowFormContainer } from "../../styles/constants/pageStyling";
import { pageTitleStyle } from "../../styles/constants/textStyling";

const AddSocialMediaPage: React.FC = () => {
  usePageTitle({ title: "Add Social Media" });

  return (
    <div style={narrowFormContainer}>
      <div style={pageTitleStyle}>
        <Title2>Add Social Media</Title2>
      </div>
      <AddProfessionalLinkForm />
    </div>
  );
};

export default AddSocialMediaPage;
