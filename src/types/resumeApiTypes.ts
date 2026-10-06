// Mirrors Portfolio.Core.DTOs.Resume.GetAllResumeDetails in the backend API.
export interface TitleItem {
  id: string;
  title: string;
}

export interface SummaryItem {
  id: string;
  summary: string;
}

export interface SocialMediaItem {
  id: string;
  socialMediaType: string;
  socialMediaUrl: string;
}

export interface SkillItem {
  id: string;
  skill: string;
  skillLevel: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  qualification: string;
  startDate: string;
  endDate: string;
  major: string;
  achievement: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  organisation: string;
  credentialUrl: string;
  issuedDate: string;
  expirationDate: string;
}

export interface UserResumeDetailsResponse {
  name: string;
  email: string;
  phoneNumber: string;
  title: TitleItem[];
  summaries: SummaryItem[];
  skills: SkillItem[];
  socials: SocialMediaItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certification: CertificationItem[];
}

export interface ItemListRequest {
  ids: string[];
  order: number;
}

// Mirrors Portfolio.Core.DTOs.Resume.ResumeRequest in the backend API.
export interface ResumeSelectionRequest {
  titleId?: string;
  professionalSummaryId?: string;
  socialMediaIds?: ItemListRequest;
  experienceIds?: ItemListRequest;
  educationIds?: ItemListRequest;
  certificationIds?: ItemListRequest;
  skillsIds?: ItemListRequest;
}
