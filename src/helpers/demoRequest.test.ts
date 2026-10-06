import { describe, expect, it } from "vitest";
import { buildDemoRequest, createEmptyDemoForm } from "./demoRequest";
import type { ResumeData } from "../types/demoTypes";

const REQUEST_KEYS = [
  "certification",
  "education",
  "email",
  "experience",
  "name",
  "phoneNumber",
  "professionalLinks",
  "skills",
  "summary",
  "title",
];

// The page's initial form with the three required fields typed in.
const basicForm = (): ResumeData => ({
  ...createEmptyDemoForm(),
  name: "Test Person",
  email: "test@example.com",
  phoneNumber: "0123456789",
});

describe("buildDemoRequest", () => {
  it("T4.1 builds from the initial form without throwing and sends no empty rows", () => {
    const request = buildDemoRequest(createEmptyDemoForm());

    expect(request.professionalLinks).toEqual([]);
    expect(request.certification).toEqual([]);
    expect(request.experience).toEqual([]);
    expect(request.education).toEqual([]);
  });

  it("T4.2 sends exactly the keys the API binds", () => {
    const request = buildDemoRequest(basicForm());

    expect(Object.keys(request).sort()).toEqual(REQUEST_KEYS);
    expect(request).not.toHaveProperty("socials");
    expect(request).not.toHaveProperty("certifications");
  });

  it("T4.3 normalises a filled link and leaves the blank one out", () => {
    const form = basicForm();
    form.professionalLinks[0] = { link: "linkedin.com/in/me", linkType: "LinkedIn" };

    expect(buildDemoRequest(form).professionalLinks).toEqual([
      { link: "https://linkedin.com/in/me", linkType: "LinkedIn" },
    ]);
  });

  it("T4.4 leaves out a link that cannot be made clickable", () => {
    const form = basicForm();
    form.professionalLinks[0] = { link: "javascript:alert(1)", linkType: "XSS" };

    expect(buildDemoRequest(form).professionalLinks).toEqual([]);
  });

  it("T4.5 formats a date as Month YYYY", () => {
    // Mid-month: new Date("2024-09-01") is UTC midnight and can read as August behind UTC.
    const form = basicForm();
    form.experience[0] = {
      ...form.experience[0],
      jobTitle: "Engineer",
      startDate: "2024-09-15",
    };

    expect(buildDemoRequest(form).experience[0].startDate).toBe("September 2024");
  });

  it("T4.6 keeps a filled experience without dates and drops the blank one", () => {
    const form = basicForm();
    form.experience[0] = { ...form.experience[0], jobTitle: "Engineer" };

    const request = buildDemoRequest(form);

    expect(request.experience).toHaveLength(1);
    expect(request.experience[0]).toMatchObject({ startDate: "", endDate: "" });
    expect(JSON.stringify(request)).not.toContain("Invalid Date");
  });

  it("T4.7 leaves out blank responsibilities, nameless skills and incomplete certifications", () => {
    const form = basicForm();
    form.skills[0] = { skill: "TypeScript", skillLevel: "Expert" };
    form.skills[1] = { skill: "  ", skillLevel: "Beginner" };
    form.experience[0] = {
      ...form.experience[0],
      jobTitle: "Engineer",
      responsibilities: ["Built things", "   "],
    };
    form.certification[0] = {
      ...form.certification[0],
      name: "Cert without an organisation",
    };

    const request = buildDemoRequest(form);

    expect(request.skills).toEqual([{ skill: "TypeScript", skillLevel: "Expert" }]);
    expect(request.experience[0].responsibilities).toEqual(["Built things"]);
    expect(request.certification).toEqual([]);
  });

  it("T4.8 stays within the API's demo limits with every row filled to its maximum", () => {
    const text = (length: number) => "x".repeat(length);
    // A link at the input's 100-character maximum that normaliseLink leaves unchanged.
    const link = `https://example.com/${"a".repeat(80)}`;
    expect(link).toHaveLength(100);

    const form: ResumeData = {
      name: text(60),
      title: text(100),
      email: text(256),
      phoneNumber: text(15),
      summary: text(200),
      skills: Array.from({ length: 4 }, () => ({ skill: text(100), skillLevel: text(100) })),
      professionalLinks: Array.from({ length: 2 }, () => ({ link, linkType: text(100) })),
      experience: Array.from({ length: 2 }, () => ({
        company: text(100),
        jobTitle: text(100),
        startDate: "2024-09-15",
        endDate: "2025-09-15",
        responsibilities: [text(255), text(255)],
      })),
      education: Array.from({ length: 2 }, () => ({
        institution: text(100),
        qualification: text(100),
        startDate: "2020-03-15",
        endDate: "2023-11-15",
        major: text(100),
        achievement: text(100),
      })),
      certification: Array.from({ length: 2 }, () => ({
        name: text(100),
        organisation: text(100),
        credentialUrl: text(100),
        issuedDate: "2022-05-15",
        expirationDate: "2026-05-15",
      })),
    };

    const request = buildDemoRequest(form);

    expect(request.skills).toHaveLength(4);
    expect(request.professionalLinks).toHaveLength(2);
    expect(request.experience).toHaveLength(2);
    expect(request.experience.every((exp) => exp.responsibilities.length === 2)).toBe(true);
    expect(request.education).toHaveLength(2);
    expect(request.certification).toHaveLength(2);
    expect(new TextEncoder().encode(JSON.stringify(request)).length).toBeLessThan(32768);
  });
});
