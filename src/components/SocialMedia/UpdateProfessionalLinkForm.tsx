import React from "react";
import { useParams } from "react-router-dom";
import { ProfessionalLinkForm } from "./ProfessionalLinkForm";

const UpdateProfessionalLinkForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Professional Links not found</div>;
  }

  return <ProfessionalLinkForm mode="update" contactId={id} />;
};

export default UpdateProfessionalLinkForm;
