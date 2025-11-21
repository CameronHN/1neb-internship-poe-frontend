export interface UserResumeDetail {
  id: string;
  title?: string;
  content?: string;
}

export interface SkillDetail extends UserResumeDetail {
  name: string;
  level: string;
}

export interface ExperienceDetail extends UserResumeDetail {
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string;
  isCurrentJob: boolean;
  responsibilities: string[];
}

export interface EducationDetail extends UserResumeDetail {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrentEducation: boolean;
  gpa?: string;
  achievements?: string[];
}

export interface CertificationDetail extends UserResumeDetail {
  name: string;
  issuingOrganization: string;
  dateIssued: string;
  expirationDate?: string;
  credentialId?: string;
}

export interface SocialMediaDetail extends UserResumeDetail {
  url: string;
  platform?: string;
}

export interface UserResumeDetailsResponse {
  basicInfo: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  professionalSummary: {
    id: string;
    content: string;
  };
  title: {
    id: string;
    content: string;
  };
  skills: SkillDetail[];
  experiences: ExperienceDetail[];
  education: EducationDetail[];
  certifications: CertificationDetail[];
  socialMedia: SocialMediaDetail[];
}

export interface ResumeSelectionRequest {
  titleId?: string;
  professionalSummaryId?: string;
  socialMediaIds?: {
    ids: string[];
    order: number;
  };
  experienceIds?: {
    ids: string[];
    order: number;
  };
  educationIds?: {
    ids: string[];
    order: number;
  };
  certificationIds?: {
    ids: string[];
    order: number;
  };
  skillsIds?: {
    ids: string[];
    order: number;
  };
}
