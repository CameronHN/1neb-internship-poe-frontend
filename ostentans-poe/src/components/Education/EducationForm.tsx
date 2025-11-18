import React, { useState, useEffect, useCallback } from "react";
import { Input, Button, Label } from "@fluentui/react-components";
import { AddSquareRegular, DismissSquareRegular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { educationService } from "../../services/educationService";
import { SaveOverlay } from "../Overlays/SaveOverlay";
import type { AddEducation, Education } from "../../types/educationTypes";
import { formatDateForInput } from "../../helpers/dateHelpers";

interface EducationFormProps {
  mode: "add" | "update";
  educationId?: string;
  initialData?: Education;
  onSaveSuccess?: () => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({
  mode,
  educationId,
  initialData,
  onSaveSuccess,
}) => {
  const [fields, setFields] = useState<AddEducation[]>([
    {
      institutionName: "",
      qualification: "",
      startDate: "",
      endDate: "",
      major: null,
      achievement: null,
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadEducationData = useCallback(async () => {
    if (!educationId) return;

    setIsLoading(true);
    try {
      const education = await educationService.getEducationById(educationId);
      setFields([
        {
          institutionName: education.institutionName,
          qualification: education.qualification,
          startDate: formatDateForInput(education.startDate),
          endDate: formatDateForInput(education.endDate),
          major: education.major,
          achievement: education.achievement,
        },
      ]);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to load education"
      );
    } finally {
      setIsLoading(false);
    }
  }, [educationId]);

  useEffect(() => {
    if (mode === "update" && educationId) {
      loadEducationData();
    } else if (mode === "update" && initialData) {
      setFields([
        {
          institutionName: initialData.institutionName,
          qualification: initialData.qualification,
          startDate: formatDateForInput(initialData.startDate),
          endDate: formatDateForInput(initialData.endDate),
          major: initialData.major,
          achievement: initialData.achievement,
        },
      ]);
    }
  }, [mode, educationId, initialData, loadEducationData]);

  const addField = () => {
    if (mode === "update") return;

    const newField: AddEducation = {
      institutionName: "",
      qualification: "",
      startDate: "",
      endDate: "",
      major: null,
      achievement: null,
    };
    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    if (mode === "update" || fields.length === 1) return;

    setFields(fields.filter((_, i) => i !== index));
  };

  const updateInstitutionName = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, institutionName: value } : field
      )
    );
  };

  const updateQualification = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, qualification: value } : field
      )
    );
  };

  const updateStartDate = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, startDate: value } : field
      )
    );
  };

  const updateEndDate = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, endDate: value } : field
      )
    );
  };

  const updateMajor = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, major: value } : field
      )
    );
  };

  const updateAchievement = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, achievement: value } : field
      )
    );
  };

  const handleSave = async () => {
    const validEducations = fields
      .filter(
        (field) =>
          field.institutionName.trim().length > 0 &&
          field.qualification.trim().length > 0 &&
          field.startDate.trim().length > 0 &&
          field.endDate.trim().length > 0
      )
      .map((field) => ({
        ...field,
        major: field.major?.trim() || null,
        achievement: field.achievement?.trim() || null,
      }));

    if (validEducations.length === 0) {
      setSaveError(
        "Please enter at least one education with institution name, qualification, start date, and end date"
      );
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      if (mode === "add") {
        await educationService.addEducations(validEducations);
      } else if (mode === "update" && educationId) {
        const updateData: Education = {
          id: educationId,
          ...validEducations[0],
        };
        await educationService.updateEducation(updateData);
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
        err instanceof Error ? err.message : `Failed to ${mode} education(s)`
      );
    }
  };

  const handleDiscard = () => {
    if (mode === "update") {
      navigate("/builder");
    } else {
      setFields([
        {
          institutionName: "",
          qualification: "",
          startDate: "",
          endDate: "",
          major: "",
          achievement: "",
        },
      ]);
    }
  };

  if (isLoading) {
    return <div>Loading education data...</div>;
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
        <div key={index}>
          <div style={fieldStyle}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Label required>Institution Name:</Label>
              <Input
                required
                placeholder={
                  index === 0
                    ? "Enter institution name (e.g., Harvard University)"
                    : ""
                }
                value={field.institutionName}
                onChange={(_, data) => updateInstitutionName(index, data.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Label required>Qualification:</Label>
              <Input
                required
                style={layoutStyle}
                placeholder={
                  index === 0
                    ? "Enter qualification (e.g., Bachelor of Science)"
                    : ""
                }
                value={field.qualification}
                onChange={(_, data) => updateQualification(index, data.value)}
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Label required>Start Date:</Label>
              <Input
                required
                type="date"
                style={layoutStyle}
                value={field.startDate}
                onChange={(_, data) => updateStartDate(index, data.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Label required>End Date:</Label>
              <Input
                required
                type="date"
                style={layoutStyle}
                value={field.endDate}
                onChange={(_, data) => updateEndDate(index, data.value)}
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Label>Major:</Label>
              <Input
                style={layoutStyle}
                placeholder={
                  index === 0 ? "Enter major (e.g., Computer Science)" : ""
                }
                value={field.major || ""}
                onChange={(_, data) => updateMajor(index, data.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Label>Achievement:</Label>
              <Input
                style={layoutStyle}
                placeholder={
                  index === 0 ? "Enter achievement (e.g., Magna Cum Laude)" : ""
                }
                value={field.achievement || ""}
                onChange={(_, data) => updateAchievement(index, data.value)}
              />
            </div>

            {mode === "add" && (
              <div style={{ alignSelf: "flex-end" }}>
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
            )}
          </div>

          {mode === "add" && fields.length > 1 && index < fields.length - 1 && (
            <hr
              style={{
                border: "none",
                borderTop: "1px solid #0000006c",
                margin: "24px 0",
              }}
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
          onClick={handleSave}
          disabled={isSaving}
          className="form-submit-button"
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
            ? "Education"
            : fields.length > 1
            ? "Educations"
            : "Education"
        }
        onCloseError={() => setSaveError(null)}
      />
    </div>
  );
};
