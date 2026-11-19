import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useSearchParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import SkillDetailsHeader from './components/SkillDetailsHeader';
import ApiErrorHandler from '@/components/common/api-error-handler';
import SkillPackageFilesCard from './components/SkillPackageFilesCard';
import PackageHealthCard from './components/PackageHealthCard';
import SkillEditorCard from './components/SkillEditorCard';
import { useSkillDetails } from './components/useSkillDetails';

export default function SkillDetailsPage() {
  const { id: paramSkillId } = useParams();
  const [searchParams] = useSearchParams();
  const querySkillId = searchParams.get('skillId');
  const targetSkillId = paramSkillId || querySkillId;

  const {
    activeSkill,
    skillDescription,
    fileTree,
    openFiles,
    activeFileId,
    setActiveFileId,
    healthChecks,
    passRate,
    isLoading,
    isLoadingTree,
    isSaving,
    isUpdatingSkill,
    isError,
    error,
    handleSelectFile,
    handleToggleFolder,
    handleCloseTab,
    handleContentChange,
    handleAddFile,
    handleAddFolder,
    handleRenameNode,
    handleDeleteNode,
    handleSaveDraft,
    handleUpdateSkill,
  } = useSkillDetails(targetSkillId);

  if (isError) {
    return <ApiErrorHandler error={error} />;
  }

  if (isLoading) {
    return (
      <div className="p-4 flex flex-col gap-4 w-full min-h-[calc(100vh-4rem)]">
        <Helmet>
          <title>Automation | Skill Details</title>
        </Helmet>

        {/* Header Skeleton */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-md shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-3.5 w-80" />
            </div>
          </div>
        </div>

        {/* Main Split Layout Skeleton */}
        <div className="flex flex-col lg:flex-row gap-5 items-stretch w-full lg:h-[calc(100vh-12rem)] min-h-[520px]">
          {/* Left Column Skeleton */}
          <div className="w-full lg:w-72 xl:w-80 flex flex-col gap-4 shrink-0 lg:h-full min-h-0">
            {/* Package Files Skeleton */}
            <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 shadow-xs flex-1 min-h-0">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="size-6 rounded-md" />
              </div>
              <div className="space-y-2 py-1 flex-1 overflow-hidden">
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-5 w-1/2 rounded-md ml-3" />
                <Skeleton className="h-5 w-2/3 rounded-md ml-3" />
                <Skeleton className="h-5 w-4/5 rounded-md ml-6" />
                <Skeleton className="h-5 w-3/5 rounded-md ml-6" />
              </div>
              <Skeleton className="h-8 w-full rounded-md mt-auto shrink-0" />
            </div>

            {/* Health Card Skeleton */}
            <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 shadow-xs shrink-0">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
              <div className="space-y-2.5 pt-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>

          {/* Right Column (Editor) Skeleton */}
          <div className="w-full lg:flex-1 min-w-0 bg-card border border-border rounded-xl lg:h-full min-h-[480px] lg:min-h-0 flex flex-col overflow-hidden shadow-xs">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-muted/20 shrink-0">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-24 rounded-lg" />
                <Skeleton className="h-7 w-28 rounded-lg" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-48 rounded-lg" />
                <Skeleton className="size-7 rounded-md" />
              </div>
            </div>
            <div className="p-6 space-y-4 flex-1">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4 w-full">
      <Helmet>
        <title>Automation | Skill Details</title>
      </Helmet>

      {/* Top Header Row */}
      <SkillDetailsHeader
        skill={activeSkill}
        title={activeSkill?.name || fileTree?.name || 'Skill Details'}
        description={skillDescription || activeSkill?.description || ''}
        onUpdateSkill={handleUpdateSkill}
        isUpdatingSkill={isUpdatingSkill}
      />

      {/* Main Split Layout */}
      <div className="flex flex-col lg:flex-row gap-5 items-stretch w-full lg:h-[calc(100vh-12rem)] min-h-[520px]">
        {/* Left Column: File Explorer & Health Status */}
        <div className="w-full lg:w-72 xl:w-80 flex flex-col gap-4 shrink-0 lg:h-full min-h-0">
          <SkillPackageFilesCard
            rootFolder={fileTree}
            activeFileId={activeFileId}
            onSelectFile={handleSelectFile}
            onToggleFolder={handleToggleFolder}
            onAddFile={handleAddFile}
            onAddFolder={handleAddFolder}
            onRenameNode={handleRenameNode}
            onDeleteNode={handleDeleteNode}
            isLoading={isLoadingTree}
          />

          <PackageHealthCard checks={healthChecks} passRate={passRate} />
        </div>

        {/* Right Column: Code / Split / Preview Editor */}
        <div className="w-full lg:flex-1 min-w-0 lg:h-full min-h-0 flex flex-col">
          <SkillEditorCard
            openFiles={openFiles}
            activeFileId={activeFileId}
            onSelectTab={setActiveFileId}
            onCloseTab={handleCloseTab}
            onContentChange={handleContentChange}
            onSave={handleSaveDraft}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
