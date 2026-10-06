import { API_URLS } from "../constants/apiConstants";
import type { ResumeTitle } from "../types/resumeTitleTypes";

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

    /**
     * Add multiple resume title entries
     * @param titles Array of resume titles to add
     * @returns Promise<void>
     */
    async addTitles(titles: string[]): Promise<void> {
        if (!titles || titles.length === 0) {
            throw new Error("No titles provided");
        }

        const titleData = titles.map(url => ({ title: url }));

        const response = await fetch(
            `${API_URLS.API_BASE}/Title/add`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(titleData),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to add resume title entries");
        }
    }

    async getTitleById(id: string): Promise<string> {
        if (!id) {
            throw new Error("No title ID provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Title/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch title");
        }

        return await response.text();
    }

    async updateTitle(title: ResumeTitle): Promise<void> {
        if (!title) {
            throw new Error("No title provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Title/patch`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(title),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update title");
        }
    }
}

export const titleService = new TitleService();
