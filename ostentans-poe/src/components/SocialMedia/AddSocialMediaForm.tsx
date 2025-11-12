import React, { useState } from "react";
import { Input, Button } from "@fluentui/react-components";
import { AddSquareRegular, DismissSquareRegular } from "@fluentui/react-icons";
import { socialMediaService } from "../../services/socialMediaService";
import { SaveOverlay } from "../Overlays/SaveOverlay";
import { useNavigate } from "react-router-dom";

interface SocialMediaField {
  value: string;
}

export const AddSocialMediaForm: React.FC = () => {
  const [fields, setFields] = useState<SocialMediaField[]>([{ value: "" }]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const navigate = useNavigate();

  const addField = () => {
    const newField: SocialMediaField = {
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
    const socialMediaUrls = fields
      .map((field) => field.value.trim())
      .filter((url) => url.length > 0);

    if (socialMediaUrls.length === 0) {
      setSaveError("Please enter at least one social media URL");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await socialMediaService.addSocialMedia(socialMediaUrls);

      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
        setIsSaving(false);
        navigate("/builder");
      }, 2000);
    } catch (err) {
      setIsSaving(false);
      setSaveError(
        err instanceof Error ? err.message : "Failed to save social media"
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
              index === 0
                ? "Enter social media URL (e.g., https://twitter.com/username). Maximum 100 characters."
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
        typeSaved={
          fields.length > 1 ? "Social Media Links" : "Social Media Link"
        }
        onCloseError={() => setSaveError(null)}
      />
    </div>
  );
};
