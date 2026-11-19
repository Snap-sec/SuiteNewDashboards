import { useEffect, useState } from 'react';
import { ArrowLeft, ChartNoAxesGantt } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { FolderBreadcrumb } from '@/components/custom/folder-breadcrumb';
import PageHeading from '@/components/custom/page-heading';
import { SearchInput } from '../../../../components/custom/search';
import { Skeleton } from '../../../../components/ui/skeleton';
import {
  useGetVmFolderByIdQuery,
  useGetVmFoldersQuery,
} from '../../../../services/vm/foldersApi';
import { useGetVmAssessmentsQuery } from '../../../../services/vm/assessmentsApi';
import AssessmentColumnCard from './components/cards/assessment-info-card';
import AddAssessments from './components/modals/add-assessments';
import CreateChildModel from './components/modals/create-child-model';
import { FolderCard } from './components/cards/folder-card';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';

import { FolderDetailsPageSkeleton } from './components/skeletons';

function FolderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');

  // If we arrived from the Category tab, categoryName will be in location.state
  const categoryName = location.state?.categoryName || null;

  const { data: Folders, isLoading: isFolderLoading } =
    useGetVmFolderByIdQuery(id);
  const [breadcrumbPath, setBreadcrumbPath] = useState([]);
  const { data: fullFolderData } = useGetVmFoldersQuery({ search: query });

  // Category view: fetch assessments via ?category=name from the assessments endpoint
  const { data: categoryAssessmentsData, isLoading: isCategoryLoading } =
    useGetVmAssessmentsQuery(
      { category: categoryName },
      { skip: !categoryName },
    );

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    // API refetch happens automatically on param change
  };

  useEffect(() => {
    if (location.state?.path) {
      setBreadcrumbPath(location.state.path);
      return;
    }

    // 2. Fallback to tree search (for direct URL access or refresh)
    if (Folders && fullFolderData) {
      const findFolderPath = (folders, targetId, currentPath = []) => {
        for (const folder of folders) {
          if (folder._id === targetId) {
            return [...currentPath, { _id: folder._id, name: folder.name }];
          }
          if (folder.children) {
            const path = findFolderPath(folder.children, targetId, [
              ...currentPath,
              { _id: folder._id, name: folder.name },
            ]);
            if (path) return path;
          }
        }
        return null;
      };

      const path = findFolderPath(fullFolderData, id) || [
        { _id: Folders._id, name: Folders.name },
      ];
      setBreadcrumbPath(path);
    }
  }, [Folders, fullFolderData, id, location.state]);

  const folders = (Folders?.children || []).filter(
    (c) => c.type === 'folder' || !c.type,
  );

  // For category view use the assessments API response; otherwise use folder children
  const assessments = categoryName
    ? (categoryAssessmentsData?.data?.assessments || [])
    : (Folders?.children || []).filter((c) => c.type === 'assessment');

  if (isFolderLoading || isCategoryLoading) {
    return <FolderDetailsPageSkeleton />;
  }

  if (!Folders) {
    return (
      <div className="p-4">
        <h1>Folder not found</h1>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <PageHeading
            title={Folders.name}
            description="Manage your folders and assessments."
          />
        </div>

        <SearchInput
          value={query}
          onChange={handleSearchChange}
          placeholder="Search Groups..."
          isSearching={false}
        />
      </div>

      {/* Breadcrumb */}
      <FolderBreadcrumb
        path={breadcrumbPath}
        onNavigate={(path) => {
          if (path.length === 0) {
            navigate('/vm/folders');
          } else {
            const lastFolder = path[path.length - 1];
            navigate(`/vm/folders/${lastFolder._id}`, { state: { path } });
          }
        }}
      />

      {/* Folders */}
      <p className="text-base font-semibold leading-none tracking-tight mt-6">
        Folders
      </p>
      <div className="grid sm:grid-cols-8 gap-5 mb-2 mt-2">
        {folders?.length > 0 &&
          folders?.map((folder) => (
            <FolderCard
              key={folder._id || folder.name}
              id={folder._id}
              logo="folder.svg"
              title={folder.name}
              folders={folder}
              onClick={() =>
                navigate(`/vm/folders/${folder._id}`, {
                  state: { path: [...breadcrumbPath, folder] },
                })
              }
            />
          ))}
        <AuthorityGuard forbidRoles={['Auditor']}>
          <CreateChildModel parentId={id} />
        </AuthorityGuard>
      </div>

      {/* Assessments */}
      <p className="text-base font-semibold leading-none tracking-tight mt-6">
        Assessments
      </p>
      <div className="grid gap-5 mb-2 mt-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {assessments.length > 0
          ? assessments.map((a) => (
            <AssessmentColumnCard
              assId={a?._id}
              icon={
                <ChartNoAxesGantt className="w-10 h-10 text-foreground" />
              }
              title={a?.title || a?.name}
              description={'project?.description'}
              startDate={a?.createdAt}
              status={a?.state}
              progress={a?.remediationProgress}
              vulnerabilities={a?.vulnMetrics}
              showActionButtons={false}
              team={a?.collaborators?.map(
                (collaborator) => collaborator.email,
              )}
              key={a?._id}
              assessment={a}
            />
          ))
          : null}
        {!categoryName && (
          <AuthorityGuard forbidRoles={['Auditor']}>
            <AddAssessments folderId={id} existingAssessments={assessments} />
          </AuthorityGuard>
        )}
      </div>
    </div>
  );
}

export default FolderDetails;
