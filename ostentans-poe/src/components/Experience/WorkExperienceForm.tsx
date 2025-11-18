import React, { useState, useEffect } from "react";
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
import type {
  AddExperience,
  Experience,
  UpdateExperience,
} from "../../types/experienceTypes";
import { tooltipStyling } from "../../styles/constants/iconStyling";
import { formatDateForInput } from "../../helpers/dateHelpers";

interface WorkExperienceFormProps {
  mode: "add" | "update";
  experienceId?: string;
  initialData?: Experience;
  onSaveSuccess?: () => void;
}

export const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({
  mode,
  experienceId,
  initialData,
  onSaveSuccess,
}) => {
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [originalResponsibilities, setOriginalResponsibilities] = useState<
    { id: string; responsibility: string }[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === "update" && experienceId) {
      loadExperienceData();
    } else if (mode === "update" && initialData) {
      setOriginalResponsibilities(initialData.responsibilities);
      setFields([
        {
          jobTitle: initialData.jobTitle,
          companyName: initialData.companyName,
          startDate: formatDateForInput(initialData.startDate),
          endDate: formatDateForInput(initialData.endDate),
          responsibilities: initialData.responsibilities.map((r) => ({
            responsibility: r.responsibility,
          })),
        },
      ]);
    }
  }, [mode, experienceId, initialData]);

  const loadExperienceData = async () => {
    if (!experienceId) return;

    setIsLoading(true);
    try {
      const experience = await experienceService.getExperienceById(
        experienceId
      );
      setOriginalResponsibilities(experience.responsibilities);
      setFields([
        {
          jobTitle: experience.jobTitle,
          companyName: experience.companyName,
          startDate: formatDateForInput(experience.startDate),
          endDate: formatDateForInput(experience.endDate),
          responsibilities: experience.responsibilities.map((r) => ({
            responsibility: r.responsibility,
          })),
        },
      ]);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to load experience"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addField = () => {
    if (mode === "update") return;

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
    if (mode === "update" || fields.length === 1) return;

    setFields(fields.filter((_, i) => i !== index));
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
    const validExperiences = fields
      .filter(
        (field) =>
          field.jobTitle.trim().length > 0 &&
          field.startDate.trim().length > 0 &&
          field.endDate.trim().length > 0 &&
          field.responsibilities.filter(
            (resp) => resp.responsibility.trim().length > 0
          ).length >= 2
      )
      .map((field) => ({
        ...field,
        responsibilities: field.responsibilities.filter(
          (resp) => resp.responsibility.trim().length > 0
        ),
      }));

    if (validExperiences.length === 0) {
      setSaveError(
        "Please enter at least one work experience with all required fields and at least 2 responsibilities"
      );
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      if (mode === "add") {
        await experienceService.addExperience(validExperiences);
      } else if (mode === "update" && experienceId) {
        const updateData: UpdateExperience = {
          id: experienceId,
          jobTitle: validExperiences[0].jobTitle,
          companyName: validExperiences[0].companyName,
          startDate: validExperiences[0].startDate,
          endDate: validExperiences[0].endDate,
          responsibilities: validExperiences[0].responsibilities.map(
            (r, index) => ({
              id: originalResponsibilities[index]?.id || "",
              responsibility: r.responsibility,
            })
          ),
        };
        await experienceService.updateExperience(updateData);
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
          : `Failed to ${mode} work experience(s)`
      );
    }
  };

  const handleDiscard = () => {
    if (mode === "update") {
      navigate("/builder");
    } else {
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
      ]);
    }
  };

  if (isLoading) {
    return <div>Loading experience data...</div>;
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

            {mode === "add" && (
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
            ? "Work Experience"
            : fields.length > 1
            ? "Work Experiences"
            : "Work Experience"
        }
        onCloseError={() => setSaveError(null)}
      />
    </div>
  );
};
