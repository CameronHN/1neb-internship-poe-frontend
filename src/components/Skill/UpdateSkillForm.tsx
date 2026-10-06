import React from "react";
import { useParams } from "react-router-dom";
import { SkillForm } from "./SkillForm";

const UpdateSkillForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Skill not found</div>;
  }

  return <SkillForm mode="update" skillId={id} />;
};

export default UpdateSkillForm;
