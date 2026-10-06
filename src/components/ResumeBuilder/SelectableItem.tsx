import { Checkbox, type CheckboxProps } from "@fluentui/react-components";
import { EditRegular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import {
  borderedItemStyle,
  itemRowStyle,
} from "../../styles/constants/builderStyling";

interface SelectableItemProps {
  label: CheckboxProps["label"];
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  editRoute: string;
  bordered: boolean;
}

export const SelectableItem = ({
  label,
  checked,
  onCheckedChange,
  editRoute,
  bordered,
}: SelectableItemProps) => {
  const navigate = useNavigate();

  const row = (
    <div style={itemRowStyle}>
      <Checkbox
        label={label}
        checked={checked}
        onChange={(_, data) => onCheckedChange(!!data.checked)}
      />
      <EditRegular cursor="pointer" onClick={() => navigate(editRoute)} />
    </div>
  );

  return bordered ? <div style={borderedItemStyle}>{row}</div> : row;
};
