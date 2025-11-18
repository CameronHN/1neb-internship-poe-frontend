import { Title2 } from "@fluentui/react-components";
import React from "react";
import { AddSkillForm } from "../../components/Skill/AddSkillForm";
import { usePageTitle } from "../../hooks/usePageTitle";

const AddSkillPage: React.FC = () => {
  usePageTitle({ title: "Add Skills" });

  return (
    <div
      style={{
        padding: "4rem 2rem",
        maxWidth: "80vw",
        minWidth: "60vw",
        margin: "0 auto",
      }}
    >
      {" "}
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <Title2>Add Skills</Title2>
      </div>
      <AddSkillForm />
    </div>
  );
};

export default AddSkillPage;
