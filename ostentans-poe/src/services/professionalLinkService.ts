import { API_URLS } from "../constants/apiConstants";
import type { AddProfessionalLink, ProfessionalLink } from "../types/professionalLinkTypes";

class ProfessionalLinkService {
    /**
     * Delete multiple professional links entries by their IDs
     * @param professionalLinkIds Array of professional links IDs to delete
     * @returns Promise<void>
     */
    async deleteProfessionalLink(professionalLinkIds: string[]): Promise<void> {
        if (!professionalLinkIds || professionalLinkIds.length === 0) {
            throw new Error("No professional links IDs provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/ProfessionalLink/delete`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(professionalLinkIds),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete professional links entries");
        }
    }

    /**
     * Add multiple professional links entries
     * @param professionalLinks Array of professional links URLs to add
     * @returns Promise<void>
     */
    async addProfessionalLink(professionalLinks: AddProfessionalLink[]): Promise<void> {
        if (!professionalLinks || professionalLinks.length === 0) {
            throw new Error("No professional links URLs provided");
        }

        // Transform the URLs into the expected format
        const professionalLinkData = professionalLinks.map(link => ({
            linkType: link.linkType, link: link.link
        }));

        const response = await fetch(
            `${API_URLS.API_BASE}/ProfessionalLink/add`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(professionalLinkData),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to add professional links entries");
        }
    }

    async getProfessionalLinkById(id: string): Promise<ProfessionalLink> {
        if (!id) {
            throw new Error("No professional link ID provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/ProfessionalLink/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch professional link");
        }

        return await response.json();
    }

    async updateProfessionalLink(professionalLink: ProfessionalLink): Promise<void> {
        if (!professionalLink) {
            throw new Error("No professional link provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/ProfessionalLink/patch`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(professionalLink),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update professional link");
        }
    }
}

export const professionalLinkService = new ProfessionalLinkService();