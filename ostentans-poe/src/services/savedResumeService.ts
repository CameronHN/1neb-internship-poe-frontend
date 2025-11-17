import { API_URLS } from '../constants/apiConstants';
import type { SavedResumeListResponse, SaveResumeRequest } from '../types/savedResumeTypes';

class SavedResumeService {
    private baseUrl = API_URLS.API_BASE;

    async getSavedResumes(): Promise<SavedResumeListResponse> {
        const response = await fetch(`${this.baseUrl}/SavedResume/list`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to fetch saved resumes' }));
            throw new Error(error.message || 'Failed to fetch saved resumes');
        }

        return response.json();
    }

    async deleteSavedResume(id: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/SavedResume/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to delete resume' }));
            throw new Error(error.message || 'Failed to delete resume');
        }
    }

    async saveResume(saveData: SaveResumeRequest): Promise<void> {
        const response = await fetch(`${this.baseUrl}/SavedResume/save`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(saveData),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to save resume' }));
            throw new Error(error.message || 'Failed to save resume');
        }
    }

    async getSavedResumeById(resumeId: string): Promise<Blob> {
        const response = await fetch(`${this.baseUrl}/SavedResume/${resumeId}/pdf`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to fetch saved resume' }));
            throw new Error(error.message || 'Failed to fetch saved resume');
        }

        return response.blob();
    }
}

export const savedResumeService = new SavedResumeService();
export type { SavedResumeListResponse, SaveResumeRequest };