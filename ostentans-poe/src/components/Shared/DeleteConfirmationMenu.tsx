import React from "react";
import {
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from "@fluentui/react-components";

interface DeleteConfirmationMenuProps {
  isEnabled: boolean;
  buttonStyle?: React.CSSProperties;
  onConfirmDelete: () => void;
  onUndo: () => void;
  buttonText?: string;
  confirmText?: string;
  undoText?: string;
}

export const DeleteConfirmationMenu: React.FC<DeleteConfirmationMenuProps> = ({
  isEnabled,
  buttonStyle,
  onConfirmDelete,
  onUndo,
  buttonText = "Delete",
  confirmText = "Yes, I am sure",
  undoText = "Undo",
}) => {
  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button size="small" style={buttonStyle} disabled={!isEnabled}>
          {buttonText}
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem onClick={onConfirmDelete}>{confirmText}</MenuItem>
          <MenuItem onClick={onUndo}>{undoText}</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
