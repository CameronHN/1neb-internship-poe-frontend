import { useState } from "react";
import type { SectionKey } from "../constants/resumeBuilderConstants";
import type { UserResumeDetailsResponse } from "../types/resumeApiTypes";

// Holds the ids of the selected items across all sections, in the order they were selected.
export const useResumeSelection = (
  resumeData: UserResumeDetailsResponse | null
) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleItem = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  };

  const toggleSection = (section: SectionKey, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      resumeData?.[section]?.forEach(({ id }) => {
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });

      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  return {
    selectedIds,
    toggleItem,
    toggleSection,
    clearSelection,
  };
};
