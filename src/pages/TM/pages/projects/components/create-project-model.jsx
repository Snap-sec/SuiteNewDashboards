import { Modal } from "../../../../../components/custom/modal";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from "react";
import { useCreateProjectMutation, useGetCollectionsQuery } from "../../../../../services/tm/projectApi";
import { toast } from "sonner";
import { Plus } from 'lucide-react';
import MultiSelect from '@/components/custom/multi-select';

function CreateProjectModel() {

  const [isOpen, setIsOpen] = useState(false);

  const [payload, setPayload] = useState({ 
    name: "", 
    description: "",
    collectionId: []     // ⭐ added field
  });

  const [collectionIds, setCollectionIds] = useState([]);

  const { data: collections } = useGetCollectionsQuery();

  const [createProject, { isLoading }] = useCreateProjectMutation();

  const handleCreate = () => {
    const finalPayload = {
      ...payload,
      collectionId: collectionIds,   // ⭐ same as first example
    };

    toast.promise(createProject(finalPayload).unwrap(), {
      loading: "Creating Project",
      success: () => {
        setIsOpen(false);
        setPayload({ name: "", description: "", collectionId: [] });
        setCollectionIds([]);
        return "Project Created";
      },
      error: () => "Failed to create project",
    });
  };

  return(
    <div>
      <Modal
        open={isOpen}
        setOpen={setIsOpen}
        title="Create Project"
        description="This is an example description."
        trigger={<Button><Plus className="w-4 h-4 mr-2" />Create Project</Button>}
        footer={<Button onClick={handleCreate} disabled={isLoading}><Plus className="w-4 h-4 mr-2" />Create</Button>}
        className="w-[550px]"
      >
        <div className="flex flex-col gap-0.5">
          <p>Name</p>
          <Input 
            placeholder="Enter the name of project" 
            value={payload.name}
            onChange={(e)=> setPayload(prev => ({ ...prev, name: e.target.value }))}/>
        </div>

        <div className="flex flex-col gap-0.5 mt-4">
          <p>Description</p>
          <Textarea 
            placeholder="Enter the description of project" 
            value={payload.description}
            onChange={(e)=> setPayload(prev => ({ ...prev, description: e.target.value }))}/>
        </div>

        <div className="mt-4">
          <p className="mb-1 text-[13px]">Select Collections</p>

          <MultiSelect
            options={collections?.data?.map(col => ({
              id: col._id,
              label: `${col.name}`,
              value: col._id,
            }))}
            values={collectionIds}
            onChange={(opts) => setCollectionIds(opts?.map(o => o.value) || [])}
          />
        </div>

      </Modal>
    </div>
  );
}

export default CreateProjectModel;
