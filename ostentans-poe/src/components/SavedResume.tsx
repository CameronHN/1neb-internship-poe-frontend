import React from "react";
import { Button, Text } from "@fluentui/react-components";
import { DeleteConfirmationMenu } from "./DeleteConfirmationMenu";
import type { SavedResumeItem } from "../types/savedResumeTypes";
import { deleteButtonStyle } from "../styles/constants/buttonStyling";

interface SavedResumeProps {
  resume: SavedResumeItem;
  onDelete: (id: string) => void;
}

export const SavedResume: React.FC<SavedResumeProps> = ({
  resume,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  const handleDelete = () => {
    onDelete(resume.id);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <Text
          size={400}
          style={{
            textDecoration: "underline",
            fontWeight: "500",
            marginRight: "26px",
          }}
        >
          {resume.name}, <i>{resume.templateType}</i>, Created{" "}
          {formatDate(resume.createdAt)}
        </Text>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <Button size="small">Open</Button>
        {/* // TODO: Implement Open functionality */}
        <DeleteConfirmationMenu
          isEnabled={true}
          buttonStyle={deleteButtonStyle(true)}
          onConfirmDelete={handleDelete}
          onUndo={() => {}}
          buttonText="Delete"
        />
      </div>
    </div>
  );
};
