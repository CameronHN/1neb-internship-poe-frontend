import { API_URLS } from "../constants/apiConstants";
import type { Experience } from "../types/experienceTypes";

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

    async addExperience(experiences: Experience[]): Promise<void> {
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
}

export const experienceService = new ExperienceService();
