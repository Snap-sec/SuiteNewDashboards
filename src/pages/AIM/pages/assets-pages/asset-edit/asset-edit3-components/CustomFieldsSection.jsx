import { useState } from 'react';
import { Edit, Check, X } from 'lucide-react';
import InfoTable from './InfoTable';
import SectionCard from './SectionCard';
import { useGetAimCustomFieldsQuery } from '@/services/asset-inventory/customFieldsApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import Select from '@/components/custom/select';
import DatePicker from '@/components/custom/date-picker';
import MultiSelect from '@/components/custom/multi-select';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';

const CustomFieldsSection = ({ asset, handleUpdate, isUpdating }) => {
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState(null);

    // Only fetch fields relevant to this asset's type
    const { data: responseData, isLoading } = useGetAimCustomFieldsQuery({
        assetType: asset?.type,
        limit: 999,
    }, {
        skip: !asset?.type
    });

    const customFieldsDef = responseData?.data?.customFields || [];
    const assetCustomFields = asset?.customFields || {};

    if (isLoading) {
        return (
            <SectionCard title="Custom Fields">
                <div className="flex flex-col gap-4 p-6">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            </SectionCard>
        );
    }

    if (customFieldsDef.length === 0) return null;

    const handleSave = (key) => {
        if (handleUpdate) {
            handleUpdate({ [`customFields.${key}`]: editValue });
        }
        setEditingField(null);
    };

    const handleCancel = () => {
        setEditingField(null);
    };

    const rows = customFieldsDef.map(field => {
        const isEditingThis = editingField === field.key;
        const val = isEditingThis ? editValue : assetCustomFields[field.key];
        
        let displayVal = val;
        
        if (val === null || val === undefined || val === '') {
            displayVal = '—';
        } else if (typeof val === 'boolean') {
            displayVal = val ? 'Yes' : 'No';
        } else if (Array.isArray(val)) {
            displayVal = val.join(', ');
        } else if (field.type === 'date' && val) {
            displayVal = new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } else {
            displayVal = String(val);
        }

        const handleChange = (newVal) => {
            setEditValue(newVal);
        };

        const renderEditMode = () => {
            switch (field.type) {
                case 'text':
                    return <Input value={val || ''} onChange={(e) => handleChange(e.target.value)} className="h-8 w-full max-w-sm" />;
                case 'number':
                    return <Input type="number" value={val || ''} onChange={(e) => handleChange(e.target.value !== '' ? Number(e.target.value) : null)} className="h-8 w-full max-w-sm" />;
                case 'boolean':
                    return (
                        <div className="w-[150px]">
                            <Select 
                                options={[{label: 'Yes', value: 'true'}, {label: 'No', value: 'false'}]} 
                                value={val === true ? 'true' : (val === false ? 'false' : undefined)}
                                onChange={(opt) => handleChange(opt?.value === 'true' ? true : (opt?.value === 'false' ? false : null))}
                                placeholder="Select..."
                                className="h-8"
                            />
                        </div>
                    );
                case 'date':
                    return (
                        <div className="w-[200px]">
                            <DatePicker 
                                value={val ? new Date(val) : undefined} 
                                onChange={(date) => handleChange(date ? date.toISOString() : null)} 
                            />
                        </div>
                    );
                case 'dropdown':
                case 'select':
                    return (
                        <div className="w-full max-w-sm">
                            <Select 
                                options={(field.options || []).map(o => ({label: o, value: o}))} 
                                value={val || undefined}
                                onChange={(opt) => handleChange(opt?.value || null)}
                                placeholder="Select option..."
                                className="h-8"
                            />
                        </div>
                    );
                case 'multiselect':
                    return (
                        <div className="w-full max-w-sm">
                            <MultiSelect 
                                options={(field.options || []).map(o => ({label: o, value: o, id: o}))}
                                values={val || []}
                                onChange={(opts) => handleChange(opts.map(o => o.value))}
                                placeholder="Select options..."
                            />
                        </div>
                    );
                default:
                    return <Input value={val || ''} onChange={(e) => handleChange(e.target.value)} className="h-8 w-full max-w-sm" />;
            }
        };

        return {
            label: field.name,
            value: displayVal,
            render: (v) => isEditingThis ? (
                <div className="flex items-center gap-1.5 w-full">
                    {renderEditMode()}
                    <div className="flex items-center gap-0.5 ml-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleSave(field.key); }}
                            className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-green-600 transition-colors"
                            title="Save"
                            disabled={isUpdating}
                        >
                            <Check size={16} strokeWidth={3} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                            className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-red-600 transition-colors"
                            title="Cancel"
                            disabled={isUpdating}
                        >
                            <X size={16} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-4 h-7">
                    <p>{v}</p>
                    <AuthorityGuard forbidRoles={['Auditor']}>
                        <button
                            disabled={isUpdating}
                            onClick={() => {
                                setEditingField(field.key);
                                setEditValue(assetCustomFields[field.key]);
                            }}
                            className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-primary transition-all duration-200"
                            title="Edit"
                        >
                            <Edit className="size-3.5" />
                        </button>
                    </AuthorityGuard>
                </div>
            )
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
