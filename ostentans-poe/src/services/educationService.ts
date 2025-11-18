import { API_URLS } from "../constants/apiConstants";
import type { AddEducation, Education } from "../types/educationTypes";

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

    async addEducations(educations: AddEducation[]): Promise<void> {
        if (!educations || educations.length === 0) {
            throw new Error("No educations provided");
        }

        // Transform educations to the expected API format
        const eduData = educations.map(education => ({
            qualification: education.qualification,
            institutionName: education.institutionName,
            startDate: education.startDate,
            endDate: education.endDate,
            major: education.major,
            achievement: education.achievement
        }));

        const response = await fetch(
            `${API_URLS.API_BASE}/Education/add`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(eduData),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to add educations");
        }
    }

    async getEducationById(id: string): Promise<Education> {
        if (!id) {
            throw new Error("No education ID provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Education/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch education");
        }

        return await response.json();
    }

    async updateEducation(education: Education): Promise<void> {
        if (!education) {
            throw new Error("No education provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Education/patch`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(education),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update education");
        }
    }
}

export const educationService = new EducationService();
