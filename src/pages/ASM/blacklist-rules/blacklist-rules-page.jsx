import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useGetAsmBlacklistRulesQuery } from '@/services/asm/blacklistRulesApi';
import useDebounce from '@/hooks/use-debounce';
import useStore from './store';
import BlacklistRulesHeader from './components/blacklist-rules-header';
import BlacklistRulesEmptyState from './components/blacklist-rules-empty-state';
import BlacklistRulesTable from './components/blacklist-rules-table';

export const BlacklistRulesPage = () => {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const filters = useStore((state) => state.filters);
  const searchQuery = useStore((state) => state.searchQuery);
  const sorting = useStore((state) => state.sorting);

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    setPagination(() => ({ pageIndex: 0, pageSize: pagination.pageSize }));
  }, [searchQuery, filters, setPagination, pagination.pageSize]);

  const { data: blacklistRules, isLoading, isFetching } = useGetAsmBlacklistRulesQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    ...(sorting?.length && sorting[0]
      ? { sortBy: sorting[0]?.id, sortAs: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
    ...filters,
  });

  const hasNoRulesOverall =
    !isLoading &&
    blacklistRules?.totalResults === 0 &&
    !Object.keys(filters).length &&
    !debouncedSearch;

  if (hasNoRulesOverall) {
    return (
      <div className="min-h-screen px-6 py-2">
        <Helmet>
          <title>Xpose | Blacklist Rules</title>
        </Helmet>
        <BlacklistRulesEmptyState isFilterActive={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-2">
      <div className="w-full mx-auto">
        <Helmet>
          <title>Xpose | Blacklist Rules</title>
        </Helmet>

        {/* Header Component */}
        <BlacklistRulesHeader />

        {/* Rules Table Component */}
        <BlacklistRulesTable
          data={blacklistRules}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
};

export default BlacklistRulesPage;
