import { useEffect, useMemo, useState } from 'react';
import { Plus, SquarePen, Trash2, Layout, FileText, Globe } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useGetVmAssessmentsQuery } from '@/services/vm/assessmentsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input, InputWrapper } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/custom/modal';
import MultiSelect from '@/components/custom/multi-select';
import {
  useDeleteVmCustomDashboardMutation,
  useUpdateVmCustomDashboardMutation,
} from '../../../../../../services/vm/customDashboatdApi';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateDashboardSchema } from './schemas/update-dashboard-schema';

function UpdateDashboardModel({ currentDashboard }) {
  const [updateDashboard] = useUpdateVmCustomDashboardMutation();
  const [deleteDashboard, { isLoading: isDeleting }] = useDeleteVmCustomDashboardMutation();

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: assessments,
    isLoading: isAssessmentsLoading,
    isFetching,
  } = useGetVmAssessmentsQuery({
    search: searchQuery,
  });

  const form = useForm({
    resolver: zodResolver(updateDashboardSchema),
    mode: "onChange",
    defaultValues: {
      name: '',
      description: '',
      isPrivate: true,
      assessmentIds: [],
    },
  });

  // merge datasets, so that select element displays them
  const assessmentOptions = useMemo(() => {
    let from_dataset =
      assessments?.data?.assessments?.map((assessment) => ({
        id: assessment._id.toString(),
        label: assessment.name || assessment.title,
      })) || [];

    let from_custom_dashboards =
      currentDashboard?.assessmentIds?.map((assessment) => ({
        id: assessment._id.toString(),
        label: assessment.name || assessment.title,
      })) || [];

    let allAssessments = [...from_dataset];

    from_custom_dashboards.forEach((a) => {
      if (from_dataset.some((v) => v.id === a.id)) return;
      allAssessments.push(a);
    });

    return allAssessments;
  }, [assessments, currentDashboard]);

  useEffect(() => {
    if (currentDashboard && isOpen) {
      const preselected = (currentDashboard?.assessmentIds || []).map((a) =>
        String(a?._id || a?.id || a?.assessmentId || a),
      );

      form.reset({
        name: currentDashboard?.name || '',
        description: currentDashboard?.description || '',
        isPrivate: typeof currentDashboard?.isPrivate === 'boolean' ? currentDashboard.isPrivate : true,
        assessmentIds: preselected,
      });
    }
  }, [currentDashboard, isOpen, form]);

  const handleSubmit = (data) => {
    if (!currentDashboard?._id) return;
    
    const payload = {
      ...data,
      assessmentIds: data.assessmentIds.map((val) => {
        if (typeof val === 'string') return val;
        return val.id || val.value;
      }),
    };

    toast.promise(
      updateDashboard({
        id: currentDashboard._id,
        ...payload,
      }).unwrap(),
      {
        loading: 'Updating dashboard...',
        success: () => {
          setIsOpen(false);
          return 'Dashboard updated successfully!';
        },
        error: (err) => `Failed to update dashboard: ${err?.message || 'Please try again.'}`,
      }
    );
  };

  const handleDeleteDashboard = () => {
    toast.promise(deleteDashboard(currentDashboard._id).unwrap(), {
      loading: 'Deleting dashboard...',
      success: () => {
        localStorage.removeItem('dashboardId');
        navigate('/vm');
        return 'Dashboard deleted successfully';
      },
      error: 'Error deleting dashboard',
    });
  };

  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      title="Update Custom Dashboard"
      description="Update custom dashboard details to monitor your projects."
      trigger={
        <Button variant="ghost" className="p-2 -mt-2">
          <SquarePen />
        </Button>
      }
      footer={
        <div className="mt-2 flex justify-end gap-2">
          <ButtonWithConfirm
            onConfirm={handleDeleteDashboard}
            disabled={isDeleting}
            variant="destructive"
            confirm={true}
            confirmButton={<Button variant="destructive">Delete Dashboard</Button>}
          >
            <Trash2 />
          </ButtonWithConfirm>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            <Plus /> Update Dashboard
          </Button>
        </div>
      }
      className="md:max-w-xl"
    >
      <Form {...form}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dashboard Name <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.name ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Layout />
                    </Button>
                    <Input placeholder="Enter dashboard name (max 40 chars)" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <div className="relative">
                    <Button size="sm" variant="dim" mode="icon" className="size-5 absolute top-2.5 left-2.5 z-10" type="button">
                      <FileText />
                    </Button>
                    <Textarea
                      placeholder="Enter description (max 60 chars)"
                      className={form.formState.errors.description ? 'border-destructive pl-9' : 'pl-9'}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assessmentIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Projects <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <MultiSelect
                    options={assessmentOptions}
                    values={field.value}
                    onChange={field.onChange}
                    onSearchChange={setSearchQuery}
                    enableSearch={true}
                    searchPlaceholder="Search assessments..."
                    placeholder="Select assessments..."
                    loading={isAssessmentsLoading || isFetching}
                    className={form.formState.errors.assessmentIds ? 'border-destructive' : ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem>
                <Card className="mt-2 border-dashed">
                  <CardContent className="flex justify-between items-center gap-4 py-4">
                    <div className="flex flex-col gap-1">
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="size-3.5 text-muted-foreground" />
                        Public Dashboard
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Make the dashboard public to share with others in your org.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        id="isPrivate"
                        checked={!field.value}
                        onCheckedChange={(checked) => field.onChange(!checked)}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
              </FormItem>
            )}
          />
        </div>
      </Form>
    </Modal>
  );
}

export default UpdateDashboardModel;
