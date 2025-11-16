import React, { useState, useEffect } from "react";
import { Input, Button } from "@fluentui/react-components";
import { AddSquareRegular, DismissSquareRegular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { titleService } from "../../services/titleService";
import { SaveOverlay } from "../Overlays/SaveOverlay";
import type { ResumeTitle } from "../../types/resumeTitleTypes";

interface ResumeTitleField {
  value: string;
}

interface ResumeTitleProps {
  mode: "add" | "update";
  titleId?: string;
  initialData?: ResumeTitle;
  onSaveSuccess?: () => void;
}

export const ResumeTitleForm: React.FC<ResumeTitleProps> = ({
  mode,
  titleId,
  initialData,
  onSaveSuccess,
}) => {
  const [fields, setFields] = useState<ResumeTitleField[]>([{ value: "" }]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === "update" && titleId) {
      loadTitleData();
    } else if (mode === "update" && initialData) {
      setFields([{ value: initialData.title }]);
    }
  }, [mode, titleId, initialData]);

  const loadTitleData = async () => {
    if (!titleId) return;

    setIsLoading(true);
    try {
      const titleText = await titleService.getTitleById(titleId);
      setFields([{ value: titleText }]);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to load resume title"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addField = () => {
    if (mode === "update") return;

    const newField: ResumeTitleField = {
      value: "",
    };
    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    if (mode === "update" || fields.length === 1) return;

    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, value: string) => {
    setFields(
      fields.map((field, i) => (i === index ? { ...field, value } : field))
    );
  };

  const handleSave = async () => {
    const titles = fields
      .map((field) => field.value.trim())
      .filter((title) => title.length > 0);

    if (titles.length === 0) {
      setSaveError("Please enter at least one resume title");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      if (mode === "add") {
        await titleService.addTitles(titles);
      } else if (mode === "update" && titleId) {
        const updateData: ResumeTitle = {
          id: titleId,
          title: titles[0],
        };
        await titleService.updateTitle(updateData);
      }

      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
        setIsSaving(false);

        if (onSaveSuccess) {
          onSaveSuccess();
        } else {
          navigate("/builder");
        }
      }, 2000);
    } catch (err) {
      setIsSaving(false);
      setSaveError(
        err instanceof Error
          ? err.message
          : `Failed to ${mode} resume ${
              mode === "add" && titles.length > 1 ? "titles" : "title"
            }`
      );
    }
  };

  const handleDiscard = () => {
    if (mode === "update") {
      navigate("/builder");
    } else {
      setFields([{ value: "" }]);
    }
  };

  if (isLoading) {
    return <div>Loading resume title data...</div>;
  }

  const fieldStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  };

  const layoutStyle = {
    flex: 1,
    width: "100%",
  };

  return (
    <div style={{ margin: "0 auto" }}>
      {fields.map((field, index) => (
        <div key={index} style={fieldStyle}>
          <Input
            style={layoutStyle}
            placeholder={
              index === 0
                ? "Enter resume title (e.g., Software Engineer). Maximum 100 characters."
                : ""
            }
            value={field.value}
            onChange={(_, data) => updateField(index, data.value)}
            maxLength={100}
          />
          {mode === "add" && (
            <>
              {index === fields.length - 1 ? (
                <Button
                  appearance="primary"
                  icon={<AddSquareRegular />}
                  onClick={addField}
                  className="form-submit-button"
                  title="Add new field"
                />
              ) : (
                <Button
                  appearance="primary"
                  icon={<DismissSquareRegular />}
                  onClick={() => removeField(index)}
                  className="form-submit-button"
                  title="Remove field"
                  disabled={fields.length === 1}
                />
              )}
            </>
          )}
        </div>
      ))}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginTop: "24px",
        }}
      >
        <Button
          style={layoutStyle}
          className="form-submit-button"
          onClick={handleSave}
          disabled={isSaving}
        >
          {mode === "update" ? "Update" : "Save"}
        </Button>
        <Button
          style={layoutStyle}
          onClick={handleDiscard}
          className="form-submit-button"
        >
          {mode === "update" ? "Cancel" : "Discard All"}
        </Button>
      </div>
      <SaveOverlay
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        saveError={saveError}
        typeSaved={
          mode === "update"
            ? "Resume Title"
            : fields.length > 1
            ? "Resume Titles"
            : "Resume Title"
        }
        onCloseError={() => setSaveError(null)}
      />
    </div>
  );
};
