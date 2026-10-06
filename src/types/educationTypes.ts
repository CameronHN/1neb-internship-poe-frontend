export interface AddEducation {
    institutionName: string;
    qualification: string;
    startDate: string;
    endDate: string;
    major: string | null;
    achievement: string | null;
}

export interface Education {
    id: string;
    institutionName: string;
    qualification: string;
    startDate: string;
    endDate: string;
    major: string | null;
    achievement: string | null;
}