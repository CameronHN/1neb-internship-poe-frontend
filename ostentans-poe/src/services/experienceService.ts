import { API_URLS } from "../constants/apiConstants";
import type { AddExperience, Experience } from "../types/experienceTypes";

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

    async addExperience(experiences: AddExperience[]): Promise<void> {
        if (!experiences || experiences.length === 0) {
            throw new Error("No experiences provided");
        }

        // Transform experiences to the expected API format
        const expData = experiences.map(experience => ({
            jobTitle: experience.jobTitle,
            companyName: experience.companyName,
            startDate: experience.startDate,
            endDate: experience.endDate,
            responsibilities: experience.responsibilities
        }));

        const response = await fetch(
            `${API_URLS.API_BASE}/Experience/add`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(expData),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to add experiences");
        }
    }

    async getExperienceById(id: string): Promise<Experience> {
        if (!id) {
            throw new Error("No experience ID provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Experience/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch experience");
        }

        return await response.json();
    }

    async updateExperience(experience: Experience): Promise<void> {
        if (!experience) {
            throw new Error("No experience provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Experience/patch`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(experience),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update experience");
        }
    }
}

export const experienceService = new ExperienceService();
