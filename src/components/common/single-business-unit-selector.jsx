import { useMemo, useState } from 'react';
import { useGetAimBusinessUnitsQuery } from '@/services/asset-inventory/businessUnitsApi';
import Select from '@/components/custom/select';
import { Skeleton } from '../ui/skeleton';

function SingleBusinessUnitSelector({
  value,
  onChange,
  showLabel = true,
  queryEndpoint = useGetAimBusinessUnitsQuery,
  disabled = false
}) {
  const [search, setSearch] = useState('');

  const {
    data: businessUnits,
    isLoading,
    error,
    isError,
  } = queryEndpoint({ search });

  const options = useMemo(() => {
    const units = Array.isArray(businessUnits?.businessUnits)
  ? businessUnits?.businessUnits
  : Array.isArray(businessUnits?.businessUnits)
    ? businessUnits?.businessUnits
    : [];
    const mapped = units.map((bu) => ({
      id: bu?.businessUnitId || bu?._id || '',
      label: bu?.name || 'Unnamed',
      value: {
        id: bu?.businessUnitId || bu?._id || '',
        name: bu?.name || 'Unnamed',
        description: bu?.description || '',
        logo: bu?.logo || '',
        owner: bu?.owner || '',
      },
    }));
    return [{ id: 'none', label: 'None', value: null }, ...mapped];
  }, [businessUnits]);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.id === value) || null,
    [options, value],
  );

  return (
    <div className="flex flex-col gap-1 w-full">
      {showLabel && <p>Business Unit</p>}

      {isError && (
        <p className="text-red-500 text-sm">
          Failed to load business units:{' '}
          {error?.data?.message || 'Unknown error'}
        </p>
      )}

      {isLoading && <Skeleton className="w-full h-10" />}

      {!isLoading && (
        <Select
          searchPlaceholder="Search by Business Unit Name"
          placeholder="Select Business Unit"
          options={options}
          value={value}
          onChange={(selected) => onChange?.(selected?.id === 'none' ? null : selected?.id)}
          onSearchChange={setSearch}
          isSearching={isLoading}
          disabled={disabled}
        />
      )}
    </div>
  );
}

export default SingleBusinessUnitSelector;
