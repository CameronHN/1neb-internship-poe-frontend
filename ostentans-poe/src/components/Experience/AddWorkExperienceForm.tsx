import React, { useState } from "react";
import {
  Input,
  Button,
  Label,
  Textarea,
  Tooltip,
} from "@fluentui/react-components";
import {
  AddSquareRegular,
  DismissSquareRegular,
  QuestionCircle12Regular,
} from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { experienceService } from "../../services/experienceService";
import { SaveOverlay } from "../Overlays/SaveOverlay";
import type { AddExperience } from "../../types/experienceTypes";
import { tooltipStyling } from "../../styles/constants/iconStyling";

export const AddWorkExperienceForm: React.FC = () => {
  const [fields, setFields] = useState<AddExperience[]>([
    {
      jobTitle: "",
      companyName: "",
      startDate: "",
      endDate: "",
      responsibilities: [
        { responsibility: "" },
        { responsibility: "" },
        { responsibility: "" },
        { responsibility: "" },
        { responsibility: "" },
      ],
    },
  ]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const navigate = useNavigate();

  const addField = () => {
    const newField: AddExperience = {
      jobTitle: "",
      companyName: "",
      startDate: "",
      endDate: "",
      responsibilities: [
        { responsibility: "" },
        { responsibility: "" },
        { responsibility: "" },
        { responsibility: "" },
        { responsibility: "" },
      ],
    };
    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  const updateJobTitle = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, jobTitle: value } : field
      )
    );
  };

  const updateCompanyName = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, companyName: value } : field
      )
    );
  };

  const updateResponsibility = (
    fieldIndex: number,
    responsibilityIndex: number,
    value: string
  ) => {
    setFields(
      fields.map((field, i) => {
        if (i === fieldIndex) {
          const newResponsibilities = [...field.responsibilities];
          newResponsibilities[responsibilityIndex] = {
            responsibility: value,
          };
          return { ...field, responsibilities: newResponsibilities };
        }
        return field;
      })
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

  const handleSave = async () => {
    // Filter out empty fields and validate required fields
    const validExperiences = fields.filter(
      (field) =>
        field.jobTitle.trim().length > 0 &&
        field.companyName.trim().length > 0 &&
        field.startDate.trim().length > 0 &&
        field.endDate.trim().length > 0 &&
        field.responsibilities.filter(
          (resp) => resp.responsibility.trim().length > 0
        ).length >= 2
    );

    if (validExperiences.length === 0) {
      setSaveError(
        "Please enter at least one work experience with all required fields and at least 2 responsibilities"
      );
      return;
    }

    // Clean up the data before sending
    const cleanedExperiences = validExperiences.map((field) => ({
      ...field,
      responsibilities: field.responsibilities.filter(
        (resp) => resp.responsibility.trim().length > 0
      ),
    }));

    setIsSaving(true);
    setSaveError(null);

    try {
      await experienceService.addExperience(cleanedExperiences);

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
        err instanceof Error ? err.message : "Failed to save work experiences"
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
              <Label required>Job Title:</Label>
              <Input
                required
                placeholder={
                  index === 0 ? "Enter job title (e.g., Software Engineer)" : ""
                }
                value={field.jobTitle}
                onChange={(_, data) => updateJobTitle(index, data.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Label>Company Name:</Label>
              <Input
                style={layoutStyle}
                placeholder={
                  index === 0
                    ? "Enter company name (e.g., ABC Corporation)"
                    : ""
                }
                value={field.companyName}
                onChange={(_, data) => updateCompanyName(index, data.value)}
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
              <Label required>
                Responsibilities:{" "}
                <Tooltip
                  content="It's recommended to have at least 2 responsibilities per job."
                  relationship="description"
                  positioning={"above-start"}
                >
                  <QuestionCircle12Regular style={tooltipStyling} />
                </Tooltip>
              </Label>
              {field.responsibilities.map((responsibility, respIndex) => (
                <Textarea
                  key={respIndex}
                  required={respIndex < 2}
                  style={{ ...layoutStyle, marginTop: "8px" }}
                  placeholder={
                    index === 0 && respIndex === 0
                      ? "Enter responsibility (e.g., Managed a team of developers) - Required field"
                      : index === 0 && respIndex === 1
                      ? "Required field"
                      : ""
                  }
                  value={responsibility.responsibility}
                  onChange={(_, data) =>
                    updateResponsibility(index, respIndex, data.value)
                  }
                  rows={2}
                />
              ))}
            </div>
            <div style={{ alignSelf: "flex-end", marginLeft: "auto" }}>
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
          </div>

          {/* Horizonal Rule to separate multiple experience entries */}
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
                jobTitle: "",
                companyName: "",
                startDate: "",
                endDate: "",
                responsibilities: [
                  { responsibility: "" },
                  { responsibility: "" },
                  { responsibility: "" },
                  { responsibility: "" },
                  { responsibility: "" },
                ],
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
        typeSaved={fields.length > 1 ? "Work Experiences" : "Work Experience"}
        onCloseError={() => setSaveError(null)}
      />
    </div>
  );
};
