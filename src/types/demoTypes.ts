// The demo resume sent to POST /api/Resume/create-pdf. The API's DemoResumeLimits cap each list.
export interface Skill {
  skill: string;
  skillLevel: string;
}

export interface ProfessionalLink {
  link: string;
  linkType: string;
}

export interface Experience {
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

export interface Education {
  institution: string;
  qualification: string;
  startDate: string;
  endDate: string;
  major: string;
  achievement: string;
}

export interface Certification {
  name: string;
  organisation: string;
  credentialUrl: string;
  issuedDate: string;
  expirationDate: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phoneNumber: string;
  summary: string;
  skills: Skill[];
  professionalLinks: ProfessionalLink[];
  experience: Experience[];
  education: Education[];
  certification: Certification[];
}
