import React from "react";
import { Title2 } from "@fluentui/react-components";
import usePageTitle from "../../hooks/usePageTitle";
import UpdateSkillForm from "../../components/Skill/UpdateSkillForm";

export const UpdateSkillPage: React.FC = () => {
  usePageTitle({ title: "Update Skill" });

  return (
    <div
      style={{
        padding: "4rem 2rem",
        maxWidth: "80vw",
        minWidth: "35vw",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <Title2>Update Skill</Title2>
      </div>
      <UpdateSkillForm />
    </div>
  );
};
