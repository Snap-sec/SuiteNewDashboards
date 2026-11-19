import { useCallback, useContext, useMemo, useState } from 'react';
import { ChevronDown, Plug } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetInstalledAutoPtIntegrationsQuery,
  useGetSupportedAutoPtIntegrationsQuery,
  useInstallAutoPtIntegrationMutation,
} from '@/services/integration/integrationsApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { EmptyScreen } from '@/components/common/empty-screen';
import { NoSearchResultsFound } from '@/components/common/no-search-found';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { SearchInput } from '@/components/custom/search';
import {
  IntegrationContext,
  IntegrationProvider,
} from '../context/integration-context';
import { useStore } from '../store';
import {
  getAdapterType,
  getIntegrationCategories,
  getIntegrationList,
} from '../utils';
import { IntegrationCard } from './integration-card';
import IntegrationModals from './integration-modals';
import { INTEGRATION_PROVIDERS } from './integration-providers';

const compactColumns = {
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6',
};

function IntegrationsPanelContent({
  mode = 'grid',
  view = 'all',
  category = 'All',
  filterTypes,
  columns = 5,
  integrations,
  isLoading: suppliedLoading = false,
  error: suppliedError,
  className = '',
  gridClassName,
  showSearch = mode !== 'button',
  searchPlaceholder = 'Search integrations...',
  searchQuery: suppliedSearch,
  onSearchChange,
  headerSlot,
  label = 'Integrate',
  menuLabel = 'Choose an integration',
  emptyState = false,
  emptyMessage = 'No integrations available',
  emptyTitle = 'No integrations found',
  emptyDescription = 'There are currently no integrations available.',
  emptyAction,
  onAccountChange,
  onInstallClick,
  onConfigClick,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(null);
  const { setShowInstallModal, setShowConfigModal } = useStore();
  const [install] = useInstallAutoPtIntegrationMutation();
  const scopedCategory =
    category && category !== 'All' ? category.toLowerCase() : null;
  const skip = integrations !== undefined || (mode === 'button' && !open);
  const supported = useGetSupportedAutoPtIntegrationsQuery(
    scopedCategory ? { category: scopedCategory } : undefined,
    { skip: skip || view === 'active' },
  );
  const installed = useGetInstalledAutoPtIntegrationsQuery(
    scopedCategory ? { category: scopedCategory } : undefined,
    { skip: skip || view !== 'active' },
  );
  const query = view === 'active' ? installed : supported;
  const isLoading =
    integrations !== undefined ? suppliedLoading : query.isLoading;
  const error = integrations !== undefined ? suppliedError : query.error;
  const searchValue = suppliedSearch ?? search;

  const adapters = useMemo(() => {
    const list = integrations ?? getIntegrationList(query.data);
    return list
      .map((adapter) => {
        const categories = getIntegrationCategories(adapter);
        const normalized = { ...adapter, category: categories };
        const type = getAdapterType(normalized);
        const provider = INTEGRATION_PROVIDERS[type];
        return {
          ...normalized,
          ...(view === 'active'
            ? {
              is_installed: true,
              instance_id: adapter.instance_id || adapter._id || adapter.id,
            }
            : {}),
          title: adapter.title || provider?.label || adapter.name || adapter.id,
          logo: adapter.logo || adapter.logoUrl || provider?.logo,
        };
      })
      .filter((adapter) => {
        const type = getAdapterType(adapter);
        if (
          filterTypes?.length &&
          !filterTypes.some((value) =>
            [type, adapter.type, adapter.slug, adapter.id].includes(value),
          )
        )
          return false;
        if (scopedCategory && !adapter.category.includes(scopedCategory))
          return false;
        if (!searchValue.trim()) return true;
        return [
          adapter.title,
          adapter.name,
          adapter.id,
          adapter.description,
          ...adapter.category,
        ].some((value) =>
          String(value ?? '')
            .toLowerCase()
            .includes(searchValue.trim().toLowerCase()),
        );
      });
  }, [
    integrations,
    query.data,
    view,
    filterTypes,
    scopedCategory,
    searchValue,
  ]);

  const closeModal = useCallback(() => {
    setActive(null);
    setShowInstallModal({ type: '' });
    setShowConfigModal(null);
    onAccountChange?.();
  }, [setShowInstallModal, setShowConfigModal, onAccountChange]);

  const openModal = (adapter, isEdit) => {
    const type = getAdapterType(adapter);
    const integrationId = isEdit
      ? adapter.instance_id ||
      adapter._id ||
      adapter.id ||
      adapter.integrationId
      : adapter.id ||
      adapter._id ||
      adapter.slug ||
      adapter.adapterName ||
      type;
    if (!INTEGRATION_PROVIDERS[type]) {
      if (type === 'jira' && !isEdit)
        setShowInstallModal({ type, integrationId, adapter });
      else
        setShowConfigModal({
          ...adapter,
          type,
          ...(!isEdit ? { integrationId } : {}),
        });
    }
    setActive({ type, integrationId, adapter, isEdit });
  };
  const handleInstall = (adapter) => {
    if (onInstallClick) return onInstallClick(adapter);
    if (adapter.supported === false) return;
    if (adapter.installable === false) {
      if (adapter.docs_url)
        window.open(adapter.docs_url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (getAdapterType(adapter) === 'aim') {
      toast.promise(
        install({
          integrationId: adapter.id || 'aim',
          data: { name: 'AIM', adapterName: 'aim' },
        }).unwrap(),
        {
          loading: 'Installing AIM...',
          success: () => {
            onAccountChange?.();
            return 'AIM has been installed';
          },
          error: 'Failed to install AIM',
        },
      );
      return;
    }
    openModal(adapter, false);
  };
  const handleConfigure = (adapter) =>
    onConfigClick ? onConfigClick(adapter) : openModal(adapter, true);
  const layout =
    gridClassName ||
    (mode === 'compact'
      ? `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${compactColumns[columns] || compactColumns[5]} gap-3`
      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4');

  return (
    <div className={className} data-integration-mode={mode}>
      {mode === 'button' ? (
        <AuthorityGuard forbidRoles={['Auditor']}>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                className="gap-1.5"
                {...(emptyState ? { mode: 'link', underlined: 'dashed' } : {})}
              >
                <Plug className="size-4" />
                {label}
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
              {isLoading ? (
                <DropdownMenuItem disabled>
                  Loading integrations…
                </DropdownMenuItem>
              ) : error ? (
                <>
                  <DropdownMenuItem disabled>
                    Unable to load integrations
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      if (integrations === undefined) query.refetch();
                      else onAccountChange?.();
                    }}
                  >
                    Retry
                  </DropdownMenuItem>
                </>
              ) : adapters.length ? (
                adapters.map((adapter) => (
                  <DropdownMenuItem
                    key={adapter.id || adapter._id || adapter.slug}
                    onSelect={() =>
                      view === 'active'
                        ? handleConfigure(adapter)
                        : handleInstall(adapter)
                    }
                    disabled={
                      adapter.supported === false ||
                      (adapter.installable === false && !adapter.docs_url)
                    }
                    className="gap-2.5"
                  >
                    {adapter.logo && (
                      adapter.logoDark || adapter.logo.toLowerCase().includes('aws.svg') ? (
                        <>
                          <img
                            src={adapter.logo}
                            alt=""
                            className="size-5 object-contain dark:hidden"
                          />
                          <img
                            src={adapter.logoDark || '/new-adapter-logos/aws-dark.svg'}
                            alt=""
                            className="size-5 object-contain hidden dark:block"
                          />
                        </>
                      ) : (
                        <img
                          src={adapter.logo}
                          alt=""
                          className="size-5 object-contain"
                        />
                      )
                    )}
                    <span className="flex-1">{adapter.title}</span>
                    {Number(adapter.installed_count) > 0 && (
                      <Badge variant="success" size="sm">
                        {adapter.installed_count} active
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>{emptyMessage}</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </AuthorityGuard>
      ) : (
        <>
          {(headerSlot || showSearch) && (
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
              {headerSlot && (
                <div className="min-w-0 flex-1 [&>*]:mb-0">{headerSlot}</div>
              )}
              {showSearch && (
                <SearchInput
                  value={searchValue}
                  onChange={(event) =>
                    onSearchChange
                      ? onSearchChange(event)
                      : setSearch(event.target.value)
                  }
                  placeholder={searchPlaceholder}
                />
              )}
            </div>
          )}
          <div className={layout}>
            {isLoading ? (
              Array.from({ length: 6 }, (_, index) => (
                <IntegrationCard key={index} isLoading mode={mode} />
              ))
            ) : error ? (
              <div className="col-span-full">
                <ApiErrorHandler error={error} />
              </div>
            ) : adapters.length ? (
              adapters.map((adapter) => (
                <IntegrationCard
                  key={
                    adapter.instance_id ||
                    adapter._id ||
                    adapter.id ||
                    adapter.slug
                  }
                  adapter={adapter}
                  mode={mode}
                  view={view}
                  onInstallClick={handleInstall}
                  onConfigClick={handleConfigure}
                />
              ))
            ) : searchValue?.trim() ? (
              <div className="col-span-full py-8">
                <NoSearchResultsFound />
              </div>
            ) : (
              <div className="col-span-full py-8">
                <EmptyScreen
                  title={emptyTitle}
                  subTitle={emptyDescription}
                  engage={emptyAction}
                />
              </div>
            )}
          </div>
        </>
      )}
      <IntegrationModals active={active} onClose={closeModal} />
    </div>
  );
}

/**
 * Shared integration catalog and setup dialogs.
 * mode: "grid" (full cards), "compact" (small cards), or "button" (dropdown).
 * columns: 4 | 5 | 6 columns at xl widths in compact mode; smaller screens wrap.
 * category/filterTypes scope all modes; onAccountChange refreshes the host page.
 */
export default function IntegrationsPanel(props) {
  const context = useContext(IntegrationContext);
  return context ? (
    <IntegrationsPanelContent {...props} />
  ) : (
    <IntegrationProvider>
      <IntegrationsPanelContent {...props} />
    </IntegrationProvider>
  );
}
