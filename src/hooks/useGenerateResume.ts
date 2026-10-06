import { useState } from "react";
import { downloadBlob } from "../helpers/fileHelpers";
import {
  buildResumeSelectionRequest,
  getSelectionLimitError,
} from "../helpers/resumeSelectionHelpers";
import { resumeApiService } from "../services/resumeApiService";
import type { UserResumeDetailsResponse } from "../types/resumeApiTypes";

export interface BuilderMessage {
  text: string;
  intent: "success" | "warning" | "error";
}

const RESUME_FILENAME = "resume.pdf";

export const useGenerateResume = (
  selectedIds: Set<string>,
  resumeData: UserResumeDetailsResponse | null
) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [message, setMessage] = useState<BuilderMessage | null>(null);

  const clearMessage = () => setMessage(null);

  const generateResume = async () => {
    if (!resumeData) return;

    if (selectedIds.size === 0) {
      setMessage({ text: "Please select at least one item", intent: "warning" });
      return;
    }

    const limitError = getSelectionLimitError(selectedIds, resumeData);
    if (limitError) {
      setMessage({ text: limitError, intent: "warning" });
      return;
    }

    setIsGenerating(true);
    setMessage(null);

    try {
      const blob = await resumeApiService.generateResume(
        buildResumeSelectionRequest(selectedIds, resumeData)
      );

      await downloadBlob(blob, RESUME_FILENAME);

      setMessage({
        text: `Resume downloaded successfully as ${RESUME_FILENAME}!`,
        intent: "success",
      });
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : "Failed to generate resume",
        intent: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, message, clearMessage, generateResume };
};
