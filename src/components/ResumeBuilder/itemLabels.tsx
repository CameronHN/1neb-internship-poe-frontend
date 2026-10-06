import {
  itemHeadingStyle,
  summaryTextStyle,
} from "../../styles/constants/builderStyling";
import { subInformationStyle } from "../../styles/constants/textStyling";
import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  SummaryItem,
} from "../../types/resumeApiTypes";
import { ResponsibilitiesAccordion } from "./ResponsibilitiesAccordion";

export const SummaryLabel = ({ summary }: { summary: SummaryItem }) => (
  <div style={summaryTextStyle}>{summary.summary}</div>
);

export const ExperienceLabel = ({
  experience,
  index,
}: {
  experience: ExperienceItem;
  index: number;
}) => (
  <div style={{ width: "100%" }}>
    <div style={itemHeadingStyle}>
      {experience.jobTitle}
      {experience.company && ` at ${experience.company}`}
    </div>
    <div style={subInformationStyle}>
      {experience.startDate} - {experience.endDate}
    </div>
    <div style={{ marginTop: "8px" }}>
      <ResponsibilitiesAccordion
        responsibilities={experience.responsibilities}
        value={`responsibilities-${index}`}
      />
    </div>
  </div>
);

export const EducationLabel = ({ education }: { education: EducationItem }) => (
  <div>
    <div style={itemHeadingStyle}>{education.qualification}</div>
    <div style={subInformationStyle}>
      {education.institution} • {education.startDate} - {education.endDate}
    </div>
    <div style={subInformationStyle}>
      {education.major && `Major: ${education.major}`}{" "}
      {education.major && education.achievement && "•"}{" "}
      {education.achievement && ` Achievement: ${education.achievement}`}
    </div>
  </div>
);

export const CertificationLabel = ({
  certification,
}: {
  certification: CertificationItem;
}) => (
  <div>
    <div style={itemHeadingStyle}>{certification.name}</div>
    <div style={subInformationStyle}>{certification.organisation}</div>
    <div style={subInformationStyle}>
      {certification.issuedDate && `Issued: ${certification.issuedDate} `}
      {certification.expirationDate &&
        `| Expires: ${certification.expirationDate}`}
    </div>
  </div>
);
