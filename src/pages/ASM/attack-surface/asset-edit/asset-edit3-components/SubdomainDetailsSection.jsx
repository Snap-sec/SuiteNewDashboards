import { Badge } from '@/components/ui/badge';
import { Check, Edit, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InfoTable from './InfoTable';
import SectionCard from './SectionCard';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';

const SubdomainDetailsSection = ({ asset, assetConfigs, handleUpdate }) => {
    const sub = asset?.subdomain;

    const [isEditingScope, setIsEditingScope] = useState(false);
    const [scope, setScope] = useState(sub?.is_public ? 'true' : 'false');

    const scopeOptions = assetConfigs?.find((c) => c.key === 'subdomain.is_reachable')?.options || [
        'true',
        'false',
    ];

    useEffect(() => {
        if (sub) {
            setScope(sub.is_public ? 'true' : 'false');
        }
    }, [sub]);

    if (!sub) return null;

    const rows = [
        {
            label: 'Status Code',
            value: sub?.status_code,
            render: (val) => {
                if (!val) return '—';
                const variant = val >= 200 && val < 300 ? 'success' : val >= 400 ? 'destructive' : 'warning';
                return <p>{val}</p>;
            },
        },
        { label: 'Title', value: sub?.title, highlight: true },
        {
            label: 'Status',
            value: sub?.status,
            render: (val) => {
                if (!val) return '—';
                return <Badge variant={val === 'live' ? 'success' : 'destructive'} appearance="outline" size="sm">{val}</Badge>;
            },
        },
        {
            label: 'Externally Reachable',
            value: sub?.is_reachable ? 'Yes' : 'No',
            render: (val) => <p>{val}</p>,
        },
        {
            label: 'Network Scope',
            value: scope,
            render: (val) => (
                <div className="flex items-center justify-start gap-4 w-full h-7">
                    {isEditingScope ? (
                        <div className="flex items-center gap-1.5">
                            <Select
                                value={scope}
                                onValueChange={(newVal) => {
                                    setScope(newVal);
                                }}
                            >
                                <SelectTrigger className="h-7 w-[120px] text-xs focus:ring-0 focus:ring-offset-0">
                                    <SelectValue placeholder="Select scope" />
                                </SelectTrigger>
                                <SelectContent>
                                    {scopeOptions.map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                            {opt === 'true' ? 'external' : 'internal'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdate({ subdomain: { ...sub, is_public: scope === 'true' } });
                                    setIsEditingScope(false);
                                }}
                                className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-green-600 transition-colors"
                                title="Save"
                            >
                                <Check size={16} strokeWidth={3} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <p>{val === 'true' ? 'external' : 'internal'}</p>
                            <AuthorityGuard forbidRoles={['Auditor']}>
                                <button
                                    onClick={() => setIsEditingScope(true)}
                                    className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-primary transition-all duration-200"
                                    title="Edit"
                                >
                                    <Edit className="size-3.5" />
                                </button>
                            </AuthorityGuard>
                        </>
                    )}
                </div>
            ),
        },
        {
            label: 'WAF Detected',
            value: sub?.has_waf ? 'Yes' : 'No',
            render: (val) => <p>{val}</p>,
        },
    ];

    if (sub?.wafs && sub.wafs.length > 0) {
        rows.push({
            label: 'WAF Provider',
            value: sub.wafs.join(', '),
            render: (val) => <p>{val}</p>,
        });
    }

    if (sub?.headers?.server) {
        rows.push({
            label: 'Server',
            value: sub.headers.server,
            render: (val) => <p>{val}</p>,
        });
    }

    if (sub?.headers?.['content-type']) {
        rows.push({ label: 'Content Type', value: sub.headers['content-type'], highlight: true });
    }

    return (
        <SectionCard icon={<Globe className="size-4" />} iconColor="text-blue-500" title="Subdomain Details">
            <InfoTable rows={rows} />
        </SectionCard>
    );
};

export default SubdomainDetailsSection;
