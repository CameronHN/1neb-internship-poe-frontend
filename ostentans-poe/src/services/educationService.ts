import { API_URLS } from "../constants/apiConstants";

class EducationService {
    /**
     * Delete multiple education entries by their IDs
     * @param educationIds Array of education IDs to delete
     * @returns Promise<void>
     */
    async deleteEducation(educationIds: string[]): Promise<void> {
        if (!educationIds || educationIds.length === 0) {
            throw new Error("No education IDs provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Education/delete`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(educationIds),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete education entries");
        }
    }
}

export const educationService = new EducationService();
