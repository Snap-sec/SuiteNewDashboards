import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import CreateAssessmentModel from '@/pages/VM/pages/assessment/components/Modal/create-assessment-model';
import { Save } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { useGetScaSettingsQuery, useUpdateScaSettingsMutation } from '@/services/sca/settingsApi';
import { useGetVmAssessmentsQuery } from '@/services/vm/assessmentsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Select from '@/components/custom/select';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import PageHeading from '../../../../components/custom/page-heading';
import AutomaticSyncSwitch from './switches/automatic-sync-switch';


export default function SCASettingsPage({ isDisabled = false }) {
  const { data: scaSettingsData, isLoading: loadingSettings, isError, error } =
    useGetScaSettingsQuery();
  const [assessmentSearch, setAssessmentSearch] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [createAssessmentOpen, setCreateAssessmentOpen] = useState(false);
  const CREATE_ASSESSMENT_VALUE = '__create_assessment__';
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';
  const isFieldDisabled = isDisabled || isAuditor;
  const activeAssessmentId = selectedAssessment || scaSettingsData?.data?.assessmentId;
  const {
    data: assessments,
    isLoading: assessmentsLoading,
    isFetching: assessmentsFetching,
  } = useGetVmAssessmentsQuery(
    {
      search: assessmentSearch,
      limit: 20,
      ...(activeAssessmentId ? { includeIds: activeAssessmentId } : {}),
    },
    { skip: loadingSettings }
  );

  const [updateScaSettings, { isLoading: isUpdatingSettings }] =
    useUpdateScaSettingsMutation();

  const [autoSync, setAutoSync] = useState(true);

  useEffect(() => {
    if (scaSettingsData && scaSettingsData.data) {
      setSelectedAssessment(scaSettingsData.data.assessmentId || 'none');
      if (scaSettingsData.data.auto_sync_vm !== undefined) {
        setAutoSync(scaSettingsData.data.auto_sync_vm);
      }
    }
  }, [scaSettingsData]);

  const handleSaveOrUpdateSettings = () => {
    if (isAuditor) return;
    const payload = {
      assessmentId: selectedAssessment === 'none' ? null : selectedAssessment,
      auto_sync_vm: autoSync,
    };

    toast.promise(updateScaSettings(payload).unwrap(), {
      loading: 'Updating configuration...',
      success: 'Configuration updated successfully',
      error: (err) => err?.data?.message || 'Failed to update configuration',
    });
  };

  if (loadingSettings || assessmentsLoading) {
    return (
      <div className="p-6 space-y-6">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-80" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-60" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="border-t pt-6 flex justify-end">
              <Skeleton className="h-10 w-40" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if(isError) return <ApiErrorHandler error={error}/>

  const sortedAssessments = [...(assessments?.data?.assessments || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const assessmentOptions = [
    ...(!isAuditor
      ? [
          {
            label: '+ Create Assessment',
            value: CREATE_ASSESSMENT_VALUE,
            className: 'text-primary font-medium',
            noNavigate: true,
          },
        ]
      : []),
    { label: 'None', value: 'none', noNavigate: true },
    ...sortedAssessments.map((a) => ({
      label: a.title,
      value: a._id,
    })),
  ];

  return (
    <div className="p-4 space-y-6">
      <Helmet>
        <title>SCA | Settings</title>
      </Helmet>

      <PageHeading
        title="Settings"
        description="Configure SCA synchronization and scanning preferences to control how vulnerability findings are automatically linked and updated across your security assessments."
      />

      {/* Vulnerability Synchronization Configuration Card */}
      <Card className="border-border/60 shadow-sm mt-2">
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold">
              Vulnerability Synchronization Configuration
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              Configure the vulnerability synchronization to your asset
              inventory.
            </p>
          </div>

          <AutomaticSyncSwitch
            autoSync={autoSync}
            setAutoSync={setAutoSync}
            isDisabled={isFieldDisabled}
            isToggling={isUpdatingSettings}
            onToggle={(newValue) => {
              if (isAuditor) return;
              toast.promise(
                updateScaSettings({ auto_sync_vm: newValue }).unwrap(),
                {
                  loading: 'Updating sync setting...',
                  success: `Auto-sync ${newValue ? 'enabled' : 'disabled'} successfully`,
                  error: (err) =>
                    err?.data?.message || 'Failed to update sync setting',
                },
              );
            }}
          />

          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
              Select Assessment
            </p>
            <Select
              value={selectedAssessment}
              options={assessmentOptions}
              onChange={(option) => {
                if (isAuditor) return;
                if (option?.value === CREATE_ASSESSMENT_VALUE) {
                  setCreateAssessmentOpen(true);
                } else {
                  setSelectedAssessment(option?.value);
                }
              }}
              onSearchChange={(s) => setAssessmentSearch(s)}
              isSearching={assessmentsFetching}
              enableSearch={true}
              areOptionsNavigating={true}
              searchPlaceholder="Search by Assessment"
              disabled={isFieldDisabled}
            />
            <CreateAssessmentModel
              open={createAssessmentOpen}
              setOpen={setCreateAssessmentOpen}
            />
          </div>

          <div className="border-t pt-6 flex justify-end">
            <Button
              variant="outline"
              onClick={handleSaveOrUpdateSettings}
              disabled={isFieldDisabled || isUpdatingSettings}
            >
              <Save className="w-4 h-4 mr-2" />
              {scaSettingsData?.data
                ? 'Update Configuration'
                : 'Save Configuration'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}