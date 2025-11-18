import { Title2 } from "@fluentui/react-components";
import React from "react";
import { AddWorkExperienceForm } from "../../components/Experience/AddWorkExperienceForm";
import usePageTitle from "../../hooks/usePageTitle";

const AddWorkExperiencePage: React.FC = () => {
  usePageTitle({ title: "Add Work Experience" });

  return (
    <div
      style={{
        padding: "4rem 2rem",
        minWidth: "60vw",
        maxWidth: "90vw",
        margin: "0 auto",
      }}
    >
      {" "}
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <Title2>Add Work Experience</Title2>
      </div>
      <AddWorkExperienceForm />
    </div>
  );
};

export default AddWorkExperiencePage;
