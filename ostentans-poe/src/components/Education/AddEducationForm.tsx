import React, { useState } from "react";
import { Input, Button, Label } from "@fluentui/react-components";
import { AddSquareRegular, DismissSquareRegular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { educationService } from "../../services/educationService";
import { SaveOverlay } from "../Overlays/SaveOverlay";
import type { AddEducation } from "../../types/educationTypes";

export const AddEducationForm: React.FC = () => {
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
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const navigate = useNavigate();

  const addField = () => {
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
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index));
    }
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
    // Filter out empty fields and convert empty optional fields to null
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
        achievement: field.major?.trim() || null,
      }));

    if (validEducations.length === 0) {
      setSaveError(
        "Please enter at least one  education with institution name, qualification, start date, and end date"
      );
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await educationService.addEducations(validEducations);

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
        err instanceof Error ? err.message : "Failed to save educations"
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
        <>
          <div key={index} style={fieldStyle}>
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Label>Major:</Label>
              <Input
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
                  index === 0
                    ? "Enter achievement (e.g., Graduated with Honors)"
                    : ""
                }
                value={field.achievement || ""}
                onChange={(_, data) => updateAchievement(index, data.value)}
              />
            </div>
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

          {/* Horizonal Rule to separate multiple education entries */}
          {fields.length > 1 && index < fields.length - 1 && (
            <hr
              style={{
                border: "none",
                borderTop: "1px solid #0000006c",
                margin: "24px 0",
              }}
            />
          )}
        </>
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
          className="form-submit-button"
        >
          Save
        </Button>
        <Button
          style={layoutStyle}
          onClick={() =>
            setFields([
              {
                institutionName: "",
                qualification: "",
                startDate: "",
                endDate: "",
                major: "",
                achievement: "",
              },
            ])
          }
          className="form-submit-button"
        >
          Discard All
        </Button>
      </div>
      <SaveOverlay
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        saveError={saveError}
        typeSaved={fields.length > 1 ? "Educations" : "Education"}
        onCloseError={() => setSaveError(null)}
      />
    </div>
  );
};
