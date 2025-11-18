import { Title2 } from "@fluentui/react-components";
import UpdateEducationForm from "../../components/Education/UpdateEducationForm";
import usePageTitle from "../../hooks/usePageTitle";

const UpdateEducationPage: React.FC = () => {
  usePageTitle({ title: "Udpate Education" });

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
        <Title2>Update Education</Title2>
      </div>
      <UpdateEducationForm />
    </div>
  );
};

export default UpdateEducationPage;
