import { Title2 } from "@fluentui/react-components";
import React from "react";
import { AddResumeTitleForm } from "../components/ResumeTitle/AddResumeTitleForm";
import usePageTitle from "../hooks/usePageTitle";

const AddResumeTitlePage: React.FC = () => {
  usePageTitle({ title: "Add Resume Title" });

  return (
    <div
      style={{
        padding: "4rem 2rem",
        maxWidth: "80vw",
        minWidth: "40vw",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <Title2>Add Resume Title</Title2>
      </div>
      <AddResumeTitleForm />
    </div>
  );
};

export default AddResumeTitlePage;
