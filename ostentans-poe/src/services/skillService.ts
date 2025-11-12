import { API_URLS } from "../constants/apiConstants";
import type { Skill } from "../types/skillTypes";

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

    async addSkills(skills: Skill[]): Promise<void> {
        if (!skills || skills.length === 0) {
            throw new Error("No skills provided");
        }

        // Transform skills to the expected API format
        const skillData = skills.map(skill => ({
            skill: skill.skill,
            proficiencyLevel: skill.proficiencyLevel
        }));

        const response = await fetch(
            `${API_URLS.API_BASE}/Skill/add`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(skillData),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to add skills");
        }
    }
}

export const skillService = new SkillService();
