import { API_URLS } from '../constants/apiConstants';
import type { UserResumeDetailsResponse, ResumeSelectionRequest } from '../types/resumeApiTypes';

class ResumeApiService {
  private baseUrl = API_URLS.API_BASE;

  async getUserResumeDetails(): Promise<UserResumeDetailsResponse> {
    const response = await fetch(`${this.baseUrl}/Resume/get-user-resume-details`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch resume details' }));
      throw new Error(error.message || 'Failed to fetch resume details');
    }

    return response.json();
  }

  async generateResume(selectionData: ResumeSelectionRequest): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/Resume/get-resume`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectionData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to generate resume' }));
      throw new Error(error.message || 'Failed to generate resume');
    }

    return response.blob();
  }
}

export const resumeApiService = new ResumeApiService();
export type { UserResumeDetailsResponse, ResumeSelectionRequest };