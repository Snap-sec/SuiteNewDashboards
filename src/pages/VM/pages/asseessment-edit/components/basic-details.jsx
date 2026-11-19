import { useState } from 'react';
import { AvatarGroup } from '@/partials/common/avatar-group';
import { RiFilePdf2Line } from '@remixicon/react';
import {
  Bug,
  Check,
  Copy,
  Edit,
  FileDown,
  Files,
  FileUp,
  Loader,
  Loader2,
  LogOut,
  MoreHorizontal,
  Pencil,
  RotateCw,
  Trash2,
  X,
} from 'lucide-react';
import { Link } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import appconfig from '@/config/appConfig';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { CustomAvatarGroup } from '@/components/custom/avatar-group';
import {
  ButtonWithConfirm,
  ConfirmDialog,
} from '@/components/custom/button-with-confirmation';
import { AssessmentBadges } from '../../../../../components/custom/assessment-states';
import { StatusBadge } from '../../../../../components/custom/status-badge';
import { CustomTooltip } from '../../../../../components/custom/tooltip';
import {
  useDeleteVmAssessmentMutation,
  useLazyGetVmAssessmentToCSVQuery,
  useRemoveYourselfFromVmAssessmentMutation,
  useUpdateVmAssessmentMutation,
} from '../../../../../services/vm/assessmentsApi';
import RemediationProgress from '../../assets/components/ui/remediation-progress';
import CSVImport from './csv-import';

const BasicDetails = ({
  data,
  assessmentData,
  loading,
  refetchStats,
  refetchDetails,
  isRefreshing,
}) => {
  const [deleteAssessment] = useDeleteVmAssessmentMutation();
  const [downloadCSVAssessmentFile, { isLoading: isExporting }] =
    useLazyGetVmAssessmentToCSVQuery();
  const [removeYourself] = useRemoveYourselfFromVmAssessmentMutation();
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [showExportCsvConfirm, setShowExportCsvConfirm] = useState(false);
  const [showLeaveProjectConfirm, setShowLeaveProjectConfirm] = useState(false);
  const [showDeleteAssessmentConfirm, setShowDeleteAssessmentConfirm] =
    useState(false);
  const [updateAssessment, { isLoading: isUpdatingName }] =
    useUpdateVmAssessmentMutation();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');

  const params = new URLSearchParams(window.location.search);
  const assessmentId = params.get('assessmentId');

  const navigate = useNavigate();

  const handleDeleteAssessment = () => {
    toast.promise(deleteAssessment(assessmentId).unwrap(), {
      loading: 'Deleting Assessment...',
      success: (res) => {
        navigate('/vm/assessments');
        return res?.message || 'Assessment Deleted';
      },
      error: (err) => err?.data?.message || err?.data?.error || (typeof err?.data?.data === 'string' ? err?.data?.data : null) || 'Failed to delete Assessment',
    });
  };

  const handleLeaveProject = () => {
    toast.promise(removeYourself({ assessmentId }).unwrap(), {
      loading: 'Leaving project...',
      success: (res) => {
        navigate('/vm/assessments');
        return res?.message || 'Left project successfully';
      },
      error: (err) => err?.data?.message || 'Failed to leave project',
    });
  };

  const handleCopyAssmntUrl = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/pages/public/report-new?assessmentId=${assessmentId}`,
      );
      toast.success('Reporting Portal Link Copied');
    } catch (err) {
      toast.error('Failed to Copy Link');
    }
  };

  const handleCopyAssessmentId = async () => {
    try {
      await navigator.clipboard.writeText(assessmentId);
      toast.success('Assessment ID Copied');
    } catch (err) {
      toast.error('Failed to Copy ID');
    }
  };

  const handleExportCSV = async () => {
    const downloadPromise = async () => {
      const authToken = localStorage.getItem('token');
      const exportURL = `${appconfig.BASE_URL}/csm/api/assessments/${assessmentId}/csv-export`;

      const response = await fetch(exportURL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to export assessment');
      }

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `assessment-${assessmentId}.zip`;
      if (contentDisposition) {
        const match = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
        );
        if (match) {
          filename = match[1].replace(/['"]/g, '');
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setShowExportCsvConfirm(false);

      return 'Report Exported Successfully';
    };

    toast.promise(downloadPromise(), {
      loading: 'Exporting report...',
      success: (message) => message,
      error: (err) => err.message || 'Error exporting report',
    });
  };

  const downloadReport = async () => {
    const downloadPromise = async () => {
      const authToken = localStorage.getItem('token');
      const downloadReportURL = `${appconfig.BASE_URL}${assessmentData?.reportUrl}`;

      const response = await fetch(downloadReportURL, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      const contentType = response.headers.get('Content-Type');

      // Handle JSON error responses
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        if (data.message) {
          throw new Error(data.message);
        }
      }

      // Parse filename from Content-Disposition header
      const getFilename = () => {
        const contentDisposition = response.headers.get('Content-Disposition');
        if (!contentDisposition) return 'snapsec_report.pdf';

        const match = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
        );
        return match ? match[1].replace(/['"]/g, '') : 'snapsec_report.pdf';
      };

      const blob = await response.blob();

      // Validate PDF response
      if (blob.type !== 'application/pdf') {
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Report not found!');
        } catch {
          throw new Error('Report not found!');
        }
      }

      // Download the file
      const filename = getFilename();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return 'Report Downloaded Successfully';
    };

    // Use toast.promise for clean loading/success/error handling
    toast.promise(downloadPromise(), {
      loading: 'Downloading Report...',
      success: (message) => message,
      error: (err) => err.message || 'Failed to download the report!',
    });
  };

  const details = data?.data || data || {};

  const currentAssessmentName =
    details?.assessmentName || assessmentData?.title || '';

  const handleStartEditName = () => {
    setEditedName(currentAssessmentName);
    setIsEditingName(true);
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  const handleSaveAssessmentName = () => {
    const trimmed = editedName.trim();
    if (!trimmed) {
      toast.error('Assessment name cannot be empty');
      return;
    }

    if (trimmed === currentAssessmentName) {
      setIsEditingName(false);
      return;
    }

    toast.promise(
      updateAssessment({
        assessmentId,
        title: trimmed,
        assessmentName: trimmed,
      }).unwrap(),
      {
        loading: 'Updating assessment name...',
        success: () => {
          setIsEditingName(false);
          refetchStats?.();
          refetchDetails?.();
          return 'Assessment name updated successfully';
        },
        error: (err) =>
          err?.data?.message ||
          err?.data?.error ||
          (typeof err?.data?.data === 'string' ? err?.data?.data : null) ||
          'Failed to update assessment name',
      }
    );
  };

  const formattedStatus =
    details?.assessmentState?.toLowerCase() === 'not configured'
      ? { variant: 'destructive', label: details }
      : details?.assessmentState?.toLowerCase() === 'running'
        ? { variant: 'warning', label: details }
        : details?.assessmentState?.toLowerCase() === 'completed'
          ? { variant: 'success', label: details }
          : { variant: 'primary', label: details };

  const statistics = [
    {
      total: 'In Review',
      description: details?.inReview,
    },
    {
      total: 'In Progress',
      description: details?.inProgress,
    },
    {
      total: 'Resolved',
      description: details?.resolved,
    },
    {
      total: 'Un Resolved',
      description: details?.unResolved,
    },
    {
      total: 'Not Applicable',
      description: details?.notApplicable,
    },
    {
      total: 'Re-Test',
      description: details?.retest,
    },
    {
      total: 'Duplicate',
      description: details?.duplicate,
    },
    {
      total: 'Fixed in Staging',
      description: details?.fixedInStaging,
    },
    {
      total: 'Risk Accepted',
      description: details?.riskAccepted,
    },

    {
      total: 'False Positives',
      description: details?.falsePositive,
    },
  ];

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

  if (loading) {
    return (
      <Card>
        <CardContent className="lg:py-7.5">
          <div className="flex flex-wrap gap-7.5">
            <div className="flex flex-col gap-3 items-center justify-center size-[140px] rounded-xl ring-1 ring-border bg-secondary-clarity animate-pulse">
              <Skeleton className="size-[70px] rounded-lg" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            <div className="flex flex-col gap-5 lg:gap-7.5 grow">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-8 w-48 rounded" />
                    <Skeleton className="h-6 w-20 rounded" />
                  </div>
                  <Skeleton className="h-4 w-64 rounded" />
                </div>
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
              <div className="flex items-center flex-wrap gap-3 lg:gap-5">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-1.5 px-2.75 py-2.25 border border-dashed border-input rounded-md min-w-[100px]"
                  >
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-3.5 w-8 rounded" />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-6 lg:gap-12">
                <div className="flex flex-col gap-3.5 grow">
                  <Skeleton className="h-4 w-72 rounded" />
                  <Skeleton className="h-2 w-full rounded" />
                </div>
                <div className="flex flex-col justify-center gap-2.5 lg:min-w-24 shrink-0 -mt-3 max-w-auto">
                  <div className="flex gap-1.5">
                    <Skeleton className="size-[30px] rounded-full" />
                    <Skeleton className="size-[30px] rounded-full" />
                    <Skeleton className="size-[30px] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="lg:py-7.5">
          <div className="flex flex-wrap gap-7.5">
            <div className="flex flex-col gap-3 items-center justify-center size-[140px] rounded-xl ring-1 ring-border bg-secondary-clarity ">
              <img
                src={toAbsoluteUrl('/media/brand-logos/cloud-one.svg')}
                className="size-[70px]"
                alt="image"
              />

              <span className="text-sm font-semibold text-mono text-center">
                {details?.assessmentName && details.assessmentName.length > 10
                  ? `${details.assessmentName.substring(0, 10)}...`
                  : details?.assessmentName}
              </span>
            </div>
            <div className="flex flex-col gap-5 lg:gap-7.5 grow">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2.5">
                    {isEditingName ? (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveAssessmentName();
                            if (e.key === 'Escape') handleCancelEditName();
                          }}
                          disabled={isUpdatingName}
                          maxLength={35}
                          className="h-9 w-60 sm:w-80 text-lg font-semibold text-mono"
                          autoFocus
                          placeholder="Assessment name"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          onClick={handleSaveAssessmentName}
                          disabled={isUpdatingName || !editedName.trim()}
                          title="Save assessment name"
                        >
                          {isUpdatingName ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Check className="size-4" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 hover:text-destructive"
                          onClick={handleCancelEditName}
                          disabled={isUpdatingName}
                          title="Cancel"
                        >
                          <X className="size-4 text-destructive" />
                        </Button>
                        <AssessmentBadges
                          state={details?.assessmentState}
                          resolved={(details?.totalVulns || 0) - (details?.resolved || 0)}
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-semibold text-mono">
                          {details?.assessmentName || assessmentData?.title || 'Unnamed Assessment'}
                        </h2>

                        <AuthorityGuard forbidRoles={['Auditor']}>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            onClick={handleStartEditName}
                            title="Edit assessment name"
                          >
                            <Edit className="size-3.5" />
                          </Button>
                        </AuthorityGuard>

                        {/* <StatusBadge status={details?.assessmentState}/> */}
                        <AssessmentBadges
                          state={details?.assessmentState}
                          resolved={(details?.totalVulns || 0) - (details?.resolved || 0)}
                        />
                      </>
                    )}
                  </div>
                  <p className="text-sm text-secondary-foreground">
                    Comprehensive security assessment overview.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  {(refetchStats || refetchDetails) && (
                    <CustomTooltip text="Refresh Assessment">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={isRefreshing}
                        onClick={() => {
                          refetchStats?.();
                          refetchDetails?.();
                          toast.success('Assessment refreshed');
                        }}
                      >
                        <RotateCw
                          className={`size-4 text-muted-foreground ${
                            isRefreshing ? 'animate-spin' : ''
                          }`}
                        />
                      </Button>
                    </CustomTooltip>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[200px]"
                      side="bottom"
                      align="end"
                    >
                      <AuthorityGuard roles={'Manager'}>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => setShowLeaveProjectConfirm(true)}
                        >
                          Leave Project
                        </DropdownMenuItem>
                      </AuthorityGuard>

                      <AuthorityGuard roles={'Admin'}>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => setShowCsvModal(true)}
                        >
                          Import CSV
                        </DropdownMenuItem>
                      </AuthorityGuard>

                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                          const url = `${window.location.origin}/vm/vulnerabilities?filters=assessmentId:${assessmentId}`;
                          window.open(url, '_blank');
                        }}
                      >
                        View Vulnerabilities
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={handleCopyAssessmentId}
                      >
                        Copy Assessment ID
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={handleCopyAssmntUrl}
                      >
                        Copy Report URL
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer"
                        disabled={isExporting}
                        onClick={() => setShowExportCsvConfirm(true)}
                      >
                        Export CSV
                      </DropdownMenuItem>

                      {assessmentData?.reportGenerated && (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          disabled={isExporting}
                          onClick={downloadReport}
                        >
                          Download Report
                        </DropdownMenuItem>
                      )}

                      {details?.totalVulns == 0 && (
                        <AuthorityGuard roles={'Admin'}>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => setShowDeleteAssessmentConfirm(true)}
                            variant="destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </AuthorityGuard>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                    Closed{' '}
                    <span className="text-sm font-medium text-mono">
                      {details?.closedVulns}
                    </span>{' '}
                    out of{' '}
                    <span className="text-sm font-medium text-mono">
                      {details?.totalVulns}
                    </span>{' '}
                    Identified Vulnerabilities
                  </div>

                  <RemediationProgress progress={details?.progress} />
                </div>
                <div className="flex flex-col justify-end gap-2.5 lg:min-w-24 shrink-0 -mt-3 max-w-auto">
                  {/* <div className="text-sm font-medium text-secondary-foreground">
                    Members :
                  </div> */}
                  <CustomAvatarGroup
                    emails={assessmentData?.collaborators?.map(
                      (item) => item.email,
                    )}
                    names={assessmentData?.collaborators?.map(
                      (item) => item.name,
                    )}
                    showOnHover="name"
                    size={'size-[30px]'}
                    more={{
                      number: 10,
                      variant: 'text-white ring-background bg-green-500',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <CSVImport
        isOpen={showCsvModal}
        setIsOpen={setShowCsvModal}
        assessmentId={assessmentId}
      />
      <ConfirmDialog
        open={showLeaveProjectConfirm}
        setOpen={setShowLeaveProjectConfirm}
        onConfirm={handleLeaveProject}
        confirmButton={<Button variant="destructive">Leave</Button>}
        dialog="Are you sure you want to leave this project? On leaving you will lose access to all tickets in this assessment."
      />
      <ConfirmDialog
        open={showExportCsvConfirm}
        setOpen={setShowExportCsvConfirm}
        onConfirm={handleExportCSV}
        variant="info"
        dialog="Are you sure you want to export this assessment to CSV? This process may take a few moments."
      />
      <ConfirmDialog
        open={showDeleteAssessmentConfirm}
        setOpen={setShowDeleteAssessmentConfirm}
        onConfirm={handleDeleteAssessment}
        variant="destructive"
        dialog="Are you sure you want to delete this assessment? This action cannot be undone."
      />
    </>
  );
};

export { BasicDetails };
