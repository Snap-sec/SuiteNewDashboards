import React, { useMemo } from 'react';
import MetricsCards from '@/components/custom/cards/metric-cards';

export default function AnalyticsMetricsCards({ apiData, isLoading }) {
  const metrics = apiData?.metrics;

  const metricsItems = useMemo(() => {
    return [
      {
        number: apiData?.totalAssets ?? 0,
        label: 'Total Assets',
        path: '/casm/assets',
        skeletonWidth: 'w-16',
      },
      {
        number: metrics?.subdomain ?? metrics?.subdomains ?? 0,
        label: 'Subdomains',
        path: '/casm/assets/subdomains',
        skeletonWidth: 'w-16',
      },
      {
        number: metrics?.port ?? metrics?.ports ?? 0,
        label: 'Ports',
        path: '/casm/assets/ports',
        skeletonWidth: 'w-10',
      },
      {
        number: metrics?.ip ?? metrics?.ips ?? 0,
        label: 'IP Addresses',
        path: '/casm/assets/ip-addresses',
        skeletonWidth: 'w-18',
      },
      {
        number:
          metrics?.web_server ??
          metrics?.webServer ??
          metrics?.web_servers ??
          metrics?.webServers ??
          0,
        label: 'Web Servers',
        path: '/casm/assets/web-servers',
        skeletonWidth: 'w-18',
      },
      {
        number: metrics?.certificate ?? metrics?.certificates ?? 0,
        label: 'Certificates',
        path: '/casm/assets/certificates',
        skeletonWidth: 'w-16',
      },
      {
        number: metrics?.technology ?? metrics?.technologies ?? 0,
        label: 'Technologies',
        path: '/casm/assets/technologies',
        skeletonWidth: 'w-18',
      },
    ];
  }, [apiData?.totalAssets, metrics]);

  return <MetricsCards items={metricsItems} isLoading={isLoading} />;
}
