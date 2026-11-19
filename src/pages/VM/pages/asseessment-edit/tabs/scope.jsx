import React from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  Database,
  Download,
  FileText,
  GitPullRequest,
  Globe,
  Link as LinkIcon,
  Server,
  Share2,
  Shield,
  Smartphone,

} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from "@/components/custom/button-with-confirmation"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import Editor from '@/components/custom/Editor';
import {
  useGetVmCustomScopeQuery,
  useApproveVmCustomScopeMutation,
  useLazyDownloadVmFilesQuery,
} from '@/services/vm/custom-scope';
import { CustomTooltip } from '@/components/custom/tooltip';
import Select from "@/components/custom/select";
import { copyToClipboard } from "@/lib/helpers";
import { Share } from "lucide-react";
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';



function Scope() {
  const [params] = useSearchParams();
  const [selectedVersion, setSelectedVersion] = React.useState(1);

  const { data, isLoading, isError, error } = usVmeGetCustomScopeQuery(
    {
      assessmentId: params.get('assessmentId'),
      params: {
        version: selectedVersion
      }
    }
  );

  const [approveScope] = useApproveVmCustomScopeMutation();

  const [triggerDownload] = useLazyDownloadVmFilesQuery();

  const handleDownload = async (file) => {
    try {
      const blob = await triggerDownload(file.filename).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.original_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed', error);
      toast.error('Failed to download file');
    }
  };


  const handleApproveScope = () => {
    toast.promise(approveScope({ assessmentId: params.get('assessmentId'), payload: { state: "approved", version: selectedVersion || data?.version } }).unwrap(), {
      loading: 'Approving scope...',
      success: 'Scope approved successfully',
      error: 'Failed to approve scope'
    });
  };

  const scope = data?.data || {};

  const {
    domains = [],
    ip_ranges = [],
    api_endpoints = [],
    mobile_apks = [],
    exclusions = [],
    scope_markdown_document = '',
    supporting_files = [],
    environment = '',
  } = scope;

  const totalAssets =
    domains.length +
    ip_ranges.length +
    api_endpoints.length +
    mobile_apks.length;
  const isProduction = environment === 'production';
  const productionAssets = isProduction ? totalAssets : 0;

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  const handleCopyLink = () => {
    copyToClipboard(`${window.location.origin}/pages/public/pentest-scope/${params.get('assessmentId')}`);
    toast.success('Link copied to clipboard');
    setTimeout(() => {
      toast.dismiss();
    }, 2000);
  }

  if (!isError && isLoading) {
    return (
      <div className="-mt-4 animate-pulse">
        <div className="flex justify-end items-center mb-4">
          <div className="flex items-center justify-end gap-2">
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
          </div>
        </div>

        <div className="space-y-6 mt-2">
          {/* Row of 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <Skeleton className="h-8 w-12 rounded" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <Skeleton className="h-8 w-12 rounded" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <Skeleton className="h-8 w-12 rounded" />
              </CardContent>
            </Card>
          </div>

          {/* Assets In Scope Card */}
          <Card>
            <CardHeader className="border-b px-6 py-4">
              <Skeleton className="h-6 w-36 rounded" />
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div>
                <Skeleton className="h-4 w-28 mb-4 rounded" />
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Out of Scope Card */}
          <Card>
            <CardHeader className="border-b px-6 py-4">
              <Skeleton className="h-6 w-28 rounded" />
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
            </CardContent>
          </Card>

          {/* Scope Document Card */}
          <Card>
            <CardHeader className="border-b px-6 py-4">
              <Skeleton className="h-6 w-32 rounded" />
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if(isError) return <ApiErrorHandler error={error} />

  const url = `${window.location.origin}/pages/public/pentest-scope/${params.get('assessmentId')}`;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Scope URL copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };



  if (!isLoading && !data?.data)
    return (
      <EmptyScreen
        title={'No Scope available'}
        subTitle={
          'The scope has not yet been shared by the customer. Please provide them with the following URL:'
        }
        engage={
          <div className="mt-2 flex items-center justify-center gap-2 break-all">
            {/* <Link
              to={`${window.location.origin}/pages/public/pentest-scope?${params.get('assessmentId')}`}
              className="text-center hover:text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {`${window.location.origin}/pages/public/pentest-scope?${params.get('assessmentId')}`}
            </Link> */}

            {/* <Copy
              size={16}
              className="cursor-pointer shrink-0 hover:text-muted-foreground"
              title="Copy URL"

            /> */}
            <Button variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/pages/public/pentest-scope/${params.get('assessmentId')}`,
                );
                toast.info('URL Copied');
              }}>
              <Copy /> Click here to copy the URL
            </Button>
          </div>
        }
      />
    );

  const versions = data?.versions?.map?.(v => ({ id: String(v), label: `Version ${v}`, value: String(v) }));

  return (
    <div className='-mt-4'>
      <div className='flex justify-end items-center'>
        {/* <div>
          <h2 className="text-sm+ font-semibold">Scope</h2>
        </div> */}

        <div className="flex items-center justify-end gap-2">
          <Select
            className="w-[200px]"
            placeholder="Select Version"
            enableSearch={false}
            options={versions}
            defaultValue={String(data?.data?.version)}
            onChange={(e) => {
              setSelectedVersion(e.value);
            }}
          />

          <Button variant="outline" onClick={handleCopyLink}><Share2 /> Scope From URL </Button>
        </div>
      </div>

      <div className="space-y-6 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Assets
                </span>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold">{totalAssets}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Production Assets
                </span>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-red-600">
                {productionAssets}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Supporting Files
                </span>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold">{supporting_files.length}</div>
            </CardContent>
          </Card>
        </div>

        {
          isProduction && (
            <Alert
              variant="destructive"
              appearance="light"
              className="border-l-4 border-l-red-600"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-semibold text-red-900">
                Production Environment Testing
              </AlertTitle>
              <AlertDescription className="text-red-800">
                This scope includes production assets. Ensure proper authorization,
                coordination, and read-only testing protocols are enforced. All
                actions will be audit-logged.
              </AlertDescription>
            </Alert>
          )
        }

        <Card>
          <CardHeader className="border-b px-6 py-4">
            <CardTitle>Assets In Scope</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {domains.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  <Globe className="h-4 w-4" /> DOMAINS
                </div>
                <div className="space-y-3">
                  {domains.map((domain, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm">{domain}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ip_ranges.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  <Server className="h-4 w-4" /> IP RANGES
                </div>
                <div className="space-y-3">
                  {ip_ranges.map((ip, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm">{ip}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {api_endpoints.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  <LinkIcon className="h-4 w-4" /> API ENDPOINTS
                </div>
                <div className="space-y-3">
                  {api_endpoints.map((endpoint, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm">{endpoint}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mobile_apks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  <Smartphone className="h-4 w-4" /> MOBILE APPLICATIONS
                </div>
                <div className="space-y-3">
                  {mobile_apks.map((app, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg bg-card"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-sm">
                          {app.original_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {app.file_type} • {formatBytes(app.file_size)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(app)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b px-6 py-4">
            <CardTitle>Out of Scope</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {exclusions.length > 0 ? (
              <ul className="space-y-3">
                {exclusions.map((exclusion, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                    {exclusion}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No exclusions defined.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b px-6 py-4">
            <CardTitle>Scope Document</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Editor
              key={scope_markdown_document}
              defaultValue={scope_markdown_document}
              readOnly={true}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b px-6 py-4">
            <CardTitle>Supporting Documentation</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {supporting_files.length > 0 ? (
              supporting_files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-lg">
                      <Database className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {file.original_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatBytes(file.file_size)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => handleDownload(file)}
                  >
                    Download
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No supporting documentation.
              </p>
            )}
          </CardContent>
        </Card>

        {
          data?.data?.state == "review" && <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-semibold">Scope Review Actions</span>
                <span className="text-sm text-muted-foreground">
                  All actions are audit-logged and will notify the customer
                </span>
              </div>

              <AuthorityGuard forbidRoles={["Auditor"]}>
              <div className="flex items-center gap-3">
                {/* <Button variant="outline"><GitPullRequest /> Request Changes</Button> */}
                <ButtonWithConfirm confirm={true} variant="primary" onConfirm={() => handleApproveScope()}>
                  <Check className="h-4 w-4 mr-2" />
                  Approve & Lock Scope
                </ButtonWithConfirm>
              </div>
              </AuthorityGuard>
            </CardContent>
          </Card>
        }

      </div >

    </div>

  );
}

export default Scope;
