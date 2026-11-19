import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateVmAssessmentMutation } from '@/services/vm/assessmentsApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CustomSelect from '@/components/custom/select';
import { Modal } from '@/components/custom/modal';
import SelectDepartments from '../../../../../../components/common/multiple-departments-selector';
import { CATEGORIES } from '../category-to-icon-mapper';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAssessmentSchema } from "./schemas/create-assessment-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function CreateAssessmentModel({ open: externalOpen, setOpen: externalSetOpen, onSuccess } = {}) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Support both controlled (external) and uncontrolled (internal) modes
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = externalSetOpen !== undefined ? externalSetOpen : setInternalOpen;

  const [createAssessment] = useCreateVmAssessmentMutation();

  // Initialize React Hook Form
  const form = useForm({
    resolver: zodResolver(createAssessmentSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      category: CATEGORIES[0] || "",
      departmentIds: [],
    },
  });

  const categoryOptions = CATEGORIES.map((cat) => ({
    value: cat,
    label: cat,
  }));

  const onSubmit = async (values) => {
    // Collect department IDs from the selected objects
    const departmentIds = values.departmentIds.map((department) => department?.id).filter(Boolean);

    const payload = [
      {
        title: values.name,
        category: values.category,
        departmentId: departmentIds,
      },
    ];

    toast.promise(createAssessment(payload).unwrap(), {
      loading: 'Creating Assessment...',
      success: (res) => {
        setIsOpen(false);
        form.reset();
        const createdId = res?.data?.[0]?._id || res?.[0]?._id;
        onSuccess?.(createdId, res);
        return 'Assessment created Successfully';
      },
      error: (err) => {
        console.error(err);
        return err?.data?.data?.[0]?.msg || err?.data?.message || err?.message || 'Failed to create Assessment';
      },
    });
  };

  return (
    <Modal
      open={isOpen}
      setOpen={(val) => {
        setIsOpen(val);
        if (!val) {
          form.reset();
        }
      }}
      title="Create Assessment"
      description="Create a new assessment by providing a name and selecting a category."
      trigger={
        externalOpen === undefined ? (
          <Button>
            <Plus /> Create Assessment
          </Button>
        ) : undefined
      }
      footer={
        <div className="mt-2">
          <Button
            type="submit"
            form="create-assessment-form"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            <Plus /> Create Assessment
          </Button>
        </div>
      }
      className="w-1/3"
    >
      <Form {...form}>
        <form
          id="create-assessment-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>
                  Assessment Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter Assessment Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 mt-2">
                <FormLabel>
                  Assessment Category <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <CustomSelect
                    value={field.value}
                    options={categoryOptions}
                    placeholder="Select Category"
                    enableSearch={true}
                    onChange={(option) => field.onChange(option?.value)}
                    searchPlaceholder="Search by Assessment Category Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departmentIds"
            render={({ field }) => (
              <FormItem className="mt-1">
                <FormControl>
                  <SelectDepartments
                    selectedDepartments={field.value}
                    onChange={field.onChange}
                    className="mt-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Modal>
  );
}

export default CreateAssessmentModel;
