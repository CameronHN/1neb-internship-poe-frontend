import { Title2 } from "@fluentui/react-components";
import React from "react";
import { AddEducationForm } from "../../components/Education/AddEducationForm";
import { usePageTitle } from "../../hooks/usePageTitle";

const AddEducationPage: React.FC = () => {
  usePageTitle({ title: "Add Education" });

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
        <Title2>Add Education</Title2>
      </div>
      <AddEducationForm />
    </div>
  );
};

export default AddEducationPage;
