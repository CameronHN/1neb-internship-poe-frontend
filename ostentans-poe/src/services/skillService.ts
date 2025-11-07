import { API_URLS } from "../constants/apiConstants";

class SkillService {
    /**
     * Delete multiple skills by their IDs
     * @param skillIds Array of skill IDs to delete
     * @returns Promise<void>
     */
    async deleteSkills(skillIds: string[]): Promise<void> {
        if (!skillIds || skillIds.length === 0) {
            throw new Error("No skill IDs provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Skill/delete`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(skillIds),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete skills");
        }
    }
}

export const skillService = new SkillService();
