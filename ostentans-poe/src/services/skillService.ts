import { API_URLS } from "../constants/apiConstants";
import type { AddSkill, Skill } from "../types/skillTypes";

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

    async addSkills(skills: AddSkill[]): Promise<void> {
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

    async getSkillById(id: string): Promise<Skill> {
        if (!id) {
            throw new Error("No skill ID provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Skill/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch skill");
        }

        return await response.json();
    }

    async updateSkill(skill: Skill): Promise<void> {
        if (!skill) {
            throw new Error("No skill provided");
        }

        // Transform skills to the expected API format
        const skillData = ({
            id: skill.id,
            skill: skill.skillName,
            proficiencyLevel: skill.proficiencyLevel
        });

        const response = await fetch(
            `${API_URLS.API_BASE}/Skill/patch`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(skillData),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update skill");
        }
    }
}

export const skillService = new SkillService();
