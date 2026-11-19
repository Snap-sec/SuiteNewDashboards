import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import InfoTable from './InfoTable';
import SectionCard from './SectionCard';


const SecuritySection = ({ asset }) => {
    const security = asset?.security || {};
    const stats = security?.vulnerability_stats || {};
    const sevDist = security?.severity_distribution || {};

    const severityCards = [
        { label: 'TOTAL', value: stats?.total || 0 },
        { label: 'CRITICAL', value: sevDist?.critical_open || stats?.critical || 0 },
        { label: 'HIGH', value: sevDist?.high_open || stats?.high || 0 },
        { label: 'MEDIUM', value: sevDist?.med_open || stats?.medium || 0 },
        { label: 'LOW', value: sevDist?.low_open || stats?.low || 0 },
        { label: 'INFO', value: stats?.info || 0 },
    ];

    const infoRows = [
        {
            label: 'Open Vulnerabilities',
            value: security?.open_vulns || 0,
            render: (val) => <p>{val}</p>,
        },
        { label: 'Closed Vulnerabilities', value: security?.closed_vulns || 0 },
        {
            label: 'Aggregate CVSS',
            value: (stats?.aggregate_cvss || security?.aggregate_cvss || 0).toFixed(1),
        },
        {
            label: 'Remediation Progress',
            value: security?.remediation_progress != null ? `${Math.round(security.remediation_progress)}%` : '0%',
            render: (val) => (
                <p>{val}</p>
            ),
        },
        {
            label: 'Tested',
            value: security?.tested ? 'Yes' : 'No',
            render: (val) => <p>{val}</p>,
        },
        { label: 'Last Scan Date', value: security?.last_scan_date || '—' },
    ];

    return (
      <SectionCard
        icon={<ShieldCheck className="size-4" />}
        iconColor="text-green-500"
        title="Security"
      >
        <div className="grid grid-cols-6 gap-0 border-b border-border/50">
          {severityCards.map((card, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center py-4 border-r border-border/50 last:border-r-0"
            >
              <Link
                to={`/vm/vulnerabilities?filters=asset:${asset?.value}`}
                className=' text-right w-full text-xs px-3 underline hover:text-primary'
              >
                View
              </Link>
              <span className="text-2xl font-bold text-foreground">
                {card.value}
              </span>

              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                {card.label}
              </span>
            </div>
          ))}
        </div>
        <InfoTable rows={infoRows} />
      </SectionCard>
    );
};

export default SecuritySection;