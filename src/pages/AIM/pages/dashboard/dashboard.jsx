import { useState } from 'react';
import { CrashError } from '@/errors/crash-error';
import { CircleAlert, Plug, RefreshCcw } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { useGetAimDashboardStatsQuery, useRecomputeAimDashboardMutation } from '@/services/asset-inventory/dashboardApi';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';
import { ContentLoader } from '@/components/common/content-loader';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import PageHeading from '@/components/custom/page-heading';
import Select from '@/components/custom/select';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../../components/common/empty-screen';
import ApiDashboard from './asset-dashboards/api-dashboard';
import ApplicationDashboard from './asset-dashboards/application-dashboard';
import CertificateDashboard from './asset-dashboards/certificate-dashboard';
import EmployeeDashboard from './asset-dashboards/employee-dashboard';
import IpDashboard from './asset-dashboards/ip-dashboard';
import ObjectStorageDashboard from './asset-dashboards/object-storage-dashboard';
import RepositoryDashboard from './asset-dashboards/repository-dashboard';
import SubdomainDashboard from './asset-dashboards/subdomain-dashboard';
import Cards from './components/cards';
import {useNavigate} from 'react-router-dom';

const ChartInfoHover = ({ text }) => (
  <DetailedHoverPopover
    buttonText={
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
      >
        <CircleAlert className="h-4 w-4" />
      </Button>
    }
    showBadge={false}
    popoverTitle="About this Graph"
    popoverContent={<p className="text-muted-foreground">{text}</p>}
  />
);

const toChartData = (obj) =>
  obj
    ? Object.entries(obj).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' '),
      value,
    }))
    : [];

const toBarData = (items) =>
  items.map((d) => ({ name: d.name, count: d.value }));
const countKey = [{ key: 'count', label: 'Count' }];

const VULN_COLORS = ['#FF4560', '#FF8C00', '#FEB019', '#3B82F6', '#9CA3AF'];
const ENV_COLORS = ['#008FFB', '#775DD0', '#FEB019', '#00E396', '#546E7A'];
// IP chart specific colors: External (blue), Internal (green)
const IP_COLORS = ['#008FFB', '#00E396'];
const ARCHIVE_COLORS = ['#00E396', '#546E7A'];
const CERT_COLORS = ['#ef4444','#10b981', '#f59e0b']; // Valid (green), Invalid (red), About to expire (yellow)
const TECH_COLORS = [
  '#008FFB',
  '#775DD0',
  '#FEB019',
  '#00E396',
  '#FF4560',
  '#26a69a',
];
const STORAGE_COLORS = ['#FF9900', '#4285F4', '#00A9E0', '#0080FF', '#546E7A'];
const DNS_COLORS = [
  '#FF4560',
  '#00E396',
  '#008FFB',
  '#FEB019',
  '#775DD0',
  '#26a69a',
];
const ASSIGN_COLORS = ['#546E7A', '#008FFB', '#00E396', '#775DD0'];

const ASSET_TYPE_OPTIONS = [
  { value: 'overview', label: 'Default' },
  { value: 'subdomain', label: 'Subdomains' },
  { value: 'ip', label: 'IP Addresses' },
  { value: 'certificate', label: 'Certificates' },
  { value: 'application', label: 'Applications' },
  { value: 'repository', label: 'Repositories' },
  { value: 'object_storage', label: 'Object Storage' },
  { value: 'api', label: 'APIs' },
  { value: 'employee', label: 'Employees' },
];

const ASSET_TYPE_META = {
  overview: {
    title: 'Asset Inventory Dashboard',
    description: 'Overview of your organization’s digital asset inventory.',
  },
  subdomain: {
    title: 'Subdomains',
    description: 'Overview of discovered subdomains and associated asset details.',
  },
  ip: {
    title: 'IP Inventory',
    description: 'Overview of IP addresses, activity, and associated risks.',
  },
  certificate: {
    title: 'SSL Certificates Inventory',
    description: 'Overview of certificates, validity, and upcoming expiry risks.',
  },
  application: {
    title: 'Application Inventory',
    description: 'Overview of enterprise applications and associated asset details.',
  },
  repository: {
    title: 'Code Repositories',
    description: 'Overview of code repositories and associated security insights.',
  },
  object_storage: {
    title: 'Object Storage Inventory',
    description: 'Overview of cloud storage assets and associated risks.',
  },
  api: {
    title: 'API Inventory',
    description: 'Overview of APIs, ownership, activity, and associated risks.',
  },
  employee: {
    title: 'Employee Inventory',
    description: 'Overview of employee-linked accounts and associated digital assets.',
  },
};

const DASHBOARD_MAP = {
  subdomain: <SubdomainDashboard />,
  ip: <IpDashboard />,
  certificate: <CertificateDashboard />,
  application: <ApplicationDashboard />,
  repository: <RepositoryDashboard />,
  object_storage: <ObjectStorageDashboard />,
  api: <ApiDashboard />,
  employee: <EmployeeDashboard />,
};

function Dashboard2() {
  const navigate = useNavigate();
  const { data, error, isLoading, isError } = useGetAimDashboardStatsQuery();
  const [recomputeDashboard, { isLoading: isRecomputing }] = useRecomputeAimDashboardMutation();
  const [activeType, setActiveType] = useState('overview');

  const handleRecompute = async () => {
    try {
      await recomputeDashboard().unwrap();
      toast.success('Dashboard recomputation started');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to recompute dashboard');
    }
  };

  if (isError) {
    return <ApiErrorHandler error={error}/>
  }

  const stats = data?.asset_stats_by_type || {};

  const vulns = data?.data?.vulns || {};
  const vulnerabilityDistribution = [
    { name: 'Critical', value: vulns.critical?.[0] || 0 },
    { name: 'High', value: vulns.high?.[0] || 0 },
    { name: 'Medium', value: vulns.medium?.[0] || 0 },
    { name: 'Low', value: vulns.low?.[0] || 0 },
    { name: 'Informational', value: vulns.info?.[0] || 0 },
  ];

  const subdomainEnvironment = toChartData(
    stats.subdomain?.environment_distribution,
  );
  const assignedDistribution = toChartData(data?.assigned_distribution);
  const ipDistribution = toChartData(stats.ip?.ip_distribution);
  const archiveStatus = toChartData(
    stats.repository?.archive_status_distribution,
  ).map((item) => ({
    ...item,
    fill: {
      'Active': '#00E396',   // Green
      'Archived': '#546E7A', // Gray
      'Archive': '#546E7A',  // Gray
    }[item.name] || '#546E7A',
  }));
  const certificateValidity = toChartData(
    stats.certificate?.status_distribution,
  ).map((item) => ({
    ...item,
    fill: {
      'Valid': '#10b981',         // Green
      'About to expire': '#f59e0b', // Yellow
      'Expired': '#ef4444',       // Red
      'Invalid': '#ef4444',       // Red
    }[item.name] || '#ef4444',
  }));
  const objectStorageProvider = toChartData(
    stats.object_storage?.provider_distribution,
  );
  const appTypeDistribution = toChartData(
    stats.application?.application_type_distribution,
  );
  const apiAuthDistribution = toChartData(stats?.api?.auth_distribution);
  const activeArchiveDistribution = toChartData(stats?.registry?.active_archive_distribution);

  if(!isLoading && !data?.metrics?.total){
    return (
      <EmptyScreen
        title={'No assets have been detected so far.'}
        subTitle={
          'Please connect the adapter to begin populating your inventory.'
        }
        engage={
          <Button onClick={() => navigate('/assetinventory/adapters')} className="flex items-center gap-2">
            <Plug />
            Connect Adapter
          </Button>
        }
      />
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Helmet>
        <title>AssetIQ | Dashboard</title>
      </Helmet>

      <div className="flex items-end justify-between items-center gap-4">
        <PageHeading
          title={ASSET_TYPE_META[activeType]?.title}
          description={ASSET_TYPE_META[activeType]?.description}
        />

        {/* Asset Type Selector & Recompute Button */}
        <div className="flex items-center gap-2 -mt-4">
          <div className="w-64 shrink-0">
            <Select
              value={activeType}
              options={ASSET_TYPE_OPTIONS}
              placeholder="Select asset type..."
              enableSearch={false}
              onChange={(option) => {
                toast.info('Switched to dashboard: ' + option?.label);
                setActiveType(option?.value ?? 'overview');
              }}
            />
          </div>

          <CustomTooltip text="Recompute Dashboard">
            <ButtonWithConfirm
              variant="outline"
              confirm
              confirmVariant="warning"
              confirmTitle="Recompute Dashboard?"
              dialog="This will trigger a full recomputation of all dashboard metrics. This may take a moment."
              onConfirm={handleRecompute}
              disabled={isRecomputing}
            >
              <RefreshCcw className={`w-4 h-4 ${isRecomputing ? 'animate-spin' : ''}`} />
            </ButtonWithConfirm>
          </CustomTooltip>
        </div>
      </div>

      {/* Asset-specific mini dashboard */}
      {activeType !== 'overview' ? (
        <div>{DASHBOARD_MAP[activeType]}</div>
      ) : (
        <>
          <Cards data={data?.metrics} isLoading={isLoading} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReBarChart
              title="Active Vulnerabilities"
              titleBadge={
                <ChartInfoHover text="This graph shows the breakdown of vulnerabilities categorized by their severity levels." />
              }
              data={toBarData(vulnerabilityDistribution)}
              xKey="name"
              keys={countKey}
              colors={VULN_COLORS}
              distributed
              height={260}
              xTickFormatter={(v) => v}
              isLoading={isLoading}
            />

            <DonutChart
              title="Subdomains"
              titleBadge={
                <ChartInfoHover text="This graph displays the distribution of organization subdomains across different environments like production, staging, etc." />
              }
              data={subdomainEnvironment}
              colors={ENV_COLORS}
              centerLabel="Subdomains"
              centerValue={subdomainEnvironment.reduce(
                (s, d) => s + d.value,
                0,
              )}
              height={260}
              isLoading={isLoading}
            />

            <DonutChart
              title="IP Addresses"
              titleBadge={
                <ChartInfoHover text="This graph compares the count of internal (private) IP addresses versus external (public) IP addresses across your infrastructure." />
              }
              data={ipDistribution}
              colors={IP_COLORS}
              centerLabel="IPs"
              centerValue={ipDistribution.reduce((s, d) => s + d.value, 0)}
              height={260}
              isLoading={isLoading}
            />


          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DonutChart
              title="Code Repos"
              titleBadge={
                <ChartInfoHover text="This graph displays the ratio of archived versus active code repositories." />
              }
              data={archiveStatus}
              colors={ARCHIVE_COLORS}
              centerLabel="Repos"
              centerValue={archiveStatus.reduce((s, d) => s + d.value, 0)}
              height={260}
              isLoading={isLoading}
            />

            <DonutChart
              title="API's"
              titleBadge={
                <ChartInfoHover text="This graph displays the distribution of authentication methods used across your APIs." />
              }
              data={apiAuthDistribution}
              colors={CERT_COLORS}
              centerLabel="Api"
              centerValue={apiAuthDistribution.reduce((s, d) => s + d.value, 0)}
              height={260}
              isLoading={isLoading}
            />

            <DonutChart
              title="Applications"
              titleBadge={
                <ChartInfoHover text="This graph shows the distribution of different application types identified in your inventory." />
              }
              data={appTypeDistribution}
              colors={ENV_COLORS}
              centerLabel="Apps"
              centerValue={appTypeDistribution.reduce((s, d) => s + d.value, 0)}
              height={260}
              isLoading={isLoading}
            />


          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DonutChart
              title="SSL Certificates"
              titleBadge={
                <ChartInfoHover text="This graph displays the status of SSL/TLS certificates across domains, such as valid or expired." />
              }
              data={certificateValidity}
              colors={CERT_COLORS}
              centerLabel="Certificates"
              centerValue={certificateValidity.reduce((s, d) => s + d.value, 0)}
              height={260}
              isLoading={isLoading}
            />

            <DonutChart
              title="Object Storage"
              titleBadge={
                <ChartInfoHover text="This graph shows the distribution of identified cloud object storage buckets by their respective providers." />
              }
              data={objectStorageProvider}
              colors={STORAGE_COLORS}
              centerLabel="Buckets"
              centerValue={objectStorageProvider.reduce(
                (s, d) => s + d.value,
                0,
              )}
              height={260}
              isLoading={isLoading}
            />

             <DonutChart
              title="Registry"
              titleBadge={
                <ChartInfoHover text="This graph shows the distribution of active vs archive assets." />
              }
              data={activeArchiveDistribution}
              colors={ARCHIVE_COLORS}
              centerLabel="Assets"
              centerValue={activeArchiveDistribution.reduce(
                (s, d) => s + d.value,
                0,
              )}
              height={260}
              isLoading={isLoading}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard2;