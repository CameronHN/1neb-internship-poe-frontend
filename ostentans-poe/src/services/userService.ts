import { API_URLS } from "../constants/apiConstants";
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
            throw new Error("Failed to fetch user");
        }

        return await response.json();
    }
}

export const userService = new UserService();