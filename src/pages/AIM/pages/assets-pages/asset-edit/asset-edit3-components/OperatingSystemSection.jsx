import { Badge } from '@/components/ui/badge';
import { Monitor } from 'lucide-react';
import InfoTable from './InfoTable';
import SectionCard from './SectionCard';

/**
 * Operating System section – Platform, Family, Distribution, Version, Kernel, Architecture.
 */
const OperatingSystemSection = ({ asset }) => {
    const os = asset?.workstation?.os || {};

    const rows = [
        {
            label: 'Platform',
            value: os?.platform,
            render: (val) => val ? <Badge variant="success" appearance="outline" size="sm">{val}</Badge> : '—',
        },
        {
            label: 'Family',
            value: os?.family,
            render: (val) => val ? <Badge variant="warning" appearance="outline" size="sm">{val}</Badge> : '—',
        },
        {
            label: 'Distribution',
            value: os?.distribution,
            render: (val) => val ? <Badge variant="info" appearance="outline" size="sm">{val}</Badge> : '—',
        },
        {
            label: 'Version',
            value: os?.version,
            render: (val) => val ? <Badge variant="success" appearance="outline" size="sm">{val}</Badge> : '—',
        },
        {
            label: 'Kernel',
            value: os?.kernel,
            highlight: true,
        },
        {
            label: 'Architecture',
            value: os?.architecture,
            render: (val) => val ? <Badge variant="primary" appearance="outline" size="sm">{val}</Badge> : '—',
        },
    ];

    return (
        <SectionCard
            icon={<Monitor className="size-4" />}
            iconColor="text-red-500"
            title="Operating System"
        >
            <InfoTable rows={rows} />
        </SectionCard>
    );
};

export default OperatingSystemSection;
