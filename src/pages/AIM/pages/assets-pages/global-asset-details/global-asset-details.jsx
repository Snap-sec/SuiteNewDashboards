import { useParams } from "react-router-dom";
import { ContentLoader } from "@/components/common/content-loader";
import { useGetAimPublicAssetDetailsByIdQuery } from "../../../../../services/asset-inventory/assets/public-assets.js";

// Shared sections (always shown when data exists)
import AssetHeader from "../asset-edit/asset-edit3-components/AssetHeader";
import GeneralInfoSection from '../asset-edit/asset-edit3-components/GeneralInfoSection';
import LocationSection from '../asset-edit/asset-edit3-components/LocationSection';
import SecuritySection from '../asset-edit/asset-edit3-components/SecuritySection';
import OwnerSection from '../asset-edit/asset-edit3-components/OwnerSection';

// Non-workstation sections (subdomain, ip, port, etc.)
import SubdomainDetailsSection from '../asset-edit/asset-edit3-components/SubdomainDetailsSection';
import OpenPortsSection from '../asset-edit/asset-edit3-components/OpenPortsSection';
import DnsRecordsSection from '../asset-edit/asset-edit3-components/DnsRecordsSection';
import CertificatesSection from '../asset-edit/asset-edit3-components/CertificatesSection';
import RelationsSection from '../asset-edit/asset-edit3-components/RelationsSection';
import AdaptersSection from '../asset-edit/asset-edit3-components/AdaptersSection';

// Workstation-specific sections
import OperatingSystemSection from '../asset-edit/asset-edit3-components/OperatingSystemSection';
import HardwareSection from '../asset-edit/asset-edit3-components/HardwareSection';
import StorageSection from '../asset-edit/asset-edit3-components/StorageSection';
import NetworkSection from '../asset-edit/asset-edit3-components/NetworkSection';
import DnsDiscoverySection from '../asset-edit/asset-edit3-components/DnsDiscoverySection';
import SystemUsersSection from '../asset-edit/asset-edit3-components/SystemUsersSection';
import SystemServicesSection from '../asset-edit/asset-edit3-components/SystemServicesSection';
import ProcessesSection from '../asset-edit/asset-edit3-components/ProcessesSection';
import InstalledPackagesSection from '../asset-edit/asset-edit3-components/InstalledPackagesSection';


function GlobalAssetDetails() {
    const pathSegments = window.location.pathname.split('/');
    const orgId = pathSegments[4];
    const assetId = pathSegments[5];

    const { data: asset, isLoading, error } = useGetAimPublicAssetDetailsByIdQuery({
        orgId,
        assetId
    });


    if (isLoading) {
        return <ContentLoader className="h-[calc(100vh-64px)]" />;
    }


    if (error) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                <p className="text-destructive text-sm">Error loading asset data</p>
            </div>
        );
    }

    const assetData = asset?.asset;
    const hasWorkstation = !!assetData?.workstation;

    return (
        <div className="p-4 p-6 py-2 flex flex-col gap-6 w-full">
            {/* Header */}
            <AssetHeader asset={assetData} isGlobal={true} />

            {/* General Information (always shown) */}
            <GeneralInfoSection asset={assetData} />

            {/* Subdomain Details (only for subdomain assets) */}
            <SubdomainDetailsSection asset={assetData} />

            {/* Owner */}
            <OwnerSection asset={assetData} />

            {/* Location & IP Info */}
            <LocationSection asset={assetData} />

            {/* Security */}
            <SecuritySection asset={assetData} />

            {/* ---- Non-workstation sections ---- */}
            {!hasWorkstation && (
                <>
                    {/* Open Ports */}
                    <OpenPortsSection asset={assetData} />

                    {/* DNS Records */}
                    <DnsRecordsSection asset={assetData} />

                    {/* SSL Certificates */}
                    <CertificatesSection asset={assetData} />

                    {/* Relations */}
                    <RelationsSection asset={assetData} />

                    {/* Adapters */}
                    <AdaptersSection asset={assetData} />
                </>
            )}

            {/* ---- Workstation-specific sections ---- */}
            {hasWorkstation && (
                <>
                    {/* Operating System */}
                    {assetData.workstation?.os && <OperatingSystemSection asset={assetData} />}

                    {/* Hardware */}
                    {assetData.workstation?.hardware && <HardwareSection asset={assetData} />}

                    {/* Storage Devices */}
                    <StorageSection asset={assetData} />

                    {/* Network Interfaces */}
                    <NetworkSection asset={assetData} />

                    {/* DNS & Discovery Adapter */}
                    <DnsDiscoverySection asset={assetData} />

                    {/* System Users */}
                    <SystemUsersSection asset={assetData} />

                    {/* System Services */}
                    <SystemServicesSection asset={assetData} />

                    {/* Processes */}
                    <ProcessesSection asset={assetData} />

                    {/* Installed Packages */}
                    <InstalledPackagesSection asset={assetData} />
                </>
            )}

        </div>
    );
}

export default GlobalAssetDetails;