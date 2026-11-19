import { Modal } from "@/components/custom/modal";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MultiSelect from "@/components/custom/multi-select";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from '@/components/ui/switch';
import { useCreateVmCustomDashboardMutation } from "../../../../../../services/vm/customDashboatdApi";
import { useGetVmAssessmentsQuery } from '@/services/vm/assessmentsApi';
import { CustomTooltip } from "../../../../../../components/custom/tooltip";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDashboardSchema } from "./schemas/create-dashboard-schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

function CreateDashboardModel() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Initialize React Hook Form
    const form = useForm({
        resolver: zodResolver(createDashboardSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            description: "",
            assessmentIds: [],
            isPrivate: true,
        },
    });

    // Fetch assessments with search query
    const { data: assessments, isLoading, isFetching } = useGetVmAssessmentsQuery({
        search: searchQuery
    });

    // Mutation for creating dashboard
    const [createDashboard, { isLoading: isCreating }] = useCreateVmCustomDashboardMutation();

    // Transform assessments data to options format for MultiSelect
    const assessmentOptions = assessments?.data?.assessments?.map(assessment => ({
        id: assessment._id.toString(),
        label: assessment.name || assessment.title
    })) || [];

    // Handle search input change for MultiSelect
    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    // Handle form submission
    const onSubmit = async (values) => {
        // Notify user that creation is starting
        toast.message("Creating dashboard...");
        try {
            const payload = {
                name: values.name,
                description: values.description,
                isPrivate: values.isPrivate,
                assessmentIds: values.assessmentIds.map(val => {
                    if (typeof val === 'string') {
                        return val;
                    }
                    if (val && val.id) {
                        return val.id;
                    }
                    return val;
                })
            };

            const response = await createDashboard(payload).unwrap();
            setIsOpen(false);
            navigate(`/vm?id=${response?.data?._id}`);

            console.log("Dashboard creation response:", response);

            // Success toast
            toast.success("Dashboard created successfully!");

            // Reset form and search query
            form.reset();
            setSearchQuery('');


        } catch (error) {
            // Error toast
            toast.error("Failed to create dashboard", { description: error?.message || "Check your data and try again." });
        }
    };


    return (
        <Modal
            open={isOpen}
            setOpen={(val) => {
                setIsOpen(val);
                if (!val) {
                    form.reset();
                    setSearchQuery('');
                }
            }}
            title="Create Custom Dashboard"
            description="Create a new custom dashboard to monitor your projects."
            trigger={
                <div>
                    <CustomTooltip text="Create new dashboard">
                        <Button variant="outline">
                            <Plus />
                        </Button>
                    </CustomTooltip>
                </div>
            }
            footer={
                <div className="mt-2">
                    <Button
                        type="submit"
                        form="create-dashboard-form"
                        disabled={isCreating || !form.formState.isValid || form.formState.isSubmitting}
                    >
                        <Plus /> Create Dashboard
                    </Button>
                </div>
            }
            className="w-1/3"
        >
            <Form {...form}>
                <form
                    id="create-dashboard-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Dashboard Name <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter dashboard name"
                                    />
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
                                <FormLabel>
                                    Description <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Enter description"
                                    />
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
                                <FormLabel>
                                    Select Assessments <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                    <MultiSelect
                                        options={assessmentOptions}
                                        values={field.value}
                                        onChange={field.onChange}
                                        onSearchChange={handleSearchChange}
                                        enableSearch={true}
                                        searchPlaceholder="Search assessments..."
                                        placeholder="Select assessments..."
                                        loading={isLoading || isFetching}
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
                                <Card className="mt-2">
                                    <CardContent className="flex justify-between items-center gap-4 py-4">
                                        <div className="flex flex-col gap-1">
                                            <p>Public</p>
                                            <p className="text-sm text-muted-foreground">
                                                Make the dashboard public to share with others.
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={!field.value}
                                                onCheckedChange={(checked) => field.onChange(!checked)}
                                            />
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </Modal>
    );
}

export default CreateDashboardModel;
