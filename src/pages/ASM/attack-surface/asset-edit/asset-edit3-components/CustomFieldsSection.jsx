import InfoTable from './InfoTable';
import SectionCard from './SectionCard';

const CustomFieldsSection = ({ asset }) => {
    const assetCustomFields = asset?.customFields || {};

    if (Object.keys(assetCustomFields).length === 0) return null;

    const rows = Object.entries(assetCustomFields).map(([key, val]) => {
        let displayVal = val;
        
        if (val === null || val === undefined || val === '') {
            displayVal = '—';
        } else if (typeof val === 'boolean') {
            displayVal = val ? 'Yes' : 'No';
        } else if (Array.isArray(val)) {
            displayVal = val.join(', ');
        } else {
            displayVal = String(val);
        }

        const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .trim()
            .replace(/^\w/, c => c.toUpperCase());

        return {
            label,
            value: displayVal
        };
    });

    return (
        <SectionCard
            title="Custom Fields"
            contentClassName="flex flex-col"
        >
            <InfoTable rows={rows} />
        </SectionCard>
    );
};

export default CustomFieldsSection;
