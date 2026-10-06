import React from "react";
import { useParams } from "react-router-dom";
import { ResumeTitleForm } from "./ResumeTitleForm";

const UpdateResumeTitleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Resume Title ID not found</div>;
  }

  return <ResumeTitleForm mode="update" titleId={id} />;
};

export default UpdateResumeTitleForm;
