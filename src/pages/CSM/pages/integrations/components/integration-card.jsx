import { LogOut, SquareDashedMousePointer, Download, Plug, ClockPlus, Settings, File, Trash, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useContext } from 'react';
import { useInstallCsmAdapterMutation } from '@/services/csm/adaptersApi';
import { RiProgress1Fill } from '@remixicon/react';
import { Skeleton } from '@/components/ui/skeleton';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';

import { useStore } from '../store';
import { useIntegrationContext } from '../context/integration-context';

const Actions = ({ adapter, view }) => {
  const {
    handleDeleteAdapter,
    handleDeleteIntegration,
    handleRefreshAdapter,
    deletingAdapterId,
    deletingIntegrationId,
    refreshingAdapterId,
  } = useIntegrationContext() || {};

  const { setShowInstallModal } = useStore();
  const [installAdapter] = useInstallCsmAdapterMutation();

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
    setShowInstallModal({ type: adapter.type });
  };

  if (view === 'active' && adapter?.is_installed) {
    return (
      <CardFooter className="w-full flex items-center py-3.5 gap-2">
        <ButtonWithConfirm
          onConfirm={onDelete}
          confirm={true}
          confirmWithInput={true}
          confirmOnInput={adapter.user_provided_name || adapter.config?.name || adapter.name}
          confirmTitle={isIntegration ? `Remove ${adapter.title}?` : `Delete ${adapter.title}?`}
          variant="destructive"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <RiProgress1Fill className="animate-spin" /> {isIntegration ? 'Removing...' : 'Deleting...'}
            </>
          ) : (
            <>
              <Trash /> {isIntegration ? 'Remove' : 'Delete'}
            </>
          )}
        </ButtonWithConfirm>
        {/* {!isIntegration && (
          <ButtonWithConfirm
            onConfirm={() => handleRefreshAdapter(adapter.instance_id)}
            confirm={true}
            variant="outline"
            disabled={isRefreshing}
          >
            <RefreshCcw className={isRefreshing ? 'animate-spin' : ''} /> {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </ButtonWithConfirm>
        )} */}
      </CardFooter>
    );
  }

  return (
    <CardFooter className="w-full flex justify-end items-center py-3.5">
      {!adapter?.supported ? (
        <Button variant="outline">
          <ClockPlus /> Coming Soon
        </Button>
      ) : adapter?.installable ? (
        <ButtonWithConfirm
          variant="outline"
          confirm={adapter.type === 'aim'}
          onConfirm={handleInstallClick}
          dialog={<p>Are you sure you want to install <b>{adapter.title}</b>?</p>}
        >
          <Plug /> Install
        </ButtonWithConfirm>
      ) : (
        <Button variant="outline" onClick={() => window.open(adapter.docs_url, '_blank')}>
          <File /> Visit Docs
        </Button>
      )}
    </CardFooter>
  );
};

const IntegrationCard = ({ adapter, view, isLoading }) => {
  const { setShowConfigModal } = useStore();
  if (isLoading) {
    return (
      <Card className="flex flex-col h-full">
        <CardContent className="p-5 lg:p-7.5 flex-1">
          <div className="flex items-center justify-between mb-3 lg:mb-5">
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

  const { logo, path, title, description, name, config, user_provided_name } = adapter;

  return (
    <Card>
      <CardContent className="p-5 lg:p-7.5">
        <div className="flex items-center justify-between mb-3 lg:mb-5">
          <div className={`flex items-center justify-center ${logo === '/new-adapter-logos/sonar-qube.png' ? 'bg-white' : ''}`}>
            <img
              src={logo.toLowerCase()}
              className="h-14 shrink-0 bg-center bg-cover rounded-sm"
              alt={title}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 lg:gap-2.5">
          <div className="text-base font-medium text-mono flex items-center gap-1.5 flex-wrap">
            <span>{title}</span>
            {(user_provided_name || config?.name || name) && (
              <span className="text-[13px] font-sans font-normal text-muted-foreground bg-secondary/40 px-1.5 py-0.5 rounded">
                {user_provided_name || config?.name || name}
              </span>
            )}
          </div>
          <span className="text-sm text-secondary-foreground">
            {description}
          </span>
        </div>
      </CardContent>
      <AuthorityGuard forbidRoles={['Auditor']}>
        <Actions adapter={adapter} view={view} />
      </AuthorityGuard>
    </Card>
  );
};

export { IntegrationCard };
