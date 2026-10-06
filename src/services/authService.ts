import { API_URLS } from '../constants/apiConstants';
import { readApiError } from '../helpers/apiError';
import type { User } from '../types/userTypes';

interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

interface LoginRequest {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

interface AuthResponse {
    message: string;
    userId?: string;
}

class AuthService {
    private baseUrl = API_URLS.AUTH_BASE;

    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await fetch(`${this.baseUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Needed for cookie-based auth
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(await readApiError(response, 'Registration failed'));
        }

        return response.json();
    }

    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(await readApiError(response, 'Login failed'));
        }

        return response.json();
    }

    async logout(): Promise<AuthResponse> {
        // The API only accepts logout with a JSON body, so another site cannot log users out.
        const response = await fetch(`${this.baseUrl}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        return response.json();
    }

    async changePassword(data: ChangePasswordRequest): Promise<AuthResponse> {
        const response = await fetch(`${this.baseUrl}/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(await readApiError(response, 'Password change failed'));
        }

        return response.json();
    }

    async checkAuth(): Promise<User> {
        const response = await fetch(`${API_URLS.API_BASE}/auth/me`, {
            credentials: "include",
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Unauthenticated. Please log in again.");
        }

        return await response.json();
    }
}

export const authService = new AuthService();
export type { RegisterRequest, LoginRequest, ChangePasswordRequest, AuthResponse };