import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useGetAimAssetConfigsQuery,
  useGetAimAssetDetailsByIdQuery,
  useUpdateAimAssetMutation,
} from '@/services/asset-inventory/assets/assetsApi';
import { ContentLoader } from '@/components/common/content-loader';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import AdaptersSection from './asset-edit3-components/AdaptersSection';
// Shared sections (always shown when data exists)
import AssetHeader from './asset-edit3-components/AssetHeader';
import CertificatesSection from './asset-edit3-components/CertificatesSection';
import DnsDiscoverySection from './asset-edit3-components/DnsDiscoverySection';
import DnsRecordsSection from './asset-edit3-components/DnsRecordsSection';
import GeneralInfoSection from './asset-edit3-components/GeneralInfoSection';
import CustomFieldsSection from './asset-edit3-components/CustomFieldsSection';
import HardwareSection from './asset-edit3-components/HardwareSection';
import InstalledPackagesSection from './asset-edit3-components/InstalledPackagesSection';
import LocationSection from './asset-edit3-components/LocationSection';
import NetworkSection from './asset-edit3-components/NetworkSection';
import OpenPortsSection from './asset-edit3-components/OpenPortsSection';
// Workstation-specific sections
import OperatingSystemSection from './asset-edit3-components/OperatingSystemSection';
import OwnerSection from './asset-edit3-components/OwnerSection';
import ProcessesSection from './asset-edit3-components/ProcessesSection';
import RelationsSection from './asset-edit3-components/RelationsSection';
import SecuritySection from './asset-edit3-components/SecuritySection';
import StorageSection from './asset-edit3-components/StorageSection';
// Non-workstation sections (subdomain, ip, port, etc.)
import SubdomainDetailsSection from './asset-edit3-components/SubdomainDetailsSection';
import SystemServicesSection from './asset-edit3-components/SystemServicesSection';
import SystemUsersSection from './asset-edit3-components/SystemUsersSection';
import ApplicationDetails from './asset-edit3-components/ApplicationDetailsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActivityTab from './tabs/activity-log/ActivityTab';
import ApprovalsTab from './tabs/approvals/ApprovalsTab';
import ImpactTab from './tabs/impact-configuration/ImpactTab';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';


// import { useGetAimAssetConfigsQuery } from '../../../../../services/asset-inventory/assets/assetsApi';

function AssetEdit3() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const { data: asset, isLoading, error, isError } = useGetAimAssetDetailsByIdQuery(id);

  const { data: assetConfigs } = useGetAimAssetConfigsQuery();
  const [updateAsset, { isLoading: isUpdating }] = useUpdateAimAssetMutation();

  const handleUpdateAsset = async (body) => {
    toast.promise(updateAsset({ id, body }).unwrap(), {
      loading: 'Updating asset...',
      success: 'Asset updated successfully',
      error: 'Failed to update asset',
    });
  };

  const handleTabChange = (value) => {
    setSearchParams({ tab: value });
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 flex flex-col gap-6 max-w-full animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-60 rounded" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-40 rounded" />
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-4 border-b border-border/60 pb-2">
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
        </div>

        {/* Details Content Skeleton */}
        <div className="flex flex-col gap-6">
          {/* General Information Card */}
          <Card>
            <CardContent className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-44 rounded" />
                <Skeleton className="h-3.5 w-80 rounded" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-9 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Owner Section Card */}
          <Card>
            <CardContent className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-3.5 w-72 rounded" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-48 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card>
            <CardContent className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-24 rounded" />
                <Skeleton className="h-3.5 w-60 rounded" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-4 border border-dashed border-border/80 rounded-lg gap-2">
                    <Skeleton className="h-6 w-8 rounded" />
                    <Skeleton className="h-3.5 w-16 rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) return <ApiErrorHandler error={error} />

  const hasWorkstation = !!asset?.workstation;

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-6 max-w-full">
      {/* Header */}
      <AssetHeader asset={asset} />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4" variant="line">
          <TabsTrigger value="details">Details</TabsTrigger>
          {asset?.state === 'staged' && (
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
          )}
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="impact">Impact Configuration</TabsTrigger>
        </TabsList>


        <TabsContent value="details" className="flex flex-col gap-6 p-0 mt-0">
          {/* General Information (always shown) */}
          <GeneralInfoSection
            asset={asset}
            assetConfigs={assetConfigs}
            handleUpdate={handleUpdateAsset}
            isUpdating={isUpdating}
          />

          {/* Custom Fields */}
          <CustomFieldsSection
            asset={asset}
            handleUpdate={handleUpdateAsset}
            isUpdating={isUpdating}
          />

          {asset?.application && <ApplicationDetails asset={asset} />}

          {/* Subdomain Details (only for subdomain assets) */}
          <SubdomainDetailsSection
            asset={asset}
            assetConfigs={assetConfigs}
            handleUpdate={handleUpdateAsset}
            isUpdating={isUpdating}
          />

          {/* Owner */}
          <OwnerSection asset={asset} handleUpdate={handleUpdateAsset} />

          {/* Location & IP Info */}
          <LocationSection asset={asset} />

          {/* Security */}
          <SecuritySection asset={asset} />

          {/* ---- Non-workstation sections ---- */}
          {!hasWorkstation && (
            <>
              {/* Open Ports */}
              <OpenPortsSection asset={asset} />

              {/* DNS Records */}
              <DnsRecordsSection asset={asset} />

              {/* SSL Certificates */}
              <CertificatesSection asset={asset} />

              {/* Relations */}
              <RelationsSection asset={asset} />

              {/* Adapters */}
              <AdaptersSection asset={asset} />
            </>
          )}

          {/* ---- Workstation-specific sections ---- */}
          {hasWorkstation && (
            <>
              {/* Operating System */}
              {asset.workstation?.os && <OperatingSystemSection asset={asset} />}

              {/* Hardware */}
              {asset.workstation?.hardware && <HardwareSection asset={asset} />}

              {/* Storage Devices */}
              <StorageSection asset={asset} />

              {/* Network Interfaces */}
              <NetworkSection asset={asset} />

              {/* DNS & Discovery Adapter */}
              <DnsDiscoverySection asset={asset} />

              {/* System Users */}
              <SystemUsersSection asset={asset} />

              {/* System Services */}
              <SystemServicesSection asset={asset} />

              {/* Processes */}
              <ProcessesSection asset={asset} />

              {/* Installed Packages */}
              <InstalledPackagesSection asset={asset} />
            </>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="p-0 mt-0">
          <ActivityTab />
        </TabsContent>

        {asset?.state === 'staged' && (
          <TabsContent value="approvals" className="p-0 mt-0">
            <ApprovalsTab />
          </TabsContent>
        )}


        <TabsContent value="impact" className="p-0 mt-0">
          <ImpactTab asset={asset} handleUpdate={handleUpdateAsset} isUpdating={isUpdating} />
        </TabsContent>

      </Tabs>
    </div>
  );
}

export default AssetEdit3;


