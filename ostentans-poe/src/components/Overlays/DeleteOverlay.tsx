import React from "react";
import { Text, Spinner, MessageBar, Button } from "@fluentui/react-components";
import { CheckmarkCircle24Filled, DismissFilled } from "@fluentui/react-icons";

interface DeleteOverlayProps {
  isDeleting: boolean;
  deleteSuccess: boolean;
  deleteError: string | null;
  itemType: string; // e.g., "certifications", "skills", "education"
  onCloseError: () => void;
}

export const DeleteOverlay: React.FC<DeleteOverlayProps> = ({
  isDeleting,
  deleteSuccess,
  deleteError,
  itemType,
  onCloseError,
}) => {
  if (!isDeleting && !deleteSuccess && !deleteError) {
    return null;
  }

  return (
    <>
      {/* Delete Operation Overlay */}
      {(isDeleting || deleteSuccess) && (
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
              padding: "40px",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              minWidth: "300px",
            }}
          >
            {isDeleting && !deleteSuccess && (
              <>
                <Spinner size="extra-large" />
                <Text size={600}>Deleting {itemType}...</Text>
              </>
            )}
            {deleteSuccess && (
              <>
                <CheckmarkCircle24Filled
                  style={{ color: "#107c10", fontSize: "48px" }}
                />
                <Text size={600}>Successfully deleted!</Text>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Error Message */}
      {deleteError && (
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
          {deleteError}
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
