import { Button, MessageBar, Spinner, Tooltip } from "@fluentui/react-components";
import { QuestionCircle12Regular } from "@fluentui/react-icons";
import type { BuilderMessage } from "../../hooks/useGenerateResume";
import {
  generateButtonStyle,
  centeredSectionStyle,
  messageBarStyle,
} from "../../styles/constants/builderStyling";
import { tooltipStyling } from "../../styles/constants/iconStyling";

interface GenerateResumeSectionProps {
  message: BuilderMessage | null;
  selectedCount: number;
  isGenerating: boolean;
  disabled: boolean;
  onGenerate: () => void;
}

export const GenerateResumeSection = ({
  message,
  selectedCount,
  isGenerating,
  disabled,
  onGenerate,
}: GenerateResumeSectionProps) => (
  <>
    {message && (
      <MessageBar intent={message.intent} style={messageBarStyle}>
        {message.text}
      </MessageBar>
    )}

    <div style={centeredSectionStyle}>
      <Button
        appearance="primary"
        size="large"
        onClick={onGenerate}
        disabled={disabled}
        style={generateButtonStyle}
      >
        {isGenerating ? (
          <>
            <Spinner size="tiny" style={{ marginRight: "8px" }} />
            Generating...
          </>
        ) : (
          <>
            Generate Resume ({selectedCount} selected){" "}
            <Tooltip
              content="It's recommended to select up to 20 items for an optimal resume length."
              relationship="description"
              positioning={"above-start"}
            >
              <QuestionCircle12Regular style={tooltipStyling} />
            </Tooltip>
          </>
        )}
      </Button>
    </div>
  </>
);
