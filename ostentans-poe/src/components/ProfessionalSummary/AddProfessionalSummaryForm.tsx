import React, { useState } from "react";
import { Button, Textarea } from "@fluentui/react-components";
import { AddSquareRegular, DismissSquareRegular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { professionalSummaryService } from "../../services/professionalSummaryService";
import { SaveOverlay } from "../Overlays/SaveOverlay";

interface SummaryField {
  value: string;
}

export const AddProfessionalSummaryForm: React.FC = () => {
  const [fields, setFields] = useState<SummaryField[]>([{ value: "" }]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const navigate = useNavigate();

  const addField = () => {
    const newField: SummaryField = {
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
    const summaries = fields
      .map((field) => field.value.trim())
      .filter((summary) => summary.length > 0);

    if (summaries.length === 0) {
      setSaveError("Please enter at least one professional summary");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await professionalSummaryService.addSummaries(summaries);

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
        err instanceof Error
          ? err.message
          : "Failed to save professional summaries"
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
  };

  return (
    <div style={{ margin: "0 auto" }}>
      {fields.map((field, index) => (
        <div key={index} style={fieldStyle}>
          <Textarea
            style={layoutStyle}
            placeholder={
              index === 0
                ? "Enter professional summary (e.g., Experienced software engineer with a focus on frontend development). Maximum 200 characters."
                : ""
            }
            rows={4}
            maxLength={200}
            value={field.value}
            onChange={(_, data) => updateField(index, data.value)}
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
        typeSaved={
          fields.length > 1 ? "Professional Summaries" : "Professional Summary"
        }
        onCloseError={() => setSaveError(null)}
      />
    </div>
  );
};
