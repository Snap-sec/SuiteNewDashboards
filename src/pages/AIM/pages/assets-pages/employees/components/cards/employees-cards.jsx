import { Fragment } from 'react';
import { Search, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PaginationView from '@/components/custom/pagination';
import useStore from '../../store';
import { EmployeesCardsSkeleton } from '../skeletons/employees-cards-skeleton';
import { EmployeeInfoCard } from './employee-info-card';
import TableToolbarFilters from '../../../../../../../components/common/table-toolbar-filters';
import EmptyScreen from "../../../assets-empty-screen"
import { NoSearchResultsFound } from '@/components/common/no-search-found';

export function EmployeesCards({ data, isLoading, isFetching, handleSearch, searchValue, debouncedSearch }) {
  const pagination = useStore((state) => state.pagination);
  const setPage = useStore((state) => state.setPage);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const renderItem = (item, index) => (
    <EmployeeInfoCard
      avatar={item?.avatar}
      name={item?.employee?.name}
      email={item?.employee?.email}
      verify={item.verify}
      employee={item}
      key={index}
    />
  );

  const hasActiveFilters = Boolean(debouncedSearch || searchValue) || Object.keys(filters || {}).length > 0;
  const showToolbar = isLoading || isFetching || (data?.assets && data.assets.length > 0) || hasActiveFilters;

  return (
    <Fragment>
      {showToolbar && (
        <div className="flex items-center justify-between gap-2.5 flex-wrap mb-7.5">
          <h3 className="text-base text-mono font-medium">
            Showing {data?.pagination?.total ?? 0} Employees
          </h3>
          <div className="flex items-center flex-wrap gap-2.5">
            <TableToolbarFilters supportedFilters={data?.advanced_filters} filters={filters} setFilters={setFilters} isLoadingFilters={isLoading} />

            <div className="flex relative">
              <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Type employee name..."
                value={searchValue}
                onChange={(e) => handleSearch(e)}
                className="ps-9"
              />
            </div>
          </div>
        </div>
      )}

      {isLoading || isFetching ? (
        <EmployeesCardsSkeleton count={8} />
      ) : data?.assets?.length === 0 ? (
        hasActiveFilters ? (
          <div className="mt-8">
            <NoSearchResultsFound
              title="No Results Found"
              subTitle="Looks like we didn’t find any employees matching your search or filters."
            />
          </div>
        ) : (
          <div className="mt-8">
            <EmptyScreen title="No Employees Found" subTitle="We couldn't find any employees matching your search or filters." />
          </div>
        )
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 lg:gap-7.5">
            {data?.assets?.map((item, index) => {
              return renderItem(item, index);
            })}
          </div>

          <div className="flex grow justify-end pt-5 lg:pt-7.5">
            {data?.pagination?.totalPages > 1 && (
              <PaginationView
                currentPage={pagination.pageIndex + 1}
                totalPages={data?.pagination?.totalPages}
                onPageChange={setPage}
                className=" w-fit mx-0"
              />
            )}
          </div>
        </>
      )}
    </Fragment>
  );
}
