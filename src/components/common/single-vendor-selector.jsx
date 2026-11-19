import { useMemo, useState } from 'react';
import { useGetVmVendorsQuery } from '@/services/vm/vendorsApi';
import Select from '@/components/custom/select';
import { Skeleton } from '../ui/skeleton';

function SingleVendorSelector({
  value,
  onChange,
  showLabel = true,
  disabled = false
}) {
  const [search, setSearch] = useState('');

  const {
    data,
    isLoading,
    error,
    isError,
  } = useGetVmVendorsQuery({ search });

  const vendors = useMemo(() => {
    return data?.data?.vendors || data?.vendors || (Array.isArray(data) ? data : []);
  }, [data]);

  const options = useMemo(() => {
    const mapped = vendors.map((v) => ({
      id: v._id || v.id || '',
      label: v.name || 'Unnamed',
      value: v._id || v.id || ''
    }));
    return [
      { id: 'none', label: 'None', value: 'none' },
      ...mapped
    ];
  }, [vendors]);

  return (
    <div className="flex flex-col gap-1 w-full">
      {showLabel && <p>Service Vendor</p>}

      {isError && (
        <p className="text-red-500 text-sm">
          Failed to load service vendors:{' '}
          {error?.data?.message || 'Unknown error'}
        </p>
      )}

      {isLoading && <Skeleton className="w-full h-10" />}

      {!isLoading && (
        <Select
          searchPlaceholder="Search by Service Vendor Name"
          placeholder="Select Service Vendor"
          options={options}
          value={value}
          onChange={(selected) => {
            if (selected?.id === 'none') {
              onChange?.(null);
            } else {
              onChange?.(selected?.id);
            }
          }}
          onSearchChange={(e) => setSearch(e)}
          isSearching={isLoading}
          disabled={disabled}
        />
      )}
    </div>
  );
}

export default SingleVendorSelector;
