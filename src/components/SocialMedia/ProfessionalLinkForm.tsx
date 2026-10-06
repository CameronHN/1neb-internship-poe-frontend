import React, { useState, useEffect, useCallback } from "react";
import { Input, Button } from "@fluentui/react-components";
import { AddSquareRegular, DismissSquareRegular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { professionalLinkService } from "../../services/professionalLinkService";
import { SaveOverlay } from "../Overlays/SaveOverlay";
import type {
  AddProfessionalLink,
  ProfessionalLink,
} from "../../types/professionalLinkTypes";

interface ProfessionalLinkProps {
  mode: "add" | "update";
  contactId?: string;
  initialData?: ProfessionalLink;
  onSaveSuccess?: () => void;
}

export const ProfessionalLinkForm: React.FC<ProfessionalLinkProps> = ({
  mode,
  contactId,
  initialData,
  onSaveSuccess,
}) => {
  const [fields, setFields] = useState<AddProfessionalLink[]>([
    { linkType: "", link: "" },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadContactData = useCallback(async () => {
    if (!contactId) return;

    setIsLoading(true);
    try {
      const contact = await professionalLinkService.getProfessionalLinkById(
        contactId
      );
      setFields([
        {
          link: contact.link,
          linkType: contact.linkType,
        },
      ]);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to load contact"
      );
    } finally {
      setIsLoading(false);
    }
  }, [contactId]);

  // Load data for update mode
  useEffect(() => {
    if (mode === "update" && contactId) {
      loadContactData();
    } else if (mode === "update" && initialData) {
      // Use provided initial data
      setFields([{ link: initialData.link, linkType: initialData.linkType }]);
    }
  }, [mode, contactId, initialData, loadContactData]);

  const addField = () => {
    if (mode === "update") return;

    const newField: AddProfessionalLink = {
      linkType: "",
      link: "",
    };
    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    if (mode === "update" || fields.length === 1) return;

    setFields(fields.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, link: value } : field
      )
    );
  };

  const updateLinkType = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, linkType: value } : field
      )
    );
  };

  const handleSave = async () => {
    // Filter out empty fields
    const validProfessionalLinks = fields.filter(
      (field) => field.link.trim().length > 0
    );

    if (validProfessionalLinks.length === 0) {
      setSaveError("Please enter at least one social media URL");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      if (mode === "add") {
        await professionalLinkService.addProfessionalLink(
          validProfessionalLinks
        );
      } else if (mode === "update" && contactId) {
        const updateData: ProfessionalLink = {
          id: contactId,
          link: validProfessionalLinks[0].link,
          linkType: validProfessionalLinks[0].linkType,
        };
        await professionalLinkService.updateProfessionalLink(updateData);
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
      setFields([{ link: "", linkType: "" }]);
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
                ? "Enter social media URL (e.g., https://twitter.com/username)"
                : ""
            }
            value={field.link}
            onChange={(_, data) => updateLink(index, data.value)}
            maxLength={100}
          />
          <Input
            style={layoutStyle}
            placeholder={
              index === 0 ? "Enter platform type (e.g., LinkedIn, Twitter)" : ""
            }
            value={field.linkType}
            onChange={(_, data) => updateLinkType(index, data.value)}
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
