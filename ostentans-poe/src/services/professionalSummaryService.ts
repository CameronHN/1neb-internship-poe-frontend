import { API_URLS } from "../constants/apiConstants";

class ProfessionalSummaryService {
    /**
     * Delete multiple professional summaries by their IDs
     * @param summaryIds Array of professional summary IDs to delete
     * @returns Promise<void>
     */
    async deleteProfessionalSummaries(summaryIds: string[]): Promise<void> {
        if (!summaryIds || summaryIds.length === 0) {
            throw new Error("No professional summary IDs provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/ProfessionalSummary/delete`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(summaryIds),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete professional summaries");
        }
    }

    /**
     * Add multiple professional summary entries
     * @param summaries Array of professional summaries to add
     * @returns Promise<void>
     */
    async addSummaries(summaries: string[]): Promise<void> {
        if (!summaries || summaries.length === 0) {
            throw new Error("No summaries provided");
        }

        const summaryData = summaries.map(summary => ({ summary }));

        const response = await fetch(
            `${API_URLS.API_BASE}/ProfessionalSummary/add`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(summaryData),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to add professional summary entries");
        }
    }
}

export const professionalSummaryService = new ProfessionalSummaryService();
