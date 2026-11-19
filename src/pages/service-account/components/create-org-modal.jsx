import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateNewOrgMutation } from '@/services/auth/serviceProviderApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/custom/modal';
import Select from '@/components/custom/select';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrgSchema } from "./schemas/create-org-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


export default function CreateOrgModal({ trigger }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  const [createOrg, { isLoading: creatingNewOrg }] = useCreateNewOrgMutation();

  const form = useForm({
    resolver: zodResolver(createOrgSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      website: "",
      logo: "",
      invitees: [{ email: "", role: "Manager" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "invitees",
  });

  const handleCompleteInfo = async () => {
    const isValid = await form.trigger(["name", "website", "logo"]);
    if (isValid) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleClose = () => {
    setOpen(false);
    setStep(1);
    form.reset();
  }

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      website: values.website,
      logo: values.logo,
      invitees: values.invitees?.filter(i => !!i.email)
    }

    toast.promise(createOrg(payload).unwrap(), {
      loading: 'Creating organization...',
      success: (res) => { handleClose(); return 'Organization created successfully!'; },
      error: 'Failed to create organization.'
    });
  };


  return (
    <Modal
      open={open}
      setOpen={(val) => {
        setOpen(val);
        if (!val) handleClose();
      }}
      trigger={trigger}
      className="max-w-[800px] w-full p-0 overflow-hidden gap-0"
    >
      <div className="bg-accent border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 w-400">
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
          >
            {step > 1 ? <Check className="w-3 h-3" /> : '1'}
          </div>
          <span
            className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : ''}`}
          >
            Company Info
          </span>

          <div className="w-100 h-[2px] bg-gray-200 mx-2 relative">
            <div
              className={`absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300 ${step > 1 ? 'w-full' : 'w-0'}`}
            ></div>
          </div>

          <div
            className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
          >
            2
          </div>
          <span
            className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : ''}`}
          >
            Invite Team
          </span>
        </div>
      </div>

      <div className="p-6">
        <Form {...form}>
          <form id="create-org-form" onSubmit={form.handleSubmit(onSubmit)}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-medium">
                    Let's set up your workspace
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Tell us about your company to get started
                  </p>
                </div>

                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter company name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Website <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Logo URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/logo.png" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={handleCompleteInfo}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-medium">Invite your team</h2>
                  <p className="text-gray-500 text-sm">
                    Add team members to collaborate on security management
                  </p>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`invitees.${index}.email`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="name@example.com"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-[120px]">
                        <FormField
                          control={form.control}
                          name={`invitees.${index}.role`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  options={[
                                    { label: 'Admin', value: 'Admin' },
                                    { label: 'Manager', value: 'Manager' },
                                  ]}
                                  enableSearch={false}
                                  onChange={(option) => field.onChange(option?.value)}
                                  placeholder="Role"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed "
                    onClick={() => append({ email: '', role: 'Manager' })}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add another member
                  </Button>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={creatingNewOrg || !form.formState.isValid}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {creatingNewOrg ? 'Creating...' : 'Complete Setup'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>
    </Modal>
  );
}
