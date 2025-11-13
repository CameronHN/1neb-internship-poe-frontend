import React, { useState } from "react";
import { Input, Button, Label } from "@fluentui/react-components";
import { AddSquareRegular, DismissSquareRegular } from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { certificationService } from "../../services/certificationService";
import { SaveOverlay } from "../Overlays/SaveOverlay";
import type { Certification } from "../../types/certificationTypes";

export const AddCertificationForm: React.FC = () => {
  const [fields, setFields] = useState<Certification[]>([
    {
      certificationName: "",
      issuingOrganisation: "",
      credentialUrl: "",
      issuedDate: "",
      expiryDate: "",
    },
  ]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const navigate = useNavigate();

  const addField = () => {
    const newField: Certification = {
      certificationName: "",
      issuingOrganisation: "",
      credentialUrl: "",
      issuedDate: "",
      expiryDate: "",
    };
    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

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
    // Filter out empty fields and convert empty optional fields to null
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
      await certificationService.addCertifications(validCertifications);

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
        err instanceof Error ? err.message : "Failed to save certifications"
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
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

          {/* Horizonal Rule to separate multiple certifications entries */}
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
                certificationName: "",
                issuingOrganisation: "",
                credentialUrl: "",
                issuedDate: "",
                expiryDate: "",
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
        typeSaved={fields.length > 1 ? "Certifications" : "Certification"}
        onCloseError={() => setSaveError(null)}
      />
    </div>
  );
};
