import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiLockPasswordFill } from '@remixicon/react';
import { GitBranch, Globe, Key, Cloud } from 'lucide-react';
import { toast } from 'sonner';
import { useInstallVmAdapterMutation } from '@/services/vm/adaptersApi';
import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Modal } from '@/components/custom/modal';
import { useStore } from '../../store';
import AssessmentSelect from '../assessment-select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { tenableSchema } from '../../schemas';

function Tenable() {
    const { showInstallModal, setShowInstallModal } = useStore();

    const form = useForm({
        resolver: zodResolver(tenableSchema),
        mode: "onChange",
        defaultValues: {
            name: '',
            accessKey: '',
            accessSecret: '',
            apiUrl: 'https://cloud.tenable.com',
            assessmentId: '',
            adapterName: 'tenable',
        },
    });

    const [isOpen, setIsOpen] = useState(false);
    const [installTenable] = useInstallVmAdapterMutation();

    useEffect(() => {
        let { type } = showInstallModal;

        // Assuming adapter type in DB is 'tenable' or 'tenable nessus', checking commonly used 'tenable'
        if (type?.toLowerCase().includes('tenable')) {
            setIsOpen(true);
            form.reset({
                name: '',
                accessKey: '',
                accessSecret: '',
                apiUrl: 'https://cloud.tenable.com',
                assessmentId: '',
                adapterName: type,
            });
        }
        else setIsOpen(false);
    }, [showInstallModal, form]);



    const handleClose = () => {
        setIsOpen(false);
        setShowInstallModal({});
        form.reset();
    }

    const handleInstall = (data) => {
        toast.promise(installTenable(data).unwrap(), {
            loading: 'Installing Tenable Nessus',
            success: () => { handleClose(); return 'Tenable Nessus has been Installed'; },
            error: 'Failed to install Tenable Nessus',
        })
    };

    return (
        <Modal
            open={isOpen}
            setOpen={handleClose}
            title="Integrate Tenable Nessus"
            description="Integrate Tenable Nessus with the Vulnerability Management"
            footer={
                <Button
                    variant="outline"
                    onClick={form.handleSubmit(handleInstall)}
                    disabled={form.formState.isSubmitting || !form.formState.isValid}
                >
                    <GitBranch /> Integrate
                </Button>
            }
            className="max-h-[95vh] overflow-y-auto w-fit"
        >
            <Form {...form}>
                <div className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Instance Name <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <InputWrapper className={form.formState.errors.name ? 'border-destructive' : ''}>
                                        <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                                            <Cloud />
                                        </Button>
                                        <Input placeholder="Enter instance name" {...field} />
                                    </InputWrapper>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="apiUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>API URL <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <InputWrapper className={form.formState.errors.apiUrl ? 'border-destructive' : ''}>
                                        <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                                            <Globe />
                                        </Button>
                                        <Input placeholder="e.g., https://cloud.tenable.com" {...field} />
                                    </InputWrapper>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="accessKey"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Access Key <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <InputWrapper className={form.formState.errors.accessKey ? 'border-destructive' : ''}>
                                        <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                                            <Key />
                                        </Button>
                                        <Input placeholder="Enter Access Key" {...field} />
                                    </InputWrapper>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="accessSecret"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Access Secret <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <InputWrapper className={form.formState.errors.accessSecret ? 'border-destructive' : ''}>
                                        <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                                            <RiLockPasswordFill />
                                        </Button>
                                        <Input type="password" placeholder="Enter Access Secret" {...field} />
                                    </InputWrapper>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="assessmentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Assessment <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <AssessmentSelect
                                        value={field.value}
                                        onChange={(option) => field.onChange(option.value)}
                                        error={!!form.formState.errors.assessmentId}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </Form>
        </Modal>
    );
}

export default Tenable;
