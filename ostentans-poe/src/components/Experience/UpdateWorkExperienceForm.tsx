import React from "react";
import { useParams } from "react-router-dom";
import { WorkExperienceForm } from "./WorkExperienceForm";

const UpdateWorkExperienceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Experience not found</div>;
  }

  return <WorkExperienceForm mode="update" experienceId={id} />;
};

export default UpdateWorkExperienceForm;
