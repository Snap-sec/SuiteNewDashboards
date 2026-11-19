import { Badge } from '@/components/ui/badge';
import { HardDrive } from 'lucide-react';
import InfoTable from './InfoTable';
import SectionCard from './SectionCard';

/**
 * Storage Devices section – shows info for each storage device.
 */
const StorageSection = ({ asset }) => {
    const storageDevices = asset?.workstation?.storage_devices || [];

    if (storageDevices.length === 0) return null;

    return (
        <SectionCard
            icon={<HardDrive className="size-4" />}
            iconColor="text-blue-500"
            title="Storage Devices"
        >
            <div>
                {storageDevices.map((device, i) => {
                    const rows = [
                        {
                            label: `Device ${i + 1}`,
                            value: device?.device || device?.name,
                            highlight: true,
                        },
                        { label: 'Type', value: device?.type },
                        { label: 'Mount Point', value: device?.mount_point },
                        {
                            label: 'Size',
                            value: device?.size,
                            render: (val) => val ? <Badge variant="info" appearance="outline" size="sm">{val}</Badge> : '—',
                        },
                    ];

                    return (
                        <div key={i} className={i > 0 ? 'border-t border-border/50' : ''}>
                            <InfoTable rows={rows} />
                        </div>
                    );
                })}
            </div>
        </SectionCard>
    );
};

export default StorageSection;
