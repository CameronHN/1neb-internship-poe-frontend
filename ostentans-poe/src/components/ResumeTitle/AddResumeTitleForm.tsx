import React, { useState } from "react";
import { Input, Button } from "@fluentui/react-components";
import { AddSquareRegular, DismissSquareRegular } from "@fluentui/react-icons";
import { SaveOverlay } from "../Overlays/SaveOverlay";
import { useNavigate } from "react-router-dom";
import { titleService } from "../../services/titleService";

interface ResumeTitleField {
  value: string;
}

export const AddResumeTitleForm: React.FC = () => {
  const [fields, setFields] = useState<ResumeTitleField[]>([{ value: "" }]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const navigate = useNavigate();

  const addField = () => {
    const newField: ResumeTitleField = {
      value: "",
    };
    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  const updateField = (index: number, value: string) => {
    setFields(
      fields.map((field, i) => (i === index ? { ...field, value } : field))
    );
  };

  const handleSave = async () => {
    // Filter out empty fields
    const titles = fields
      .map(field => field.value.trim())
      .filter(title => title.length > 0);

    if (titles.length === 0) {
      setSaveError("Please enter at least one resume title");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await titleService.addTitles(titles);
      
      setSaveSuccess(true);
      // Show success for 2 seconds, then navigate back
      setTimeout(() => {
        setSaveSuccess(false);
        setIsSaving(false);
        navigate("/builder");
      }, 2000);
    } catch (err) {
      setIsSaving(false);
      setSaveError(
        err instanceof Error ? err.message : "Failed to save resume titles"
      );
    }
  };

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
          Save
        </Button>
        <Button
          style={layoutStyle}
          onClick={() => setFields([{ value: "" }])}
          className="form-submit-button"
        >
          Discard All
        </Button>
      </div>
      <SaveOverlay
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        saveError={saveError}
        typeSaved={fields.length > 1 ? "Resume Titles" : "Resume Title"}
        onCloseError={() => setSaveError(null)}
      />
    </div>
  );
};
