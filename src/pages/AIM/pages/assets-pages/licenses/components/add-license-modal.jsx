import { useEffect, useState } from 'react';
import { KeyRound, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/custom/modal';
import Select from '@/components/custom/select';
import {
  useCreateAimLicenseMutation,
  useUpdateAimLicenseMutation,
} from '@/services/asset-inventory/licensesApi';

export function AddLicenseModal({ open, setOpen, selectedLicense }) {
  const [createAimLicense, { isLoading: isCreating }] = useCreateAimLicenseMutation();
  const [updateAimLicense, { isLoading: isUpdating }] = useUpdateAimLicenseMutation();

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('valid');
  const [purchased, setPurchased] = useState('');
  const [starts, setStarts] = useState('');
  const [expires, setExpires] = useState('');

  const isEditMode = Boolean(selectedLicense);

  useEffect(() => {
    if (open) {
      if (selectedLicense) {
        const lData = selectedLicense.license || selectedLicense.data || selectedLicense;
        setName(lData.name || selectedLicense.name || selectedLicense.value || '');
        setKey(lData.key || lData.license_key || selectedLicense.key || selectedLicense.license_key || '');
        setType(lData.type || selectedLicense.type || '');
        setStatus((lData.status || selectedLicense.status || 'valid').toLowerCase());
        setPurchased(
          toInputDateStr(lData.purchased_at || lData.purchased || selectedLicense.purchased_at || selectedLicense.purchased || ''),
        );
        setStarts(toInputDateStr(lData.starts_at || lData.starts || selectedLicense.starts_at || selectedLicense.starts || ''));
        setExpires(
          toInputDateStr(lData.expires_at || lData.expires || selectedLicense.expires_at || selectedLicense.expires || ''),
        );
      } else {
        handleReset();
      }
    }
  }, [open, selectedLicense]);

  const toInputDateStr = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toISOString().split('T')[0];
    } catch {
      return dateStr;
    }
  };

  const handleReset = () => {
    setName('');
    setKey('');
    setType('');
    setStatus('valid');
    setPurchased('');
    setStarts('');
    setExpires('');
  };

  const handleSave = async () => {
    if (!name.trim()) {
      return toast.error('Please enter a license name');
    }

    const formatIsoDate = (str) => {
      if (!str) return null;
      try {
        const dateObj = new Date(str);
        if (isNaN(dateObj.getTime())) return str;
        return dateObj.toISOString();
      } catch {
        return str;
      }
    };

    const licenseData = {
      name: name.trim(),
      type: type || 'Subscription',
      key: key.trim(),
      status: status ? status.toLowerCase() : 'valid',
      purchased_at: formatIsoDate(purchased),
      starts_at: formatIsoDate(starts),
      expires_at: formatIsoDate(expires),
      source: 'manual',
    };

    const createPayload = {
      type: 'license',
      value: name.trim(),
      data: licenseData,
    };

    try {
      if (isEditMode) {
        const id = selectedLicense._id || selectedLicense.id;
        await updateAimLicense({ id, ...licenseData }).unwrap();
        toast.success('License updated successfully');
      } else {
        await createAimLicense(createPayload).unwrap();
        toast.success('License created successfully');
      }
      setOpen(false);
      handleReset();
    } catch (err) {
      toast.error(
        err?.data?.message ||
          (isEditMode ? 'Failed to update license' : 'Failed to create license'),
      );
    }
  };

  const typeOptions = [
    { label: 'Subscription', value: 'Subscription' },
    { label: 'Perpetual', value: 'Perpetual' },
    { label: 'Trial', value: 'Trial' },
    { label: 'Enterprise', value: 'Enterprise' },
  ];

  const statusOptions = [
    { label: 'Valid', value: 'valid' },
    { label: 'Expired', value: 'expired' },
  ];

  return (
    <Modal
      open={open}
      setOpen={(val) => {
        setOpen(val);
        if (!val) handleReset();
      }}
      title={isEditMode ? 'Edit License' : 'Add License'}
      description={
        isEditMode
          ? 'Update software license details.'
          : 'Add a software license to your organization.'
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
        {/* Name Field with Character Count */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Name <span className="text-destructive">*</span>
            </label>
            <span className="text-xs text-muted-foreground">{name.length}/40</span>
          </div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 40))}
            placeholder="e.g. Jira Software"
            maxLength={40}
          />
        </div>

        {/* License Key Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
            License Key
          </label>
          <div className="relative">
            <KeyRound className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g. XXXX-XXXX-XXXX-XXXX"
              className="ps-9"
            />
          </div>
        </div>

        {/* Type Field using custom Select component */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Type
          </label>
          <Select
            value={type}
            onChange={(option) => setType(option?.value || '')}
            options={typeOptions}
            placeholder="Select type"
            enableSearch={false}
          />
        </div>

        {/* Status Field using custom Select component */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Status
          </label>
          <Select
            value={status}
            onChange={(option) => setStatus(option?.value || 'Valid')}
            options={statusOptions}
            placeholder="Select status"
            enableSearch={false}
          />
        </div>

        {/* 3-Column Grid for Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Purchased
            </label>
            <Input
              type="date"
              value={purchased}
              onChange={(e) => setPurchased(e.target.value)}
              className="text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Starts
            </label>
            <Input
              type="date"
              value={starts}
              onChange={(e) => setStarts(e.target.value)}
              className="text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Expires
            </label>
            <Input
              type="date"
              value={expires}
              onChange={(e) => setExpires(e.target.value)}
              className="text-xs"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
