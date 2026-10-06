import React from "react";
import { useParams } from "react-router-dom";
import { CertificationForm } from "./CertificationForm";

const UpdateCertificationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Certification ID not found</div>;
  }

  return (
    <CertificationForm 
      mode="update" 
      certificationId={id} 
    />
  );
};

export default UpdateCertificationForm;