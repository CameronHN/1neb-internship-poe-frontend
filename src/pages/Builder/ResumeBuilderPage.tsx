import { Text, Button, Spinner, MessageBar, Title2 } from "@fluentui/react-components";
import usePageTitle from "../../hooks/usePageTitle";
import { useResumeData } from "../../hooks/useResumeData";
import { useResumeSelection } from "../../hooks/useResumeSelection";
import { useGenerateResume } from "../../hooks/useGenerateResume";
import { useSectionDelete } from "../../hooks/useSectionDelete";
import { useSaveResume } from "../../hooks/useSaveResume";
import {
  SECTION_BY_KEY,
  type SectionKey,
} from "../../constants/resumeBuilderConstants";
import { canGenerate } from "../../helpers/resumeSelectionHelpers";
import { BasicInfoCard } from "../../components/ResumeBuilder/BasicInfoCard";
import { BuilderSection } from "../../components/ResumeBuilder/BuilderSection";
import { GenerateResumeSection } from "../../components/ResumeBuilder/GenerateResumeSection";
import { SaveResumeSection } from "../../components/ResumeBuilder/SaveResumeSection";
import {
  CertificationLabel,
  EducationLabel,
  ExperienceLabel,
  SummaryLabel,
} from "../../components/ResumeBuilder/itemLabels";
import { DeleteOverlay } from "../../components/Overlays/DeleteOverlay";
import { SaveOverlay } from "../../components/Overlays/SaveOverlay";
import { pageTitleStyle } from "../../styles/constants/textStyling";
import { resumeContainer } from "../../styles/constants/pageStyling";
import {
  errorContainerStyle,
  loadingContainerStyle,
  sectionStackStyle,
} from "../../styles/constants/builderStyling";

export const ResumeBuilderPage = () => {
  usePageTitle({ title: "Create Resume" });

  const { resumeData, isLoading, error, fetchResumeData } = useResumeData();
  const selection = useResumeSelection(resumeData);
  const generate = useGenerateResume(selection.selectedIds, resumeData);
  const save = useSaveResume(resumeData, selection.selectedIds);
  const remove = useSectionDelete(
    resumeData,
    selection.selectedIds,
    async () => {
      await fetchResumeData();
      // Clear selections after successful delete
      selection.clearSelection();
    }
  );

  if (isLoading) {
    return (
      <div style={loadingContainerStyle}>
        <Spinner size="large" />
        <Text>Loading your resume details...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorContainerStyle}>
        <MessageBar intent="error" style={{ marginBottom: "20px" }}>
          {error}
        </MessageBar>
        <Button onClick={fetchResumeData}>Try Again</Button>
      </div>
    );
  }

  // Props shared by every section card.
  const sectionProps = (key: SectionKey) => ({
    config: SECTION_BY_KEY[key],
    selectedIds: selection.selectedIds,
    onToggleItem: (id: string, checked: boolean) => {
      selection.toggleItem(id, checked);
      generate.clearMessage();
    },
    onToggleAll: (checked: boolean) => {
      selection.toggleSection(key, checked);
      generate.clearMessage();
    },
    onDelete: () => remove.deleteSelected(key),
    onUndo: selection.clearSelection,
  });

  return (
    <div style={resumeContainer}>
      <div style={pageTitleStyle}>
        <Title2>Resume Builder</Title2>
      </div>

      {resumeData && (
        <div style={sectionStackStyle}>
          <BasicInfoCard
            name={resumeData.name}
            email={resumeData.email}
            phoneNumber={resumeData.phoneNumber}
          />
          {resumeData.socials && (
            <BuilderSection
              {...sectionProps("socials")}
              items={resumeData.socials}
              renderLabel={(social) =>
                `${social.socialMediaUrl} (${social.socialMediaType})`
              }
            />
          )}
          {resumeData.title && (
            <BuilderSection
              {...sectionProps("title")}
              items={resumeData.title}
              renderLabel={(title) => title.title}
            />
          )}
          {resumeData.summaries && (
            <BuilderSection
              {...sectionProps("summaries")}
              items={resumeData.summaries}
              renderLabel={(summary) => <SummaryLabel summary={summary} />}
            />
          )}
          {resumeData.skills && (
            <BuilderSection
              {...sectionProps("skills")}
              items={resumeData.skills}
              renderLabel={(skill) =>
                `${skill.skill} ${skill.skillLevel ? `(${skill.skillLevel})` : ""}`
              }
            />
          )}
          {resumeData.experience && (
            <BuilderSection
              {...sectionProps("experience")}
              items={resumeData.experience}
              renderLabel={(experience, index) => (
                <ExperienceLabel experience={experience} index={index} />
              )}
            />
          )}
          {resumeData.education && (
            <BuilderSection
              {...sectionProps("education")}
              items={resumeData.education}
              renderLabel={(education) => (
                <EducationLabel education={education} />
              )}
            />
          )}
          {resumeData.certification && (
            <BuilderSection
              {...sectionProps("certification")}
              items={resumeData.certification}
              renderLabel={(certification) => (
                <CertificationLabel certification={certification} />
              )}
            />
          )}
        </div>
      )}

      <GenerateResumeSection
        message={generate.message}
        selectedCount={selection.selectedIds.size}
        isGenerating={generate.isGenerating}
        disabled={generate.isGenerating || !canGenerate(selection.selectedIds, resumeData)}
        onGenerate={generate.generateResume}
      />

      <SaveResumeSection
        name={save.savedResumeName}
        onNameChange={save.setSavedResumeName}
        isSaving={save.isSaving}
        onSave={save.saveResume}
      />

      <DeleteOverlay
        isDeleting={remove.isDeleting}
        deleteSuccess={remove.deleteSuccess}
        deleteError={remove.deleteError}
        itemType={remove.currentDeleteType}
        onCloseError={remove.closeDeleteError}
      />

      <SaveOverlay
        isSaving={save.isSaving}
        saveSuccess={save.saveSuccess}
        saveError={save.saveError}
        typeSaved={"Resume"}
        onCloseError={save.closeSaveError}
      />
    </div>
  );
};
