import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useDeleteAimCustomFieldMutation } from '@/services/asset-inventory/customFieldsApi';
import DefineFieldModal from '../modals/define-field-modal';

const CustomFieldDropdown = ({ row }) => {
  const [open, setOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const field = row.original;
  
  const [deleteField, { isLoading: isDeleting }] = useDeleteAimCustomFieldMutation();

  const handleDelete = async () => {
    try {
      await deleteField(field._id).unwrap();
      toast.success('Custom field deleted.');
      setOpen(false);
    } catch (err) {
      toast.error('Failed to delete custom field.');
    }
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[150px]" side="bottom" align="end">
          <DropdownMenuItem
            onClick={() => {
              setIsEditModalOpen(true);
              setOpen(false);
            }}
            className="cursor-pointer"
          >
            Edit
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <ButtonWithConfirm
              disabled={isDeleting}
              variant="ghost"
              confirm={true}
              dialog="Are you sure you want to delete this custom field? This will remove it from the UI but preserve existing data."
              confirmOnInput={field.name}
              onConfirm={handleDelete}
              confirmButton={
                <Button variant="destructive" disabled={isDeleting}>
                  Delete
                </Button>
              }
              cancelButton={<Button variant="outline">Cancel</Button>}
              className="w-full justify-start !font-normal hover:bg-red-200/20 px-2 py-1.5 text-sm h-8"
            >
              <span className="text-destructive">Delete</span>
            </ButtonWithConfirm>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DefineFieldModal 
        open={isEditModalOpen} 
        setOpen={setIsEditModalOpen} 
        initialData={field} 
      />
    </>
  );
};

export default CustomFieldDropdown;
