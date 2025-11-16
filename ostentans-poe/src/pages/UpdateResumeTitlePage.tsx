import React from "react";
import { Title2 } from "@fluentui/react-components";
import usePageTitle from "../hooks/usePageTitle";
import UpdateResumeTitleForm from "../components/ResumeTitle/UpdateResumeTitleForm";

export const UpdateResumeTitlePage: React.FC = () => {
  usePageTitle({ title: "Update Resume Title" });

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
        <Title2>Update Resume Title</Title2>
      </div>
      <UpdateResumeTitleForm />
    </div>
  );
};
