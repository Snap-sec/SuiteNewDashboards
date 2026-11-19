import React, { useContext } from 'react';
import { LogOut, SquareDashedMousePointer, Download, Plug, ClockPlus, Settings, File, Trash, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RiProgress1Fill } from '@remixicon/react';

import { DateFormatter } from '@/components/custom/date-formatter';

import { useStore } from '../store';
import { IntegrationContext } from '../context/integration-context';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';

const Actions = ({ adapter, view }) => {
  const {
    handleDisconnect,
    handleSync,
    deletingId,
    refreshingId,
  } = useContext(IntegrationContext);

  const { setShowConfigModal } = useStore();

  const adapterType = adapter?.adapterType || adapter?.id || adapter?.instance_id || adapter?._id;
  const isDeleting = deletingId === adapterType;
  const isRefreshing = refreshingId === adapterType;
  const isInstalled = adapter?.is_installed || adapter?.isInstalled || adapter?.status === 'Installed' || view === 'active';

  const onDelete = () => handleDisconnect(adapterType);

  const handleInstallClick = () => {
    setShowConfigModal(adapter);
  };

  if (view === 'active' && isInstalled) {
    return (
      <CardFooter className="w-full flex items-center py-3.5 gap-2 px-5 lg:px-7.5 border-t border-border/50">
        <ButtonWithConfirm
          onConfirm={onDelete}
          confirm={true}
          confirmWithInput={true}
          confirmOnInput={adapter.config?.organization || adapter.config?.name || adapter.title || adapter.name}
          confirmTitle={`Disconnect ${adapter.title || 'Integration'}?`}
          variant="destructive"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <RiProgress1Fill className="animate-spin size-4" /> Disconnecting...
            </>
          ) : (
            <>
              <Trash className="size-4" /> Disconnect
            </>
          )}
        </ButtonWithConfirm>

        <ButtonWithConfirm
          onConfirm={() => handleSync(adapterId)}
          confirm={true}
          variant="outline"
          disabled={isRefreshing}
        >
          <RefreshCcw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </ButtonWithConfirm>
      </CardFooter>
    );
  }

  return (
    <CardFooter className="w-full flex justify-between items-center py-3.5 px-4 lg:px-7.5 border-t border-border/50">
      {adapter?.supported === false ? (
        <Button variant="outline">
          <ClockPlus className="size-4" /> Coming Soon
        </Button>
      )
       //: isInstalled ? (
      //   <div className="flex items-center justify-between w-full">
      //     <span className="text-xs text-muted-foreground font-mono">
      //       {adapter.config?.organization || 'Installed'}
      //     </span>
      //     <Button variant="outline" size="sm" onClick={() => setShowConfigModal(adapter)}>
      //       <Settings className="size-4" />
      //       <span>Configure</span>
      //     </Button>
      //   </div>
      // )
       : (
        <Button variant="outline" onClick={handleInstallClick}>
          <Plug className="size-4" />
          <span>Install</span>
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

  const { logo, title, description, name, config, lastSync } = adapter;
  const isInstalled = adapter?.is_installed || adapter?.isInstalled || adapter?.status === 'Installed' || view === 'active';
  const orgName = config?.organization || config?.name || name;

  return (
    <Card className="flex flex-col justify-between h-full">
      <CardContent className="p-5 lg:p-7.5">
        <div className="flex items-center justify-between mb-3 lg:mb-5">
          <div className="flex items-center justify-center">
            <img
              src={logo || `/new-adapter-logos/${(adapter.type || adapter.adapterType || adapter.id || '').toLowerCase()}.svg`}
              className="h-12 max-w-[48px] shrink-0 object-contain rounded-md"
              alt={title || name}
              onError={(e) => {
                e.currentTarget.src = '/new-adapter-logos/defaultlogo.webp';
              }}
            />
          </div>
          {view === 'active' && isInstalled && (
            <AuthorityGuard forbidRoles={['Auditor']}>
              <Button
                variant="dim"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfigModal(adapter)}
              >
                <Settings className="size-4" />
              </Button>
            </AuthorityGuard>
          )}
        </div>
        <div className="flex flex-col gap-1 lg:gap-2">
          <h3 className="text-base font-medium text-mono text-foreground flex items-center gap-1.5 flex-wrap">
            <span>{title || name}</span>
            {orgName && (
              <span className="text-[13px] font-sans font-normal text-muted-foreground bg-secondary/40 px-1.5 py-0.5 rounded">
                {orgName}
              </span>
            )}
          </h3>
          <p className="text-sm text-secondary-foreground leading-relaxed">
            {description}
          </p>
          {view === 'active' && lastSync && (
            <p className="text-xs text-secondary-foreground mt-1">
              Last Sync: <DateFormatter date={lastSync} className="font-medium text-foreground" />
            </p>
          )}
        </div>
      </CardContent>
      <AuthorityGuard forbidRoles={['Auditor']}>
        <Actions adapter={adapter} view={view} />
      </AuthorityGuard>
    </Card>
  );
};

export { IntegrationCard };
