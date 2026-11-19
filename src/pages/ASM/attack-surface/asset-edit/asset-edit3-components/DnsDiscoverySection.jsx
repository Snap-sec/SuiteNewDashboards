import { Radar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import InfoTable from './InfoTable';
import SectionCard from './SectionCard';

/**
 * DNS & Discovery Adapter section.
 */
const DnsDiscoverySection = ({ asset }) => {
  const adapter = asset?.workstation?.discovery_adapter || asset?.adapter || {};
  const dns = asset?.workstation?.dns || {};

  const rows = [];

  // DNS servers
  if (dns?.servers) {
    dns.servers.forEach((server, i) => {
      rows.push({
        label: `DNS Server ${i + 1}`,
        value: server,
        highlight: true,
      });
    });
  }

  if (dns?.dns_server_1) {
    rows.push({
      label: 'DNS Server 1',
      value: dns.dns_server_1,
      highlight: true,
    });
  }

  // Public IP
//   const publicIp =
//     (typeof asset?.ip === 'string' ? asset.ip : null) ||
//     asset?.ips?.[0]?.ip ||
//     asset?.value;
//   if (publicIp && typeof publicIp === 'string') {
    rows.push({
      label: 'Public IP',
      value: asset?.workstation?.public_ip,
      render: (val) => (
        <Badge variant="primary" appearance="outline" size="sm">
          {val}
        </Badge>
      ),
    });
//   }

  // Adapter info
  if (adapter?.name) {
    rows.push({
      label: 'Adapter Name',
      value: adapter.name,
      render: (val) => (
        <Badge variant="warning" appearance="outline" size="sm">
          {val}
        </Badge>
      ),
    });
  }

  if (adapter?.type) {
    rows.push({
      label: 'Adapter Type',
      value: adapter.type,
      render: (val) => (
        <Badge variant="info" appearance="outline" size="sm">
          {val}
        </Badge>
      ),
    });
  }

  if (adapter?.description) {
    rows.push({ label: 'Description', value: adapter.description });
  }

  if (rows.length === 0) return null;

  return (
    <SectionCard
      icon={<Radar className="size-4" />}
      iconColor="text-cyan-500"
      title="DNS & Discovery Adapter"
    >
      <InfoTable rows={rows} />
    </SectionCard>
  );
};

export default DnsDiscoverySection;
