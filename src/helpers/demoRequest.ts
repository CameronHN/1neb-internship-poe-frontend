import { normaliseLink } from "./linkHelpers";
import type { ResumeData } from "../types/demoTypes";

// The fixed number of rows the demo page shows for each list.
const SKILL_ROWS = 4;
const LINK_ROWS = 2;
const EXPERIENCE_ROWS = 2;
const RESPONSIBILITY_ROWS = 2;
const EDUCATION_ROWS = 2;
const CERTIFICATION_ROWS = 2;

/** The demo form as the page first shows it: every row blank. */
export function createEmptyDemoForm(): ResumeData {
  const rows = <T>(count: number, row: () => T): T[] =>
    Array.from({ length: count }, row);

  return {
    name: "",
    title: "",
    email: "",
    phoneNumber: "",
    summary: "",
    skills: rows(SKILL_ROWS, () => ({ skill: "", skillLevel: "" })),
    professionalLinks: rows(LINK_ROWS, () => ({ link: "", linkType: "" })),
    experience: rows(EXPERIENCE_ROWS, () => ({
      company: "",
      jobTitle: "",
      startDate: "",
      endDate: "",
      responsibilities: rows(RESPONSIBILITY_ROWS, () => ""),
    })),
    education: rows(EDUCATION_ROWS, () => ({
      institution: "",
      qualification: "",
      startDate: "",
      endDate: "",
      major: "",
      achievement: "",
    })),
    certification: rows(CERTIFICATION_ROWS, () => ({
      name: "",
      organisation: "",
      credentialUrl: "",
      issuedDate: "",
      expirationDate: "",
    })),
  };
}

/** "2024-09-15" becomes "September 2024". An empty or invalid date becomes "". */
function formatDate(date: string): string {
  if (!date.trim()) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

/** The exact object the demo page sends to the API: filled rows only, links and dates cleaned. */
export function buildDemoRequest(formData: ResumeData): ResumeData {
  return {
    name: formData.name,
    title: formData.title,
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    summary: formData.summary,
    skills: formData.skills.filter((skill) => skill.skill.trim()),
    // The API ignores a link it cannot make clickable, so drop what normaliseLink rejects.
    professionalLinks: formData.professionalLinks
      .filter((social) => social.link.trim())
      .flatMap((social) => {
        const link = normaliseLink(social.link);
        return link ? [{ ...social, link }] : [];
      }),
    experience: formData.experience
      .filter((exp) => exp.jobTitle.trim())
      .map((exp) => ({
        ...exp,
        startDate: formatDate(exp.startDate),
        endDate: formatDate(exp.endDate),
        responsibilities: exp.responsibilities.filter((resp) => resp.trim()),
      })),
    education: formData.education
      .filter((edu) => edu.institution.trim() && edu.qualification.trim())
      .map((edu) => ({
        ...edu,
        startDate: formatDate(edu.startDate),
        endDate: formatDate(edu.endDate),
      })),
    certification: formData.certification
      .filter((cert) => cert.name.trim() && cert.organisation.trim())
      .map((cert) => ({
        ...cert,
        issuedDate: formatDate(cert.issuedDate),
        expirationDate: formatDate(cert.expirationDate),
      })),
  };
}
