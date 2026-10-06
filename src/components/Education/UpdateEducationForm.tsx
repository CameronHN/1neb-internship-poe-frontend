import React from "react";
import { useParams } from "react-router-dom";
import { EducationForm } from "./EducationForm";

const UpdateEducationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Education not found</div>;
  }

  return <EducationForm mode="update" educationId={id} />;
};

export default UpdateEducationForm;
