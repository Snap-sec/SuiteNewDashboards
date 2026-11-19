import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plug2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import { SearchInput } from '@/components/custom/search';
import { NoSearchResultsFound } from '@/components/common/no-search-found';
import { debounce } from '@/lib/helpers';
import { useAuthListAdaptersQuery, useAuthDeleteAdapterMutation } from '@/services/auth/adapterApi';
import { useStore } from '../../store';
import { AdapterInfoCard, AdapterInfoCardSkeleton } from '../cards/adapter-info-card';
import allAdapters from "../../data.json";
import ApiErrorHandler from '../../../../../components/common/api-error-handler';



const ActiveAdapters = () => {
  const setTab = useStore((state) => state.setTab);

  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: adapters,
    isLoading: adaptersLoading,
    isFetching,
    isError,
    error,
  } = useAuthListAdaptersQuery({ search: searchTerm });

  const [deleteAdapter] = useAuthDeleteAdapterMutation();

  // Use memo to prevent debounce recreation on every render
  const debouncedSetSearchTerm = useMemo(() => {
    return debounce((value) => {
      setSearchTerm(value);
    }, 500);
  }, []);

  const handleSearchChange = useCallback(
    (e) => {
      debouncedSetSearchTerm(e.target.value);
    },
    [debouncedSetSearchTerm],
  );

  useEffect(() => {
    if (isError) toast.error('Something Went Wrong.');
  }, [isError]);

  if (adaptersLoading) {
    return (
      <div id="integrations_cards">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <AdapterInfoCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if(isError) return <ApiErrorHandler error={error} />

  // If API returned no adapters, we'll show a helpful empty screen only when
  // there is no search term. Otherwise fall back to showing a couple of
  // default adapters (Postman, Swagger) so the UI always reflects current
  // supported adapters.
  if (!isError && !adaptersLoading && !searchTerm && (adapters?.data?.length === 0 || !adapters)) {
    return (
      <EmptyScreen
        darkImgUrl="/media/illustrations/23-dark.svg"
        lightImgUrl="/media/illustrations/23.svg"
        title="No Active Adapters Found"
        subTitle="No adapters are currently connected. Please install one to proceed."
        engage={
          <Button variant="primary" onClick={() => setTab('adapters')}>
            <Plug2 /> Goto Adapters
          </Button>
        }
      />
    );
  }

  const renderItem = (item, index) => {
    const status = item?.status || (item?.isActive ? 'Installed' : item?.metadata?.status || 'Unknown');

    let adapter = allAdapters.find(a => a.type == item.type);

    return (
      <AdapterInfoCard
        id={item?._id}
        key={index}
        logo={adapter?.logo}
        error={item?.error}
        // path={item?.path}
        name={adapter?.name}
        description={adapter?.description}
        lastRefresh={adapter?.lastRefresh}
        status={adapter?.status || "Installed"}
        adapter={item}
      />
    );
  };

  return (
    <div id="integrations_cards">
      {/* <div className="flex justify-end  mb-1 md:mb-2 lg:mb-3 xl:mb-6">
        <SearchInput
          className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4"
          inputClass="pl-9 pr-9"
          placeholder="Start typing to search"
          onChange={handleSearchChange}
          isSearching={isFetching}
        />
      </div> */}

      {/* Show No Search Results (when search term entered, no results, not loading) */}
      {searchTerm && !adaptersLoading && (adapters?.data?.length === 0 || !adapters) && (
        <NoSearchResultsFound />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5">
        {
          adapters?.data?.map((item, index) => renderItem(item, index))
        }
      </div>
    </div>
  );
};

export default ActiveAdapters;
