import { describe, expect, it } from "vitest";
import { MAX_RESPONSIBILITIES_PER_EXPERIENCE } from "../constants/resumeBuilderConstants";
import { getResponsibilityLimitError } from "./resumeSelectionHelpers";
import type { ExperienceItem, UserResumeDetailsResponse } from "../types/resumeApiTypes";

const experience = (
  id: string,
  jobTitle: string,
  responsibilityCount: number,
): ExperienceItem => ({
  id,
  company: "Acme",
  jobTitle,
  startDate: "2020-01-01",
  endDate: "2021-01-01",
  responsibilities: Array.from({ length: responsibilityCount }, (_, i) => `Duty ${i + 1}`),
});

const resumeWith = (...items: ExperienceItem[]): UserResumeDetailsResponse => ({
  name: "Test Person",
  email: "test@example.com",
  phoneNumber: "0123456789",
  title: [],
  summaries: [],
  skills: [],
  socials: [],
  experience: items,
  education: [],
  certification: [],
});

describe("getResponsibilityLimitError", () => {
  const limit = MAX_RESPONSIBILITIES_PER_EXPERIENCE;

  it("is null when every selected experience is within the limit", () => {
    const data = resumeWith(experience("a", "Engineer", limit));
    expect(getResponsibilityLimitError(new Set(["a"]), data)).toBeNull();
  });

  it("names the selected experience that has too many responsibilities", () => {
    const data = resumeWith(experience("a", "Many duties", limit + 1));
    const message = getResponsibilityLimitError(new Set(["a"]), data);

    expect(message).toContain(`at most ${limit} responsibilities`);
    expect(message).toContain('"Many duties"');
    expect(message).toContain(`has ${limit + 1}`);
  });

  it("ignores an experience that is not selected", () => {
    const data = resumeWith(experience("a", "Many duties", limit + 1));
    expect(getResponsibilityLimitError(new Set(), data)).toBeNull();
  });

  it("is null before the resume data has loaded", () => {
    expect(getResponsibilityLimitError(new Set(["a"]), null)).toBeNull();
  });
});
