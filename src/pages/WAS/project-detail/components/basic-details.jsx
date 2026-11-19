import { useEffect, useState } from 'react';
import _ from 'lodash';
import { Check, Download, Eye, Globe, Pencil, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import appConfig from '@/config/appConfig';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useDeleteApisecProjectsMutation } from '@/services/apisec/projectsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { useUpdateApisecProjectMutation } from '../../../../services/apisec/projectsApi';

const BasicDetails = ({ data = {}, trueDescription, status, isLoading }) => {
  const [deleteProject, { isLoading: isDeleting }] =
    useDeleteApisecProjectsMutation();
  const [updateProject, { isLoading: isUpdating }] =
    useUpdateApisecProjectMutation();

  const projectId = window.location.pathname?.split('/')?.at(-1);
  const navigate = useNavigate();

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [name, setName] = useState(data?.name || '');
  const [description, setDescription] = useState(trueDescription || '');

  useEffect(() => {
    if (data?.name) setName(data.name);
    if (data?.description) setDescription(data.description);
  }, [data]);

  const handleSaveName = async () => {
    if (!name.trim()) return;
    try {
      await updateProject({
        payload: { name },
        projectId,
      }).unwrap();
      toast.success('Project name updated');
      setIsEditingName(false);
    } catch (error) {
      toast.error('Failed to update project name');
    }
  };

  const handleSaveDescription = async () => {
    try {
      await updateProject({
        payload: { description },
        projectId,
      }).unwrap();
      toast.success('Project description updated');
      setIsEditingDescription(false);
    } catch (error) {
      toast.error('Failed to update project description');
    }
  };

  const handleDelete = () => {
    toast.promise(deleteProject(projectId).unwrap(), {
      loading: 'Deleting Project',
      success: (res) => {
        navigate('/was/projects');
        return 'Project Deleted';
      },
      error: 'Failed to delete project',
    });
  };
  const handleDownloadReport = async () => {
    setIsDownloading(true);
    toast.info('Generating report, please wait...');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${appConfig.BASE_URL}/apisec/api/v1/reports/download/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) throw new Error('Report generation failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-report-${name.replace(/\s+/g, '-').toLowerCase()}-${projectId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Report downloaded');
    } catch (err) {
      toast.error('Failed to generate report');
    } finally {
      setIsDownloading(false);
    }
  };

  const statistics = Array.isArray(data?.state_distribution)
    ? data.state_distribution.map((item) => ({
        total: item._id, // Use _id as the label (e.g., "In Review")
        description: item.count,
      }))
    : Object.entries(data?.state_distribution || {})?.map(([key, value]) => ({
        total: _.capitalize(key),
        description:
          typeof value === 'object' && value !== null ? value.count : value,
      }));

  // const statistics = [
  //   {
  //     total: 'Pending',
  //     description: data?.state_distribution?.pending || 0
  //   },
  //   {
  //     total: 'Acknowledged',
  //     description: data?.state_distribution?.acknowledged || 0
  //   },
  //   {
  //     total: 'Risk Accepted',
  //     description: data?.state_distribution?.risk_accepted || 0
  //   },
  //   {
  //     total: 'Need More Info',
  //     description: data?.state_distribution?.need_more_info || 0
  //   },
  //   {
  //     total: 'In Progress',
  //     description: data?.state_distribution?.in_progress || 0
  //   },
  //   {
  //     total: 'Fixed',
  //     description: data?.state_distribution?.fixed || 0
  //   },
  //   {
  //     total: 'Fix Verified',
  //     description: data?.state_distribution?.fix_verified || 0
  //   },
  // ];

  const renderItem = (statistic, index) => {
    return (
      <div
        key={index}
        className="flex flex-col gap-1.5 px-2.75 py-2.25 border border-dashed border-input rounded-md"
      >
        <span className="text-mono text-sm leading-none font-medium">
          {statistic.total}
        </span>
        <span className="text-secondary-foreground text-xs">
          {statistic.description}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="lg:py-7.5 animate-pulse">
          <div className="flex flex-wrap gap-7.5">
            {/* Globe box skeleton */}
            <div className="flex flex-col gap-3 items-center justify-center size-[140px] rounded-xl ring-1 ring-border bg-secondary-clarity shrink-0">
              <Skeleton className="size-[50px] rounded-full" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>

            <div className="flex flex-col gap-5 lg:gap-7.5 grow">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Name / Description text skeleton */}
                <div className="flex flex-col gap-2.5 w-full max-w-2xl">
                  <Skeleton className="h-7 w-48 rounded" />
                  <Skeleton className="h-4 w-96 rounded" />
                </div>

                {/* Actions buttons skeleton */}
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-9 w-24 rounded-md" />
                  <Skeleton className="h-9 w-36 rounded-md" />
                  <Skeleton className="h-9 w-32 rounded-md" />
                </div>
              </div>

              {/* Statistics badges grid skeleton */}
              <div className="flex items-center flex-wrap gap-3 lg:gap-5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1.5 px-2.75 py-2.25 border border-dashed border-input rounded-md min-w-[100px]"
                  >
                    <Skeleton className="h-3 w-16 rounded" />
                    <Skeleton className="h-3 w-8 rounded" />
                  </div>
                ))}
              </div>

              {/* Progress bar skeleton */}
              <div className="flex flex-wrap gap-6 lg:gap-12">
                <div className="flex flex-col gap-3.5 grow">
                  <Skeleton className="h-4 w-60 rounded" />
                  <Skeleton className="h-2 w-full rounded" />
                </div>
                <div className="lg:min-w-24 shrink-0" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="lg:py-7.5">
        <div className="flex flex-wrap gap-7.5">
          <div className="flex flex-col gap-3 items-center justify-center size-[140px] rounded-xl ring-1 ring-border bg-secondary-clarity">
            <Globe className="size-[50px]" />

            <span className="text-sm font-semibold text-mono text-center">
              {data?.name}
            </span>
          </div>
          <div className="flex flex-col gap-5 lg:gap-7.5 grow">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-col gap-1 w-full max-w-2xl">
                <div className="flex items-center gap-2.5 h-9">
                  {isEditingName ? (
                    <div className="flex items-center gap-2 w-100">
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-8"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={handleSaveName}
                        disabled={isUpdating}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => {
                          setName(data?.name || '');
                          setIsEditingName(false);
                        }}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-semibold text-mono">
                        {data?.name}
                      </h2>
                      <AuthorityGuard forbidRoles={['Auditor']}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 opacity-50 hover:opacity-100"
                          onClick={() => setIsEditingName(true)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </AuthorityGuard>
                    </>
                  )}
                </div>

                <div className="min-h-[24px] flex items-start gap-2">
                  {isEditingDescription ? (
                    <div className="flex items-start gap-2 w-102 mt-1">
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={1}
                        className="resize-none"
                        maxLength={70}
                        autoFocus
                      />
                      <div className="flex  gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={handleSaveDescription}
                          disabled={isUpdating}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => {
                            setDescription(data?.description || '');
                            setIsEditingDescription(false);
                          }}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-secondary-foreground">
                        {trueDescription || 'No description provided.'}
                      </p>
                      <AuthorityGuard forbidRoles={['Auditor']}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 opacity-50 hover:opacity-100 -mt-0.5"
                          onClick={() => setIsEditingDescription(true)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </AuthorityGuard>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {status === 'completed' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => window.open(`/pages/public/was-reports/project-report?projectId=${projectId}&view_mode=web`, '_blank')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <ButtonWithConfirm
                      confirm
                      confirmVariant="success"
                      variant="outline"
                      onConfirm={handleDownloadReport}
                      disabled={isDownloading}
                      dialog="This will download the report for this project. Do you want to proceed?"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isDownloading ? 'Downloading...' : 'Download Report'}
                    </ButtonWithConfirm>
                  </>
                )}
                <AuthorityGuard roles={['Admin']}>
                  <ButtonWithConfirm
                    confirm={true}
                    disabled={isDeleting}
                    onConfirm={() => {
                      if (isDeleting) return;
                      handleDelete();
                    }}
                    dialog="This action requires confirmation, click delete to proceed."
                    variant="destructive"
                    confirmButton={<Button variant="destructive">Delete</Button>}
                    cancelButton={<Button variant="outline">Cancel</Button>}
                  >
                    Delete
                  </ButtonWithConfirm>
                </AuthorityGuard>
              </div>
            </div>
            <div className="flex items-center flex-wrap gap-3 lg:gap-5">
              {statistics.map((statistic, index) => {
                return renderItem(statistic, index);
              })}
            </div>
            <div className="flex flex-wrap gap-6 lg:gap-12">
              <div className="flex flex-col gap-3.5 grow">
                <div className="text-sm text-secondary-foreground">
                  Resolved{' '}
                  <span className="text-sm font-medium text-mono">
                    {data?.totalResolved}
                  </span>{' '}
                  out of{' '}
                  <span className="text-sm font-medium text-mono">
                    {data?.totalVulns}
                  </span>{' '}
                  Identified Vulnerabilities
                </div>
                <Progress value={data?.remediation} className="w-full" />
              </div>
              <div className="flex flex-col gap-2.5 lg:min-w-24 shrink-0 -mt-3 max-w-auto">
                {/* <div className="text-sm font-medium text-secondary-foreground">
                  Members :
                </div>
                <CustomAvatarGroup
                    emails={assessmentData?.collaborators?.map((item) => item.email)}
                    size={'size-[30px]'}
                    more={{
                      number: 10,
                      variant: 'text-white ring-background bg-green-500',
                    }}
                /> */}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { BasicDetails };
