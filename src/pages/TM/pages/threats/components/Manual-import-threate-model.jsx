import { useState } from 'react';
import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Select from '@/components/custom/select';
import { useGetEndpointsQuery } from '../../../../../services/tm/projectApi';
import { useParams } from 'react-router-dom';
import { useGetProjectsQuery } from '../../../../../services/tm/projectApi';
import { useCreateManualThreatMutation } from '../../../../../services/tm/threatApi';
import { toast } from 'sonner';
import {CustomTooltip} from '@/components/custom/tooltip'; 
import { SquarePen } from 'lucide-react';


function ManualImportThreatModel(showText) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState();
  const { projectId } = useParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data, isLoading, isFetching } = useGetEndpointsQuery({ projectId, search, limit: 10 });
  const { data : projects, isLoading: isProjectsLaoding} = useGetProjectsQuery({ page, limit });


  const severity = [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const [formData, setFormData] = useState({
    title: '',
    endpointId: '',
    severity: 'low',
    explaination: '',
    mitigations: '',
    references: '',
    postman_reference: '',
    state: 'pending'
  });

  const [createManualThreat] = useCreateManualThreatMutation();

  const handleSubmit = async () => {
    toast.promise(
      async () => {
        // Split mitigations and references by newline
        const mitigations = formData.mitigations.split('\n').filter(item => item.trim());
        const references = formData.references.split('\n').filter(item => item.trim());

        const payload = {
          ...formData,
          mitigations,
          references,
          endpointId: formData.endpointId,  // This is already just the ID
          projectId   // This is already just the ID from useParams()
        };

        const response = await createManualThreat({ 
          projectId,
          data: payload
        }).unwrap();
        
        setIsModalOpen(false);
        return response;
      },
      {
        loading: 'Creating threat...',
        success: (data) => `${data?.message || 'Threat created successfully'}`,
        error: (err) => `${err?.data?.message || 'Failed to create threat'}`
      }
    );
  };

  return (
        <Modal
            open={isModalOpen}
            setOpen={setIsModalOpen}
            title="Create Threat"
            description="Create a new manual threat"
            trigger={
              <CustomTooltip text="Create Threat">
                <Button onClick={() => setIsModalOpen(true)}>
                  <SquarePen /> {showText?.showText === true ? "Create Manual Threats" : null}
                </Button>
              </CustomTooltip>
            }
            footer={
                <div className="mt-2 flex items-center gap-4">
                  <Button onClick={() => setIsModalOpen(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} className="mr-2">
                    <Plus /> Create Threat
                  </Button>
                </div>
            }
            className="w-full md:w-[800px] lg:w-[800px]"
        >

        <div className="space-y-4">
            
            <div className='flex items-center justify-between gap-3'>
              <div className='flex flex-col gap-1 w-full'>
                <label className="text-sm font-medium">Title</label>
                <Input 
                  placeholder="Enter Threat Title" 
                  className="w-full"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                />
              </div>

           

              <div className='flex flex-col gap-1 w-full'>
                  <label className="text-sm font-medium">Projects</label>
                  <Select
                      options={projects?.projects?.map(project => ({
                          value: project._id,
                          label: project.name
                      })) || []}
                      onChange={console.log}
                      placeholder="Select a project"
                      isLoading={isProjectsLaoding}
                  />
              </div>
            </div>

            <div className='flex items-center justify-between gap-3'>
          
              <div className='flex flex-col gap-1 w-full'>
                  <label className="text-sm font-medium">Severity</label>
                  <Select
                      options={severity}
                      defaultValue="low"
                      onChange={(value) => setFormData(prev => ({...prev, severity: value?.value }))}
                      placeholder="Select severity of this threat"
                  />
              </div>

              <div className='flex flex-col gap-1 w-full'>
                  <label className="text-sm font-medium">Postman Reference</label>
                  <Input 
                    placeholder="Postman references of this threat" 
                    className="w-full"
                    value={formData.postman_reference}
                    onChange={(e) => setFormData(prev => ({...prev, postman_reference: e.target.value}))}
                  />
              </div>
            </div>


            <div className='flex flex-col gap-1 w-full'>
                  <label className="text-sm font-medium">Endpoints</label>
                  <Select
                      options={data?.endpoints?.map(endpoint => ({
                          value: endpoint._id,
                          label: `${endpoint.method} - ${endpoint.url}`
                      })) || []}
                      onChange={(option) => setFormData(prev => ({
                          ...prev, 
                          endpointId: option.value // Extract just the value from the option object
                      }))}
                      onSearchChange={(value) => {
                          setSearch(value);
                      }}
                      placeholder="Select an endpoint"
                      isLoading={isLoading || isFetching}
                      enableSearch
                      searchValue={search}
                  />
            </div>


            <div className='flex flex-col gap-1'>
                <label className="text-sm font-medium">Explanation</label>
                <Textarea
                    placeholder="Explain the threat in detail"
                    value={formData.explaination}
                    onChange={(e) => setFormData(prev => ({...prev, explaination: e.target.value}))}
                />
            </div>


            <div className='flex flex-col gap-1'>
                <label className="text-sm font-medium">Mitigations (one per line)</label>
                <Textarea
                    placeholder="List the mitigations for this threat (one per line)"
                    value={formData.mitigations}
                    onChange={(e) => setFormData(prev => ({...prev, mitigations: e.target.value}))}
                />
            </div>


            <div className='flex flex-col gap-1'>
                <label className="text-sm font-medium">References (one per line)</label>
                <Textarea
                    placeholder="References for this threat (one per line)"
                    value={formData.references}
                    onChange={(e) => setFormData(prev => ({...prev, references: e.target.value}))}
                />
            </div>

        </div>

    </Modal>
  );
}

export default ManualImportThreatModel;