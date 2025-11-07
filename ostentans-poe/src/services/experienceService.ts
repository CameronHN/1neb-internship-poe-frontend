import { API_URLS } from "../constants/apiConstants";

class ExperienceService {
    /**
     * Delete multiple experience entries by their IDs
     * @param experienceIds Array of experience IDs to delete
     * @returns Promise<void>
     */
    async deleteExperience(experienceIds: string[]): Promise<void> {
        if (!experienceIds || experienceIds.length === 0) {
            throw new Error("No experience IDs provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Experience/delete`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(experienceIds),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete experience entries");
        }
    }
}

export const experienceService = new ExperienceService();
