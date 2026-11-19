import { useEffect, useMemo, useState } from 'react';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import { ShieldAlert, AlertTriangle, Bug, Globe, Database, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetVmPotentialFalsePositivesQuery } from '@/services/vm/falsePositiveApi';
import { SearchInput } from '@/components/custom/search';
import useDebounce from '@/hooks/use-debounce';

const SEVERITY_CONFIG = {
  critical: { color: 'bg-red-500', label: 'Critical', textColor: 'text-red-600' },
  high: { color: 'bg-orange-500', label: 'High', textColor: 'text-orange-600' },
  medium: { color: 'bg-yellow-500', label: 'Medium', textColor: 'text-yellow-600' },
  low: { color: 'bg-blue-500', label: 'Low', textColor: 'text-blue-600' },
  none: { color: 'bg-gray-400', label: 'None', textColor: 'text-gray-500' },
};

const ICONS = [ShieldAlert, AlertTriangle, Bug, Globe, Database, Lock];

function SidebarVulnCard({ item, isActive, onClick }) {
  const vuln = item.vuln;
  const severityKey = (vuln?.severity || 'none').toLowerCase();
  const severity = SEVERITY_CONFIG[severityKey] || SEVERITY_CONFIG.none;
  const assetName =
    item.exploitabilityAnalysis?.affected_asset?.name ||
    vuln?.affectedAssets?.[0]?.value ||
    vuln?.affectedAssets?.[0]?.assetName;

  return (
    <Card
      className={`cursor-pointer transition-all relative border overflow-hidden ${isActive
        ? 'border-l-[3px] border-l-primary shadow-sm bg-muted/30'
        : 'hover:shadow-sm hover:bg-muted/10'
        }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-2.5">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-foreground leading-tight line-clamp-2">
              {vuln?.title || 'Untitled Vulnerability'}
            </h4>
            {assetName && (
              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{assetName}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase ${severity.textColor}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${severity.color}`} />
            {severity.label}
          </span>
          <span className="text-[10px] text-muted-foreground">•</span>
          <span className="text-[10px] text-muted-foreground">
            Confidence:{' '}
            <span className="font-semibold text-foreground">{item.confidence}%</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function SidebarSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-start gap-2.5">
        <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function FalsePositiveSidebar({ activeVuln, onVulnSelect }) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const limit = 20;

  const debouncedSearch = useDebounce(search, 400);

  // Reset page when search query or filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters]);

  const queryParams = useMemo(() => {
    return {
      page,
      limit,
      search: debouncedSearch || undefined,
      ...filters,
    };
  }, [page, limit, debouncedSearch, filters]);

  const { data, isLoading, isFetching } = useGetVmPotentialFalsePositivesQuery(queryParams);

  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    if (data?.data) {
      const fetched = Array.isArray(data.data) ? data.data : [];
      if (page === 1) {
        setAllItems(fetched);
      } else {
        setAllItems((prev) => {
          const existingIds = new Set(prev.map((item) => item.vulnId || item._id || item.vuln?._id));
          const newItems = fetched.filter((item) => !existingIds.has(item.vulnId || item._id || item.vuln?._id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [data?.data, page]);

  const fetchedCount = Array.isArray(data?.data) ? data.data.length : 0;
  const totalCount = data?.totalItems || data?.total || data?.pagination?.total;
  const hasMore = totalCount ? allItems.length < totalCount : fetchedCount >= limit;

  const filtered = useMemo(() => {
    if (!debouncedSearch) return allItems;
    const q = debouncedSearch.toLowerCase();
    return allItems.filter((item) => {
      const title = item.vuln?.title || '';
      const asset =
        item.exploitabilityAnalysis?.affected_asset?.name ||
        item.vuln?.affectedAssets?.[0]?.value ||
        item.vuln?.affectedAssets?.[0]?.assetName ||
        '';
      return title.toLowerCase().includes(q) || asset.toLowerCase().includes(q);
    });
  }, [allItems, debouncedSearch]);

  const loadingInitial = (isLoading || isFetching) && page === 1 && allItems.length === 0;
  const loadingMore = isFetching && page > 1;

  // Auto-select the first item when data first loads or filtered list updates
  useEffect(() => {
    if (!loadingInitial && filtered.length > 0) {
      const isStillFiltered = filtered.some((item) => item.vulnId === activeVuln?.vulnId);
      if (!activeVuln || !isStillFiltered) {
        onVulnSelect(filtered[0]);
      }
    } else if (!loadingInitial && !isFetching && filtered.length === 0) {
      onVulnSelect(null);
    }
  }, [loadingInitial, isFetching, filtered, activeVuln?.vulnId]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (isFetching || isLoading || !hasMore) return;
    if (scrollTop + clientHeight >= scrollHeight - 60) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <aside className="w-[360px] shrink-0 border-r border-border flex flex-col bg-background h-full">
      <div className="p-4 flex flex-col gap-3 border-b border-border">
        <div className="flex items-center justify-between h-8">
          <h2 className="text-lg font-semibold text-foreground">False Positive Workflow</h2>
          <div className="flex items-center gap-1.5 shrink-0">
            <TableToolbarFilters
              filters={filters}
              setFilters={setFilters}
              supportedFilters={data?.advanced_filters}
              isLoadingFilters={loadingInitial}
              inlineFilterCount={0}
              showSingleSkeleton
              iconOnly
            />
          </div>
        </div>
        <SearchInput
          placeholder="Search vulnerabilities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
          inputClass="h-9 text-xs pl-9 pr-9"
        />
      </div>

      <div
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border"
      >
        <div className="flex flex-col gap-2">
          {loadingInitial &&
            Array.from({ length: 5 }).map((_, i) => <SidebarSkeleton key={i} />)}

          {!loadingInitial && filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-muted-foreground">
              {debouncedSearch || search
                ? `No results for "${search}"`
                : 'No potential false positives found'}
            </div>
          )}

          {!loadingInitial &&
            filtered.map((item) => (
              <SidebarVulnCard
                key={item.vulnId || item._id}
                item={item}
                isActive={activeVuln?.vulnId === item.vulnId}
                onClick={() => onVulnSelect(item)}
              />
            ))}

          {loadingMore && (
            <div className="py-2 space-y-2">
              <SidebarSkeleton />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default FalsePositiveSidebar;
