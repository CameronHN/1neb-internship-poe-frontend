import React, { useState } from "react";
import { Input, Button } from "@fluentui/react-components";
import { AddSquareRegular, DismissSquareRegular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { skillService } from "../../services/skillService";
import type { Skill } from "../../types/skillTypes";
import { SaveOverlay } from "../Overlays/SaveOverlay";

export const AddSkillForm: React.FC = () => {
  const [fields, setFields] = useState<Skill[]>([
    { skill: "", proficiencyLevel: "" },
  ]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const navigate = useNavigate();

  const addField = () => {
    const newField: Skill = {
      skill: "",
      proficiencyLevel: "",
    };
    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  const updateSkillName = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, skill: value } : field
      )
    );
  };

  const updateSkillLevel = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, proficiencyLevel: value } : field
      )
    );
  };

  const handleSave = async () => {
    // Filter out empty fields
    const validSkills = fields.filter(
      (field) =>
        field.skill.trim().length > 0 &&
        field.proficiencyLevel.trim().length > 0
    );

    if (validSkills.length === 0) {
      setSaveError("Please enter at least one skill with both name and level");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await skillService.addSkills(validSkills);

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
        err instanceof Error ? err.message : "Failed to save skills"
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
          <Input
            style={layoutStyle}
            placeholder={
              index === 0 ? "Enter skill name (e.g., JavaScript)" : ""
            }
            value={field.skill}
            onChange={(_, data) => updateSkillName(index, data.value)}
          />
          <Input
            style={layoutStyle}
            placeholder={
              index === 0 ? "Enter skill level (e.g., Expert, 7/10)" : ""
            }
            value={field.proficiencyLevel}
            onChange={(_, data) => updateSkillLevel(index, data.value)}
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
          onClick={handleSave}
          className="form-submit-button"
        >
          Save
        </Button>
        <Button
          style={layoutStyle}
          onClick={() => setFields([{ skill: "", proficiencyLevel: "" }])}
          className="form-submit-button"
        >
          Discard All
        </Button>
      </div>
      <SaveOverlay
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        saveError={saveError}
        typeSaved={fields.length > 1 ? "Skills" : "Skill"}
        onCloseError={() => setSaveError(null)}
      />
    </div>
  );
};
