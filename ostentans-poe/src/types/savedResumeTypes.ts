export interface SavedResumeItem {
    id: string;
    name: string;
    templateType: string;
    createdAt: string;
    updatedAt: string;
}

export interface SaveResumeData {
    name: string;
    title: string;
    email: string;
    phoneNumber: string;
    summary: string;
    skills: Array<{
        skill: string;
        skillLevel: string;
    }>;
    professionalLinks: Array<{
        link: string;
        linkType: string;
    }>;
    experience: Array<{
        company: string;
        jobTitle: string;
        startDate: string;
        endDate: string;
        responsibilities: string[];
    }>;
    education: Array<{
        institution: string;
        qualification: string;
        startDate: string;
        endDate: string;
        major: string;
        achievement: string;
    }>;
    certification: Array<{
        name: string;
        organisation: string;
        credentialUrl: string;
        issuedDate: string;
        expirationDate: string;
    }>;
}

export interface SaveResumeRequest {
    savedResumeName: string;
    resumeData: SaveResumeData;
    templateType: string;
}

export type SavedResumeListResponse = SavedResumeItem[];