import { LogOut, SquareDashedMousePointer, Download, Plug, ClockPlus, File, Trash, RefreshCcw, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from "@/components/custom/button-with-confirmation";
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useContext } from 'react';
import { useInstallVmAdapterMutation } from '@/services/vm/adaptersApi';

import { useStore } from '../store';
import { IntegrationContext } from '../context/integration-context';
import { RiProgress1Fill } from '@remixicon/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';


const Actions = ({ adapter, view }) => {
  const {
    handleDeleteAdapter,
    handleDeleteIntegration,
    handleRefreshAdapter,
    deletingAdapterId,
    deletingIntegrationId,
    refreshingAdapterId,
  } = useContext(IntegrationContext) || {};

  const { setShowInstallModal } = useStore();
  const [installAdapter] = useInstallVmAdapterMutation();

  const isIntegration = adapter?.kind === 'integration';
  const isDeleting = isIntegration
    ? deletingIntegrationId === adapter.instance_id
    : deletingAdapterId === adapter.instance_id;
  const isRefreshing = refreshingAdapterId === adapter.instance_id;

  const onDelete = () =>
    isIntegration
      ? handleDeleteIntegration(adapter.instance_id)
      : handleDeleteAdapter(adapter.instance_id);

  const handleInstallClick = () => {
    // Single-click install adapters (no modal needed)
    if (adapter.type === 'aim') {
      toast.promise(
        installAdapter({ name: 'AIM', adapterName: 'aim' }).unwrap(),
        {
          loading: 'Installing AIM...',
          success: 'AIM has been installed',
          error: 'Failed to install AIM',
        }
      );
      return;
    }
    // For other adapters, show the modal
    setShowInstallModal({ type: adapter.type });
  };

  if (view === 'active' && adapter?.is_installed) {
    return (
      <CardFooter className="w-full flex items-center py-3.5 gap-2">
        <ButtonWithConfirm
          onConfirm={onDelete}
          confirm={true}
          confirmWithInput={true}
          placeholder={`Enter "${adapter.config?.name || adapter.name}" to confirm`}
          confirmOnInput={adapter.config?.name || adapter.name}
          confirmTitle={isIntegration ? `Remove ${adapter.title}?` : `Delete ${adapter.title}?`}
          variant="destructive"
          showCopyIcon={false}
          disabled={isDeleting}
        >
          {
            isDeleting ?
              <>
                <RiProgress1Fill className="animate-spin" /> {isIntegration ? 'Removing...' : 'Deleting...'}
              </>
              :
              <>
                <Trash /> {isIntegration ? 'Remove' : 'Delete'}
              </>
          }
        </ButtonWithConfirm>
        {!isIntegration && (adapter?.is_refreshable || adapter?.manual_integration_required) && (
          <ButtonWithConfirm
            onConfirm={() => handleRefreshAdapter(adapter.instance_id)}
            confirm={true}
            variant="outline"
            disabled={isRefreshing}
          >
            <RefreshCcw className={isRefreshing ? 'animate-spin' : ''} /> {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </ButtonWithConfirm>
        )}
      </CardFooter>
    )
  }

  return (
    <CardFooter className="w-full flex justify-between items-center py-3.5">
      {
        !adapter?.supported ?
          <Button variant="outline">
            <ClockPlus /> Coming Soon
          </Button>
          :
          adapter?.installable ?
            <ButtonWithConfirm
              variant="outline"
              confirm={adapter.type === 'aim'}
              onConfirm={handleInstallClick}
              dialog={<p>Are you sure you want to install <b>{adapter.title}</b>?</p>}
            >
              <Settings/>
              Configure
            </ButtonWithConfirm>
            :
            <Button variant="outline" onClick={() => window.open(adapter.docs_url, "_blank")}><File /> Visit Docs</Button>
      }
    </CardFooter>
  )
}


const IntegrationCard = ({ adapter, view, isLoading }) => {
  const { setShowConfigModal } = useStore();
  if (isLoading) {
    return (
      <Card className="flex flex-col h-full">
        <CardContent className="p-5 lg:p-7.5 flex-1">
          <div className="flex items-center justify-between mb-3 lg:mb-5">
            <Skeleton className="h-11 w-11 rounded-lg" />
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-5 w-1/2" />
            <div className="space-y-2 mt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-5 w-20 rounded" />
              <Skeleton className="h-5 w-24 rounded" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="py-3.5 px-5 lg:px-7.5 flex items-center justify-between gap-4 border-t border-border/50">
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    );
  }

  const { logo, path, title, description, name, config } = adapter || {};

  const status = adapter?.status;
  const model = adapter?.model || config?.model;
  const apiKeyMasked =
    adapter?.apiKeyMasked ||
    adapter?.apiKey ||
    config?.apiKeyMasked ||
    config?.apiKey;

  const tokensUsed = adapter?.tokensUsed ?? adapter?.totalTokensUsed;
  const cost = adapter?.cost ?? adapter?.totalCost;
  const hasStats =
    tokensUsed !== undefined || cost !== undefined || (view === 'active' && adapter?.is_installed);

  const getStatusVariant = (s) => {
    if (!s) return 'secondary';
    const lower = String(s).toLowerCase();
    if (['active', 'installed', 'connected', 'success'].includes(lower)) {
      return 'success';
    }
    if (['inactive', 'disconnected', 'disabled'].includes(lower)) {
      return 'secondary';
    }
    if (['failed', 'error'].includes(lower)) {
      return 'destructive';
    }
    if (['pending', 'warning', 'installing', 'refreshing'].includes(lower)) {
      return 'warning';
    }
    return 'secondary';
  };

  const formatTokens = (val) => {
    if (val === undefined || val === null) return '0';
    if (typeof val === 'number') return val.toLocaleString();
    return val;
  };

  const formatCost = (val) => {
    if (val === undefined || val === null) return '$0';
    if (typeof val === 'number') {
      if (val === 0) return '$0';
      if (val < 0.01) return `$${val}`;
      return `$${val.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      })}`;
    }
    return String(val).startsWith('$') ? val : `$${val}`;
  };

  return (
    <Card className="flex flex-col justify-between h-full">
      <CardContent className="p-5 lg:p-7.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3 lg:mb-5">
            <div
              className={`flex items-center justify-center rounded-lg ${
                logo === '/new-adapter-logos/sonar-qube.png'
                  ? 'bg-white'
                  : logo?.toLowerCase().includes('openai')
                    ? 'dark:bg-transparent bg-slate-900 p-2 dark:p-0 w-fit'
                    : ''
              }`}
            >
              <img
                src={logo?.toLowerCase()}
                className={`${
                  logo?.toLowerCase().includes('openai')
                    ? 'h-10 dark:h-14'
                    : 'h-14'
                } shrink-0 bg-center bg-cover rounded-sm`}
                alt={title}
              />
            </div>
            <div className="flex items-center gap-2">
              {status && (
                <Badge
                  variant={getStatusVariant(status)}
                  appearance="outline"
                  size="sm"
                  className="capitalize"
                >
                  {status}
                </Badge>
              )}
              {view === 'active' &&
                adapter?.is_installed &&
                adapter?.configurable !== false && (
                  <AuthorityGuard forbidRoles={['Auditor']}>
                    <Button
                      variant="dim"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfigModal(adapter)}
                    >
                      <Settings size={18} />
                    </Button>
                  </AuthorityGuard>
                )}
            </div>
          </div>
          <div className="flex flex-col gap-1 lg:gap-2.5">
            <Link
              to={path || '#'}
              className="text-base font-medium text-mono hover:text-primary-active flex items-center gap-1.5 flex-wrap"
            >
              <span>{title}</span>
              {(config?.name || name) && (
                <Badge
                    variant="secondary"
                    appearance="outline"
                    size="sm"
                    className="font-mono text-xs"
                  >
                    {config?.name || name}
                  </Badge>
              )}
            </Link>
            <span className="text-sm text-secondary-foreground">
              {description}
            </span>
            {(model || apiKeyMasked) && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {model && (
                  <Badge
                    variant="secondary"
                    appearance="outline"
                    size="sm"
                    className="font-mono text-xs"
                  >
                    {model}
                  </Badge>
                )}
                {apiKeyMasked && (
                  <Badge
                    variant="secondary"
                    appearance="outline"
                    size="sm"
                    className="font-mono text-xs tracking-wider"
                  >
                    {apiKeyMasked}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {hasStats && (
          <div className="grid grid-cols-2 gap-3 mt-4 pt-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground font-medium">
                Tokens Used
              </span>
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {formatTokens(tokensUsed)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground font-medium">
                Cost
              </span>
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {formatCost(cost)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
      <AuthorityGuard forbidRoles={['Auditor']}>
        <Actions adapter={adapter} view={view} />
      </AuthorityGuard>
    </Card>
  );
};

export { IntegrationCard };
