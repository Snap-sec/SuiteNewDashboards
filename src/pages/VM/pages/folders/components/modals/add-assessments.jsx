import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/custom/modal';
import { AddFolderAssessmentCard } from './add-folder-card';
import { FolderPen } from 'lucide-react';
import MultiSelect from '@/components/custom/multi-select';
import { useGetVmAssessmentsQuery } from '@/services/vm/assessmentsApi';
import { useCreateVmChildAssessmentMutation } from '../../../../../../services/vm/foldersApi';


function AddAssessments({ folderId, existingAssessments = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  
  const { data: assessments, isLoading: isAssessmentLoading } = useGetVmAssessmentsQuery({ 
    search, 
    page: 1, 
    limit: 10 
  });

  // Filter out assessments that are already in the folder
  const availableAssessments = assessments?.data?.assessments?.filter(assessment => 
    !existingAssessments.some(existing => existing._id === assessment._id)
  ) || [];

  const [createChildAssessment, { isLoading }] = useCreateVmChildAssessmentMutation();

  // Handle assessment selection
  const handleAssessmentChange = (selectedValues) => {
    const selectedOptions = selectedValues.map(value => ({
      value: value,
      label: assessments?.data?.assessments?.find(a => a._id === value)?.title || value
    }));
    setSelectedAssessments(selectedOptions);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedAssessments.length) {
      toast.error('Please select at least one assessment');
      return;
    }

    try {
      const payload = {
        assessmentData: {
          assessmentIds: selectedAssessments.map(assessment => assessment.value)
        },
        folderId: folderId
      };

      await toast.promise(createChildAssessment(payload).unwrap(), {
        loading: 'Adding Assessments',
        success: () => {
          setIsModalOpen(false);
          setSelectedAssessments([]);
          return `Successfully added ${selectedAssessments.length} assessment${selectedAssessments.length > 1 ? 's' : ''}`;
        },
        error: 'Failed to add assessments'
      });
    } catch (error) {
      console.error('Error adding assessments:', error);
      toast.error('Failed to add assessments');
    }
  };

  // Handle modal close - reset form and search
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAssessments([]);
    setSearch(''); // Reset search when modal closes
  };

  return (
    <Modal
      open={isModalOpen}
      setOpen={setIsModalOpen}
      onOpenChange={handleModalClose}
      title="Add Assessments"
      description="Add assessments to this folder"
      trigger={
        <AddFolderAssessmentCard 
          title={"Add Assessments"}
          subTitle={"Place the existing assessments into this folder for easier management."}
          iconSize={30}
          onClick={()=> setIsModalOpen(true)}
          logo={<FolderPen className='h-[30px] w-[30px]'/>}
          className={`flex items-center gap-5`}
          alignment="text-start"
        />
      }
      footer={
        <div className="flex gap-2 justify-end mt-4">
          <Button
            variant="outline"
            onClick={handleModalClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isLoading || !selectedAssessments.length}
          >
            {isLoading ? 'Adding...' : 'Add Assessments'}
          </Button>
        </div>
      }
      className="w-full md:w-1/2 lg:w-1/3"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Select Assessments <span className="text-red-500">*</span>
          </label>
          <MultiSelect
            placeholder="Select assessments to add to this folder"
            onChange={handleAssessmentChange}
            values={selectedAssessments.map(a => a.value)}
            disabled={isAssessmentLoading}
            options={availableAssessments.map(assessment => ({
              id: assessment._id,
              value: assessment._id,
              label: assessment.title || assessment.name
            })) || []}
            onSearchChange={setSearch}
            searchPlaceholder="Search assessments..."
            emptyPlaceholder="No assessments found"
            maxShownItems={3}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddAssessments;
