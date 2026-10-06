import React from "react";
import { useParams } from "react-router-dom";
import { ProfessionalSummaryForm } from "./ProfessionalSummaryForm";

const UpdateProfessionalSummaryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Professional Summary ID not found</div>;
  }

  return (
    <ProfessionalSummaryForm 
      mode="update" 
      summaryId={id} 
    />
  );
};

export default UpdateProfessionalSummaryForm;
