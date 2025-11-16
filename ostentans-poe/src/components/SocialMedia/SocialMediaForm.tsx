import React, { useState, useEffect } from "react";
import { Input, Button } from "@fluentui/react-components";
import { AddSquareRegular, DismissSquareRegular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { socialMediaService } from "../../services/socialMediaService";
import { SaveOverlay } from "../Overlays/SaveOverlay";
import type { Contact } from "../../types/socialMediaTypes";

interface SocialMediaField {
  contactUrl: string;
}

interface SocialMediaProps {
  mode: "add" | "update";
  contactId?: string;
  initialData?: Contact;
  onSaveSuccess?: () => void;
}

export const SocialMediaForm: React.FC<SocialMediaProps> = ({
  mode,
  contactId,
  initialData,
  onSaveSuccess,
}) => {
  const [fields, setFields] = useState<SocialMediaField[]>([
    { contactUrl: "" },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load data for update mode
  useEffect(() => {
    if (mode === "update" && contactId) {
      loadContactData();
    } else if (mode === "update" && initialData) {
      // Use provided initial data
      setFields([{ contactUrl: initialData.contactUrl }]);
    }
  }, [mode, contactId, initialData]);

  const loadContactData = async () => {
    if (!contactId) return;

    setIsLoading(true);
    try {
      const contact = await socialMediaService.getContactById(contactId);
      setFields([{ contactUrl: contact.contactUrl }]);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to load contact"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addField = () => {
    if (mode === "update") return;

    const newField: SocialMediaField = {
      contactUrl: "",
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
        i === index ? { ...field, contactUrl: value } : field
      )
    );
  };

  const handleSave = async () => {
    // Filter out empty fields
    const socialMediaUrls = fields
      .map((field) => field.contactUrl.trim())
      .filter((url) => url.length > 0);

    if (socialMediaUrls.length === 0) {
      setSaveError("Please enter at least one social media URL");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      if (mode === "add") {
        await socialMediaService.addSocialMedia(socialMediaUrls);
      } else if (mode === "update" && contactId) {
        const updateData: Contact = {
          id: contactId,
          contactUrl: socialMediaUrls[0],
        };
        await socialMediaService.updateContact(updateData);
      }

      setSaveSuccess(true);

      // Handle success callback or navigation
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
        err instanceof Error ? err.message : `Failed to ${mode} social media`
      );
    }
  };

  const handleDiscard = () => {
    if (mode === "update") {
      navigate("/builder");
    } else {
      setFields([{ contactUrl: "" }]);
    }
  };

  if (isLoading) {
    return <div>Loading contact data...</div>;
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
              index === 0
                ? "Enter social media URL (e.g., https://twitter.com/username). Maximum 100 characters."
                : ""
            }
            value={field.contactUrl}
            onChange={(_, data) => updateField(index, data.value)}
            maxLength={100}
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
            ? "Social Media Link"
            : fields.length > 1
            ? "Social Media Links"
            : "Social Media Link"
        }
        onCloseError={() => setSaveError(null)}
      />
    </div>
  );
};
