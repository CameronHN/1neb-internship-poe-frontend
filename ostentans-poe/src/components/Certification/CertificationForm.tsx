import React, { useState, useEffect } from "react";
import { Input, Button, Label } from "@fluentui/react-components";
import { AddSquareRegular, DismissSquareRegular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { certificationService } from "../../services/certificationService";
import { SaveOverlay } from "../Overlays/SaveOverlay";
import type {
  AddCertification,
  UpdateCertification,
} from "../../types/certificationTypes";

interface CertificationFormProps {
  mode: "add" | "update";
  certificationId?: string;
  initialData?: UpdateCertification;
  onSaveSuccess?: () => void;
}

export const CertificationForm: React.FC<CertificationFormProps> = ({
  mode,
  certificationId,
  initialData,
  onSaveSuccess,
}) => {
  const [fields, setFields] = useState<AddCertification[]>([
    {
      certificationName: "",
      issuingOrganisation: "",
      credentialUrl: null,
      issuedDate: null,
      expiryDate: null,
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load data for update mode
  useEffect(() => {
    if (mode === "update" && certificationId) {
      loadCertificationData();
    } else if (mode === "update" && initialData) {
      setFields([
        {
          certificationName: initialData.certificationName,
          issuingOrganisation: initialData.issuingOrganisation,
          credentialUrl: initialData.credentialUrl,
          issuedDate: initialData.issuedDate,
          expiryDate: initialData.expiryDate,
        },
      ]);
    }
  }, [mode, certificationId, initialData]);

  const loadCertificationData = async () => {
    if (!certificationId) return;

    setIsLoading(true);
    try {
      const certification = await certificationService.getCertificationById(
        certificationId
      );
      setFields([
        {
          certificationName: certification.certificationName,
          issuingOrganisation: certification.issuingOrganisation,
          credentialUrl: certification.credentialUrl,
          issuedDate: certification.issuedDate,
          expiryDate: certification.expiryDate,
        },
      ]);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to load certification"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addField = () => {
    if (mode === "update") return;

    const newField: AddCertification = {
      certificationName: "",
      issuingOrganisation: "",
      credentialUrl: "",
      issuedDate: "",
      expiryDate: "",
    };
    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    if (mode === "update" || fields.length === 1) return;

    setFields(fields.filter((_, i) => i !== index));
  };

  // Update functions
  const updateCertificationName = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, certificationName: value } : field
      )
    );
  };

  const updateIssuingOrganisation = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, issuingOrganisation: value } : field
      )
    );
  };

  const updateCredentialUrl = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, credentialUrl: value } : field
      )
    );
  };

  const updateIssueDate = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, issuedDate: value } : field
      )
    );
  };

  const updateExpiryDate = (index: number, value: string) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, expiryDate: value } : field
      )
    );
  };

  const handleSave = async () => {
    const validCertifications = fields
      .filter(
        (field) =>
          field.certificationName.trim().length > 0 &&
          field.issuingOrganisation.trim().length > 0
      )
      .map((field) => ({
        ...field,
        credentialUrl: field.credentialUrl?.trim() || null,
        issuedDate: field.issuedDate?.trim() || null,
        expiryDate: field.expiryDate?.trim() || null,
      }));

    if (validCertifications.length === 0) {
      setSaveError(
        "Please enter at least one certification with both name and organisation"
      );
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      if (mode === "add") {
        await certificationService.addCertifications(validCertifications);
      } else if (mode === "update" && certificationId) {
        const updateData: UpdateCertification = {
          id: certificationId,
          ...validCertifications[0],
        };
        await certificationService.updateCertification(updateData);
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
        err instanceof Error
          ? err.message
          : `Failed to ${mode} certification(s)`
      );
    }
  };

  const handleDiscard = () => {
    if (mode === "update") {
      navigate("/builder");
    } else {
      setFields([
        {
          certificationName: "",
          issuingOrganisation: "",
          credentialUrl: "",
          issuedDate: "",
          expiryDate: "",
        },
      ]);
    }
  };

  if (isLoading) {
    return <div>Loading certification data...</div>;
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
        <React.Fragment key={index}>
          <div style={fieldStyle}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Label required>Certification Name:</Label>
              <Input
                placeholder={
                  index === 0
                    ? "Enter certification name (e.g., AWS Certified Solutions Architect)"
                    : ""
                }
                value={field.certificationName}
                onChange={(_, data) =>
                  updateCertificationName(index, data.value)
                }
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Label required>Issuing Organisation:</Label>
              <Input
                style={layoutStyle}
                placeholder={
                  index === 0
                    ? "Enter issuing organisation (e.g., Amazon Web Services)"
                    : ""
                }
                value={field.issuingOrganisation}
                onChange={(_, data) =>
                  updateIssuingOrganisation(index, data.value)
                }
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Label>URL:</Label>
              <Input
                style={layoutStyle}
                placeholder={
                  index === 0 ? "Enter URL (e.g., https://www.example.com)" : ""
                }
                value={field.credentialUrl || ""}
                onChange={(_, data) => updateCredentialUrl(index, data.value)}
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Label>Issue Date:</Label>
              <Input
                type="date"
                style={layoutStyle}
                value={field.issuedDate || ""}
                onChange={(_, data) => updateIssueDate(index, data.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Label>Expiry Date:</Label>
              <Input
                type="date"
                style={layoutStyle}
                value={field.expiryDate || ""}
                onChange={(_, data) => updateExpiryDate(index, data.value)}
              />
            </div>

            {/* Only show add/remove buttons in add mode */}
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

          {/* Horizontal Rule to separate multiple certification entries */}
          {mode === "add" && fields.length > 1 && index < fields.length - 1 && (
            <hr
              style={{
                border: "none",
                borderTop: "1px solid #0000006c",
                margin: "24px 0",
              }}
            />
          )}
        </React.Fragment>
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
            ? "Certification"
            : fields.length > 1
            ? "Certifications"
            : "Certification"
        }
        onCloseError={() => setSaveError(null)}
      />
    </div>
  );
};
