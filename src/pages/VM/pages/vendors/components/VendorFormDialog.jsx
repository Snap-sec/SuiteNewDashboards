import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { vendorSchema } from '../forms/vendor-schema';

const EMPTY_FORM = {
  name: '',
  description: '',
  email: '',
  phone: '',
  address: '',
  logo_url: '',
};

function getInitials(name) {
  return name ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) : '?';
}

export default function VendorFormDialog({ open, setOpen, vendor, onSave }) {
  const isEdit = !!vendor;

  const form = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (open) {
      if (!vendor) {
        form.reset(EMPTY_FORM);
      } else {
        const contact = vendor.contact_details ?? vendor.contactDetails ?? {};
        form.reset({
          name: vendor.name || '',
          description: vendor.description || '',
          email: vendor.email ?? contact.email ?? '',
          phone: vendor.phone ?? contact.phone ?? '',
          address: vendor.address ?? contact.address ?? '',
          logo_url: vendor.logo_url ?? vendor.logoUrl ?? vendor.logo ?? '',
        });
      }
    }
  }, [open, vendor, form]);

  const onSubmit = (values) => {
    // Maintain the exact payload structure expected by the backend
    const payload = {
      name: values.name,
      description: values.description,
      contact_details: {
        email: values.email,
        phone: values.phone,
        address: values.address,
      },
      logo_url: values.logo_url,
    };

    onSave(payload);
    setOpen(false);
  };

  const logoUrl = form.watch('logo_url');
  const name = form.watch('name');

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={isEdit ? 'Edit Service Vendor' : 'Add New Service Vendor'}
      description={isEdit ? 'Update the service vendor details below.' : 'Fill in the details to register a new service vendor identity.'}
      className="sm:max-w-lg max-h-[95vh] overflow-y-auto"
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" size="md" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
          >
            {isEdit ? 'Save Changes' : 'Add Service Vendor'}
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Service Vendor Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. CyberGuard Solutions" 
                    {...field}
                    maxLength={30}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      field.onChange(val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contact@vendor.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="e.g. 15550000000" 
                      {...field} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        field.onChange(val);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main Street, City, Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Logo URL */}
          <FormField
            control={form.control}
            name="logo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Logo URL <span className="text-destructive">*</span>
                </FormLabel>
                <div className="flex gap-3 items-center">
                  <FormControl>
                    <Input
                      placeholder="https://example.com/logo.png"
                      className="flex-1"
                      {...field}
                    />
                  </FormControl>
                  {logoUrl && !form.formState.errors.logo_url && (
                    <Avatar className="size-10 border">
                      <AvatarImage src={logoUrl} />
                      <AvatarFallback className="text-[10px] bg-muted">{getInitials(name)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <FormMessage />
                <p className="text-[10px] text-muted-foreground italic">Provide a direct link to the service vendor's logo image.</p>
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description / Notes</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Brief description of the service vendor's services..."
                    {...field}
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
