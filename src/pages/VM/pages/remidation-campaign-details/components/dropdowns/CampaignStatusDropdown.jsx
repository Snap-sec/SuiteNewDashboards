import React, { useState } from 'react';
import { Check, SquarePen, X } from 'lucide-react';
import { toast } from 'sonner';
import { useChangeVmRemediationCampaignOwnerMutation } from '@/services/vm/remidationCampaignApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Select from '@/components/custom/select';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';

const STATUS_OPTIONS = [
  { value: 'completed', label: 'Completed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'open', label: 'Open' },
  { value: 'dismissed', label: 'Dismissed' },
];

export default function CampaignStatusDropdown({ campaign }) {
  const campaignId = campaign?._id;
  const [editing, setEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    campaign?.status || 'open',
  );

  const [updateCampaign, { isLoading }] =
    useChangeVmRemediationCampaignOwnerMutation();

  const handleSave = async () => {
    const payload = {
      status: selectedStatus,
    };

    toast.promise(updateCampaign({ id: campaignId, payload }).unwrap(), {
      loading: 'Updating state...',
      success: () => {
        setEditing(false);
        return 'Campaign state updated successfully';
      },
      error: 'Failed to update campaign state',
    });
  };

  const getStatusLabel = (value) => {
    const option = STATUS_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : value || 'Open';
  };

  const getStatusBadge = (status) => {
    const val = status || 'open';
    const label = getStatusLabel(val);
    
    switch (val) {
      case 'completed':
        return (
          <Badge
            variant="success"
            appearance="outline"
            shape="circle"
            size="xs"
            className="px-2 py-0.5"
          >
            {label}
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge
            variant="warning"
            appearance="outline"
            shape="circle"
            size="xs"
            className="px-2 py-0.5"
          >
            {label}
          </Badge>
        );
      case 'dismissed':
        return (
          <Badge
            variant="dangerSoft"
            appearance="outline"
            shape="circle"
            size="xs"
            className="px-2 py-0.5"
          >
            {label}
          </Badge>
        );
      case 'open':
      default:
        return (
          <Badge
            variant="info"
            appearance="outline"
            shape="circle"
            size="xs"
            className="px-2 py-0.5"
          >
            {label}
          </Badge>
        );
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 mt-1 grow min-h-9 w-full">
      {editing ? (
        <div className="flex items-center gap-1.5 w-full">
          <div className="grow max-w-[200px]">
            <Select
              options={STATUS_OPTIONS}
              value={selectedStatus}
              onChange={(option) =>
                setSelectedStatus(option?.value || 'open')
              }
              placeholder="Select state..."
              enableSearch={false}
            />
          </div>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 p-0 hover:bg-muted"
              onClick={handleSave}
              disabled={isLoading}
            >
              <Check size={14} className="text-emerald-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 p-0 hover:bg-muted"
              onClick={() => {
                setSelectedStatus(campaign?.status || 'open');
                setEditing(false);
              }}
              disabled={isLoading}
            >
              <X size={14} className="text-destructive" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full gap-2">
          {getStatusBadge(campaign?.status)}

          <AuthorityGuard forbidRoles={['Auditor']}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={() => setEditing(true)}
            >
              <SquarePen size={12} className="text-muted-foreground" />
            </Button>
          </AuthorityGuard>
        </div>
      )}
    </div>
  );
}
