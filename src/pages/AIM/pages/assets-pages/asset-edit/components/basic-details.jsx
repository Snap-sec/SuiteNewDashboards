import { useState } from 'react';
import { AvatarGroup } from '@/partials/common/avatar-group';
import { Archive, ArrowUpRight, Box, CircleEllipsis, Code2, Container, Cpu, Database, Factory, FileBadge2, GitFork, Globe, LayoutPanelLeft, Loader2, MapPin, Monitor, Server, Settings, ShieldAlert, SquarePen, Trash, Users } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import SelectWithAvatar from '../../../../../../components/custom/select-with-avatar';
import { CustomTooltip } from '../../../../../../components/custom/tooltip';
import { useUpdateAimAssetMutation } from '../../../../../../services/asset-inventory/assets/assetsApi';
import { useDeleteAimAssetByIdMutation, useAimStageForDecommissionMutation, useDecommissionAimGlobalAssetMutation } from '../../../../../../services/asset-inventory/assets/assetsApi';
import { useGetOrgMembersQuery } from '../../../../../../services/auth/orgApi';
import UpdateBusinessUnit from './actions/update-asset-business-unit';
import AssetNameInput from './basic-details-asset-name-input';
import ReasonModal from './reason-modal';


// Asset Icons
const assetTypeIcons = {
  subdomain: <Globe size={35} />,
  repo: <GitFork size={35} />,
  ip: <MapPin size={35} />,
  employee: <Users size={35} />,
  certificate: <FileBadge2 size={35} />,
  dns: <LayoutPanelLeft size={35} />,
  application: <Server size={35} />,
  other: <CircleEllipsis size={35} />,
  api: <Code2 size={35} />,
  technology: <Cpu size={35} />,
  compartment: <Box size={35} />,
  workstation: <Monitor size={35} />,
  registry: <Database size={35} />,
  object_storage: <Container size={35} />,
  vendor: <Factory size={35} />
};

const AssetNames = {
  subdomain: 'Subdomain',
  repo: 'Repository',
  ip: 'IP Address',
  employee: 'Employees',
  certificate: 'Certificates',
  dns: 'DNS Records',
  application: 'Applications',
  other: 'Others',
};

const BasicDetails = ({ asset = {} }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [deleteAsset] = useDeleteAimAssetByIdMutation();
  const [updateAsset, { isLoading: isUpdating }] = useUpdateAimAssetMutation();
  const [stageForDecommission, { isLoading: isStaging }] = useAimStageForDecommissionMutation();
  const [decommissionGlobalAsset, { isLoading: isDecommissioning }] = useDecommissionAimGlobalAssetMutation();
  const assetType = searchParams.get('asset');
  const {
    data: orgMembers,
    error,
    isLoading: orgMembersLoading,
  } = useGetOrgMembersQuery();

  const [isEditingOwner, setIsEditingOwner] = useState(false);
  const [updatingOwner, setUpdatingOwner] = useState(false);
  const [currentOwner, setCurrentOwner] = useState(asset?.owner);

  const handleDelete = async () => {
    try {
      await toast.promise(deleteAsset(asset._id).unwrap(), {
        success: 'Asset successfully deleted.',
        error: 'Failed to delete asset.',
      });
      if (assetType !== 'assets') {
        navigate(`/assetinventory/assets/${assetType}`);
      } else {
        navigate('/assetinventory/assets');
      }
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
  };

  const decommissionAsset = async (reason = '') => {
    const newStatus = !asset.decommissioned;
    try {
      await toast.promise(
        updateAsset({
          id: asset._id,
          body: { decommissioned: newStatus, decommissionedReason: reason },
        }).unwrap(),
        {
          success: newStatus ? 'Asset decommissioned.' : 'Asset reactivated.',
          error: 'Failed to update asset status.',
        },
      );
      // Optionally, you can refresh or navigate if needed
    } catch (error) {
      console.error('Failed to update asset status:', error);
    }
  };

  const handleStageForDecommission = (reason = '') => {
    toast.promise(
      stageForDecommission({ assetId: asset._id, reason: reason }).unwrap(),
      {
        loading: 'Staging asset for decommission...',
        success: 'Asset staged for decommission successfully.',
        error: (err) =>
          err?.data?.message || 'Failed to stage asset for decommission.',
      },
    );
  };

  const handleDecommission = (reason = '') => {
    toast.promise(
      decommissionGlobalAsset({ assetId: asset._id, reason: reason }).unwrap(),
      {
        loading: 'Decommissioning asset...',
        success: 'Asset decommissioned successfully.',
        error: (err) =>
          err?.data?.message || 'Failed to decommission asset.',
      },
    );
  };

  const statistics = [
    {
      total: asset?.security?.vulnerability_stats?.total || 0,
      description: 'Total Vulnerabilities',
    },
    // {
    //   total: asset?.risk?.autoRiskScore?.score || 0,
    //   description: 'Risk Score',
    // },
    // {
    //   total: asset?.risk?.exposure ? 'Exposed' : 'Safe',
    //   description: 'Exposure',
    // },
    {
      total: asset?.environment || 'Unknown',
      description: 'Environment',
    },
    {
      total: new Date(asset?.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      description: 'First Found',
    },
    {
      total: new Date(asset?.last_detected).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      description: 'Last Found',
    },
  ];

  const renderItem = (statistic, index) => (
    <div
      key={index}
      className="flex flex-col gap-1.5 px-2.75 py-2.25 border border-dashed border-input rounded-md"
    >
      <span className="text-mono text-sm leading-none font-medium">
        {statistic?.total}
      </span>
      <span className="text-secondary-foreground text-xs">
        {statistic?.description}
      </span>
    </div>
  );

  // Owner edit workflow
  const handleOwnerEdit = () => setIsEditingOwner(true);

  const handleUserSelect = async (userId) => {
    const selectedUser = orgMembers?.data?.members?.find(
      (u) => u._id === userId,
    );
    if (!selectedUser) return;

    setUpdatingOwner(true);

    try {
      // Send update with full user object as payload
      await updateAsset({
        id: asset._id,
        body: {
          owner: {
            userId: selectedUser._id,
        },
      }}).unwrap();

      setCurrentOwner({
        id: selectedUser._id,
        name: selectedUser.name,
        email: selectedUser.email,
      });
      setIsEditingOwner(false); // Close the select after update
      toast.success('Owner updated!');
    } catch (err) {
      toast.error('Failed to update owner!');
    } finally {
      setUpdatingOwner(false);
    }
  };

  return (
    <Card>
      <CardContent className="lg:py-7.5">
        <div className="flex flex-wrap gap-7.5">
          <div className="flex flex-col gap-3 items-center justify-center size-[140px] rounded-xl ring-1 ring-border bg-secondary-clarity">
            <div>{assetTypeIcons[asset?.type]}</div>
            <span className="text-sm font-semibold text-mono">
              {AssetNames[asset?.type]}
            </span>
          </div>
          <div className="flex flex-col gap-5 lg:gap-5 grow">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-semibold text-mono">
                    {asset?.value}
                  </h2>
                  <Badge
                    size="md"
                    variant={
                      asset?.state === 'active' ? 'success'
                        : asset?.state === 'staged' ? 'warning'
                          : 'destructive'
                    }
                    appearance="outline"
                  >
                    {asset?.state === 'active'
                      ? 'Active'
                      : asset?.state === 'staged'
                        ? 'Staged'
                        : 'Decommissioned'}
                  </Badge>
                </div>
                <p className="text-sm text-secondary-foreground">
                  <AssetNameInput assetId={asset?._id} name={asset?.name} />{' '}
                  {asset?.decommissioned ? asset?.decommissionedReason : ''}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                {(!asset?.state || asset?.state === 'active' || asset?.state === 'pending') && (
                  <ReasonModal
                    onDecommission={handleStageForDecommission}
                    title="Stage for Decommission"
                    description="Please provide a reason for staging this asset for decommission"
                    trigger={
                      <Button variant="outline" disabled={isStaging}>
                        <Trash />
                        Stage for Decommission
                      </Button>
                    }
                  />
                )}


                {asset?.state === 'staged' && (
                  <ReasonModal
                    onDecommission={handleDecommission}
                    showWarning
                    trigger={
                      <Button variant="outline" disabled={isDecommissioning}>
                        <Archive />
                        Decommission
                      </Button>
                    }
                  />
                )}
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-3 lg:gap-5">
              {statistics.map((statistic, index) =>
                renderItem(statistic, index),
              )}

              {/* Updating Owner */}
              <div className="flex flex-col px-2.75 py-2.25 border border-dashed border-input rounded-md">
                {!isEditingOwner && (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-mono text-sm leading-none font-medium">
                        {(() => {
                          const owner = asset?.owner;
                          const user = owner?.user;
                          if (user?.firstName || user?.lastName) {
                            return `${user.firstName || ''} ${user.lastName || ''}`.trim();
                          }
                          if (user?.email) return user.email;
                          if (owner?.team?.name) return owner.team.name;
                          if (owner?.department?.name) return owner.department.name;
                          return 'Unknown';
                        })()}
                      </span>
                      <div className=" cursor-pointer">
                        <button
                          type="button"
                          aria-label="Edit Owner"
                          onClick={handleOwnerEdit}
                          className="cursor-pointer"
                        >
                          <SquarePen className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <span className="text-secondary-foreground text-xs">
                      Managed By
                    </span>
                  </>
                )}
                {/* Only show SelectWithAvatar when in editing mode */}
                {isEditingOwner && (
                  <SelectWithAvatar
                    users={orgMembers?.data?.members || []}
                    onChange={handleUserSelect}
                    searchFields={['name', 'email']}
                    placeholder="Select a user…"
                    emptyMessage="No users found."
                  />
                )}
                {updatingOwner && (
                  <div className="text-xs text-muted-foreground">
                    Updating owner...
                  </div>
                )}
              </div>

              {/* Update business unit */}
              <UpdateBusinessUnit assetData={asset} />
            </div>
            <div className="flex flex-wrap gap-6 lg:gap-12">
              <div className="flex flex-col gap-3.5 grow">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-secondary-foreground">
                    Total of :{' '}
                    <span className="text-sm font-medium text-mono">
                      {asset?.security?.closed_vulns || 0} closed vulns from{' '}
                      {asset?.security?.vulnerability_stats?.total}
                    </span>
                  </div>

                  <div className="flex  gap-2">
                    <p>Found On:</p>
                    <div className="flex gap-1">
                      {asset?.adapters?.map((adapter, index) => (
                        <CustomTooltip text={adapter?.title} key={index}>
                          <img
                            key={index}
                            src={toAbsoluteUrl(`${adapter?.logo}`)}
                            className="h-6 shrink-0 border p-0.5 rounded-md border-default"
                            alt="icon"
                          />
                        </CustomTooltip>
                      ))}
                    </div>
                  </div>
                </div>

                <Progress
                  value={asset?.security?.vulnerability_stats?.remediation_progress}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { BasicDetails };