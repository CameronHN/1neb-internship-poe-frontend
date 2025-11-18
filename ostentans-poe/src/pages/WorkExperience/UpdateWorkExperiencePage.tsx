import { Title2 } from "@fluentui/react-components";
import React from "react";
import usePageTitle from "../../hooks/usePageTitle";
import UpdateWorkExperienceForm from "../../components/Experience/UpdateWorkExperienceForm";

export const UpdateWorkExperiencePage: React.FC = () => {
  usePageTitle({ title: "Update Work Experience" });

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
        <Title2>Update Work Experience</Title2>
      </div>
      <UpdateWorkExperienceForm />
    </div>
  );
};
