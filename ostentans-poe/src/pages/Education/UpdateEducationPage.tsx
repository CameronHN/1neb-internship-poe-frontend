import { Title2 } from "@fluentui/react-components";
import UpdateEducationForm from "../../components/Education/UpdateEducationForm";
import usePageTitle from "../../hooks/usePageTitle";
import { normalFormContainer } from "../../styles/constants/pageStyling";
import { pageTitleStyle } from "../../styles/constants/textStyling";

const UpdateEducationPage: React.FC = () => {
  usePageTitle({ title: "Udpate Education" });

  return (
    <div style={normalFormContainer}>
      <div style={pageTitleStyle}>
        <Title2>Update Education</Title2>
      </div>
      <UpdateEducationForm />
    </div>
  );
};

export default UpdateEducationPage;
