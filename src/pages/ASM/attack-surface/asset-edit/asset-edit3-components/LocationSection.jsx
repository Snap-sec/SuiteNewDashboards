
import { MapPin } from 'lucide-react';
import InfoTable from './InfoTable';
import SectionCard from './SectionCard';

/**
 * Location section – reads from asset.ips[0].ip (the IP info object)
 * or asset.workstation.location, whichever exists.
 */
const LocationSection = ({ asset }) => {
    // For subdomain/ip assets, location data is at asset.ips[0].ip
    const ipInfo = asset?.ips?.[0]?.ip || {};
    const location = asset?.workstation?.location || ipInfo || {};

    const safeString = (val) => {
        if (val === null || val === undefined) return null;
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val);
    };

    const rows = [
        { label: 'City', value: safeString(location?.city) },
        {
            label: 'Region',
            value: safeString(location?.region),
            render: (val) => val ? <p>{val}</p> : '—',
        },
        {
            label: 'Country',
            value: safeString(location?.country),
            render: (val) => val ? <p>{val}</p> : '—',
        },
        {
            label: 'Location',
            value: safeString(location?.location),
            highlight: true,
        },
        { label: 'Latitude', value: safeString(location?.latitude || location?.lat), highlight: true },
        { label: 'Longitude', value: safeString(location?.longitude || location?.lng), highlight: true },
        {
            label: 'ISP',
            value: safeString(location?.isp),
            highlight: true,
        },
        {
            label: 'ASN',
            value: safeString(location?.asn),
            render: (val) => val ? <p>{val}</p> : '—',
        },
        {
            label: 'Organization',
            value: safeString(location?.organization || location?.org),
            highlight: true,
        },
        { label: 'Timezone', value: safeString(location?.timezone) },
        {
            label: 'IP Version',
            value: safeString(location?.version),
            render: (val) => val ? <p>{val}</p> : '—',
        },
        {
            label: 'Public IP',
            value: safeString(location?.is_public != null ? (location.is_public ? 'Yes' : 'No') : null),
            render: (val) => val ? <p>{val}</p> : '—',
        },
    ];

    // Filter out rows with no value
    const filteredRows = rows.filter(r => r.value);

    if (filteredRows.length === 0) return null;

    return (
        <SectionCard
            icon={<MapPin className="size-4" />}
            iconColor="text-yellow-500"
            title="Location & IP Info"
        >
            <InfoTable rows={filteredRows} />
        </SectionCard>
    );
};

export default LocationSection;
