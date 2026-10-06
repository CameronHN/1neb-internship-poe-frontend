import {
  Text,
  Title1,
  Button,
  Input,
  Label,
  Textarea,
  Subtitle1,
  MessageBar,
} from "@fluentui/react-components";
import { useState } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import { ArrowDownload24Regular } from "@fluentui/react-icons";
import { API_URLS } from "../../constants/apiConstants";

const BASE_URL: string = API_URLS.API_BASE;

interface Skill {
  skill: string;
  skillLevel: string;
}

interface ProfessionalLink {
  link: string;
  linkType: string;
}

interface Experience {
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

interface Education {
  institution: string;
  qualification: string;
  startDate: string;
  endDate: string;
  major: string;
  achievement: string;
}

interface Certification {
  name: string;
  organisation: string;
  credentialUrl: string;
  issuedDate: string;
  expirationDate: string;
}

interface ResumeData {
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

export const DemoPage: React.FC = () => {
  usePageTitle({ title: "Demo" });

  const DEMO_LIMIT: number = 2;

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "warning" | "info";
    text: string;
  } | null>(null);
  const [usageCount, setUsageCount] = useState(() => {
    const saved = localStorage.getItem("demoUsageCount");
    return saved ? parseInt(saved) : 0;
  });

  // Function to detect current theme
  const isLightTheme = () => {
    return (
      document.body.parentElement?.classList.contains("light-theme") ||
      document.documentElement.classList.contains("light-theme") ||
      document.querySelector(".light-theme") !== null
    );
  };

  const [formData, setFormData] = useState<ResumeData>({
    name: "",
    title: "",
    email: "",
    phoneNumber: "",
    summary: "",
    skills: Array(4).fill({ skill: "", skillLevel: "" }),
    professionalLinks: Array(2).fill({ socialMediaUrl: "" }),
    experience: Array(2).fill({
      company: "",
      jobTitle: "",
      startDate: "",
      endDate: "",
      responsibilities: ["", ""],
    }),
    education: Array(2).fill({
      institution: "",
      qualification: "",
      startDate: "",
      endDate: "",
      major: "",
      achievement: "",
    }),
    certification: Array(2).fill({
      name: "",
      organisation: "",
      credentialUrl: "",
      issuedDate: "",
      expirationDate: "",
    }),
  });

  const handleInputChange = (field: keyof ResumeData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillChange = (
    index: number,
    field: keyof Skill,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const handleSocialChange = (
    index: number,
    field: keyof ProfessionalLink,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      professionalLinks: prev.professionalLinks.map((social, i) =>
        i === index ? { ...social, [field]: value } : social
      ),
    }));
  };

  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleResponsibilityChange = (
    expIndex: number,
    respIndex: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === expIndex
          ? {
              ...exp,
              responsibilities: exp.responsibilities.map((resp, j) =>
                j === respIndex ? value : resp
              ),
            }
          : exp
      ),
    }));
  };

  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const handleCertificationChange = (
    index: number,
    field: keyof Certification,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      certification: prev.certification.map((cert, i) =>
        i === index ? { ...cert, [field]: value } : cert
      ),
    }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phoneNumber.trim()
    ) {
      setMessage({
        type: "error",
        text: "Name, email, and phone number are required",
      });
      return false;
    }
    return true;
  };

  // Updated the handleCreatePDF function to format dates as "Month YYYY"
  const handleCreatePDF = async () => {
    if (usageCount >= DEMO_LIMIT) {
      setMessage({
        type: "error",
        text: `Demo limit reached. You can only create ${DEMO_LIMIT} resumes in demo mode.`,
      });
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const formatDate = (date: string): string => {
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "long",
        };
        return new Date(date).toLocaleDateString("en-US", options);
      };

      const cleanedData = {
        ...formData,
        skills: formData.skills.filter((skill) => skill.skill.trim()),
        socials: formData.professionalLinks.filter((social) =>
          social.link.trim()
        ),
        experience: formData.experience.map((exp) => ({
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
        certifications: formData.certification
          .filter((cert) => cert.name.trim() && cert.organisation.trim())
          .map((cert) => ({
            ...cert,
            issuedDate: cert.issuedDate.trim()
              ? formatDate(cert.issuedDate)
              : "",
            expirationDate: cert.expirationDate.trim()
              ? formatDate(cert.expirationDate)
              : "",
          })),
      };

      const response: Response = await fetch(`${BASE_URL}/resume/create-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        const contentDisposition = response.headers.get("Content-Disposition");
        const backendFilename = contentDisposition?.match(
          /filename="?([^";]+)"?/
        )?.[1];
        a.download = backendFilename || "resume.pdf";

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem("demoUsageCount", newCount.toString());

        setMessage({
          type: "success",
          text: `Resume downloaded successfully! You have ${
            DEMO_LIMIT - newCount
          } demo uses remaining.`,
        });
      } else {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      console.error("Error creating PDF:", error);
      setMessage({
        type: "error",
        text: "Failed to create PDF. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "80vw",
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          marginBottom: "32px",
          textAlign: "center",
          maxWidth: "80vw",
          margin: "0 auto",
        }}
      >
        <Title1 style={{ marginBottom: "16px" }}>
          Free Resume Creator - Demo
        </Title1>
        <Text
          style={{
            display: "block",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          Create your professional resume instantly - no registration required!
        </Text>
        <Text
          style={{
            display: "block",
            fontSize: "14px",
          }}
        >
          You are limited to the fields that are provided. If you would like to
          store this data or mix and match, please register.
        </Text>
        <Text
          style={{
            display: "block",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          Usage: {usageCount}/{DEMO_LIMIT} resumes created
        </Text>
      </div>

      {message && (
        <MessageBar
          intent={message.type}
          style={{
            marginBottom: "24px",
            color: isLightTheme() ? "#000000" : "#ffffff",
          }}
        >
          {message.text}
        </MessageBar>
      )}

      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          padding: "32px",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Basic Information */}
        <div style={{ marginBottom: "32px" }}>
          <Subtitle1>Basic Information</Subtitle1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginTop: "8px",
            }}
          >
            {/* Full Name */}
            <div>
              <Label
                style={{
                  display: "block",
                  marginBottom: "8px",
                }}
                required
              >
                Full Name
              </Label>
              <Input
                value={formData.name}
                onChange={(_, data) => handleInputChange("name", data.value)}
                style={{
                  width: "100%",
                }}
                required
                maxLength={60}
              />
            </div>

            {/* Email */}
            <div>
              <Label
                style={{
                  display: "block",
                  marginBottom: "8px",
                }}
                required
              >
                Email
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(_, data) => handleInputChange("email", data.value)}
                style={{
                  width: "100%",
                }}
                required
                maxLength={256}
              />
            </div>

            {/* Phone Number */}
            <div>
              <Label
                style={{
                  display: "block",
                  marginBottom: "8px",
                }}
                required
              >
                Phone Number
              </Label>
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={(_, data) =>
                  handleInputChange("phoneNumber", data.value)
                }
                style={{
                  width: "100%",
                }}
                required
                maxLength={15}
              />
            </div>

            {/* Resume Title */}
            <div>
              <Label
                required
                style={{
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Job Title
              </Label>
              <Input
                value={formData.title}
                onChange={(_, data) => handleInputChange("title", data.value)}
                style={{
                  width: "100%",
                }}
                required
                maxLength={100}
              />
            </div>

            {/* Professional Summary */}
            <div>
              <Label
                required
                style={{
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Professional Summary
              </Label>
              <Textarea
                value={formData.summary}
                onChange={(_, data) => handleInputChange("summary", data.value)}
                rows={5}
                style={{
                  width: "100%",
                }}
                required
                maxLength={200}
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div style={{ marginBottom: "32px" }}>
          <Subtitle1
            style={{
              marginBottom: "16px",
            }}
          >
            Skills (Max 4)
          </Subtitle1>
          {formData.skills.map((skill, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div style={{ margin: 0, padding: 0 }}>
                <Label
                  required
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "12px",
                    opacity: 0.8,
                    margin: 0,
                  }}
                >
                  Skill Name
                </Label>
                <Input
                  value={skill.skill}
                  onChange={(_, data) =>
                    handleSkillChange(index, "skill", data.value)
                  }
                  style={{
                    width: "100%",
                    margin: 0,
                  }}
                  required
                  maxLength={100}
                />
              </div>
              <div style={{ margin: 0, padding: 0 }}>
                <Label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "12px",
                    opacity: 0.8,
                    margin: 0,
                  }}
                >
                  Skill Level
                </Label>
                <Input
                  value={skill.skillLevel}
                  onChange={(_, data) =>
                    handleSkillChange(index, "skillLevel", data.value)
                  }
                  style={{
                    width: "100%",
                    margin: 0,
                  }}
                  maxLength={100}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Social Media */}
        <div style={{ marginBottom: "32px" }}>
          <Subtitle1
            style={{
              marginBottom: "16px",
            }}
          >
            Social Media (Max 2)
          </Subtitle1>
          {formData.professionalLinks.map((social, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div style={{ margin: 0, padding: 0 }}>
                <Label
                  required
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "12px",
                    opacity: 0.8,
                    margin: 0,
                  }}
                >
                  Social Media Link
                </Label>
                <Input
                  value={social.link}
                  onChange={(_, data) =>
                    handleSocialChange(index, "link", data.value)
                  }
                  style={{
                    width: "100%",
                    margin: 0,
                  }}
                  required
                  maxLength={100}
                />
              </div>
              <div style={{ margin: 0, padding: 0 }}>
                <Label
                  required
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "12px",
                    opacity: 0.8,
                    margin: 0,
                  }}
                >
                  Social Media Type
                </Label>
                <Input
                  value={social.linkType}
                  onChange={(_, data) =>
                    handleSocialChange(index, "linkType", data.value)
                  }
                  style={{
                    width: "100%",
                    margin: 0,
                  }}
                  required
                  maxLength={100}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Experience */}
        <div style={{ marginBottom: "32px" }}>
          <Subtitle1
            style={{
              marginBottom: "16px",

              lineHeight: "1.6",
            }}
          >
            Experience (Max 2)
          </Subtitle1>
          {formData.experience.map((exp, index) => (
            <div
              key={index}
              style={{
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "16px",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <Label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "12px",
                      opacity: 0.8,
                    }}
                  >
                    Company Name
                  </Label>
                  <Input
                    value={exp.company}
                    onChange={(_, data) =>
                      handleExperienceChange(index, "company", data.value)
                    }
                    style={{
                      width: "100%",
                    }}
                    maxLength={100}
                  />
                </div>
                <div>
                  <Label
                    required
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "12px",
                      opacity: 0.8,
                    }}
                  >
                    Job Title
                  </Label>
                  <Input
                    value={exp.jobTitle}
                    onChange={(_, data) =>
                      handleExperienceChange(index, "jobTitle", data.value)
                    }
                    style={{
                      width: "100%",
                    }}
                    required
                    maxLength={100}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "16px",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <Label
                    required
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "12px",
                      opacity: 0.8,
                    }}
                  >
                    Start Date
                  </Label>
                  <Input
                    type="date"
                    value={exp.startDate}
                    onChange={(_, data) =>
                      handleExperienceChange(index, "startDate", data.value)
                    }
                    style={{
                      width: "100%",
                    }}
                    required
                  />
                </div>
                <div>
                  <Label
                    required
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "12px",
                      opacity: 0.8,
                    }}
                  >
                    End Date
                  </Label>
                  <Input
                    type="date"
                    value={exp.endDate}
                    onChange={(_, data) =>
                      handleExperienceChange(index, "endDate", data.value)
                    }
                    style={{
                      width: "100%",
                    }}
                    required
                  />
                </div>
              </div>
              <Label
                required
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Responsibilities (Max 2)
              </Label>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {exp.responsibilities.map((resp, respIndex) => (
                  <Textarea
                    key={respIndex}
                    value={resp}
                    onChange={(_, data) =>
                      handleResponsibilityChange(index, respIndex, data.value)
                    }
                    style={{
                      width: "100%",
                    }}
                    rows={2}
                    required
                    maxLength={255}
                  />
                ))}
              </div>
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #0000006c",
                  margin: "24px 0",
                }}
              />
            </div>
          ))}
        </div>

        {/* Education */}
        <div style={{ marginBottom: "32px" }}>
          <Subtitle1
            style={{
              marginBottom: "16px",
            }}
          >
            Education (Max 2)
          </Subtitle1>
          {formData.education.map((edu, index) => (
            <div
              key={index}
              style={{
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "16px",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <Label
                    required
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "12px",
                      opacity: 0.8,
                    }}
                  >
                    Institution
                  </Label>
                  <Input
                    value={edu.institution}
                    onChange={(_, data) =>
                      handleEducationChange(index, "institution", data.value)
                    }
                    style={{
                      width: "100%",
                    }}
                    required
                    maxLength={100}
                  />
                </div>
                <div>
                  <Label
                    required
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "12px",
                      opacity: 0.8,
                    }}
                  >
                    Qualification
                  </Label>
                  <Input
                    value={edu.qualification}
                    onChange={(_, data) =>
                      handleEducationChange(index, "qualification", data.value)
                    }
                    style={{
                      width: "100%",
                    }}
                    required
                    maxLength={100}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "16px",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <Label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "12px",
                      opacity: 0.8,
                    }}
                  >
                    Major
                  </Label>
                  <Input
                    value={edu.major}
                    onChange={(_, data) =>
                      handleEducationChange(index, "major", data.value)
                    }
                    style={{
                      width: "100%",
                    }}
                    maxLength={100}
                  />
                </div>
                <div>
                  <Label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "12px",
                      opacity: 0.8,
                    }}
                  >
                    Achievement
                  </Label>
                  <Input
                    value={edu.achievement}
                    onChange={(_, data) =>
                      handleEducationChange(index, "achievement", data.value)
                    }
                    style={{
                      width: "100%",
                    }}
                    maxLength={100}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "16px",
                }}
              >
                <div>
                  <Label
                    required
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "12px",
                      opacity: 0.8,
                    }}
                  >
                    Start Date
                  </Label>
                  <Input
                    type="date"
                    value={edu.startDate}
                    onChange={(_, data) =>
                      handleEducationChange(index, "startDate", data.value)
                    }
                    style={{
                      width: "100%",
                    }}
                    required
                  />
                </div>
                <div>
                  <Label
                    required
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "12px",
                      opacity: 0.8,
                    }}
                  >
                    End Date
                  </Label>
                  <Input
                    type="date"
                    value={edu.endDate}
                    onChange={(_, data) =>
                      handleEducationChange(index, "endDate", data.value)
                    }
                    style={{
                      width: "100%",
                    }}
                    required
                  />
                </div>
              </div>
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #0000006c",
                  margin: "24px 0",
                }}
              />
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div style={{ marginBottom: "32px" }}>
          <Subtitle1
            style={{
              marginBottom: "16px",
            }}
          >
            Certifications (Max 2)
          </Subtitle1>
          {formData.certification.map((cert, index) => (
            <div
              key={index}
              style={{
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "16px",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <Label
                    required
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "12px",
                      opacity: 0.8,
                    }}
                  >
                    Certification Name
                  </Label>
                  <Input
                    value={cert.name}
                    onChange={(_, data) =>
                      handleCertificationChange(index, "name", data.value)
                    }
                    style={{
                      width: "100%",
                    }}
                    required
                    maxLength={100}
                  />
                </div>
                <div>
                  <Label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "12px",
                      opacity: 0.8,
                    }}
                  >
                    Issuing Organisation
                  </Label>
                  <Input
                    value={cert.organisation}
                    onChange={(_, data) =>
                      handleCertificationChange(
                        index,
                        "organisation",
                        data.value
                      )
                    }
                    style={{
                      width: "100%",
                    }}
                    maxLength={100}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <Label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "12px",
                    opacity: 0.8,
                  }}
                >
                  Credential URL
                </Label>
                <Input
                  value={cert.credentialUrl}
                  onChange={(_, data) =>
                    handleCertificationChange(
                      index,
                      "credentialUrl",
                      data.value
                    )
                  }
                  style={{
                    width: "100%",
                  }}
                  maxLength={100}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "16px",
                }}
              >
                <div>
                  <Label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "12px",
                      opacity: 0.8,
                    }}
                  >
                    Issued Date
                  </Label>
                  <Input
                    type="date"
                    value={cert.issuedDate}
                    onChange={(_, data) =>
                      handleCertificationChange(index, "issuedDate", data.value)
                    }
                    style={{
                      width: "100%",
                    }}
                  />
                </div>
                <div>
                  <Label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "12px",
                      opacity: 0.8,
                    }}
                  >
                    Expiry Date
                  </Label>
                  <Input
                    type="date"
                    value={cert.expirationDate}
                    onChange={(_, data) =>
                      handleCertificationChange(
                        index,
                        "expirationDate",
                        data.value
                      )
                    }
                    style={{
                      width: "100%",
                    }}
                  />
                </div>
              </div>
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #0000006c",
                  margin: "24px 0",
                }}
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Button
            appearance="primary"
            size="large"
            icon={<ArrowDownload24Regular />}
            onClick={handleCreatePDF}
            disabled={isLoading || usageCount >= DEMO_LIMIT}
            style={{
              backgroundColor: usageCount >= DEMO_LIMIT ? "#666" : "#0078D4",

              padding: "12px 32px",
              fontSize: "16px",
            }}
          >
            {isLoading
              ? "Creating Resume..."
              : usageCount >= DEMO_LIMIT
              ? "Demo Limit Reached"
              : `Create Resume (${DEMO_LIMIT - usageCount} uses left)`}
          </Button>
        </div>
      </div>
    </div>
  );
};
