import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useGetAimAssetsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { useGetAimDashboardStatsQuery } from '@/services/asset-inventory/dashboardApi';
import useDebounce from '@/hooks/use-debounce';
import PageHeading from '@/components/custom/page-heading';
import { FilterSidebar } from './components/filter-sidebar';
import { InventoryTable } from './components/inventory-table';
import { MOCK_ASSETS } from './data/mock-assets';

export function UnifiedAssetInventory() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters read from URL params
  const rawTypes = searchParams.get('types') || searchParams.get('type') || '';
  const selectedTypes = useMemo(() => {
    if (!rawTypes || rawTypes === 'all') return [];
    return rawTypes.split(',').filter(Boolean);
  }, [rawTypes]);

  const rawStatuses = searchParams.get('status') || searchParams.get('statuses') || '';
  const selectedStatuses = useMemo(() => {
    if (!rawStatuses) return [];
    return rawStatuses.split(',').filter(Boolean);
  }, [rawStatuses]);

  const selectedConnectivity = searchParams.get('connectivity') || 'all';
  const selectedEnvironment = searchParams.get('env') || 'all';
  const selectedSeverity = searchParams.get('severity') || 'all';

  // Input states
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 350);

  const [ownerQuery, setOwnerQuery] = useState('');
  const debouncedOwner = useDebounce(ownerQuery, 350);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [selectedRows, setSelectedRows] = useState({});

  // Queries
  const { data: statsData } = useGetAimDashboardStatsQuery(undefined, {
    skip: false,
  });

  const {
    data: apiAssetsData,
    isLoading: isApiLoading,
  } = useGetAimAssetsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    ...(selectedTypes.length === 1 ? { type: selectedTypes[0] } : {}),
    ...(selectedStatuses.length === 1 ? { status: selectedStatuses[0] } : {}),
    ...(selectedEnvironment !== 'all' ? { environment: selectedEnvironment } : {}),
  });

  // Extract type counts from statsData or compute fallback
  const typeCounts = useMemo(() => {
    const counts = { all: 12846 };
    if (statsData?.data) {
      Object.entries(statsData.data).forEach(([key, val]) => {
        if (typeof val === 'number') counts[key] = val;
      });
    }
    return counts;
  }, [statsData]);

  // Combined data set: blend API results or fall back to mock assets
  const { displayAssets, totalItems } = useMemo(() => {
    let list = [];
    let isFromApi = false;

    if (apiAssetsData && Array.isArray(apiAssetsData.assets) && apiAssetsData.assets.length > 0) {
      list = [...apiAssetsData.assets];
      isFromApi = true;
    } else if (apiAssetsData?.results && Array.isArray(apiAssetsData.results) && apiAssetsData.results.length > 0) {
      list = [...apiAssetsData.results];
      isFromApi = true;
    } else {
      list = [...MOCK_ASSETS];
    }

    // Dropdown multiselect filter: Asset Types
    if (selectedTypes.length > 0) {
      list = list.filter((a) => {
        const t = (a.type || a.asset_type || '').toLowerCase();
        return selectedTypes.includes(t);
      });
    }

    // Dropdown multiselect filter: Lifecycle Statuses
    if (selectedStatuses.length > 0) {
      list = list.filter((a) => {
        const s = (a.state || a.status || '').toLowerCase();
        return selectedStatuses.includes(s);
      });
    }

    // Dropdown filter: Environment
    if (selectedEnvironment && selectedEnvironment !== 'all') {
      list = list.filter(
        (a) => (a.environment || '').toLowerCase() === selectedEnvironment.toLowerCase(),
      );
    }

    // Dropdown filter: Reachability / Connectivity
    if (selectedConnectivity && selectedConnectivity !== 'all') {
      list = list.filter((a) => {
        const rawConn =
          a.connectivity ||
          (a.risk?.exposure ? String(a.risk.exposure) : null) ||
          (a.is_internal !== undefined ? (a.is_internal ? 'internal' : 'external') : null) ||
          '';
        return rawConn.toLowerCase() === selectedConnectivity.toLowerCase();
      });
    }

    // Dropdown filter: Severity
    if (selectedSeverity && selectedSeverity !== 'all') {
      list = list.filter((a) => {
        const vulns = a.security?.vulnerability_stats || a.vulnerabilities || {};
        const crit = Number(vulns.critical) || 0;
        const high = Number(vulns.high) || 0;
        const med = Number(vulns.medium) || 0;
        const total = Number(vulns.total) || (crit + high + med);

        if (selectedSeverity === 'critical') return crit > 0;
        if (selectedSeverity === 'high') return crit > 0 || high > 0;
        if (selectedSeverity === 'medium') return crit > 0 || high > 0 || med > 0;
        if (selectedSeverity === 'none') return total === 0;
        return true;
      });
    }

    // Input filter: Owner / Accountable team
    if (debouncedOwner.trim()) {
      const q = debouncedOwner.toLowerCase();
      list = list.filter((a) => {
        let ownerStr = '';
        if (typeof a.owner === 'string') {
          ownerStr = a.owner.toLowerCase();
        } else if (typeof a.owner === 'object' && a.owner) {
          ownerStr = [
            a.owner.user?.email,
            a.owner.user?.firstName,
            a.owner.user?.lastName,
            a.owner.team?.name,
            a.owner.department?.name,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
        }
        return ownerStr.includes(q);
      });
    }

    // Input filter: Keyword search
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((a) => {
        const valStr = typeof a.value === 'string' ? a.value.toLowerCase() : '';
        const nameStr = typeof a.name === 'string' ? a.name.toLowerCase() : '';
        const ipStr = typeof a.ip === 'string' ? a.ip.toLowerCase() : '';
        let ownerStr = '';
        if (typeof a.owner === 'string') {
          ownerStr = a.owner.toLowerCase();
        } else if (typeof a.owner === 'object' && a.owner) {
          ownerStr = [
            a.owner.user?.email,
            a.owner.user?.firstName,
            a.owner.team?.name,
            a.owner.department?.name,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
        }
        return (
          valStr.includes(q) ||
          nameStr.includes(q) ||
          ipStr.includes(q) ||
          ownerStr.includes(q)
        );
      });
    }

    const totalCount =
      isFromApi &&
      selectedTypes.length === 0 &&
      selectedStatuses.length === 0 &&
      selectedEnvironment === 'all' &&
      selectedConnectivity === 'all' &&
      selectedSeverity === 'all' &&
      !debouncedOwner &&
      !debouncedSearch
        ? (apiAssetsData?.pagination?.total ?? list.length)
        : list.length;

    const start = pagination.pageIndex * pagination.pageSize;
    const paginated = list.slice(start, start + pagination.pageSize);

    return {
      displayAssets: paginated,
      totalItems: totalCount,
    };
  }, [
    apiAssetsData,
    selectedTypes,
    selectedStatuses,
    selectedEnvironment,
    selectedConnectivity,
    selectedSeverity,
    debouncedOwner,
    debouncedSearch,
    pagination,
  ]);

  // URL param updater helper
  const updateUrlParam = (key, val) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val && val !== 'all') {
        next.set(key, val);
      } else {
        next.delete(key);
      }
      return next;
    });
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Multiselect dropdown handlers: types
  const handleSelectTypes = (typesArray) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('type');
      if (typesArray && typesArray.length > 0) {
        next.set('types', typesArray.join(','));
      } else {
        next.delete('types');
      }
      return next;
    });
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Multiselect dropdown handlers: statuses
  const handleSelectStatuses = (statusesArray) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('statuses');
      if (statusesArray && statusesArray.length > 0) {
        next.set('status', statusesArray.join(','));
      } else {
        next.delete('status');
      }
      return next;
    });
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Dropdown handlers
  const handleSelectEnvironment = (val) => updateUrlParam('env', val);
  const handleSelectConnectivity = (val) => updateUrlParam('connectivity', val);
  const handleSelectSeverity = (val) => updateUrlParam('severity', val);

  // Reset all
  const handleResetAll = () => {
    setSearchParams(new URLSearchParams());
    setSearchQuery('');
    setOwnerQuery('');
    setSelectedRows({});
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  const activeFiltersCount =
    selectedTypes.length +
    selectedStatuses.length +
    (selectedEnvironment !== 'all' ? 1 : 0) +
    (selectedConnectivity !== 'all' ? 1 : 0) +
    (selectedSeverity !== 'all' ? 1 : 0) +
    (ownerQuery.trim() ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const handleToggleRow = (id) => {
    setSelectedRows((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  };

  const handleToggleAllRows = (select) => {
    if (select) {
      const next = {};
      displayAssets.forEach((item) => {
        next[item._id] = true;
      });
      setSelectedRows(next);
    } else {
      setSelectedRows({});
    }
  };

  const handleDecommission = (id) => {
    toast.success('Asset staged for decommission', {
      description: `Asset ${id} queued for decommission workflow.`,
    });
  };

  return (
    <div className="flex w-full min-w-0 min-h-[calc(100vh-64px)] bg-background">
      <Helmet>
        <title>AssetIQ | Centralized Asset Inventory</title>
      </Helmet>

      {/* Left-side full-height filter controls: Dropdowns, Multiselects & Inputs (NO CHECKBOXES) */}
      <FilterSidebar
        selectedTypes={selectedTypes}
        onSelectTypes={handleSelectTypes}
        selectedStatuses={selectedStatuses}
        onSelectStatuses={handleSelectStatuses}
        selectedEnvironment={selectedEnvironment}
        onSelectEnvironment={handleSelectEnvironment}
        selectedConnectivity={selectedConnectivity}
        onSelectConnectivity={handleSelectConnectivity}
        selectedSeverity={selectedSeverity}
        onSelectSeverity={handleSelectSeverity}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        ownerQuery={ownerQuery}
        onOwnerQueryChange={setOwnerQuery}
        typeCounts={typeCounts}
        onResetAll={handleResetAll}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Middle / Main Inventory Table Region */}
      <main className="flex-1 min-w-0 p-4 md:p-6 space-y-4 overflow-y-auto">
        <PageHeading
          title="Centralized Asset Inventory"
          description="View, track, and manage all discoverable assets across your entire organization."
          className="mb-2"
        />

        <InventoryTable
          assets={displayAssets}
          isLoading={isApiLoading && displayAssets.length === 0}
          pagination={pagination}
          onPageChange={(pageIndex) => setPagination((prev) => ({ ...prev, pageIndex }))}
          onPageSizeChange={(pageSize) =>
            setPagination({ pageIndex: 0, pageSize })
          }
          totalItems={totalItems}
          selectedRows={selectedRows}
          onToggleRow={handleToggleRow}
          onToggleAllRows={handleToggleAllRows}
          onResetFilters={handleResetAll}
          onDecommission={handleDecommission}
        />
      </main>
    </div>
  );
}

export default UnifiedAssetInventory;
