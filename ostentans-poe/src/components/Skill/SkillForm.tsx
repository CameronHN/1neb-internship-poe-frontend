import React, { useState, useEffect, useCallback } from "react";
import { Input, Button } from "@fluentui/react-components";
import { AddSquareRegular, DismissSquareRegular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { skillService } from "../../services/skillService";
import { SaveOverlay } from "../Overlays/SaveOverlay";
import type { AddSkill, Skill } from "../../types/skillTypes";

interface SkillProps {
  mode: "add" | "update";
  skillId?: string;
  initialData?: Skill;
  onSaveSuccess?: () => void;
}

export const SkillForm: React.FC<SkillProps> = ({
  mode,
  skillId,
  initialData,
  onSaveSuccess,
}) => {
  const [fields, setFields] = useState<AddSkill[]>([
    { skill: "", proficiencyLevel: "" },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadSkillData = useCallback(async () => {
    if (!skillId) return;

    setIsLoading(true);
    try {
      const skill = await skillService.getSkillById(skillId);
      setFields([
        {
          skill: skill.skillName,
          proficiencyLevel: skill.proficiencyLevel,
        },
      ]);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to load skill");
    } finally {
      setIsLoading(false);
    }
  }, [skillId]);

  useEffect(() => {
    if (mode === "update" && skillId) {
      loadSkillData();
    } else if (mode === "update" && initialData) {
      setFields([
        {
          skill: initialData.skillName,
          proficiencyLevel: initialData.proficiencyLevel,
        },
      ]);
    }
  }, [mode, skillId, initialData, loadSkillData]);

  const addField = () => {
    if (mode === "update") return;

    const newField: AddSkill = {
      skill: "",
      proficiencyLevel: "",
    };
    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    if (mode === "update" || fields.length === 1) return;

    setFields(fields.filter((_, i) => i !== index));
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
    const validSkills = fields.filter((field) => field.skill.trim().length > 0);

    if (validSkills.length === 0) {
      setSaveError("Please enter at least one skill with a name");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      if (mode === "add") {
        await skillService.addSkills(validSkills);
      } else if (mode === "update" && skillId) {
        const updateData: Skill = {
          id: skillId,
          skillName: validSkills[0].skill,
          proficiencyLevel: validSkills[0].proficiencyLevel,
        };
        await skillService.updateSkill(updateData);
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
          : `Failed to ${mode} ${
              mode === "add" && validSkills.length > 1 ? "skills" : "skill"
            }`
      );
    }
  };

  const handleDiscard = () => {
    if (mode === "update") {
      navigate("/builder");
    } else {
      setFields([{ skill: "", proficiencyLevel: "" }]);
    }
  };

  if (isLoading) {
    return <div>Loading skill data...</div>;
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
          onClick={handleSave}
          className="form-submit-button"
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
          mode === "update" ? "Skill" : fields.length > 1 ? "Skills" : "Skill"
        }
        onCloseError={() => setSaveError(null)}
      />
    </div>
  );
};
