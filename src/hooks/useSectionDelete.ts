import { useEffect, useRef, useState } from "react";
import {
  SECTION_BY_KEY,
  type SectionKey,
} from "../constants/resumeBuilderConstants";
import { getSelectedItems } from "../helpers/resumeSelectionHelpers";
import type { UserResumeDetailsResponse } from "../types/resumeApiTypes";

// How long the success state shows before the data is refetched.
const SUCCESS_DISPLAY_MS = 2000;

export const useSectionDelete = (
  resumeData: UserResumeDetailsResponse | null,
  selectedIds: Set<string>,
  onDeleted: () => Promise<void>
) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [currentDeleteType, setCurrentDeleteType] = useState<string>("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const deleteSelected = async (section: SectionKey) => {
    if (!resumeData) return;

    const { deleteItems, deleteLabel } = SECTION_BY_KEY[section];
    const itemIds = getSelectedItems(selectedIds, section, resumeData).map(
      (item) => item.id
    );

    if (itemIds.length === 0) return;

    setIsDeleting(true);
    setDeleteError(null);
    setCurrentDeleteType(deleteLabel);

    try {
      await deleteItems(itemIds);

      setDeleteSuccess(true);
      // Show success for 2 seconds, then refetch data
      timeoutRef.current = setTimeout(async () => {
        setDeleteSuccess(false);
        setIsDeleting(false);
        setCurrentDeleteType("");
        await onDeleted();
      }, SUCCESS_DISPLAY_MS);
    } catch (err) {
      setIsDeleting(false);
      setCurrentDeleteType("");
      setDeleteError(
        err instanceof Error ? err.message : `Failed to delete ${deleteLabel}`
      );
    }
  };

  const closeDeleteError = () => setDeleteError(null);

  return {
    isDeleting,
    deleteSuccess,
    deleteError,
    currentDeleteType,
    deleteSelected,
    closeDeleteError,
  };
};
