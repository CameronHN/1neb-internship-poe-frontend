import { API_URLS } from "../constants/apiConstants";

class TitleService {
    /**
     * Delete multiple titles by their IDs
     * @param titleIds Array of title IDs to delete
     * @returns Promise<void>
     */
    async deleteTitles(titleIds: string[]): Promise<void> {
        if (!titleIds || titleIds.length === 0) {
            throw new Error("No title IDs provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Title/delete`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(titleIds),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete titles");
        }
    }
}

export const titleService = new TitleService();
