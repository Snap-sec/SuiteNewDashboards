import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { useCreateScanMutation, useUpdateScanMutation } from '@/services/csm/scansApi';
import { useGetInstalledCsmAdaptersQuery } from '@/services/csm/adaptersApi';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/custom/modal';
import Select from '@/components/custom/select';
import MultiSelect from '@/components/custom/multi-select';
import useStore from '../../store';

const frequencyOptions = [
  { label: 'Immediate', value: 'immediate' },
  { label: 'Hourly', value: 'hourly' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

function CreateScanModel({ supportedFrameworks = [] }) {
  const showCreateUpdateModal = useStore((state) => state.showCreateUpdateModal);
  const setShowCreateUpdateModal = useStore((state) => state.setShowCreateUpdateModal);
  const modalMode = useStore((state) => state.modalMode);
  const setModalMode = useStore((state) => state.setModalMode);
  const selectedScan = useStore((state) => state.selectedScan);
  const setSelectedScan = useStore((state) => state.setSelectedScan);

  const [payload, setPayload] = useState({
    name: '',
    description: '',
    accounts: [],
    complianceFrameworks: [],
    frequency: 'immediate',
  });

  const { data: installedData, isLoading: installedLoading } = useGetInstalledCsmAdaptersQuery();
  const integrations = installedData?.data?.integrations || installedData?.integrations || [];

  const integrationOptions = integrations.map((integration) => ({
    label: integration.user_provided_name || integration.title || integration.type,
    value: integration._id || integration.instance_id,
  }));

  const frameworkOptions = supportedFrameworks.map((fw) => ({
    label: fw.name,
    value: fw.id,
  }));

  useEffect(() => {
    if (modalMode === 'update' && selectedScan) {
      setPayload({
        name: selectedScan.name || '',
        description: selectedScan.description || '',
        accounts: selectedScan.accounts?.map(acc => acc._id || acc.value || acc) || [],
        complianceFrameworks: selectedScan.complianceFrameworks || [],
        frequency: selectedScan.schedule?.frequency || 'immediate',
      });
    } else {
      setPayload({
        name: '',
        description: '',
        accounts: [],
        complianceFrameworks: [],
        frequency: 'immediate',
      });
    }
  }, [selectedScan, modalMode, showCreateUpdateModal]);

  const [createScan] = useCreateScanMutation();
  const [updateScan] = useUpdateScanMutation();

  const handleCreateScan = () => {
    if (!payload.name || !payload.accounts.length) {
      return toast.error('Name and Accounts are required!');
    }

    const cleanPayload = {
      name: payload.name,
      description: payload.description,
      accounts: payload.accounts.map(a => a.value || a),
      complianceFrameworks: payload.complianceFrameworks.map(f => f.value || f),
      schedule: {
        frequency: payload.frequency,
      },
    };

    toast.promise(createScan(cleanPayload).unwrap(), {
      loading: 'Creating Scan',
      success: 'Scan Created',
      error: (err) => err?.data?.message || 'Failed to create Scan',
    });
    setShowCreateUpdateModal(false);
  };

  const handleUpdateScan = () => {
    if (!payload.name || !payload.accounts.length) {
      return toast.error('Name and Accounts are required!');
    }

    const cleanPayload = {
      scanId: selectedScan._id,
      name: payload.name,
      description: payload.description,
      accounts: payload.accounts.map(a => a.value || a),
      complianceFrameworks: payload.complianceFrameworks.map(f => f.value || f),
      schedule: {
        frequency: payload.frequency,
      },
    };

    toast.promise(updateScan(cleanPayload).unwrap(), {
      loading: 'Updating Scan',
      success: 'Scan Updated',
      error: (err) => err?.data?.message || 'Failed to update Scan',
    });
    setShowCreateUpdateModal(false);
  };

  const handleSubmit = () => {
    if (modalMode === 'update') {
      handleUpdateScan();
    } else {
      handleCreateScan();
    }
  };

  return (
    <Modal
      open={showCreateUpdateModal}
      setOpen={setShowCreateUpdateModal}
      title={modalMode === 'update' ? 'Update Scan' : 'Create Scan'}
      description={
        modalMode === 'update' ? 'Update the scan configuration.' : 'Create a new cloud compliance scan.'
      }
      trigger={
        <Button
          onClick={() => {
            setModalMode('create');
            setSelectedScan({});
          }}
        >
          <Plus /> Create Scan
        </Button>
      }
      footer={
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSubmit}>
            <Plus className="w-4 h-4 mr-2" /> {modalMode === 'update' ? 'Update Scan' : 'Create Scan'}
          </Button>
        </div>
      }
      className="w-1/3 max-w-[600px] max-h-[90vh] overflow-y-auto hide-scrollbar"
    >
      <div className="w-full flex flex-col gap-4">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Scan Name <span className='text-red-500'>*</span></Label>
            <Input
              id="name"
              placeholder="e.g., Daily Cloud Compliance Scan"
              value={payload.name}
              onChange={(e) => setPayload({ ...payload, name: e.target.value })}
            />
          </div>
        </div>

        {/* Target Accounts */}
        <div className="space-y-2">
          <Label>Target Accounts <span className='text-red-500'>*</span></Label>
          <CardDescription className="mb-2 text-xs">
            Select one or more active cloud integrations to scan.
          </CardDescription>
          <MultiSelect
            options={integrationOptions}
            values={payload.accounts}
            onChange={(values) => setPayload({ ...payload, accounts: values })}
            placeholder="Select accounts..."
            enableSearch={true}
            searchPlaceholder="Search accounts..."
            isLoading={installedLoading}
            maxShownItems={5}
          />
        </div>

        {/* Compliance Frameworks */}
        {/* <div className="space-y-2">
          <Label>Compliance Frameworks</Label>
          <CardDescription className="mb-2 text-xs">
            Select the compliance frameworks to evaluate during this scan.
          </CardDescription>
          <MultiSelect
            options={frameworkOptions}
            values={payload.complianceFrameworks}
            onChange={(values) => setPayload({ ...payload, complianceFrameworks: values })}
            placeholder="Select frameworks..."
            enableSearch={true}
            searchPlaceholder="Search frameworks..."
            maxShownItems={5}
          />
        </div> */}

        {/* Schedule Configuration */}
        <Card className="p-4 shadow-sm mt-2">
          <CardTitle className="text-base">Schedule Configuration</CardTitle>
          <CardDescription className="text-xs mb-4">Set how often this scan should run.</CardDescription>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Frequency <span className='text-red-500'>*</span></Label>
              <Select
                options={frequencyOptions}
                value={payload.frequency}
                onChange={(selected) => setPayload({ ...payload, frequency: selected.value })}
              />
            </div>
          </div>
        </Card>
      </div>
    </Modal>
  );
}

export default CreateScanModel;