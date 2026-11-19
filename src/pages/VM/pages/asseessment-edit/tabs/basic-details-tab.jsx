import { useState } from 'react';
import { Faq } from '@/partials/common/faq';
import { HighlightedPosts } from '@/partials/common/highlighted-posts';
import { Settings, ToggleRight, Upload } from 'lucide-react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { debounce } from '@/lib/helpers';
import CSVImport from '../components/csv-import';
import { useGetOrgMembersQuery } from '@/services/auth/orgApi';
import { useUpdateVmAssessmentMutation, useUpdateVmScopeMutation } from '@/services/vm/assessmentsApi';
import {
  useGetVmAssetTagsQuery,
} from '@/services/vm/assetsApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AssessmentType } from '../components/assessment-type';
import { BasicEdit } from '../components/basic-edit';
import { Collabrators } from '../components/collabrators';
import { StopPauseAssessment } from '../components/stop-pause-assessment';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { EmptyScreen } from "@/components/common/empty-screen"
import useDebounce from '../../../../../hooks/use-debounce';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';

function BasicDetailsTab({ data, stats, loading, isError, error }) {
  const [params] = useSearchParams();
  const [search, setSearch] = useState('');
  const [assetSearch, setAssetSearch] = useState('');
  const assessmentId = params.get('assessmentId');
  const navigate = useNavigate();
  const [showCsvModal, setShowCsvModal] = useState(false);

  const debouncedSearch = useDebounce(search, 400)

  const {
    data: members,
    isLoading: loadingMembers,
    isFetching: fetchingMembers,
  } = useGetOrgMembersQuery({ search: debouncedSearch }, {
    skip: !open
  });

  const {
    data: tags,
    isLoading: tagsLoading,
    isFetching: tagsFetching,
  } = useGetVmAssetTagsQuery();

  const [updateAssessment, { isLoading: isUpdatingAssignment }] = useUpdateVmAssessmentMutation();
  const [updateScope] = useUpdateVmScopeMutation();

  const handleUpdateScope = (updates) => {
    toast.promise(updateScope({ assessmentId, ...updates }).unwrap(), {
      loading: 'Updating Scope',
      success: 'Scope updated',
      error: 'Failed to update scope',
    });
  };

  const handleUpdateAssessment = (updates) => {
    toast.promise(updateAssessment({ assessmentId, ...updates }).unwrap(), {
      loading: 'Updating Assessment',
      success: 'Assessment updated',
      error: 'Failed to update assessment',
    });
  };


  const handleCollaboratorSearchChange = (value) => {
    setSearch(value);
  };

  const posts = [
    {
      icon: ToggleRight,
      title: 'Fortifying Privacy Controls: Customization and Guidelines',
      summary: `Manage who can access detailed vulnerability findings across different assessment types. Customize access levels (Black Box, Grey Box, White Box) to control the visibility of discovered issues and remediation steps. This guide helps you enforce privacy policies, configure access for internal and external collaborators, and ensure only the right people see sensitive vulnerability data.`,
      path: '#',
    },
    // {
    //   icon: Settings,
    //   title: 'Navigating Privacy Preferences: Secure Configuration Tools',
    //   summary:
    //     'Configure how vulnerability data is shared, accessed, and protected. Learn to manage assessment states (start, pause, finish), restrict report visibility, and enable secure collaboration. This guide provides tools to prevent unauthorized exposure of critical findings and ensures full control over who can view and interact with assessment results.',
    //   path: '#',
    // },
  ];

  // if (!data && !loading) {
  //   return <EmptyScreen
  //     title="No settings availabe"
  //     subTitle="There are no settings to display"
  //     darkImgUrl='/media/illustrations/30-dark.svg'
  //     lightImgUrl='/media/illustrations/30.svg'
  //   />
  // }

  // show skeleton
  if (
    !isError && (
      loadingMembers ||
      tagsLoading ||
      tagsFetching ||
      loading
    )
  ) {
    return (
      <div className="flex justify-between gap-4 animate-pulse w-full">
        {/* Left column (75% width) */}
        <div className="flex flex-col gap-4 w-[75%]">
          {/* BasicEdit Card Skeleton */}
          <Card>
            <CardHeader className="border-b px-6 py-4 flex flex-row items-center justify-between">
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-9 w-20 rounded-md" />
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>

          {/* Row of AssessmentType and StopPauseAssessment Skeletons */}
          <div className="grid lg:grid-cols-2 gap-5 lg:gap-4">
            {/* AssessmentType Card Skeleton */}
            <Card>
              <CardHeader className="border-b px-6 py-4">
                <Skeleton className="h-6 w-36 rounded" />
              </CardHeader>
              <CardContent className="p-4 border-b border-border flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-3 w-40 rounded" />
                </div>
                <Skeleton className="size-4 rounded-full" />
              </CardContent>
              <CardContent className="p-4 border-b border-border flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-3 w-44 rounded" />
                </div>
                <Skeleton className="size-4 rounded-full" />
              </CardContent>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-3 w-48 rounded" />
                </div>
                <Skeleton className="size-4 rounded-full" />
              </CardContent>
            </Card>

            {/* StopPauseAssessment Card Skeleton */}
            <Card>
              <CardHeader className="border-b px-6 py-4">
                <Skeleton className="h-6 w-48 rounded" />
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-24 rounded-md" />
                  <Skeleton className="h-10 w-24 rounded-md" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right column (25% width) */}
        <div className="flex flex-col gap-4 w-[25%]">
          {/* Collaborators Card Skeleton */}
          <Card>
            <CardHeader className="border-b px-6 py-4">
              <Skeleton className="h-6 w-28 rounded" />
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-16 rounded-md" />
              </div>
              <div className="space-y-4 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="size-[30px] rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-24 rounded" />
                        <Skeleton className="h-3 w-16 rounded" />
                      </div>
                    </div>
                    <Skeleton className="size-6 rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if(isError) return <ApiErrorHandler error={error}/>

  return (
    <div>
      {/* <div className='flex items-center justify-between'>
        <div>
          <h2 className="text-sm+ font-semibold">Basic Details</h2>
          <p className="text-sm text-secondary-foreground">This tab contains basic details of the assessment.</p>
        </div>


        <div className="flex items-center gap-2.5">
        </div>
      </div> */}

      <CSVImport
        isOpen={showCsvModal}
        setIsOpen={setShowCsvModal}
        assessmentId={assessmentId}
      />

      <div className=" flex justify-between gap-4">
        <div className="flex flex-col gap-4 w-[75%]">
          <BasicEdit
            assessment={data}
            onUpdate={handleUpdateAssessment}
            isUpdatingAssignment={isUpdatingAssignment}
            onUpdateScope={handleUpdateScope}
            assetSearch={debounce(setAssetSearch, 200)}
            membersSearch={debounce(setSearch, 200)}
            members={members?.data?.members || []}
          />

          <div className="grid lg:grid-cols-2 gap-5 lg:gap-4">
            <AssessmentType
              assessment={data}
              onUpdate={handleUpdateAssessment}
            />
            <StopPauseAssessment
              assessment={data}
              onUpdate={handleUpdateAssessment}
            />
          </div>

          {/* <Faq /> */}
        </div>

        <div className="flex flex-col gap-4 w-[25%]">
          <Collabrators
            assessment={data}
            members={members?.data?.members || []}
            onSearchChange={handleCollaboratorSearchChange}
            isLoadingMembers={loadingMembers || fetchingMembers}
          />
          {/* <HighlightedPosts posts={posts} /> */}
        </div>
      </div>
    </div>
  );
}

export default BasicDetailsTab;
