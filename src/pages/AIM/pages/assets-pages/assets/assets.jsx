import { Helmet } from 'react-helmet';
import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchInput } from '@/components/custom/search';
import { Button } from '../../../../../components/ui/button';
import { convertToFilters, debounce } from '../../../../../lib/helpers';
import {
  useGetAimQuerySchemaQuery,
  useGetAimAdvancedAssetsQuery,
  useGetAimSavedQueriesQuery,
} from '@/services/asset-inventory/assets/queriesApi';
import EmptyAssets from '../assets-empty-screen';
import AdvancedSearchList from './components/advanced-search-list';
import useStore from '../store';
import BulkUpdate from './components/bulk-update';
import QueryWizardModal from './components/modals/query-wizard-modal';
import StatsCards from './components/stats-cards';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';

function Assets() {
  const pagination = useStore((state) => state.pagination);
  const sorting = useStore((state) => state.sorting);
  const filters = useStore((state) => state.filters);
  const searchQuery = useStore((state) => state.searchQuery);
  const rowSelection = useStore((state) => state.rowSelection);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setSorting = useStore((state) => state.setSorting);
  const setFilters = useStore((state) => state.setFilters);
  const setRowSelection = useStore((state) => state.setRowSelection);

  const [currentAST, setCurrentAST] = React.useState(null);
  const [isAdvancedMode, setIsAdvancedMode] = React.useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingQuery, setEditingQuery] = useState(null);

  // Show query string in the search bar
  const [queryString, setQueryString] = useState('');

  const { data: schemaData } = useGetAimQuerySchemaQuery();

  // Local state for immediate typing feedback
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounced search trigger for the store
  const debouncedSearch = useMemo(
    () => debounce((val) => setSearchQuery(val), 500),
    [setSearchQuery]
  );

  const handleSearch = (val) => {
    setLocalSearch(val);
    debouncedSearch(val);
  };

  // Sync local search when store value changes (e.g. from clear actions)
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const {
    data: assetsData,
    isLoading: assetsLoading,
    isFetching: assetsFetching,
    isError,
    error,
  } = useGetAimAdvancedAssetsQuery({
    body: isAdvancedMode && currentAST ? currentAST : { type: 'group', logicOp: 'AND', children: [] },
    params: {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      ...(sorting?.length
        ? { sortBy: sorting[0]?.id, sort: sorting[0]?.desc ? 'desc' : 'asc' }
        : {}),
      search: searchQuery,
      ...filters,
    }
  });

  const tableDetails = {
    pagination,
    sorting,
    searchQuery,
    filters,
    setPagination,
    setSearchQuery,
    setSorting,
    rowSelection,
    setRowSelection,
  };

  const filterMap2 = assetsData?.advanced_filters?.reduce(
    (acc, { key }) => ({ ...acc, [key]: key }),
    {},
  );

  const handleLabels = (labels) => {
    const newFilters = labels.reduce((acc, label) => {
      const key = label.key.replace(':', '');
      if (filterMap2[key]) {
        const mappedKey = filterMap2[key];
        if (acc[mappedKey] !== undefined) {
          if (Array.isArray(acc[mappedKey])) {
            acc[mappedKey].push(label.value);
          } else {
            acc[mappedKey] = [acc[mappedKey], label.value];
          }
        } else {
          acc[mappedKey] = label.value;
        }
      }
      return acc;
    }, {});
    setFilters(() => newFilters);
  };

  if (
    !isError &&
    !assetsLoading &&
    assetsData?.pagination?.total == 0 &&
    !assetsData?.assets?.length &&
    !searchQuery &&
    Object.keys(filters).length === 0 &&
    !currentAST
  )
    return <EmptyAssets />;

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <div className="p-4 pb-0">
      <Helmet>
        <title>AssetIQ | Advanced Search</title>
      </Helmet>

      <div className="flex items-center mb-4 justify-between">
        <div className="flex flex-row w-full gap-2 justify-center items-center">
          {isAdvancedMode ? (
            <div className="flex-1 flex items-center justify-between bg-muted/20 p-2 rounded-lg border border-border">
              <div className="flex items-center gap-4">
                <Badge variant="primary" className="h-8 px-4 rounded-md">Advanced Search Active</Badge>
                <p className="text-sm text-muted-foreground">Found {assetsData?.pagination?.total || 0} results</p>
                <p className="text-sm text-muted-foreground">QUERY: {queryString}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdvancedMode(false);
                  setCurrentAST(null);
                }}
                className="text-xs font-semibold hover:text-destructive"
              >
                Clear Search & Return
              </Button>
            </div>
          ) : (
            <SearchInput
              placeholder="Search by value, type, owner, etc."
              value={localSearch}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1"
              inputClass="h-10 pl-10 pr-10"
              isSearching={assetsFetching}
            />
          )}

          <QueryWizardModal
            open={isWizardOpen}
            onOpenChange={setIsWizardOpen}
            editingQuery={editingQuery}
            initialAST={currentAST}
            setQueryString={setQueryString}
            onSuccess={(ast) => {
              setCurrentAST(ast);
              setIsAdvancedMode(true);
            }}
            trigger={
              <Button
                onClick={() => {
                  setEditingQuery(null);
                  setIsWizardOpen(true);
                }}
                variant="outline"
                size="lg"
              >
                <Filter /> Query Wizard
              </Button>
            }
          />
        </div>
      </div>


      <div className="mb-4">
        <StatsCards
          metrics={assetsData?.stats}
          assetsLoading={assetsLoading}
        />
      </div>

      <AdvancedSearchList
        data={assetsData}
        isLoading={assetsLoading}
        isFetching={assetsFetching}
        tableDetails={tableDetails}
        filters={isAdvancedMode ? null : filters}
        setFilters={isAdvancedMode ? null : setFilters}
        supportedFilters={isAdvancedMode ? null : assetsData?.advanced_filters}
      />
      {Object.keys(rowSelection || {}).length > 1 && <BulkUpdate />}

    </div>
  );
}

export default Assets;
