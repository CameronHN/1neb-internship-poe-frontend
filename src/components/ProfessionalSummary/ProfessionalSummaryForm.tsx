import React, { useState, useEffect, useCallback } from "react";
import { Button, Textarea } from "@fluentui/react-components";
import { AddSquareRegular, DismissSquareRegular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { professionalSummaryService } from "../../services/professionalSummaryService";
import { SaveOverlay } from "../Overlays/SaveOverlay";
import type { Summary } from "../../types/professionalSummaryTypes";

interface SummaryField {
  summary: string;
}

interface ProfessionalSummaryProps {
  mode: "add" | "update";
  summaryId?: string;
  initialData?: Summary;
  onSaveSuccess?: () => void;
}

export const ProfessionalSummaryForm: React.FC<ProfessionalSummaryProps> = ({
  mode,
  summaryId,
  initialData,
  onSaveSuccess,
}) => {
  const [fields, setFields] = useState<SummaryField[]>([{ summary: "" }]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadSummaryData = useCallback(async () => {
    if (!summaryId) return;

    setIsLoading(true);
    try {
      const summaryText = await professionalSummaryService.getSummaryById(
        summaryId
      );
      setFields([{ summary: summaryText }]);
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "Failed to load professional summary"
      );
    } finally {
      setIsLoading(false);
    }
  }, [summaryId]);

  // Load data for update mode
  useEffect(() => {
    if (mode === "update" && summaryId) {
      loadSummaryData();
    } else if (mode === "update" && initialData) {
      setFields([{ summary: initialData.summary }]);
    }
  }, [mode, summaryId, initialData, loadSummaryData]);

  const addField = () => {
    if (mode === "update") return;

    const newField: SummaryField = {
      summary: "",
    };
    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    if (mode === "update" || fields.length === 1) return;

    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, summary: value } : field
      )
    );
  };

  const handleSave = async () => {
    const summaries = fields
      .map((field) => field.summary.trim())
      .filter((summary) => summary.length > 0);

    if (summaries.length === 0) {
      setSaveError("Please enter at least one professional summary");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      if (mode === "add") {
        await professionalSummaryService.addSummaries(summaries);
      } else if (mode === "update" && summaryId) {
        const updateData: Summary = {
          id: summaryId,
          summary: summaries[0],
        };
        await professionalSummaryService.updateSummary(updateData);
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
          : `Failed to ${mode} professional ${
              mode === "add" && summaries.length > 1 ? "summaries" : "summary"
            }`
      );
    }
  };

  const handleDiscard = () => {
    if (mode === "update") {
      navigate("/builder");
    } else {
      setFields([{ summary: "" }]);
    }
  };

  if (isLoading) {
    return <div>Loading professional summary data...</div>;
  }

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
            value={field.summary}
            onChange={(_, data) => updateField(index, data.value)}
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
            ? "Professional Summary"
            : fields.length > 1
            ? "Professional Summaries"
            : "Professional Summary"
        }
        onCloseError={() => setSaveError(null)}
      />
    </div>
  );
};
