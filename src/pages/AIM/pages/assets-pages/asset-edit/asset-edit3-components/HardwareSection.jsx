import { Badge } from '@/components/ui/badge';
import { Cpu } from 'lucide-react';
import InfoTable from './InfoTable';
import SectionCard from './SectionCard';

/**
 * Hardware section – CPU model, cores, threads, frequency, RAM, disk.
 */
const HardwareSection = ({ asset }) => {
    const hw = asset?.workstation?.hardware || {};

    const rows = [
        { label: 'CPU Model', value: hw?.cpuModel },
        {
            label: 'Cores',
            value: hw?.cpuCores,
            render: (val) => val != null ? <Badge variant="success" appearance="outline" size="sm">{val}</Badge> : '—',
        },
        {
            label: 'Threads',
            value: hw?.cpuThreads,
            render: (val) => val != null ? <Badge variant="info" appearance="outline" size="sm">{val}</Badge> : '—',
        },
        {
            label: 'Frequency',
            value: hw?.cpuFrequency ? `${hw.cpuFrequency} MHz` : null,
            render: (val) => val ? <Badge variant="warning" appearance="outline" size="sm">{val}</Badge> : '—',
        },
        {
            label: 'RAM Total',
            value: hw?.ramTotal ? `${hw.ramTotal} MB` : null,
            render: (val) => val ? <Badge variant="info" appearance="outline" size="sm">{val}</Badge> : '—',
        },
        {
            label: 'RAM Available',
            value: hw?.ramAvailable ? `${hw.ramAvailable} MB` : null,
            render: (val) => val ? <Badge variant="success" appearance="outline" size="sm">{val}</Badge> : '—',
        },
        {
            label: 'RAM Used',
            value: hw?.ramUsed ? `${hw.ramUsed}` : hw?.ramTotal - hw?.ramAvailable + ' MB',
            render: (val) => val ? <Badge variant="warning" appearance="outline" size="sm">{val}</Badge> : '—',
        },
        {
            label: 'Disk Total',
            value: hw?.diskTotal ? `${hw.diskTotal} GB` : null,
            render: (val) => val ? <Badge variant="primary" appearance="outline" size="sm">{val}</Badge> : '—',
        },
    ];

    return (
        <SectionCard
            icon={<Cpu className="size-4" />}
            iconColor="text-green-500"
            title="Hardware"
        >
            <InfoTable rows={rows} />
        </SectionCard>
    );
};

export default HardwareSection;
