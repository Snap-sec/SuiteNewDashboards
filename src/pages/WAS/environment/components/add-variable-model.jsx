import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreateApisecEnvironmentMutation } from '@/services/apisec/environmentApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinners';
import { Modal } from '@/components/custom/modal';
import Select from '@/components/custom/select';
import { useGetApisecEnvironmentsQuery } from '../../../../services/apisec/environmentApi';

function AddVariableModel() {
  const { envId } = useParams();

  const [search, setSearch] = useState('');

  const {
    data: environments,
    isLoading: isLoadingEnvs,
    isFetching: fetchingEnvs,
  } = useGetApisecEnvironmentsQuery({ search });

  const [createEnvironment, { isLoading }] =
    useCreateApisecEnvironmentMutation();

  const [IsOpen, setIsOpen] = useState(false);

  const [envDetails, setEnvDetails] = useState({
    name: '',
    value: '',
  });
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [allEnvsOptions, setAllEnvsOptions] = useState([]);

  const handleCreateEnvironment = () => {
    const payload = {
      key: envDetails?.name,
      value: envDetails?.value,
    };

    if (!payload?.key.trim()) return toast.error('Variable name is required');

    if (!payload?.value.trim())
      return toast.error('Variable value is required');

    // if (!selectedEnvironment?.value?.trim())
    //   return toast.error('Select atleast one environment');

    toast.promise(
      createEnvironment({
        payload,
        environmentId: envId,
      }).unwrap(),
      {
        loading: 'Adding Variable',
        success: () => {
          setIsOpen(false);
          return 'Variable Added successfully';
        },
        error: (err) => {
          return err?.data?.message || 'Error adding Variable';
        },
      },
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnvDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setEnvDetails({ name: '', value: '' });
    if (environments?.data) {
      const formattedEnvs = environments?.data?.map((env) => ({
        label: env?.name,
        value: env?._id,
      }));
      setAllEnvsOptions(formattedEnvs);
    }
  }, [IsOpen, environments]);

  return (
    <Modal
      className="w-1/4"
      open={IsOpen}
      setOpen={setIsOpen}
      title={`Variable`}
      description={`Add a new variable to your environment by providing its name and value.`}
      trigger={
        <Button>
          <Plus /> Add Variable
        </Button>
      }
      footer={
        <div className="mt-2">
          <Button disabled={isLoading} onClick={handleCreateEnvironment}>
            {isLoading ? (
              <>
                <Spinner className="w-4 h-4 mr-2 animate-spin" />
                Adding Variable
              </>
            ) : (
              <>
                <Plus className="mr-2 w-4 h-4" />
                Add Variable
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label>Name</label>
          <Input
            type="text"
            name="name"
            value={envDetails.title}
            placeholder="Name of variable..."
            onChange={handleInputChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Value</label>
          <Input
            type="text"
            name="value"
            placeholder="Value of variable..."
            value={envDetails.value}
            onChange={handleInputChange}
          />
        </div>

        {/* <div>
          <Label>Select Environment</Label>
          <Select
            placeholder="Select an Environment"
            options={allEnvsOptions}
            defaultValue={selectedEnvironment?.value?.id}
            onChange={(option) => setSelectedEnvironment(option)}
            onSearchChange={setSearch}
            isSearching={isLoadingEnvs || fetchingEnvs}
          />
        </div> */}
      </div>
    </Modal>
  );
}

export default AddVariableModel;
