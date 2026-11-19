import FilterButton from '@/components/custom/filter-toolbar/filter-button';
import useStore from '../store';

function TableToolbar({ supportedFilters }) {
  const setFilters = useStore((state) => state.setFilters);

  const productsFilters =
    supportedFilters?.products?.map((p) => ({
      id: p,
      label: p?.toUpperCase(),
      value: p,
    })) || [];

  const userFilters =
    supportedFilters?.usersFilter?.map((p) => ({
      id: p,
      label: p,
      value: p,
    })) || [];

  const handleFilterChange = (key) => (checked, value) => {
    if (value.length > 0) {
      // One or more filters selected → update
      setFilters((prev) => ({ ...prev, [key]: value.join(',') }));
    } else {
      // No filters left → remove the key
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      });
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <FilterButton
        title="Products"
        filters={productsFilters}
        onChange={handleFilterChange('product')}
      />

      <FilterButton
        title="Users"
        filters={userFilters}
        onChange={handleFilterChange('email')}
        enableSearch={true}
      />

      <FilterButton
        title="HTTP Methods"
        filters={
          supportedFilters?.methods?.map((m) => ({
            id: m,
            label: m,
            value: m,
          })) || []
        }
        onChange={handleFilterChange('method')}
      />

      <FilterButton
        title="Action Type"
        filters={
          supportedFilters?.actionTypes?.map((a) => ({
            id: a,
            label: a.charAt(0).toUpperCase() + a.slice(1),
            value: a,
          })) || []
        }
        onChange={handleFilterChange('actionType')}
      />
    </div>
  );
}

export default TableToolbar;
