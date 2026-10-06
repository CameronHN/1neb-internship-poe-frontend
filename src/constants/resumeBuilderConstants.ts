import { certificationService } from "../services/certificationService";
import { educationService } from "../services/educationService";
import { experienceService } from "../services/experienceService";
import { professionalLinkService } from "../services/professionalLinkService";
import { professionalSummaryService } from "../services/professionalSummaryService";
import { skillService } from "../services/skillService";
import { titleService } from "../services/titleService";

// Each key is the matching array on UserResumeDetailsResponse.
export type SectionKey =
  | "socials"
  | "title"
  | "summaries"
  | "skills"
  | "experience"
  | "education"
  | "certification";

export interface SectionConfig {
  key: SectionKey;
  title: string;
  tooltip?: string;
  addRoute: string;
  // The item id is appended: `${updateRoute}/${id}`.
  updateRoute: string;
  // Shown in the delete overlay ("Deleting <deleteLabel>...").
  deleteLabel: string;
  deleteItems: (ids: string[]) => Promise<void>;
  layout: { kind: "grid" | "stack"; gap: string; bordered: boolean };
}

// Display order on the page. Add routes are plural and update routes singular;
// both match the routes registered in App.tsx.
export const SECTIONS: SectionConfig[] = [
  {
    key: "socials",
    title: "Social Media - Select up to 2",
    tooltip:
      "It's recommended to have up to 2 social media links so to not overwhelm the resume.",
    addRoute: "/add-socials",
    updateRoute: "/update-social",
    deleteLabel: "social media",
    deleteItems: professionalLinkService.deleteProfessionalLink,
    layout: { kind: "grid", gap: "12px", bordered: false },
  },
  {
    key: "title",
    title: "Resume Titles - Select 1",
    addRoute: "/add-titles",
    updateRoute: "/update-title",
    deleteLabel: "titles",
    deleteItems: titleService.deleteTitles,
    layout: { kind: "stack", gap: "12px", bordered: false },
  },
  {
    key: "summaries",
    title: "Professional Summaries - Select 1",
    addRoute: "/add-summaries",
    updateRoute: "/update-summary",
    deleteLabel: "summaries",
    deleteItems: professionalSummaryService.deleteProfessionalSummaries,
    layout: { kind: "stack", gap: "16px", bordered: false },
  },
  {
    key: "skills",
    title: "Skills",
    addRoute: "/add-skills",
    updateRoute: "/update-skill",
    deleteLabel: "skills",
    deleteItems: skillService.deleteSkills,
    layout: { kind: "grid", gap: "12px", bordered: false },
  },
  {
    key: "experience",
    title: "Work Experience",
    addRoute: "/add-experiences",
    updateRoute: "/update-experience",
    deleteLabel: "experience",
    deleteItems: experienceService.deleteExperience,
    layout: { kind: "stack", gap: "16px", bordered: true },
  },
  {
    key: "education",
    title: "Education - Select up to 3",
    tooltip:
      "It's recommended to have up to 3 releveant education entries so to not overwhelm the resume.",
    addRoute: "/add-educations",
    updateRoute: "/update-education",
    deleteLabel: "education",
    deleteItems: educationService.deleteEducation,
    layout: { kind: "stack", gap: "16px", bordered: true },
  },
  {
    key: "certification",
    title: "Certifications",
    addRoute: "/add-certifications",
    updateRoute: "/update-certification",
    deleteLabel: "certifications",
    deleteItems: certificationService.deleteCertifications,
    layout: { kind: "stack", gap: "16px", bordered: true },
  },
];

export const SECTION_BY_KEY = Object.fromEntries(
  SECTIONS.map((section) => [section.key, section])
) as Record<SectionKey, SectionConfig>;

// Hard limits checked in this order before generating.
export const SELECTION_LIMITS: {
  section: SectionKey;
  max: number;
  message: string;
}[] = [
  {
    section: "socials",
    max: 2,
    message:
      "You can only select a maximum of 2 social media links for resume generation",
  },
  {
    section: "title",
    max: 1,
    message: "You can only select 1 resume title for resume generation",
  },
  {
    section: "summaries",
    max: 1,
    message:
      "You can only select 1 professional summary for resume generation",
  },
  {
    section: "education",
    max: 3,
    message:
      "You can only select a maximum of 3 education entries for resume generation",
  },
];

// Above this many selected items Generate is disabled (the tooltip calls it a recommendation).
export const MAX_SELECTED_ITEMS = 20;

// The API rejects a saved resume with more responsibilities than this in any one experience.
export const MAX_RESPONSIBILITIES_PER_EXPERIENCE = 20;
