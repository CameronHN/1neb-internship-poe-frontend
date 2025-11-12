import {
  Text,
  Button,
  Spinner,
  MessageBar,
  Title2,
  Subtitle1,
  Subtitle2,
  Checkbox,
  Card,
  CardHeader,
  CardPreview,
  Tooltip,
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  List,
  ListItem,
  Input,
  Label,
} from "@fluentui/react-components";
import { useState, useEffect } from "react";
import usePageTitle from "../hooks/usePageTitle";
import { resumeApiService } from "../services/resumeApiService";
import { certificationService } from "../services/certificationService";
import { educationService } from "../services/educationService";
import { experienceService } from "../services/experienceService";
import { professionalSummaryService } from "../services/professionalSummaryService";
import { skillService } from "../services/skillService";
import { titleService } from "../services/titleService";
import { socialMediaService } from "../services/socialMediaService";
import { savedResumeService } from "../services/savedResumeService";
import { DeleteOverlay } from "../components/DeleteOverlay";
import { SaveOverlay } from "../components/SaveOverlay";
import { DeleteConfirmationMenu } from "../components/DeleteConfirmationMenu";
import { QuestionCircle12Regular } from "@fluentui/react-icons";
import { deleteButtonStyle } from "../styles/constants/buttonStyling";
import { subInformationStyle } from "../styles/constants/textStyling";
import { tooltipStyling } from "../styles/constants/iconStyling";

const cardHeaderStyle = { display: "flex", gap: "8px" };

export const ResumeBuilderPage = () => {
  usePageTitle({ title: "Create Resume" });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showSaveNameInput, setShowSaveNameInput] = useState<boolean>(false);
  const [savedResumeName, setSavedResumeName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [currentDeleteType, setCurrentDeleteType] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load resume data when component mounts
  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await resumeApiService.getUserResumeDetails();
      setResumeData(data);
    } catch (err) {
      console.error("Error fetching resume data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load resume data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);

      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }

      return newSet;
    });
    if (message) {
      setMessage(null);
    }
  };

  const handleGenerateResume = async () => {
    if (selectedIds.size === 0) {
      setMessage("Please select at least one item");
      return;
    }

    // Check selection limits before generating
    const socialCount = Array.from(selectedIds).filter((id) =>
      id.startsWith("social_")
    ).length;
    const titleCount = Array.from(selectedIds).filter((id) =>
      id.startsWith("title_")
    ).length;
    const summaryCount = Array.from(selectedIds).filter((id) =>
      id.startsWith("summary_")
    ).length;
    const educationCount = Array.from(selectedIds).filter((id) =>
      id.startsWith("education_")
    ).length;

    if (socialCount > 2) {
      setMessage(
        "You can only select a maximum of 2 social media links for resume generation"
      );
      return;
    }
    if (titleCount > 1) {
      setMessage("You can only select 1 resume title for resume generation");
      return;
    }
    if (summaryCount > 1) {
      setMessage(
        "You can only select 1 professional summary for resume generation"
      );
      return;
    }
    if (educationCount > 3) {
      setMessage(
        "You can only select a maximum of 3 education entries for resume generation"
      );
      return;
    }

    setIsGenerating(true);
    setMessage(null);

    try {
      // Build the request data with resource IDs
      const selectedData = {
        titleIds: Array.from(selectedIds)
          .filter((id) => id.startsWith("title_"))
          .map((id) => {
            const index = parseInt(id.split("_")[1]);
            return resumeData?.title?.[index]?.id;
          })
          .filter(Boolean),
        summaryIds: Array.from(selectedIds)
          .filter((id) => id.startsWith("summary_"))
          .map((id) => {
            const index = parseInt(id.split("_")[1]);
            return resumeData?.summaries?.[index]?.id;
          })
          .filter(Boolean),
        skillIds: Array.from(selectedIds)
          .filter((id) => id.startsWith("skill_"))
          .map((id) => {
            const index = parseInt(id.split("_")[1]);
            return resumeData?.skills?.[index]?.id;
          })
          .filter(Boolean),
        experienceIds: Array.from(selectedIds)
          .filter((id) => id.startsWith("experience_"))
          .map((id) => {
            const index = parseInt(id.split("_")[1]);
            return resumeData?.experience?.[index]?.id;
          })
          .filter(Boolean),
        educationIds: Array.from(selectedIds)
          .filter((id) => id.startsWith("education_"))
          .map((id) => {
            const index = parseInt(id.split("_")[1]);
            return resumeData?.education?.[index]?.id;
          })
          .filter(Boolean),
        certificationIds: Array.from(selectedIds)
          .filter((id) => id.startsWith("certification_"))
          .map((id) => {
            const index = parseInt(id.split("_")[1]);
            return resumeData?.certification?.[index]?.id;
          })
          .filter(Boolean),
        socialIds: Array.from(selectedIds)
          .filter((id) => id.startsWith("social_"))
          .map((id) => {
            const index = parseInt(id.split("_")[1]);
            return resumeData?.socials?.[index]?.id;
          })
          .filter(Boolean),
      };

      // Build the request data
      const requestData: any = {};

      // Single title and summary (take first if multiple selected)
      const titleIds = selectedData.titleIds;
      const summaryIds = selectedData.summaryIds;

      if (titleIds.length > 0) {
        requestData.titleId = titleIds[0];
      }
      if (summaryIds.length > 0) {
        requestData.professionalSummaryId = summaryIds[0];
      }

      // Arrays with order (order set to 0 for all as ordering not implemented yet)
      // TODO: Implement ordering feature in UI
      if (selectedData.socialIds.length > 0) {
        requestData.socialMediaIds = {
          ids: selectedData.socialIds,
          order: 0,
        };
      }
      if (selectedData.experienceIds.length > 0) {
        requestData.experienceIds = {
          ids: selectedData.experienceIds,
          order: 0,
        };
      }
      if (selectedData.educationIds.length > 0) {
        requestData.educationIds = {
          ids: selectedData.educationIds,
          order: 0,
        };
      }
      if (selectedData.certificationIds.length > 0) {
        requestData.certificationIds = {
          ids: selectedData.certificationIds,
          order: 0,
        };
      }
      if (selectedData.skillIds.length > 0) {
        requestData.skillsIds = {
          ids: selectedData.skillIds,
          order: 0,
        };
      }

      // Call the generate API
      const blob = await resumeApiService.generateResume(requestData);

      // Handle file download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const filename = "resume.pdf";

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMessage(`Resume downloaded successfully as ${filename}!`);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Failed to generate resume"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Spinner size="large" />
        <Text>Loading your resume details...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <MessageBar intent="error" style={{ marginBottom: "20px" }}>
          {error}
        </MessageBar>
        <Button onClick={fetchResumeData}>Try Again</Button>
      </div>
    );
  }

  // Helper function to check if any items are selected in a section
  const hasSelectedItemsInSection = (sectionPrefix: string) => {
    return Array.from(selectedIds).some((id) => id.startsWith(sectionPrefix));
  };

  // Generic delete handler for all sections
  const handleDeleteItems = async (
    sectionPrefix: string,
    sectionName: string,
    deleteFunction: (ids: string[]) => Promise<void>
  ) => {
    const itemIds = Array.from(selectedIds)
      .filter((id) => id.startsWith(sectionPrefix))
      .map((id) => {
        const index = parseInt(id.split("_")[1]);
        const sectionData = sectionPrefix.startsWith("title_")
          ? resumeData?.title
          : sectionPrefix.startsWith("summary_")
          ? resumeData?.summaries
          : sectionPrefix.startsWith("skill_")
          ? resumeData?.skills
          : sectionPrefix.startsWith("experience_")
          ? resumeData?.experience
          : sectionPrefix.startsWith("education_")
          ? resumeData?.education
          : sectionPrefix.startsWith("certification_")
          ? resumeData?.certification
          : sectionPrefix.startsWith("social_")
          ? resumeData?.socials
          : null;

        return sectionData?.[index]?.id;
      })
      .filter(Boolean);

    if (itemIds.length === 0) return;

    setIsDeleting(true);
    setDeleteError(null);
    setCurrentDeleteType(sectionName);

    try {
      await deleteFunction(itemIds);

      setDeleteSuccess(true);
      // Show success for 2 seconds, then refetch data
      setTimeout(async () => {
        setDeleteSuccess(false);
        setIsDeleting(false);
        setCurrentDeleteType("");
        await fetchResumeData();
        // Clear selections after successful delete
        setSelectedIds(new Set());
      }, 2000);
    } catch (err) {
      setIsDeleting(false);
      setCurrentDeleteType("");
      setDeleteError(
        err instanceof Error ? err.message : `Failed to delete ${sectionName}`
      );
    }
  };

  // Specific delete handlers
  const handleDeleteCertifications = () =>
    handleDeleteItems(
      "certification_",
      "certifications",
      certificationService.deleteCertifications
    );

  const handleDeleteEducation = () =>
    handleDeleteItems(
      "education_",
      "education",
      educationService.deleteEducation
    );

  const handleDeleteExperience = () =>
    handleDeleteItems(
      "experience_",
      "experience",
      experienceService.deleteExperience
    );

  const handleDeleteSkills = () =>
    handleDeleteItems("skill_", "skills", skillService.deleteSkills);

  const handleDeleteTitles = () =>
    handleDeleteItems("title_", "titles", titleService.deleteTitles);

  const handleDeleteSummaries = () =>
    handleDeleteItems(
      "summary_",
      "summaries",
      professionalSummaryService.deleteProfessionalSummaries
    );

  const handleDeleteSocialMedia = () =>
    handleDeleteItems(
      "social_",
      "social media",
      socialMediaService.deleteSocialMedia
    );

  const handleUndoSelection = () => {
    setSelectedIds(new Set());
  };

  const handleSectionToggle = (section: string, allSelected: boolean) => {
    if (section === "title") {
      resumeData?.title?.forEach((_: any, index: number) => {
        handleCheckboxChange(`title_${index}`, allSelected);
      });
    } else if (section === "summaries") {
      resumeData?.summaries?.forEach((_: any, index: number) => {
        handleCheckboxChange(`summary_${index}`, allSelected);
      });
    } else if (section === "skills") {
      resumeData?.skills?.forEach((_: any, index: number) => {
        handleCheckboxChange(`skill_${index}`, allSelected);
      });
    } else if (section === "experience") {
      resumeData?.experience?.forEach((_: any, index: number) => {
        handleCheckboxChange(`experience_${index}`, allSelected);
      });
    } else if (section === "education") {
      resumeData?.education?.forEach((_: any, index: number) => {
        handleCheckboxChange(`education_${index}`, allSelected);
      });
    } else if (section === "certification") {
      resumeData?.certification?.forEach((_: any, index: number) => {
        handleCheckboxChange(`certification_${index}`, allSelected);
      });
    } else if (section === "socials") {
      resumeData?.socials?.forEach((_: any, index: number) => {
        handleCheckboxChange(`social_${index}`, allSelected);
      });
    }
  };

  const handleSaveResume = async () => {
    if (!savedResumeName.trim()) {
      setSaveError("Please enter a name for your resume");
      return;
    }

    if (selectedIds.size === 0) {
      setSaveError("Please select at least one item to save");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Build the save data structure based on selected items
      const selectedData = {
        titleIds: Array.from(selectedIds)
          .filter((id) => id.startsWith("title_"))
          .map((id) => {
            const index = parseInt(id.split("_")[1]);
            return resumeData?.title?.[index];
          })
          .filter(Boolean),
        summaryIds: Array.from(selectedIds)
          .filter((id) => id.startsWith("summary_"))
          .map((id) => {
            const index = parseInt(id.split("_")[1]);
            return resumeData?.summaries?.[index];
          })
          .filter(Boolean),
        skillIds: Array.from(selectedIds)
          .filter((id) => id.startsWith("skill_"))
          .map((id) => {
            const index = parseInt(id.split("_")[1]);
            return resumeData?.skills?.[index];
          })
          .filter(Boolean),
        experienceIds: Array.from(selectedIds)
          .filter((id) => id.startsWith("experience_"))
          .map((id) => {
            const index = parseInt(id.split("_")[1]);
            return resumeData?.experience?.[index];
          })
          .filter(Boolean),
        educationIds: Array.from(selectedIds)
          .filter((id) => id.startsWith("education_"))
          .map((id) => {
            const index = parseInt(id.split("_")[1]);
            return resumeData?.education?.[index];
          })
          .filter(Boolean),
        certificationIds: Array.from(selectedIds)
          .filter((id) => id.startsWith("certification_"))
          .map((id) => {
            const index = parseInt(id.split("_")[1]);
            return resumeData?.certification?.[index];
          })
          .filter(Boolean),
        socialIds: Array.from(selectedIds)
          .filter((id) => id.startsWith("social_"))
          .map((id) => {
            const index = parseInt(id.split("_")[1]);
            return resumeData?.socials?.[index];
          })
          .filter(Boolean),
      };

      // Construct the resume data for saving
      const saveResumeData = {
        savedResumeName: savedResumeName.trim(),
        resumeData: {
          name: resumeData.name,
          title: selectedData.titleIds[0]?.title || "",
          email: resumeData.email,
          phoneNumber: resumeData.phoneNumber,
          summary: selectedData.summaryIds[0]?.summary || "",
          skills: selectedData.skillIds.map((skill: any) => ({
            skill: skill.skill,
            skillLevel: skill.skillLevel,
          })),
          socials: selectedData.socialIds.map((social: any) => ({
            socialMediaUrl: social.socialMediaUrl,
          })),
          experience: selectedData.experienceIds.map((exp: any) => ({
            company: exp.company,
            jobTitle: exp.jobTitle,
            startDate: exp.startDate,
            endDate: exp.endDate,
            responsibilities: exp.responsibilities,
          })),
          education: selectedData.educationIds.map((edu: any) => ({
            institution: edu.institution,
            qualification: edu.qualification,
            startDate: edu.startDate,
            endDate: edu.endDate,
            major: edu.major,
            achievement: edu.achievement,
          })),
          certification: selectedData.certificationIds.map((cert: any) => ({
            name: cert.name,
            organisation: cert.organisation,
            credentialUrl: cert.credentialUrl || "",
            issuedDate: cert.issuedDate,
            expirationDate: cert.expirationDate,
          })),
        },
        templateType: "classic",
      };

      await savedResumeService.saveResume(saveResumeData);

      setSaveSuccess(true);
      // Show success for 2 seconds, then reset the form
      setTimeout(() => {
        setSaveSuccess(false);
        setIsSaving(false);
        setShowSaveNameInput(false);
        setSavedResumeName("");
      }, 2000);
    } catch (err) {
      setIsSaving(false);
      setSaveError(
        err instanceof Error ? err.message : "Failed to save resume"
      );
    }
  };

  return (
    <div style={{ padding: "4rem 2rem", maxWidth: "60vw", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <Title2>Resume Builder</Title2>
      </div>

      {resumeData && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Basic Info - Always included */}
          <Card>
            <CardHeader
              header={
                <Subtitle1>Basic Information (Always Included)</Subtitle1>
              }
            />
            <CardPreview style={{ padding: "16px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "12px",
                  fontSize: "14px",
                }}
              >
                <div>
                  <strong>Name:</strong> {resumeData.name}
                </div>
                <div>
                  <strong>Email:</strong> {resumeData.email}
                </div>
                <div>
                  <strong>Phone:</strong> {resumeData.phoneNumber}
                </div>
              </div>
            </CardPreview>
          </Card>
          {/* Social Media Section */}
          {resumeData.socials && (
            <Card>
              <CardHeader
                header={
                  <Subtitle1>
                    Social Media - Select up to 2
                    <Tooltip
                      content="It's recommended to have up to 2 social media links so to not overwhelm the resume."
                      relationship="description"
                      positioning={"above-start"}
                    >
                      <QuestionCircle12Regular style={tooltipStyling} />
                    </Tooltip>
                  </Subtitle1>
                }
                action={
                  <div style={cardHeaderStyle}>
                    <Button
                      size="small"
                      onClick={() => handleSectionToggle("socials", true)}
                    >
                      Add
                    </Button>
                    {resumeData.socials.length > 0 && (
                      <>
                        <Button
                          size="small"
                          onClick={() => handleSectionToggle("socials", true)}
                        >
                          Select All
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleSectionToggle("socials", false)}
                        >
                          Clear All
                        </Button>
                        <DeleteConfirmationMenu
                          isEnabled={hasSelectedItemsInSection("social_")}
                          buttonStyle={deleteButtonStyle(
                            hasSelectedItemsInSection("social_")
                          )}
                          onConfirmDelete={handleDeleteSocialMedia}
                          onUndo={handleUndoSelection}
                        />
                      </>
                    )}
                  </div>
                }
              />
              <CardPreview style={{ padding: "16px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {resumeData.socials.map((social: any, index: number) => (
                    <Checkbox
                      key={social.id}
                      label={social.socialMediaUrl}
                      checked={selectedIds.has(`social_${index}`)}
                      onChange={(_, data) =>
                        handleCheckboxChange(`social_${index}`, !!data.checked)
                      }
                    />
                  ))}
                </div>
              </CardPreview>
            </Card>
          )}

          {/* Titles Section */}
          {resumeData.title && (
            <Card>
              <CardHeader
                header={<Subtitle1>Resume Titles - Select 1</Subtitle1>}
                action={
                  <div style={cardHeaderStyle}>
                    <Button
                      size="small"
                      onClick={() => handleSectionToggle("title", true)}
                    >
                      Add
                    </Button>
                    {resumeData.title.length > 0 && (
                      <>
                        <Button
                          size="small"
                          onClick={() => handleSectionToggle("title", true)}
                        >
                          Select All
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleSectionToggle("title", false)}
                        >
                          Clear All
                        </Button>
                        <DeleteConfirmationMenu
                          isEnabled={hasSelectedItemsInSection("title_")}
                          buttonStyle={deleteButtonStyle(
                            hasSelectedItemsInSection("title_")
                          )}
                          onConfirmDelete={handleDeleteTitles}
                          onUndo={handleUndoSelection}
                        />
                      </>
                    )}
                  </div>
                }
              />
              <CardPreview style={{ padding: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {resumeData.title.map((titleObj: any, index: number) => (
                    <Checkbox
                      key={titleObj.id}
                      label={titleObj.title}
                      checked={selectedIds.has(`title_${index}`)}
                      onChange={(_, data) =>
                        handleCheckboxChange(`title_${index}`, !!data.checked)
                      }
                    />
                  ))}
                </div>
              </CardPreview>
            </Card>
          )}

          {/* Summaries Section */}
          {resumeData.summaries && (
            <Card>
              <CardHeader
                header={
                  <Subtitle1>Professional Summaries - Select 1</Subtitle1>
                }
                action={
                  <div style={cardHeaderStyle}>
                    <Button
                      size="small"
                      onClick={() => handleSectionToggle("summaries", true)}
                    >
                      Add
                    </Button>
                    {resumeData.summaries.length > 0 && (
                      <>
                        <Button
                          size="small"
                          onClick={() => handleSectionToggle("summaries", true)}
                        >
                          Select All
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            handleSectionToggle("summaries", false)
                          }
                        >
                          Clear All
                        </Button>
                        <DeleteConfirmationMenu
                          isEnabled={hasSelectedItemsInSection("summary_")}
                          buttonStyle={deleteButtonStyle(
                            hasSelectedItemsInSection("summary_")
                          )}
                          onConfirmDelete={handleDeleteSummaries}
                          onUndo={handleUndoSelection}
                        />
                      </>
                    )}
                  </div>
                }
              />
              <CardPreview style={{ padding: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {resumeData.summaries.map(
                    (summaryObj: any, index: number) => (
                      <div key={summaryObj.id}>
                        <Checkbox
                          label={
                            <div>
                              <div
                                style={{ fontSize: "13px", lineHeight: "1.4" }}
                              >
                                {summaryObj.summary}
                              </div>
                            </div>
                          }
                          checked={selectedIds.has(`summary_${index}`)}
                          onChange={(_, data) =>
                            handleCheckboxChange(
                              `summary_${index}`,
                              !!data.checked
                            )
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              </CardPreview>
            </Card>
          )}

          {/* Skills Section */}
          {resumeData.skills && (
            <Card>
              <CardHeader
                header={<Subtitle1>Skills</Subtitle1>}
                action={
                  <div style={cardHeaderStyle}>
                    <Button
                      size="small"
                      onClick={() => handleSectionToggle("skills", true)}
                    >
                      Add
                    </Button>
                    {resumeData.skills.length > 0 && (
                      <>
                        <Button
                          size="small"
                          onClick={() => handleSectionToggle("skills", true)}
                        >
                          Select All
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleSectionToggle("skills", false)}
                        >
                          Clear All
                        </Button>
                        <DeleteConfirmationMenu
                          isEnabled={hasSelectedItemsInSection("skill_")}
                          buttonStyle={deleteButtonStyle(
                            hasSelectedItemsInSection("skill_")
                          )}
                          onConfirmDelete={handleDeleteSkills}
                          onUndo={handleUndoSelection}
                        />
                      </>
                    )}
                  </div>
                }
              />
              <CardPreview style={{ padding: "16px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {resumeData.skills.map((skill: any, index: number) => (
                    <Checkbox
                      key={skill.id}
                      label={`${skill.skill} (${skill.skillLevel})`}
                      checked={selectedIds.has(`skill_${index}`)}
                      onChange={(_, data) =>
                        handleCheckboxChange(`skill_${index}`, !!data.checked)
                      }
                    />
                  ))}
                </div>
              </CardPreview>
            </Card>
          )}

          {/* Experience Section */}
          {resumeData.experience && (
            <Card>
              <CardHeader
                header={<Subtitle1>Work Experience</Subtitle1>}
                action={
                  <div style={cardHeaderStyle}>
                    <Button
                      size="small"
                      onClick={() => handleSectionToggle("experience", true)}
                    >
                      Add
                    </Button>
                    {resumeData.experience.length > 0 && (
                      <>
                        <Button
                          size="small"
                          onClick={() =>
                            handleSectionToggle("experience", true)
                          }
                        >
                          Select All
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            handleSectionToggle("experience", false)
                          }
                        >
                          Clear All
                        </Button>
                        <DeleteConfirmationMenu
                          isEnabled={hasSelectedItemsInSection("experience_")}
                          buttonStyle={deleteButtonStyle(
                            hasSelectedItemsInSection("experience_")
                          )}
                          onConfirmDelete={handleDeleteExperience}
                          onUndo={handleUndoSelection}
                        />
                      </>
                    )}
                  </div>
                }
              />
              <CardPreview style={{ padding: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {resumeData.experience.map((exp: any, index: number) => (
                    <div
                      key={exp.id}
                      style={{
                        border: "1px solid #e1e1e1",
                        borderRadius: "8px",
                        padding: "12px",
                      }}
                    >
                      <Checkbox
                        label={
                          <div style={{ width: "100%" }}>
                            <div style={{ fontWeight: "600" }}>
                              {exp.jobTitle} at {exp.company}
                            </div>
                            <div style={subInformationStyle}>
                              {exp.startDate} - {exp.endDate}
                            </div>
                            <div style={{ marginTop: "8px" }}>
                              <Accordion multiple collapsible>
                                <AccordionItem
                                  value={`responsibilities-${index}`}
                                >
                                  <AccordionHeader
                                    size="small"
                                    style={subInformationStyle}
                                  >
                                    {exp.responsibilities.length}{" "}
                                    responsibilities
                                  </AccordionHeader>
                                  <AccordionPanel>
                                    <List
                                      style={{
                                        margin: 0,
                                        paddingLeft: "20px",
                                        ...subInformationStyle,
                                      }}
                                    >
                                      {exp.responsibilities.map(
                                        (
                                          responsibility: string,
                                          respIndex: number
                                        ) => (
                                          <ListItem
                                            key={respIndex}
                                            style={{
                                              marginBottom: "4px",
                                              fontSize: "12px",
                                              position: "relative",
                                            }}
                                          >
                                            <span
                                              style={{
                                                position: "absolute",
                                                left: "-12px",
                                              }}
                                            >
                                              •
                                            </span>
                                            {responsibility}
                                          </ListItem>
                                        )
                                      )}
                                    </List>
                                  </AccordionPanel>
                                </AccordionItem>
                              </Accordion>
                            </div>
                          </div>
                        }
                        checked={selectedIds.has(`experience_${index}`)}
                        onChange={(_, data) =>
                          handleCheckboxChange(
                            `experience_${index}`,
                            !!data.checked
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardPreview>
            </Card>
          )}

          {/* Education Section */}
          {resumeData.education && (
            <Card>
              <CardHeader
                header={
                  <Subtitle1>
                    Education - Select up to 3
                    <Tooltip
                      content="It's recommended to have up to 3 releveant education entries so to not overwhelm the resume."
                      relationship="description"
                      positioning={"above-start"}
                    >
                      <QuestionCircle12Regular style={tooltipStyling} />
                    </Tooltip>
                  </Subtitle1>
                }
                action={
                  <div style={cardHeaderStyle}>
                    <Button
                      size="small"
                      onClick={() => handleSectionToggle("education", true)}
                    >
                      Add
                    </Button>
                    {resumeData.education.length > 0 && (
                      <>
                        <Button
                          size="small"
                          onClick={() => handleSectionToggle("education", true)}
                        >
                          Select All
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            handleSectionToggle("education", false)
                          }
                        >
                          Clear All
                        </Button>
                        <DeleteConfirmationMenu
                          isEnabled={hasSelectedItemsInSection("education_")}
                          buttonStyle={deleteButtonStyle(
                            hasSelectedItemsInSection("education_")
                          )}
                          onConfirmDelete={handleDeleteEducation}
                          onUndo={handleUndoSelection}
                        />
                      </>
                    )}
                  </div>
                }
              />
              <CardPreview style={{ padding: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {resumeData.education.map((edu: any, index: number) => (
                    <div
                      key={edu.id}
                      style={{
                        border: "1px solid #e1e1e1",
                        borderRadius: "8px",
                        padding: "12px",
                      }}
                    >
                      <Checkbox
                        label={
                          <div>
                            <div style={{ fontWeight: "600" }}>
                              {edu.qualification}
                            </div>
                            <div style={subInformationStyle}>
                              {edu.institution} • {edu.startDate} -{" "}
                              {edu.endDate}
                            </div>
                            <div style={{ fontSize: "12px", color: "#666" }}>
                              Major: {edu.major} • Achievement:{" "}
                              {edu.achievement}
                            </div>
                          </div>
                        }
                        checked={selectedIds.has(`education_${index}`)}
                        onChange={(_, data) =>
                          handleCheckboxChange(
                            `education_${index}`,
                            !!data.checked
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardPreview>
            </Card>
          )}

          {/* Certifications Section */}
          {resumeData.certification && (
            <Card>
              <CardHeader
                header={<Subtitle1>Certifications</Subtitle1>}
                action={
                  <div style={cardHeaderStyle}>
                    <Button
                      size="small"
                      onClick={() => handleSectionToggle("certification", true)}
                    >
                      Add
                    </Button>
                    {resumeData.certification.length > 0 && (
                      <>
                        <Button
                          size="small"
                          onClick={() =>
                            handleSectionToggle("certification", true)
                          }
                        >
                          Select All
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            handleSectionToggle("certification", false)
                          }
                        >
                          Clear All
                        </Button>
                        <DeleteConfirmationMenu
                          isEnabled={hasSelectedItemsInSection(
                            "certification_"
                          )}
                          buttonStyle={deleteButtonStyle(
                            hasSelectedItemsInSection("certification_")
                          )}
                          onConfirmDelete={handleDeleteCertifications}
                          onUndo={handleUndoSelection}
                        />
                      </>
                    )}
                  </div>
                }
              />
              <CardPreview style={{ padding: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {resumeData.certification.map((cert: any, index: number) => (
                    <div
                      key={cert.id}
                      style={{
                        border: "1px solid #e1e1e1",
                        borderRadius: "8px",
                        padding: "12px",
                      }}
                    >
                      <Checkbox
                        label={
                          <div>
                            <div style={{ fontWeight: "600" }}>{cert.name}</div>
                            <div style={subInformationStyle}>
                              {cert.organisation} • Issued: {cert.issuedDate}
                            </div>
                            <div style={{ fontSize: "12px", color: "#666" }}>
                              Expires: {cert.expirationDate}
                            </div>
                          </div>
                        }
                        checked={selectedIds.has(`certification_${index}`)}
                        onChange={(_, data) =>
                          handleCheckboxChange(
                            `certification_${index}`,
                            !!data.checked
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardPreview>
            </Card>
          )}
        </div>
      )}

      {message && (
        <MessageBar
          intent={
            selectedIds.size === 0 ||
            message.includes("maximum") ||
            message.includes("only select") ||
            message.includes("Please select at least one item")
              ? "warning"
              : "success"
          }
          style={{ marginBottom: "24px", marginTop: "24px" }}
        >
          {message}
        </MessageBar>
      )}

      {/* Generate button */}
      <div style={{ marginTop: "32px", textAlign: "center" }}>
        <Button
          appearance="primary"
          size="large"
          onClick={handleGenerateResume}
          disabled={
            isGenerating ||
            selectedIds.size === 0 ||
            Array.from(selectedIds).filter((id) => id.startsWith("social_"))
              .length > 2 ||
            Array.from(selectedIds).filter((id) => id.startsWith("summary_"))
              .length > 1 ||
            Array.from(selectedIds).filter((id) => id.startsWith("title_"))
              .length > 1 ||
            Array.from(selectedIds).filter((id) => id.startsWith("education_"))
              .length > 3
          }
          style={{ padding: "12px 32px" }}
        >
          {isGenerating ? (
            <>
              <Spinner size="tiny" style={{ marginRight: "8px" }} />
              Generating...
            </>
          ) : (
            `Generate Resume (${selectedIds.size} selected)`
          )}
        </Button>
      </div>

      {/* Save button */}
      <div style={{ marginTop: "32px", textAlign: "center" }}>
        <Subtitle2>
          Liked what you saw?
          <Tooltip
            content={`Saving the resume allows you to access it later from your saved resumes. 
            This is a snapshot of the information and can't be edited after saving. 
            Information also can't be removed as future changes to it won't reflect here.`}
            relationship="description"
          >
            <QuestionCircle12Regular style={tooltipStyling} />
          </Tooltip>
        </Subtitle2>
        {/* Save Resume Name Input */}
        {showSaveNameInput && (
          <div
            style={{
              marginTop: "16px",
              maxWidth: "20vw",
              margin: "16px auto 0",
            }}
          >
            <Label htmlFor="savedResumeName">Saved Resume Name:</Label>
            <Input
              id="savedResumeName"
              value={savedResumeName}
              onChange={(_, data) => setSavedResumeName(data.value)}
              placeholder="Enter a name for your saved resume"
              style={{ marginTop: "8px", width: "100%" }}
            />
            <Button
              appearance="primary"
              style={{ marginTop: "8px", width: "100%" }}
              onClick={handleSaveResume}
              disabled={isSaving || !savedResumeName.trim()}
            >
              {isSaving ? (
                <>
                  <Spinner size="tiny" style={{ marginRight: "8px" }} />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        )}
      </div>

      <DeleteOverlay
        isDeleting={isDeleting}
        deleteSuccess={deleteSuccess}
        deleteError={deleteError}
        itemType={currentDeleteType}
        onCloseError={() => setDeleteError(null)}
      />

      <SaveOverlay
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        saveError={saveError}
        onCloseError={() => setSaveError(null)}
      />
    </div>
  );
};
