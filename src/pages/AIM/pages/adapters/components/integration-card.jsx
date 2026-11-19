import { RiProgress1Line } from '@remixicon/react';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Loader,
  RefreshCcw,
  RefreshCw,
  Trash,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useDeleteAimAdapterMutation,
  useInstallAimAdapterMutation,
  useRefreshAimAdapterMutation,
} from '@/services/asset-inventory/adaptersApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { DateFormatter } from '@/components/custom/date-formatter';
import { CustomTooltip } from '@/components/custom/tooltip';
import { Spinner } from '../../../../../components/ui/spinners';
import { useStore } from '../store';

const IntegrationCard = ({ adapter, activeTab }) => {
  const {
    instance_id,
    logo,
    path,
    title,
    type,
    description,
    is_installed,
    status,
    err_message,
    createdAt,
    created_at,
  } = adapter;

  const installedDate = createdAt || created_at;
  const lastRefreshedDate = adapter?.last_refresh;

  const { setShowInstallModal } = useStore();

  const [installAdapter, { isLoading: isInstalling }] =
    useInstallAimAdapterMutation();
  const [deleteAdapter, { isLoading: isDeleting }] =
    useDeleteAimAdapterMutation();
  const [refreshAdapter, { isLoading: isRefreshing }] =
    useRefreshAimAdapterMutation();

  const directInstallTypes = [
    'asm',
    'vm',
    'sslcert',
    'dns',
    'snapsec-asm',
    'vulnerability-management',
    'cert-grabber',
    'dns-resolver',
    'aim',
  ];
  const isDirectInstall =
    directInstallTypes.includes(type?.toLowerCase()) ||
    [
      'snapsec asm',
      'vulnerability management',
      'cert grabber',
      'dns resolver',
    ].includes(title?.toLowerCase());

  const handleDirectInstall = async () => {
    toast.promise(
      installAdapter({
        adapterName: type,
        payload: {},
      }).unwrap(),
      {
        loading: `Installing ${title}...`,
        success: `${title} installed successfully`,
        error: (err) =>
          err?.data?.message ||
          err?.data?.error ||
          `Failed to install ${title}`,
      },
    );
  };

  const handleDelete = async () => {
    toast.promise(deleteAdapter(instance_id).unwrap(), {
      loading: 'Deleting adapter...',
      success: 'Adapter deleted successfully',
      error: 'Failed to delete adapter',
    });
  };

  const handleRefresh = async () => {
    toast.promise(refreshAdapter(instance_id).unwrap(), {
      loading: 'Refreshing adapter...',
      success: 'Adapter refreshed successfully',
      error: 'Failed to refresh adapter',
    });
  };

  const isBusy =
    ['refreshing', 'syncing', 'installing'].includes(status?.toLowerCase()) ||
    isInstalling ||
    isDeleting ||
    isRefreshing;

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'installed':
        return 'success';
      case 'failed':
      case 'refresh_error':
        return 'destructive';
      case 'refreshing':
      case 'syncing':
      case 'installing':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'installed':
        return <CheckCircle className="size-3.5" />;
      case 'failed':
      case 'refresh_error':
        return <AlertCircle className="size-3.5" />;
      case 'refreshing':
      case 'syncing':
        return <Loader className="size-3.5 animate-spin" />;
      case 'installing':
        return <Spinner className="animate-spin w-3 h-3" />;
      case 'pending':
        return <Clock className="size-3.5" />;
      default:
        return <RefreshCw className="size-3.5" />;
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardContent className="p-5 flex-grow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-center bg-muted/30 p-2 rounded-lg">
            <img
              src={logo.toLowerCase()}
              className="h-10 w-10 object-contain"
              alt={title}
            />
          </div>

          <div className="flex flex-wrap gap-1 justify-end">
            {activeTab !== 'active-integrations' &&
              adapter?.category?.map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  size="sm"
                  className="text-[10px] uppercase"
                >
                  {cat}
                </Badge>
              ))}
            {activeTab === 'active-integrations' && status && (
              <CustomTooltip
                text={err_message}
                isTooltipTextHidden={err_message ? false : true}
              >
                <Badge
                  variant={getStatusVariant(status)}
                  appearance="light"
                  className="capitalize flex items-center gap-1"
                >
                  {getStatusIcon(status)}
                  {status}
                </Badge>
              </CustomTooltip>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center flex-wrap gap-2">
            <Link
              to={path || '#'}
              className="text-base font-semibold hover:text-primary transition-colors"
            >
              {title}
            </Link>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>

          {(installedDate || lastRefreshedDate) && (
            <div className="flex flex-row gap-4 justify-start mt-1 text-xs text-muted-foreground">
              {installedDate && (
                <p className="flex items-center gap-1.5">
                  <Clock className="size-3.5 shrink-0" />
                  <span>Installed</span>
                  <DateFormatter date={installedDate} />
                </p>
              )}
              {lastRefreshedDate && (
                <p className="flex items-center gap-1.5">
                  <RefreshCw className="size-3 shrink-0" />
                  <span>Refreshed </span>
                  <DateFormatter date={lastRefreshedDate} />
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="w-full flex justify-between items-center py-3 px-5 border-t bg-muted/5 gap-2 mt-auto">
        <div>
          {adapter?.installed_count > 0 && activeTab === 'all-integrations' && (
            <Badge variant="success" appearance="outline" size="sm">
              {adapter?.installed_count} active connections
            </Badge>
          )}
        </div>

        <AuthorityGuard forbidRoles={['Auditor']}>
          <div className="flex items-center gap-2">
            {activeTab === 'all-integrations' &&
              (isDirectInstall ? (
                <ButtonWithConfirm
                  confirm={true}
                  variant="outline"
                  confirmTitle={`Install ${title}`}
                  dialog={`Are you sure you want to install the ${title} integration?`}
                  onConfirm={handleDirectInstall}
                  disabled={isBusy}
                >
                  <Download /> Install
                </ButtonWithConfirm>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowInstallModal({ type })}
                >
                  <Download /> Install
                </Button>
              ))}

            {activeTab === 'active-integrations' && instance_id && (
              <>
                <ButtonWithConfirm
                  onConfirm={handleDelete}
                  confirm={true}
                  confirmWithInput={true}
                  confirmOnInput={title}
                  confirmTitle={`Delete ${title}?`}
                  variant="destructive"
                  disabled={isDeleting || isBusy}
                >
                  {isDeleting ? (
                    <>
                      <RiProgress1Line className="animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>
                      <Trash /> Delete
                    </>
                  )}
                </ButtonWithConfirm>
                <ButtonWithConfirm
                  onConfirm={handleRefresh}
                  confirm={true}
                  variant="outline"
                  disabled={isRefreshing || isBusy}
                >
                  {isRefreshing ? (
                    <>
                      <RiProgress1Line /> Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCcw /> Refresh
                    </>
                  )}
                </ButtonWithConfirm>
              </>
            )}
          </div>
        </AuthorityGuard>
      </CardFooter>
    </Card>
  );
};

export { IntegrationCard };
