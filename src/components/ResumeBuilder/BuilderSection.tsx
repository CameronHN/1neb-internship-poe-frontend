import {
  Button,
  Card,
  CardHeader,
  CardPreview,
  type CheckboxProps,
  Subtitle1,
  Tooltip,
} from "@fluentui/react-components";
import { QuestionCircle12Regular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import type { SectionConfig } from "../../constants/resumeBuilderConstants";
import { deleteButtonStyle } from "../../styles/constants/buttonStyling";
import {
  cardHeaderActionsStyle,
  cardPreviewStyle,
  gridLayoutStyle,
  stackLayoutStyle,
} from "../../styles/constants/builderStyling";
import { tooltipStyling } from "../../styles/constants/iconStyling";
import { DeleteConfirmationMenu } from "../Shared/DeleteConfirmationMenu";
import { SelectableItem } from "./SelectableItem";

interface BuilderSectionProps<T extends { id: string }> {
  config: SectionConfig;
  items: T[];
  renderLabel: (item: T, index: number) => CheckboxProps["label"];
  selectedIds: Set<string>;
  onToggleItem: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onDelete: () => void;
  onUndo: () => void;
}

export const BuilderSection = <T extends { id: string }>({
  config,
  items,
  renderLabel,
  selectedIds,
  onToggleItem,
  onToggleAll,
  onDelete,
  onUndo,
}: BuilderSectionProps<T>) => {
  const navigate = useNavigate();
  const { layout } = config;
  const hasSelection = items.some((item) => selectedIds.has(item.id));

  return (
    <Card>
      <CardHeader
        header={
          <Subtitle1>
            {config.title}
            {config.tooltip && (
              <Tooltip
                content={config.tooltip}
                relationship="description"
                positioning={"above-start"}
              >
                <QuestionCircle12Regular style={tooltipStyling} />
              </Tooltip>
            )}
          </Subtitle1>
        }
        action={
          <div style={cardHeaderActionsStyle}>
            <Button size="small" onClick={() => navigate(config.addRoute)}>
              Add
            </Button>
            {items.length > 0 && (
              <>
                <Button size="small" onClick={() => onToggleAll(true)}>
                  Select All
                </Button>
                <Button size="small" onClick={() => onToggleAll(false)}>
                  Clear All
                </Button>
                <DeleteConfirmationMenu
                  isEnabled={hasSelection}
                  buttonStyle={deleteButtonStyle(hasSelection)}
                  onConfirmDelete={onDelete}
                  onUndo={onUndo}
                />
              </>
            )}
          </div>
        }
      />
      {items.length > 0 && (
        <CardPreview style={cardPreviewStyle}>
          <div
            style={
              layout.kind === "grid"
                ? gridLayoutStyle(layout.gap)
                : stackLayoutStyle(layout.gap)
            }
          >
            {items.map((item, index) => (
              <SelectableItem
                key={item.id}
                label={renderLabel(item, index)}
                checked={selectedIds.has(item.id)}
                onCheckedChange={(checked) => onToggleItem(item.id, checked)}
                editRoute={`${config.updateRoute}/${item.id}`}
                bordered={layout.bordered}
              />
            ))}
          </div>
        </CardPreview>
      )}
    </Card>
  );
};
