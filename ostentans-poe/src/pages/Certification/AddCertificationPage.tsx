import { Title2 } from "@fluentui/react-components";
import React from "react";
import { AddCertificationForm } from "../../components/Certification/AddCertificationForm";
import usePageTitle from "../../hooks/usePageTitle";

const AddCertificationPage: React.FC = () => {
  usePageTitle({ title: "Add Certification" });

  return (
    <div
      style={{
        padding: "4rem 2rem",
        minWidth: "60vw",
        maxWidth: "90vw",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <Title2>Add Certification</Title2>
      </div>
      <AddCertificationForm />
    </div>
  );
};

export default AddCertificationPage;
