import { useState } from "react";
import { toast } from "sonner";
import { PlusCircle, SquarePen } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/custom/modal";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateRawEnvironmentMutation } from '@/services/apisec/environmentApi';
import { createEnvironmentSchema } from "./schemas/create-environment-schema";

function CreateEnvironmentModel() {
    const [isOpen, setIsOpen] = useState(false);
    const [createEnvironment, { isLoading }] = useCreateRawEnvironmentMutation();

    const form = useForm({
        resolver: zodResolver(createEnvironmentSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values) => {
        toast.promise(createEnvironment({ name: values.name }).unwrap(), {
            loading: "Creating Environment",
            success: () => {
                setIsOpen(false);
                form.reset();
                return "Environment Created Successfully";
            },
            error: (err) => err?.data?.message || "Failed to create environment",
        });
    };

    return (
        <div>
            <Modal
                open={isOpen}
                setOpen={(val) => {
                    setIsOpen(val);
                    if (!val) form.reset();
                }}
                title="Create Environment"
                trigger={<Button onClick={() => setIsOpen(true)}><PlusCircle className="w-3 h-3" size={12} />Add Environment</Button>}
                footer={
                    <Button 
                        type="submit" 
                        form="create-environment-form" 
                        disabled={isLoading || !form.formState.isValid || form.formState.isSubmitting}
                    >
                        <SquarePen />Create
                    </Button>
                }
                className="w-[450px]"
            >
                <Form {...form}>
                    <form 
                        id="create-environment-form" 
                        onSubmit={form.handleSubmit(onSubmit)} 
                        className="flex flex-col gap-4 p-1"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Environment Name <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter environment name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </Modal>
        </div>
    );
}

export default CreateEnvironmentModel;
