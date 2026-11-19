import { Helmet } from 'react-helmet';
import { useGetAimBusinessUnitsQuery } from '@/services/asset-inventory/businessUnitsApi';
import PageHeading from '@/components/custom/page-heading';
import { EmptyScreen } from '../../../../components/common/empty-screen';
import CreateBusinessUnitModal from './components/modals/create-business-unit-modal';
import BusinessUnitsTable from './components/tables/business-units-table';
import useStore from './store';
import useDebounce from '../../../../hooks/use-debounce';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';
import ApiErrorHandler from '@/components/common/api-error-handler';

function BusinessUnits() {
  const searchQuery = useStore((state) => state.searchQuery);
  const pagination = useStore((state) => state.pagination);
  const sorting = useStore((state) => state.sorting);
  const filters = useStore((state) => state.filters);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data: businessUnits, isLoading, isFetching, isError, error } = useGetAimBusinessUnitsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, sort: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
    search: debouncedSearch,
    ...(filters
      ? Object.fromEntries(
          Object.entries(filters)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => [
              key,
              Array.isArray(value)
                ? value.filter((v) => String(v).trim() !== '').join(',')
                : value,
            ]),
        )
      : {}),
  });

  if (isError && !isLoading) return <ApiErrorHandler error={error} />;

  if (!isError && !isLoading && !isFetching && !businessUnits?.businessUnits?.length && !debouncedSearch && Object.keys(filters || {}).length === 0) {
    return (
      <EmptyScreen
        title="No business units yet"
        subTitle="There are currently no Business units available. Create one to get started."
        engage={<AuthorityGuard forbidRoles={['Auditor']}><CreateBusinessUnitModal /></AuthorityGuard>}
      />
    );
  }

  return (
    <div className="p-4">
      <Helmet>
        <title>AssetIQ | Business Units</title>
      </Helmet>
      <div className=" flex justify-between items-center">
        <PageHeading
          title="Business Units"
          description="View business units and their associated assets, resources, and organizational data."
        />

        <AuthorityGuard forbidRoles={['Auditor']}><CreateBusinessUnitModal /></AuthorityGuard>
      </div>

      <BusinessUnitsTable data={businessUnits} isLoading={isLoading} isFetching={isFetching} />
    </div>
  );
}

export default BusinessUnits;
