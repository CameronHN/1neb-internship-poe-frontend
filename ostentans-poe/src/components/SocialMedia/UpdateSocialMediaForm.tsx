import React from "react";
import { useParams } from "react-router-dom";
import { SocialMediaForm } from "./SocialMediaForm";

const UpdateSocialMediaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Contact ID not found</div>;
  }

  return <SocialMediaForm mode="update" contactId={id} />;
};

export default UpdateSocialMediaForm;
