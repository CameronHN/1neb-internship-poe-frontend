import { API_URLS } from "../constants/apiConstants";
import type { Contact } from "../types/socialMediaTypes";

class SocialMediaService {
    /**
     * Delete multiple social media entries by their IDs
     * @param socialMediaIds Array of social media IDs to delete
     * @returns Promise<void>
     */
    async deleteSocialMedia(socialMediaIds: string[]): Promise<void> {
        if (!socialMediaIds || socialMediaIds.length === 0) {
            throw new Error("No social media IDs provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Contact/delete`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(socialMediaIds),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete social media entries");
        }
    }

    /**
     * Add multiple social media entries
     * @param socialMediaUrls Array of social media URLs to add
     * @returns Promise<void>
     */
    async addSocialMedia(socialMediaUrls: string[]): Promise<void> {
        if (!socialMediaUrls || socialMediaUrls.length === 0) {
            throw new Error("No social media URLs provided");
        }

        // Transform the URLs into the expected format
        const socialMediaData = socialMediaUrls.map(url => ({ social: url }));

        const response = await fetch(
            `${API_URLS.API_BASE}/Contact/add`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(socialMediaData),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to add social media entries");
        }
    }

    async getContactById(id: string): Promise<Contact> {
        if (!id) {
            throw new Error("No contact ID provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Contact/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch contact");
        }

        return await response.json();
    }

    async updateContact(contact: Contact): Promise<void> {
        if (!contact) {
            throw new Error("No contact provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Contact/patch`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(contact),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update contact");
        }
    }
}

export const socialMediaService = new SocialMediaService();