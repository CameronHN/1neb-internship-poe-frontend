import {
  MAX_SELECTED_ITEMS,
  SELECTION_LIMITS,
  type SectionKey,
} from "../constants/resumeBuilderConstants";
import type { SaveResumeRequest } from "../types/savedResumeTypes";
import type {
  ItemListRequest,
  ResumeSelectionRequest,
  UserResumeDetailsResponse,
} from "../types/resumeApiTypes";

type SectionItem<K extends SectionKey> = UserResumeDetailsResponse[K][number];

export const isDefined = <T>(value: T | undefined): value is T =>
  value !== undefined;

// Resolves the selected item ids of a section to the items, in the order they were selected.
export const getSelectedItems = <K extends SectionKey>(
  selectedIds: Set<string>,
  section: K,
  resumeData: UserResumeDetailsResponse | null
): SectionItem<K>[] => {
  const items = (resumeData?.[section] ?? []) as SectionItem<K>[];

  return Array.from(selectedIds)
    .map((id) => items.find((item) => item.id === id))
    .filter(isDefined);
};

export const countSelected = (
  selectedIds: Set<string>,
  section: SectionKey,
  resumeData: UserResumeDetailsResponse | null
) => getSelectedItems(selectedIds, section, resumeData).length;

// The first limit that is exceeded, or null when the selection is within limits.
export const getSelectionLimitError = (
  selectedIds: Set<string>,
  resumeData: UserResumeDetailsResponse | null
) =>
  SELECTION_LIMITS.find(
    ({ section, max }) => countSelected(selectedIds, section, resumeData) > max
  )?.message ?? null;

export const canGenerate = (
  selectedIds: Set<string>,
  resumeData: UserResumeDetailsResponse | null
) =>
  selectedIds.size > 0 &&
  selectedIds.size <= MAX_SELECTED_ITEMS &&
  getSelectionLimitError(selectedIds, resumeData) === null;

export const buildResumeSelectionRequest = (
  selectedIds: Set<string>,
  resumeData: UserResumeDetailsResponse
): ResumeSelectionRequest => {
  const idsOf = (section: SectionKey) =>
    getSelectedItems(selectedIds, section, resumeData).map((item) => item.id);

  // Ordering is not implemented in the UI yet, so each list gets a fixed order.
  // TODO: Implement ordering feature in UI
  const list = (ids: string[], order: number): ItemListRequest => ({
    ids,
    order,
  });

  const request: ResumeSelectionRequest = {};

  // Single title and summary (take first if multiple selected)
  const titleIds = idsOf("title");
  const summaryIds = idsOf("summaries");
  const socialIds = idsOf("socials");
  const experienceIds = idsOf("experience");
  const educationIds = idsOf("education");
  const certificationIds = idsOf("certification");
  const skillIds = idsOf("skills");

  if (titleIds.length > 0) {
    request.titleId = titleIds[0];
  }
  if (summaryIds.length > 0) {
    request.professionalSummaryId = summaryIds[0];
  }
  if (socialIds.length > 0) {
    request.socialMediaIds = list(socialIds, 0);
  }
  // Hard setting order to descending (2)
  if (experienceIds.length > 0) {
    request.experienceIds = list(experienceIds, 2);
  }
  if (educationIds.length > 0) {
    request.educationIds = list(educationIds, 2);
  }
  if (certificationIds.length > 0) {
    request.certificationIds = list(certificationIds, 2);
  }
  if (skillIds.length > 0) {
    request.skillsIds = list(skillIds, 0);
  }

  return request;
};

// A saved resume is a snapshot of the selected items, not a list of ids.
export const buildSaveResumeRequest = (
  savedResumeName: string,
  selectedIds: Set<string>,
  resumeData: UserResumeDetailsResponse
): SaveResumeRequest => {
  const selected = <K extends SectionKey>(section: K) =>
    getSelectedItems(selectedIds, section, resumeData);

  return {
    savedResumeName: savedResumeName.trim(),
    resumeData: {
      name: resumeData.name,
      title: selected("title")[0]?.title || "",
      email: resumeData.email,
      phoneNumber: resumeData.phoneNumber,
      summary: selected("summaries")[0]?.summary || "",
      skills: selected("skills").map((skill) => ({
        skill: skill.skill,
        skillLevel: skill.skillLevel,
      })),
      professionalLinks: selected("socials").map((social) => ({
        link: social.socialMediaUrl,
        linkType: social.socialMediaType,
      })),
      experience: selected("experience").map((exp) => ({
        company: exp.company,
        jobTitle: exp.jobTitle,
        startDate: exp.startDate,
        endDate: exp.endDate,
        responsibilities: exp.responsibilities,
      })),
      education: selected("education").map((edu) => ({
        institution: edu.institution,
        qualification: edu.qualification,
        startDate: edu.startDate,
        endDate: edu.endDate,
        major: edu.major,
        achievement: edu.achievement,
      })),
      certification: selected("certification").map((cert) => ({
        name: cert.name,
        organisation: cert.organisation,
        credentialUrl: cert.credentialUrl || "",
        issuedDate: cert.issuedDate,
        expirationDate: cert.expirationDate,
      })),
    },
    templateType: "classic",
  };
};
