import { useEffect, useRef, useState } from "react";
import {
  buildSaveResumeRequest,
  getResponsibilityLimitError,
} from "../helpers/resumeSelectionHelpers";
import { savedResumeService } from "../services/savedResumeService";
import type { UserResumeDetailsResponse } from "../types/resumeApiTypes";

// How long the success state shows before the form resets.
const SUCCESS_DISPLAY_MS = 2000;

export const useSaveResume = (
  resumeData: UserResumeDetailsResponse | null,
  selectedIds: Set<string>
) => {
  const [savedResumeName, setSavedResumeName] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const saveResume = async () => {
    if (!savedResumeName.trim()) {
      setSaveError("Please enter a name for your resume");
      return;
    }

    if (selectedIds.size === 0) {
      setSaveError("Please select at least one item to save");
      return;
    }

    if (!resumeData) {
      setSaveError("Resume details have not loaded yet");
      return;
    }

    // Checked here so the user gets a clear message instead of the API's 400.
    const responsibilityError = getResponsibilityLimitError(
      selectedIds,
      resumeData
    );
    if (responsibilityError) {
      setSaveError(responsibilityError);
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await savedResumeService.saveResume(
        buildSaveResumeRequest(savedResumeName, selectedIds, resumeData)
      );

      setSaveSuccess(true);
      // Show success for 2 seconds, then reset the form
      timeoutRef.current = setTimeout(() => {
        setSaveSuccess(false);
        setIsSaving(false);
        setSavedResumeName("");
      }, SUCCESS_DISPLAY_MS);
    } catch (err) {
      setIsSaving(false);
      setSaveError(
        err instanceof Error ? err.message : "Failed to save resume"
      );
    }
  };

  const closeSaveError = () => setSaveError(null);

  return {
    savedResumeName,
    setSavedResumeName,
    isSaving,
    saveSuccess,
    saveError,
    saveResume,
    closeSaveError,
  };
};
