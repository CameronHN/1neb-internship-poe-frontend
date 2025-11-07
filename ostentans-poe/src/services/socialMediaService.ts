import { API_URLS } from "../constants/apiConstants";

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
}

export const socialMediaService = new SocialMediaService();