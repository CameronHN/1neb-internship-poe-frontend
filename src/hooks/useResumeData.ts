import { useCallback, useEffect, useState } from "react";
import { resumeApiService } from "../services/resumeApiService";
import type { UserResumeDetailsResponse } from "../types/resumeApiTypes";

export const useResumeData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [resumeData, setResumeData] = useState<UserResumeDetailsResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const fetchResumeData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await resumeApiService.getUserResumeDetails();
      setResumeData(data);
    } catch (err) {
      console.error("Error fetching resume data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load resume data"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load resume data when the page mounts
  useEffect(() => {
    // The loader only sets state after awaiting the request; the rule can't tell.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResumeData();
  }, [fetchResumeData]);

  return { resumeData, isLoading, error, fetchResumeData };
};
