import { useEffect, useState } from 'react';
import { useGetDepartmentsQuery } from '@/services/auth/departmentsApi';
import { Label } from '@/components/ui/label';
import MultiSelect from '@/components/custom/multi-select';
import { Skeleton } from '../ui/skeleton';

function SelectDepartments({
  selectedDepartments,
  onChange,
  showLabel = true,
  className = '',
}) {
  const {
    data: departmentsData,
    isLoading,
    isFetching,
  } = useGetDepartmentsQuery();

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [normalizedSelected, setNormalizedSelected] = useState([]);

  // 🧠 Step 1: Format departments from API
  useEffect(() => {
    if (departmentsData?.data?.length > 0) {
      const formattedDepartments = departmentsData.data.map((dept) => ({
        id: dept._id,
        label: dept.name,
        value: {
          id: dept._id,
          name: dept.name,
          description: dept.description,
          teamCount: dept.teamCount,
          totalMembers: dept.totalMembers,
        },
      }));
      setDepartmentOptions(formattedDepartments);
    }
  }, [departmentsData]);

  // 🧩 Step 2: Normalize selectedDepartments (accept IDs or objects)
  useEffect(() => {
    if (!selectedDepartments) return;

    const cleanSelected = selectedDepartments.filter((selected) => {
      const id = typeof selected === 'string' ? selected : selected?.id;
      return id && id !== 'none';
    });

    // if departments not yet loaded, skip normalization
    if (!departmentOptions.length) {
      if (
        Array.isArray(cleanSelected) &&
        typeof cleanSelected[0] === 'object'
      ) {
        setNormalizedSelected(cleanSelected);
      }
      return;
    }

    const formattedSelected = cleanSelected.map((selected) => {
      if (typeof selected === 'string') {
        // compare with loaded departments from API
        const match = departmentOptions.find((dept) => dept.id === selected);
        return (
          match || {
            id: selected,
            label: 'Unknown Department',
            value: { id: selected },
          }
        );
      }
      // already a full object
      return selected;
    });

    setNormalizedSelected(formattedSelected);
  }, [selectedDepartments, departmentOptions]);

  // 🔄 Step 3: Handle changes in MultiSelect
  const handleChange = (newValues) => {
    const singleValue = newValues.filter(v => v.id !== 'none').slice(-1);
    setNormalizedSelected(singleValue);
    onChange(singleValue);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {showLabel && <Label>Departments</Label>}

      {isLoading && <Skeleton className=" w-full h-11 rounded-lg" />}

      {!isLoading && (
        <MultiSelect
          searchPlaceholder="Search by Department Name"
          placeholder="Select departments"
          options={departmentOptions}
          values={normalizedSelected}
          onChange={handleChange}
          maxShownItems={3}
          emptyPlaceholder={
            isLoading || isFetching
              ? 'Loading departments...'
              : departmentOptions?.length === 0
                ? 'No departments found.'
                : "You've added all available departments."
          }
        />
      )}
    </div>
  );
}

export default SelectDepartments;
