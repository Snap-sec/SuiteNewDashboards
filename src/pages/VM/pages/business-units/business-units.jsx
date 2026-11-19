import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useGetAimBusinessUnitsQuery } from '@/services/asset-inventory/businessUnitsApi';
import PageHeading from '@/components/custom/page-heading';
import PaginationView from '@/components/custom/pagination';
import { SearchInput } from '@/components/custom/search';
import { NoSearchResultsFound } from '@/components/common/no-search-found';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../../components/common/empty-screen';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';
import useDebounce from '../../../../hooks/use-debounce';
import { BusinessUnitCard, BusinessUnitCardSkeleton } from './components/cards/business-unit-card';
import CreateBusinessUnitModal from './components/modals/create-business-unit-modal';
import useStore from './store';


function BusinessUnits() {
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const pagination = useStore((state) => state.pagination);
  const setPage = useStore((state) => state.setPage);
  const sorting = useStore((state) => state.sorting);

  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, setPage]);

  const {
    data: businessUnits,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAimBusinessUnitsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    ...(sorting?.length && sorting[0]
      ? {
        sortBy:
          sorting[0]?.id === 'LastUpdated' ? 'updatedAt' : sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      }
      : {}),
  });

  const units = Array.isArray(businessUnits?.businessUnits)
    ? businessUnits.businessUnits
    : Array.isArray(businessUnits)
      ? businessUnits
      : [];

  const totalPages =
    businessUnits?.totalPages ||
    businessUnits?.pagination?.totalPages ||
    (businessUnits?.totalItems
      ? Math.ceil(businessUnits.totalItems / pagination.pageSize)
      : businessUnits?.total
        ? Math.ceil(businessUnits.total / pagination.pageSize)
        : 0);

  if (!isError && !isLoading && units.length === 0 && !debouncedSearch) {
    return (
      <EmptyScreen
        title="No Business units Added yet"
        subTitle="There are currently no Business units available. Please take an action to get started."
        engage={
          <AuthorityGuard forbidRoles={['Auditor']}>
            <CreateBusinessUnitModal />
          </AuthorityGuard>
        }
      />
    );
  }

  if (isError) return <ApiErrorHandler error={error} />;

  return (
    <div className="p-4">
      <Helmet>
        <title>UniRisk | Business Units</title>
      </Helmet>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <PageHeading
          title="Business Units"
          description="Manage and organize assets by business units to align with your organizational structure."
        />
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Business Units..."
            isSearching={isFetching}
            className="w-full sm:w-60"
          />
          <AuthorityGuard forbidRoles={['Auditor']}>
            <CreateBusinessUnitModal />
          </AuthorityGuard>
        </div>
      </div>

      {/* Card Grid */}
      {isLoading || isFetching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <BusinessUnitCardSkeleton key={i} />
          ))}
        </div>
      ) : units.length === 0 && debouncedSearch ? (
        <NoSearchResultsFound subTitle="No business units matched your search criteria." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map((unit) => (
            <BusinessUnitCard key={unit._id} unit={unit} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationView
          currentPage={pagination.pageIndex + 1}
          totalPages={totalPages}
          onPageChange={setPage}
          className="w-full mx-0 mt-6 justify-end"
        />
      )}
    </div>
  );
}

export default BusinessUnits;