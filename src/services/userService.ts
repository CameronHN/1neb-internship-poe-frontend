import { API_URLS } from "../constants/apiConstants";
import { readApiError } from "../helpers/apiError";
import type { User } from "../types/userTypes";


class UserService {
    async getUserById(userId: string): Promise<User> {
        if (!userId) {
            throw new Error("No user ID provided");
        }

        const response = await fetch(`${API_URLS.API_BASE}/User?id=${userId}`, {
            credentials: "include",
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(await readApiError(response, "Failed to fetch user"));
        }

        return await response.json();
    }
}

export const userService = new UserService();