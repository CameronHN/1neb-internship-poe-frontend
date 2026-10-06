import {
  Button,
  Input,
  Label,
  Spinner,
  Subtitle2,
  Tooltip,
} from "@fluentui/react-components";
import { QuestionCircle12Regular } from "@fluentui/react-icons";
import {
  centeredSectionStyle,
  saveNameContainerStyle,
} from "../../styles/constants/builderStyling";
import { tooltipStyling } from "../../styles/constants/iconStyling";

interface SaveResumeSectionProps {
  name: string;
  onNameChange: (name: string) => void;
  isSaving: boolean;
  onSave: () => void;
}

export const SaveResumeSection = ({
  name,
  onNameChange,
  isSaving,
  onSave,
}: SaveResumeSectionProps) => (
  <div style={centeredSectionStyle}>
    <Subtitle2>
      Liked what you saw?
      <Tooltip
        content={`Saving the resume allows you to access it later from your saved resumes.
            This is a snapshot of the information and can't be edited after saving.
            Information also can't be removed as future changes to it won't reflect here.`}
        relationship="description"
      >
        <QuestionCircle12Regular style={tooltipStyling} />
      </Tooltip>
    </Subtitle2>

    <div style={saveNameContainerStyle}>
      <Label htmlFor="savedResumeName">Saved Resume Name:</Label>
      <Input
        id="savedResumeName"
        value={name}
        onChange={(_, data) => onNameChange(data.value)}
        placeholder="Enter a name for your saved resume"
        style={{ marginTop: "8px", width: "100%" }}
      />
      <Button
        appearance="primary"
        style={{ marginTop: "8px", width: "100%" }}
        onClick={onSave}
        disabled={isSaving || !name.trim()}
      >
        {isSaving ? (
          <>
            <Spinner size="tiny" style={{ marginRight: "8px" }} />
            Saving...
          </>
        ) : (
          "Save"
        )}
      </Button>
    </div>
  </div>
);
