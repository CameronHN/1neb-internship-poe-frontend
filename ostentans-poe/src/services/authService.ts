import { API_URLS } from '../constants/apiConstants';

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
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
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
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        return response.json();
    }

    async logout(): Promise<AuthResponse> {
        const response = await fetch(`${this.baseUrl}/logout`, {
            method: 'POST',
            credentials: 'include',
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
            const error = await response.json();
            throw new Error(error.message || 'Password change failed');
        }

        return response.json();
    }
}

export const authService = new AuthService();
export type { RegisterRequest, LoginRequest, ChangePasswordRequest, AuthResponse };