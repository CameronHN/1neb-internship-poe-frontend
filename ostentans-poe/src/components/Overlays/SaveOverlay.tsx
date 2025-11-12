import React from "react";
import { Text, Spinner, MessageBar, Button } from "@fluentui/react-components";
import { CheckmarkCircle24Filled, DismissFilled } from "@fluentui/react-icons";

interface SaveOverlayProps {
  isSaving: boolean;
  saveSuccess: boolean;
  saveError: string | null;
  typeSaved: string | null;
  onCloseError: () => void;
}

export const SaveOverlay: React.FC<SaveOverlayProps> = ({
  isSaving,
  saveSuccess,
  saveError,
  typeSaved = "Object",
  onCloseError,
}) => {
  if (!isSaving && !saveSuccess && !saveError) {
    return null;
  }

  return (
    <>
      {/* Save Operation Overlay */}
      {(isSaving || saveSuccess) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              minWidth: "300px",
            }}
          >
            {isSaving && !saveSuccess && (
              <>
                <Spinner size="extra-large" />
                <Text size={500}>Saving {typeSaved}...</Text>
              </>
            )}
            {saveSuccess && (
              <>
                <CheckmarkCircle24Filled
                  style={{ color: "#107c10", fontSize: "48px" }}
                />
                <Text size={500}>{typeSaved} saved successfully!</Text>
              </>
            )}
          </div>
        </div>
      )}

      {/* Save Error Message */}
      {saveError && (
        <MessageBar
          intent="error"
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1001,
          }}
        >
          {saveError}
          <Button
            size="small"
            appearance="transparent"
            onClick={onCloseError}
            style={{ marginLeft: "auto" }}
          >
            <DismissFilled />
          </Button>
        </MessageBar>
      )}
    </>
  );
};
