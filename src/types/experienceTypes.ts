export interface AddExperience {
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate: string;
    responsibilities: AddResponsibilities[];
}

interface AddResponsibilities {
    responsibility: string;
}

export interface Experience {
    id: string;
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate: string;
    responsibilities: Responsibilities[];
}

export interface UpdateExperience {
    id: string;
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate: string;
    responsibilities: Responsibilities[];
}
export interface Responsibilities {
    id: string;
    responsibility: string;
}
