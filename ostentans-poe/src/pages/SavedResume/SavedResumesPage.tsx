import React, { useState, useEffect } from "react";
import { Text, Spinner, MessageBar, Title2 } from "@fluentui/react-components";
import { SavedResume } from "../../components/SavedResume";
import { savedResumeService } from "../../services/savedResumeService";
import type { SavedResumeItem } from "../../types/savedResumeTypes";
import { usePageTitle } from "../../hooks/usePageTitle";
import { downloadBlob } from "../../helpers/fileHelpers";

export const SavedResumesPage: React.FC = () => {
  usePageTitle({ title: "Saved Resumes" });

  const [resumes, setResumes] = useState<SavedResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSavedResumes();
  }, []);

  const loadSavedResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const resumeList = await savedResumeService.getSavedResumes();
      setResumes(resumeList);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load saved resumes"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await savedResumeService.deleteSavedResume(id);

      setResumes((prev) => prev.filter((resume) => resume.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete resume");
    }
  };

  const handleOpen = async (id: string) => {
    try {
      const blob = await savedResumeService.getSavedResumeById(id);

      const resume = resumes.find((r) => r.id === id);
      const filename = resume ? `${resume.name}.pdf` : `resume.pdf`;

      await downloadBlob(blob, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open resume");
    }
  };

  const pageStyle = {
    padding: "24px",
    maxWidth: "800px",
    margin: "0 auto",
    minHeight: "calc(100vh - 64px)",
  };

  const contentStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <Spinner size="large" label="Loading saved resumes..." />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "4rem 2rem", maxWidth: "60vw", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <Title2>Saved Resumes</Title2>
      </div>

      {error && (
        <MessageBar intent="error" style={{ marginBottom: "16px" }}>
          {error}
        </MessageBar>
      )}

      <div style={contentStyle}>
        {resumes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px" }}>
            <Text size={500}>
              No saved resumes found. Save a resume to see it here!
            </Text>
          </div>
        ) : (
          resumes.map((resume) => (
            <SavedResume
              key={resume.id}
              resume={resume}
              onDelete={handleDelete}
              onOpen={() => handleOpen(resume.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
