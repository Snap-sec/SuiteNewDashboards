import { useContext } from 'react';
import { RiProgress1Fill } from '@remixicon/react';
import {
  ClockPlus,
  Download,
  File,
  LogOut,
  Plug,
  RefreshCcw,
  Settings,
  SquareDashedMousePointer,
  Trash,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { IntegrationContext } from '../context/integration-context';
import { useStore } from '../store';

const Actions = ({ adapter, view, onInstallClick, mode }) => {
  const {
    handleDeleteAdapter,
    handleDeleteIntegration,
    handleRefreshAdapter,
    deletingAdapterId,
    deletingIntegrationId,
    refreshingAdapterId,
  } = useContext(IntegrationContext);

  const isIntegration = adapter?.kind === 'integration';
  const instanceId = adapter?.instance_id || adapter?._id || adapter?.id;
  const isDeleting =
    deletingAdapterId === instanceId || deletingIntegrationId === instanceId;
  const isRefreshing = refreshingAdapterId === instanceId;
  const onDelete = () =>
    isIntegration
      ? handleDeleteIntegration?.(instanceId)
      : handleDeleteAdapter?.(instanceId);
  const handleInstallClick = () => onInstallClick?.(adapter);

  if (view === 'active' && adapter?.is_installed) {
    return (
      <CardFooter className="w-full flex items-center py-3.5 gap-2">
        <ButtonWithConfirm
          onConfirm={onDelete}
          confirm={true}
          confirmWithInput={true}
          confirmOnInput={adapter.config?.name || adapter.name}
          confirmTitle={
            isIntegration
              ? `Remove ${adapter.title}?`
              : `Delete ${adapter.title}?`
          }
          variant="destructive"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <RiProgress1Fill className="animate-spin" />{' '}
              {isIntegration ? 'Removing...' : 'Deleting...'}
            </>
          ) : (
            <>
              <Trash /> {isIntegration ? 'Remove' : 'Delete'}
            </>
          )}
        </ButtonWithConfirm>
        {!isIntegration &&
          (adapter?.is_refreshable || adapter?.manual_integration_required) && (
            <ButtonWithConfirm
              onConfirm={() => handleRefreshAdapter(adapter.instance_id)}
              confirm={true}
              variant="primary"
              disabled={isRefreshing}
            >
              <RefreshCcw className={isRefreshing ? 'animate-spin' : ''} />{' '}
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </ButtonWithConfirm>
          )}
      </CardFooter>
    );
  }

  const installedCount = Number(adapter?.installed_count || 0);

  return (
    <CardFooter
      className={
        mode === 'compact'
          ? 'w-full flex flex-wrap justify-between items-center gap-2 px-4 pb-4 pt-0 border-0'
          : 'w-full flex justify-between items-center py-3.5 gap-2'
      }
    >
      {mode !== 'compact' && (
        <div>
          {installedCount > 0 && (
            <Badge variant="success" appearance="outline" size="sm">
              {installedCount}{' '}
              {installedCount === 1
                ? 'active connection'
                : 'active connections'}
            </Badge>
          )}
        </div>
      )}
      <div>
        {adapter?.supported === false ||
          (adapter?.installable === false && !adapter?.docs_url) ? (
          <Button variant="outline" disabled>
            <ClockPlus /> Coming Soon
          </Button>
        ) : adapter?.installable !== false ? (
          <Button
            variant={mode === 'compact' ? 'outline' : 'primary'}
            size={mode === 'compact' ? 'sm' : 'md'}
            onClick={handleInstallClick}
          >
            <Plug /> Install
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => window.open(adapter.docs_url, '_blank')}
          >
            <File /> Visit Docs
          </Button>
        )}
      </div>
    </CardFooter>
  );
};

const IntegrationCard = ({
  adapter,
  view,
  isLoading,
  onInstallClick,
  onConfigClick,
  mode = 'grid',
}) => {
  const { setShowConfigModal } = useStore();
  if (isLoading) {
    return (
      <Card className="flex flex-col h-full">
        <CardContent
          className={mode === 'compact' ? 'p-4 flex-1' : 'p-5 lg:p-7.5 flex-1'}
        >
          <div
            className={
              mode === 'compact'
                ? 'flex items-center justify-between mb-3'
                : 'flex items-center justify-between mb-3 lg:mb-5'
            }
          >
            <Skeleton className="h-11 w-11 rounded-lg" />
          </div>
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-5 w-1/2" />
            <div className="space-y-2 mt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="py-3.5 px-5 lg:px-7.5 flex items-center justify-between gap-4 border-t border-border/50">
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    );
  }

  const { logo, logoUrl, logoDark, path, title, description, name, config } =
    adapter || {};
  const displayTitle = title || name || adapter?.id || 'Integration';
  const imageSrc = logo || logoUrl;
  const darkImageSrc =
    logoDark ||
    (imageSrc?.toLowerCase().includes('aws.svg')
      ? '/new-adapter-logos/aws-dark.svg'
      : null);
  const instanceName = config?.name || name;

  return (
    <Card className="flex h-full flex-col">
      <CardContent
        className={mode === 'compact' ? 'p-4 flex-1' : 'p-5 lg:p-7.5 flex-1'}
      >
        <div
          className={
            mode === 'compact'
              ? 'flex items-center justify-between mb-3'
              : 'flex items-center justify-between mb-3 lg:mb-5'
          }
        >
          <div
            className={`flex items-center justify-center ${imageSrc === '/new-adapter-logos/sonar-qube.png' ? 'bg-white' : ''}`}
          >
            {imageSrc ? (
              darkImageSrc ? (
                <>
                  <img
                    src={imageSrc.toLowerCase()}
                    className={
                      (mode === 'compact'
                        ? 'size-7 shrink-0 rounded-sm object-contain'
                        : 'h-14 shrink-0 bg-center bg-cover rounded-sm object-contain') +
                      ' dark:hidden'
                    }
                    alt={displayTitle}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <img
                    src={darkImageSrc.toLowerCase()}
                    className={
                      (mode === 'compact'
                        ? 'size-7 shrink-0 rounded-sm object-contain'
                        : 'h-14 shrink-0 bg-center bg-cover rounded-sm object-contain') +
                      ' hidden dark:block'
                    }
                    alt={displayTitle}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </>
              ) : (
                <img
                  src={imageSrc.toLowerCase()}
                  className={
                    mode === 'compact'
                      ? 'size-7 shrink-0 rounded-sm object-contain'
                      : 'h-14 shrink-0 bg-center bg-cover rounded-sm object-contain'
                  }
                  alt={displayTitle}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )
            ) : (
              <div className="size-14 rounded-sm bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground uppercase">
                {displayTitle?.slice(0, 2)}
              </div>
            )}
          </div>
          {mode === 'compact' && Number(adapter?.installed_count) > 0 && (
            <Badge variant="success" appearance="outline" size="sm">
              {adapter.installed_count} active
            </Badge>
          )}
          {view === 'active' &&
            adapter?.is_installed &&
            adapter?.configurable !== false && (
              <AuthorityGuard forbidRoles={['Auditor']}>
                <Button
                  variant="dim"
                  size="icon"
                  aria-label={`Configure ${displayTitle}`}
                  className="size-8 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    if (onConfigClick) {
                      onConfigClick(adapter);
                    } else {
                      setShowConfigModal(adapter);
                    }
                  }}
                >
                  <Settings size={18} />
                </Button>
              </AuthorityGuard>
            )}
        </div>
        <div className="flex flex-col gap-1 lg:gap-2.5">
          {path ? (
            <Link
              to={path}
              className={`${mode === 'compact' ? 'text-sm' : 'text-base'} font-medium text-mono hover:text-primary-active flex items-center gap-1.5 flex-wrap`}
            >
              <span>{displayTitle}</span>
              {instanceName && instanceName !== displayTitle && (
                <Badge appearance="outline" size="sm">
                  {config?.name || name}
                </Badge>
              )}
            </Link>
          ) : (
            <div
              className={`${mode === 'compact' ? 'text-sm' : 'text-base'} font-medium text-mono flex items-center gap-1.5 flex-wrap`}
            >
              <span>{displayTitle}</span>
              {instanceName && instanceName !== displayTitle && (
                <Badge appearance="outline" size="sm">
                  {config?.name || name}
                </Badge>
              )}
            </div>
          )}
          <span
            className={
              mode === 'compact'
                ? 'text-xs text-secondary-foreground line-clamp-2'
                : 'text-sm text-secondary-foreground'
            }
          >
            {description}
          </span>
        </div>
      </CardContent>

      <div>
        <AuthorityGuard forbidRoles={['Auditor']}>
          <Actions
            adapter={adapter}
            view={view}
            mode={mode}
            onInstallClick={onInstallClick}
          />
        </AuthorityGuard>
      </div>
    </Card>
  );
};

export { IntegrationCard };
