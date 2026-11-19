import Select from '@/components/custom/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function SelectDashboard({ data, currentId }) {

  const navigate = useNavigate();

  const dashboardOptions = data?.map(dashboard => ({
    label: dashboard.name,
    value: dashboard._id || 'default'
  })) || [];

  const effectiveId = currentId || 'default';

  const handleSelectChange = (selectedOption) => {
    const newId = selectedOption.value === 'default' ? '' : selectedOption.value;

    if (newId) {
      localStorage.setItem("dashboardId", newId);
    } else {
      localStorage.removeItem("dashboardId");
    }

    toast.success(`Switched to dashboard: ${selectedOption.label}`);

    if (newId) {
      navigate(`/vm?type=opt&&id=${newId}`);
    } else {
      navigate(`/vm?type=opt`);
    }
  };

  return (
    <div className='w-50'>
      <Select
        searchPlaceholder="Search by Name"
        key={effectiveId}
        options={dashboardOptions}
        placeholder="Select Dashboard"
        onChange={handleSelectChange}
        defaultValue={effectiveId}
      />
    </div>
  );
}

export default SelectDashboard;
