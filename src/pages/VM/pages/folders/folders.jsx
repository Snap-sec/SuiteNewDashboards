import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Home, ArrowLeft, ChartNoAxesGantt } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import PageHeading from '@/components/custom/page-heading';
import { Skeleton } from '../../../../components/ui/skeleton';
import { useGetVmFoldersQuery } from '../../../../services/vm/foldersApi';
import { useGetVmAssessmentsQuery } from '../../../../services/vm/assessmentsApi';
import CreateModel from './components/modals/create-model';
import { FolderCard, FolderCardSkeleton } from './components/cards/folder-card';
import { SearchInput } from '../../../../components/custom/search';
import useStore from './store';
import useDebounce from '@/hooks/use-debounce';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';
import AssessmentColumnCard, { AssessmentColumnCardSkeleton } from './components/cards/assessment-info-card';
import { EmptyScreen } from '@/components/common/empty-screen';
import { NoSearchResultsFound } from '@/components/common/no-search-found';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

const findFolderById = (folders, id) => {
  if (!id) return null;
  return folders.find((f) => f._id === id) || null;
};

const getCurrentFolder = (data, path) => {
  if (!data) return null;
  const rootFolders = data.folders || [];
  if (path.length === 0) return { children: rootFolders };
  const last = path[path.length - 1];
  return findFolderById(rootFolders, last._id);
};

/** Standard folder grid for Custom and By Time tabs */
function FolderGrid({ queryParams, readOnly, navigate, currentPath, setCurrentPath }) {
  const [page, setPage] = useState(1);
  const [allFolders, setAllFolders] = useState([]);
  const { data, isLoading, isFetching, isError, error } = useGetVmFoldersQuery({ ...queryParams, page, limit: 24 });

  const folders = readOnly
    ? allFolders
    : (getCurrentFolder({ folders: allFolders }, currentPath)?.children || []).filter(
      (c) => c.type === 'folder' || !c.type,
    );

  const hasMore = data ? page < data.totalPages : false;

  useEffect(() => {
    setPage(1);
    setAllFolders([]);
  }, [queryParams.search]);

  useEffect(() => {
    if (data?.folders) {
      if (page === 1) {
        setAllFolders(data.folders);
      } else {
        setAllFolders((prev) => {
          const newFolders = data.folders.filter(
            (nf) => !prev.some((pf) => pf._id === nf._id)
          );
          return [...prev, ...newFolders];
        });
      }
    }
  }, [data, page]);

  const loadMore = () => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  // Intersection Observer for infinite scroll
  const observerTarget = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [hasMore, isFetching, folders.length]);

  if (isError) {
    return <ApiErrorHandler error={error} />
  }

  if (!isLoading && !isFetching && folders.length === 0) {
    if (queryParams.search) {
      return <NoSearchResultsFound />;
    }

    return (
      <EmptyScreen
        title="No Assessment Groups Found"
        subTitle="Create an assessment group to organize your assessments effectively."
        engage={
          !readOnly ? (
            <AuthorityGuard forbidRoles={['Auditor']}>
              <CreateModel isSimpleButton folders={allFolders || []} />
            </AuthorityGuard>
          ) : null
        }
      />
    );
  }

  return (
    <div>
      <div className="grid sm:grid-cols-6 gap-5 mb-2 mt-2 2xl:grid-cols-8">
        {folders?.length > 0 &&
          folders.map((folder) => (
            <FolderCard
              key={folder._id || folder.name}
              id={folder._id}
              logo="folder.svg"
              title={folder.name}
              folders={folder}
              readOnly={readOnly}
              onClick={() =>
                navigate(`/vm/folders/${folder._id}`, { state: { path: [folder] } })
              }
            />
          ))}

        {!isFetching && !readOnly && !isLoading && (
          <AuthorityGuard forbidRoles={['Auditor']}>
            <CreateModel folders={allFolders || []} />
          </AuthorityGuard>
        )}
      </div>

      {(isLoading || isFetching) && (
        <div className="grid sm:grid-cols-6 gap-5 mb-2 mt-2 2xl:grid-cols-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <FolderCardSkeleton key={i} readOnly={readOnly} />
          ))}
        </div>
      )}

      <div ref={observerTarget} className="h-10 w-full" />
    </div>
  );
}

/** Category tab: shows the list of categories, and when one is selected shows its assessments inline */
function CategoryView({ debouncedQuery, selectedCategory, setSelectedCategory }) {
  const { data: categoryFolders, isLoading: isFoldersLoading, isError, error } = useGetVmFoldersQuery({
    search: debouncedQuery,
    type: 'category',
  });

  const { data: assessmentsData, isLoading: isAssessmentsLoading } = useGetVmAssessmentsQuery(
    { category: selectedCategory?.name },
    { skip: !selectedCategory },
  );

  const folders = categoryFolders?.folders || [];
  const assessments = assessmentsData?.data?.assessments || [];

  if (selectedCategory) {
    return (
      <div className="mt-2">
        {isAssessmentsLoading && (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <AssessmentColumnCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isAssessmentsLoading && assessments.length === 0 && (
          <EmptyScreen
            title="No Assessments Found"
            subTitle={`No assessments found for category "${selectedCategory.name}".`}
          />
        )}

        {assessments.length > 0 && (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {assessments.map((a) => (
              <AssessmentColumnCard
                key={a?._id}
                assId={a?._id}
                icon={<ChartNoAxesGantt className="w-10 h-10 text-foreground" />}
                title={a?.title || a?.name}
                description={a?.description}
                startDate={a?.createdAt}
                status={a?.state}
                progress={a?.remediationProgress}
                vulnerabilities={a?.vulnMetrics}
                showActionButtons={false}
                team={a?.collaborators?.map((c) => c.email)}
                assessment={a}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (isError) {
    return <ApiErrorHandler error={error} />;
  }

  if (!isFoldersLoading && folders.length === 0) {
    if (debouncedQuery) {
      return <NoSearchResultsFound />;
    }

    return (
      <EmptyScreen
        title="No Categories Found"
        subTitle="There are currently no assessment categories available."
      />
    );
  }

  return (
    <div className="grid sm:grid-cols-6 gap-5 mb-2 mt-2 2xl:grid-cols-8">
      {isFoldersLoading &&
        [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <FolderCardSkeleton key={i} readOnly={true} />
        ))}

      {folders.map((folder) => (
        <FolderCard
          key={folder._id || folder.name}
          id={folder._id}
          logo="folder.svg"
          title={folder.name}
          folders={folder}
          readOnly={true}
          onClick={() => setSelectedCategory(folder)}
        />
      ))}
    </div>
  );
}

/** Yearly (By Time) tab: shows the list of years, and when one is selected shows its assessments inline */
function YearlyView({ debouncedQuery, selectedYear, setSelectedYear }) {
  const { data: yearlyFolders, isLoading: isFoldersLoading, isError, error } = useGetVmFoldersQuery({
    search: debouncedQuery,
    type: 'yearly',
  });

  const { data: assessmentsData, isLoading: isAssessmentsLoading } = useGetVmAssessmentsQuery(
    {
      before: selectedYear ? `Dec${selectedYear.name}` : undefined,
      after: selectedYear ? `Jan${selectedYear.name}` : undefined,
    },
    { skip: !selectedYear },
  );

  const folders = yearlyFolders?.folders || [];
  const assessments = assessmentsData?.data?.assessments || [];

  if (selectedYear) {
    return (
      <div className="mt-2">
        {isAssessmentsLoading && (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <AssessmentColumnCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isAssessmentsLoading && assessments.length === 0 && (
          <EmptyScreen
            title="No Assessments Found"
            subTitle={`No assessments found for year "${selectedYear.name}".`}
          />
        )}

        {assessments.length > 0 && (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {assessments.map((a) => (
              <AssessmentColumnCard
                key={a?._id}
                assId={a?._id}
                icon={<ChartNoAxesGantt className="w-10 h-10 text-foreground" />}
                title={a?.title || a?.name}
                description={a?.description}
                startDate={a?.createdAt}
                status={a?.state}
                progress={a?.remediationProgress}
                vulnerabilities={a?.vulnMetrics}
                showActionButtons={false}
                team={a?.collaborators?.map((c) => c.email)}
                assessment={a}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (isError) {
    return <ApiErrorHandler error={error} />;
  }

  if (!isFoldersLoading && folders.length === 0) {
    if (debouncedQuery) {
      return <NoSearchResultsFound />;
    }

    return (
      <EmptyScreen
        title="No Groups Found"
        subTitle="There are currently no yearly assessment groups available."
      />
    );
  }

  return (
    <div className="grid sm:grid-cols-6 gap-5 mb-2 mt-2 2xl:grid-cols-8">
      {isFoldersLoading &&
        [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <FolderCardSkeleton key={i} readOnly={true} />
        ))}

      {folders.map((folder) => (
        <FolderCard
          key={folder._id || folder.name}
          id={folder._id}
          logo="folder.svg"
          title={folder.name}
          folders={folder}
          readOnly={true}
          onClick={() => setSelectedYear(folder)}
        />
      ))}
    </div>
  );
}

function Folders() {
  const navigate = useNavigate();
  const { query, setQuery, currentPath, setCurrentPath } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'category';
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const debouncedQuery = useDebounce(query, 400);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const resetAllSelections = () => {
    setCurrentPath([]);
    setSelectedYear(null);
    setSelectedCategory(null);
  };

  const handleTabChange = (v) => {
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      nextParams.set('tab', v);
      return nextParams;
    });
    setQuery('');
    resetAllSelections();
  };

  return (
    <div className="p-4">
      <Helmet>
        <title>UniRisk | Assessment Groups</title>
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeading
          title="Assessment Groups"
          description="Group Assessments into folders to manage them more effectively."
        />
      </div>

      {/* Breadcrumb */}
      {(currentPath.length > 0 || selectedYear || selectedCategory) && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <Card>
            <CardContent className="px-4 py-2.5">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className="cursor-pointer flex items-center gap-1"
                      onClick={resetAllSelections}
                    >
                      <Home className="size-4" />
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {/* Custom Tab Breadcrumbs */}
                  {activeTab === 'custom' &&
                    currentPath.map((folder, idx) => (
                      <span key={folder._id} className="flex items-center">
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink
                            onClick={() =>
                              setCurrentPath(currentPath.slice(0, idx + 1))
                            }
                          >
                            {folder.name}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                      </span>
                    ))}

                  {/* Yearly Tab Breadcrumb */}
                  {activeTab === 'yearly' && selectedYear && (
                    <span className="flex items-center">
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink>{selectedYear.name}</BreadcrumbLink>
                      </BreadcrumbItem>
                    </span>
                  )}

                  {/* Category Tab Breadcrumb */}
                  {activeTab === 'category' && selectedCategory && (
                    <span className="flex items-center">
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink>{selectedCategory.name}</BreadcrumbLink>
                      </BreadcrumbItem>
                    </span>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="mt-0"
      >
        <div className="flex items-end justify-between border-b border-border mb-4">
          <TabsList variant="line" className="mb-[-1px]">
            <TabsTrigger value="category">By Category</TabsTrigger>
            <TabsTrigger value="yearly">By Time</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <div className="mb-2">
            <SearchInput
              value={query}
              onChange={handleSearchChange}
              placeholder="Search Groups..."
              isSearching={false}
            />
          </div>
        </div>

        <TabsContent value="custom">
          <FolderGrid
            queryParams={{ search: debouncedQuery }}
            readOnly={false}
            navigate={navigate}
            currentPath={currentPath}
            setCurrentPath={setCurrentPath}
          />
        </TabsContent>

        <TabsContent value="yearly">
          <YearlyView
            debouncedQuery={debouncedQuery}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        </TabsContent>

        <TabsContent value="category">
          <CategoryView
            debouncedQuery={debouncedQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Folders;
