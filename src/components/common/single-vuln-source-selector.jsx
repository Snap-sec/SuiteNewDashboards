import { useMemo, useState } from 'react';
import { useGetVmVulnerabilitySourcesQuery } from '@/services/vm/vulnerabilitySourcesApi';
import Select from '@/components/custom/select';
import { Skeleton } from '../ui/skeleton';


function SingleVulnSourceSelector({
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
  } = useGetVmVulnerabilitySourcesQuery({ search });

  const sources = useMemo(() => {
    return data?.data?.data || [];
  }, [data]);

  const options = useMemo(() => {
    const mapped = sources.map((s) => ({
      id: s._id || s.id || '',
      label: s.name || 'Unnamed',
      value: s._id || s.id || ''
    }));
    return [
      { id: 'none', label: 'None', value: 'none' },
      ...mapped
    ];
  }, [sources]);

  return (
    <div className="flex flex-col gap-1 w-full">
      {showLabel && <p>Vulnerability Source</p>}

      {isError && (
        <p className="text-red-500 text-sm">
          Failed to load vulnerability sources:{' '}
          {error?.data?.message || 'Unknown error'}
        </p>
      )}

      {isLoading && <Skeleton className="w-full h-10" />}

      {!isLoading && (
        <Select
          searchPlaceholder="Search by Source Name"
          placeholder="Select Vulnerability Source"
          options={options?.filter(
            (o) => !o?.label?.toLowerCase().includes('unknown'),
          )}
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

export default SingleVulnSourceSelector;