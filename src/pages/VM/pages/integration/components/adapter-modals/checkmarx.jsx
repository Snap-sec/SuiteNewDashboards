import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RiLockPasswordFill } from '@remixicon/react';
import { GitBranch, Globe, User } from 'lucide-react';
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
import { checkmarxSchema } from '../../schemas';

function Checkmarx() {
    const { showInstallModal, setShowInstallModal } = useStore();

    const form = useForm({
        resolver: zodResolver(checkmarxSchema),
        mode: "onChange",
        defaultValues: {
            apiUrl: '',
            assessmentId: '',
            name: 'checkmarx',
            password: '',
            username: '',
            adapterName: 'checkmarx',
        },
    });

    const [isOpen, setIsOpen] = useState(false);
    const [installCheckmarx] = useInstallVmAdapterMutation();

    useEffect(() => {
        let { type } = showInstallModal;

        if (type == 'checkmarx') {
            setIsOpen(true);
            form.reset({
                apiUrl: '',
                assessmentId: '',
                name: 'checkmarx',
                password: '',
                username: '',
                adapterName: 'checkmarx',
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
        toast.promise(installCheckmarx(data).unwrap(), {
            loading: 'Installing Checkmarx',
            success: () => { handleClose(); return 'Checkmarx has been Installed'; },
            error: 'Failed to install Checkmarx',
        })
    };

    return (
        <Modal
            open={isOpen}
            setOpen={handleClose}
            title="Integrate Checkmarx"
            description="Integrate Checkmarx with the Vulnerability Management"
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
                        name="apiUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>API URL <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <InputWrapper className={form.formState.errors.apiUrl ? 'border-destructive' : ''}>
                                        <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                                            <Globe />
                                        </Button>
                                        <Input placeholder="e.g., https://checkmarx.server.com" {...field} />
                                    </InputWrapper>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <InputWrapper className={form.formState.errors.username ? 'border-destructive' : ''}>
                                        <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                                            <User />
                                        </Button>
                                        <Input placeholder="Enter username" {...field} />
                                    </InputWrapper>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <InputWrapper className={form.formState.errors.password ? 'border-destructive' : ''}>
                                        <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                                            <RiLockPasswordFill />
                                        </Button>
                                        <Input type="password" placeholder="Enter password" {...field} />
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

export default Checkmarx;
