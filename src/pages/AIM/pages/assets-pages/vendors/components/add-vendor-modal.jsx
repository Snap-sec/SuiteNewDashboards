import { useEffect, useState } from 'react';
import { Building2, Globe, Mail, Phone, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/custom/modal';
import {
  useCreateAimVendorMutation,
  useUpdateAimVendorMutation,
} from '@/services/asset-inventory/vendorsApi';

export function AddVendorModal({ open, setOpen, selectedVendor }) {
  const [createAimVendor, { isLoading: isCreating }] = useCreateAimVendorMutation();
  const [updateAimVendor, { isLoading: isUpdating }] = useUpdateAimVendorMutation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');

  const isEditMode = Boolean(selectedVendor);

  const extractDomain = (url) => {
    if (!url) return '';
    try {
      const cleanUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
      return new URL(cleanUrl).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  };

  useEffect(() => {
    if (open) {
      if (selectedVendor) {
        const vData = selectedVendor.vendor || selectedVendor.data || selectedVendor;
        setName(vData.name || selectedVendor.name || selectedVendor.value || '');
        setDescription(vData.description || selectedVendor.description || '');
        setLogoUrl(vData.logo_url || selectedVendor.logo_url || vData.logoUrl || selectedVendor.logoUrl || '');
        setAddress(vData.address || selectedVendor.address || '');
        setEmail(vData.email || selectedVendor.email || '');
        setWebsite(vData.website || selectedVendor.website || vData.domain || selectedVendor.domain || '');
        setPhone(vData.phone || selectedVendor.phone || '');
      } else {
        handleReset();
      }
    }
  }, [open, selectedVendor]);

  const handleReset = () => {
    setName('');
    setDescription('');
    setLogoUrl('');
    setAddress('');
    setEmail('');
    setWebsite('');
    setPhone('');
  };

  const handleSave = async () => {
    if (!name.trim()) {
      return toast.error('Please enter a vendor name');
    }

    const domain = extractDomain(website.trim());

    const vendorData = {
      name: name.trim(),
      description: description.trim() || undefined,
      logo_url: logoUrl.trim() || undefined,
      domain: domain || undefined,
      address: address.trim() || undefined,
      email: email.trim() || undefined,
      website: website.trim() || undefined,
      phone: phone.trim() || undefined,
      source: 'manual',
    };

    const createPayload = {
      type: 'vendor',
      value: name.trim(),
      data: vendorData,
    };

    try {
      if (isEditMode) {
        const id = selectedVendor._id || selectedVendor.id;
        await updateAimVendor({ id, ...vendorData }).unwrap();
        toast.success('Vendor updated successfully');
      } else {
        await createAimVendor(createPayload).unwrap();
        toast.success('Vendor created successfully');
      }
      setOpen(false);
      handleReset();
    } catch (err) {
      toast.error(
        err?.data?.message ||
          (isEditMode ? 'Failed to update vendor' : 'Failed to create vendor'),
      );
    }
  };

  return (
    <Modal
      open={open}
      setOpen={(val) => {
        setOpen(val);
        if (!val) handleReset();
      }}
      title={isEditMode ? 'Edit Vendor' : 'Add Vendor'}
      description={
        isEditMode
          ? 'Update vendor details.'
          : 'Add a new vendor to your organization.'
      }
      className="sm:max-w-lg"
      footer={
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              handleReset();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isCreating || isUpdating}
          >
            {isEditMode ? (
              <>
                <Save className="size-4 mr-1" /> Save Changes
              </>
            ) : (
              <>
                <Plus className="size-4 mr-1" /> Create
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 py-1">
        {/* Name Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Name <span className="text-destructive">*</span>
            </label>
            <span className="text-xs text-muted-foreground">{name.length}/60</span>
          </div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 60))}
            placeholder="e.g. AWS, Microsoft, Atlassian"
            maxLength={60}
          />
        </div>

        {/* Website & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Website
            </label>
            <div className="relative">
              <Globe className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="e.g. https://example.com"
                className="ps-9"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Email
            </label>
            <div className="relative">
              <Mail className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. vendor@example.com"
                className="ps-9"
              />
            </div>
          </div>
        </div>

        {/* Phone & Logo URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Phone
            </label>
            <div className="relative">
              <Phone className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 15551234567"
                className="ps-9"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Logo URL
            </label>
            <Input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="e.g. https://example.com/logo.png"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the vendor..."
            rows={2}
          />
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Address
          </label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 100 Enterprise Way, Suite 200, San Jose, CA"
          />
        </div>
      </div>
    </Modal>
  );
}
