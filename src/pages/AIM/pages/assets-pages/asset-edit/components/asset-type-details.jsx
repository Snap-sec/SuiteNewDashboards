import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Server, Check, X, Shield, AlertTriangle } from 'lucide-react';

// Configuration for each asset type's fields
const assetTypeConfig = {
    subdomain: {
        title: 'Subdomain Details',
        icon: Globe,
        fields: [
            { key: 'status_code', label: 'Status Code', type: 'statusCode' },
            { key: 'title', label: 'Page Title' },
            { key: 'is_reachable', label: 'Externally Reachable', type: 'boolean' },
        ],
        headerFields: [
            { key: 'server', label: 'Server' },
            { key: 'content-type', label: 'Content Type' },
        ],
        wafsField: 'wafs',
    },
    ip: {
        title: 'IP Details',
        icon: Server,
        fields: [
            { key: 'version', label: 'IP Version' },
            { key: 'asn', label: 'ASN' },
            { key: 'organization', label: 'Organization' },
            { key: 'isp', label: 'ISP' },
            { key: 'country', label: 'Country' },
            { key: 'region', label: 'Region' },
            { key: 'city', label: 'City' },
            { key: 'timezone', label: 'Timezone' },
            { key: 'latitude', label: 'Latitude' },
            { key: 'longitude', label: 'Longitude' },
            { key: 'lastChecked', label: 'Last Checked', type: 'date' },
        ],
    },
    certificate: {
        title: 'Certificate Details',
        icon: Shield,
        fields: [
            { key: 'common_name', label: 'Common Name' },
            { key: 'issuer', label: 'Issuer' },
            { key: 'issuer_organization', label: 'Issuer Organization' },
            { key: 'status', label: 'Status', type: 'certStatus' },
            { key: 'serial_number', label: 'Serial Number', mono: true },
            { key: 'not_before', label: 'Valid From', type: 'date' },
            { key: 'not_after', label: 'Valid To', type: 'date' },
            { key: 'lastChecked', label: 'Last Checked', type: 'date' },
        ],
        altNamesField: 'alt_names',
    },
    dns: {
        title: 'DNS Record Details',
        icon: Globe,
        fields: [
            { key: 'record_type', label: 'Record Type', type: 'dnsRecordType' },
            { key: 'resolved_from', label: 'Resolved From' },
            { key: 'value', label: 'Value', mono: true },
            { key: 'lastChecked', label: 'Last Checked', type: 'date' },
        ],
    },
    repo: {
        title: 'Repository Details',
        icon: Server,
        fields: [
            { key: 'visibility', label: 'Visibility' },
            { key: 'default_branch', label: 'Default Branch' },
            { key: 'language', label: 'Language' },
            { key: 'stars_count', label: 'Stars' },
            { key: 'forks_count', label: 'Forks' },
            { key: 'open_issues_count', label: 'Open Issues' },
            { key: 'is_archived', label: 'Archived', type: 'boolean' },
            { key: 'is_fork', label: 'Is Fork', type: 'boolean' },
        ],
    },
    application: {
        title: 'Application Details',
        icon: Server,
        fields: [
            { key: 'status_code', label: 'Status Code', type: 'statusCode' },
            { key: 'title', label: 'Title' },
            { key: 'is_reachable', label: 'Reachable', type: 'boolean' },
        ],
    },
    api: {
        title: 'API Details',
        icon: Globe,
        fields: [
            { key: 'method', label: 'Method', type: 'httpMethod' },
            { key: 'url', label: 'URL', mono: true },
            { key: 'source', label: 'Source' },
        ],
        headersField: 'headers',
        queryParamsField: 'queryParams',
    },
};

const formatValue = (value, type) => {
    if (value === undefined || value === null) return 'N/A';

    switch (type) {
        case 'boolean':
            return value ? (
                <Badge variant="success" appearance="outline" className="gap-1">
                    <Check className="w-3 h-3" /> Yes
                </Badge>
            ) : (
                <Badge variant="destructive" appearance="outline" className="gap-1">
                    <X className="w-3 h-3" /> No
                </Badge>
            );
        case 'date':
            return new Date(value).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        case 'statusCode':
            const statusVariant = value >= 200 && value < 300 ? 'success' :
                value >= 400 ? 'destructive' : 'warning';
            return (
                <Badge variant={statusVariant} appearance="outline">
                    {value}
                </Badge>
            );
        case 'httpMethod':
            const methodColors = {
                GET: 'success',
                POST: 'info',
                PUT: 'warning',
                PATCH: 'warning',
                DELETE: 'destructive',
                HEAD: 'secondary',
                OPTIONS: 'secondary',
            };
            return (
                <Badge variant={methodColors[value?.toUpperCase()] || 'secondary'} appearance="outline">
                    {value?.toUpperCase()}
                </Badge>
            );
        case 'dnsRecordType':
            const recordTypeColors = {
                A: 'success',
                AAAA: 'success',
                CNAME: 'info',
                MX: 'warning',
                TXT: 'secondary',
                NS: 'info',
                SOA: 'secondary',
                PTR: 'secondary',
                SRV: 'warning',
            };
            return (
                <Badge variant={recordTypeColors[value?.toUpperCase()] || 'secondary'} appearance="outline">
                    {value?.toUpperCase()}
                </Badge>
            );
        case 'certStatus':
            const certStatusColors = {
                valid: 'success',
                expired: 'destructive',
                invalid: 'destructive',
                revoked: 'destructive',
                pending: 'warning',
            };
            return (
                <Badge variant={certStatusColors[value?.toLowerCase()] || 'secondary'} appearance="outline" className="gap-1">
                    {value?.toLowerCase() === 'valid' && <Check className="w-3 h-3" />}
                    {(value?.toLowerCase() === 'expired' || value?.toLowerCase() === 'invalid' || value?.toLowerCase() === 'revoked') && <X className="w-3 h-3" />}
                    {value?.charAt(0).toUpperCase() + value?.slice(1).toLowerCase()}
                </Badge>
            );
        default:
            return String(value);
    }
};

const AssetTypeDetails = ({ title, className, data, assetType }) => {
    const config = assetTypeConfig[assetType];

    // If no config for this asset type, don't render
    if (!config) return null;

    // Get the type-specific data object (e.g., data.subdomain, data.ip)
    const typeData = data?.[assetType] || data;

    if (!typeData) return null;

    const IconComponent = config.icon;

    // Check if any field has a value
    const hasAnyValue = config.fields.some(({ key }) => {
        const value = typeData?.[key];
        return value !== undefined && value !== null && value !== '';
    });

    return (
        <Card className={className}>
            <CardHeader>
                {/* {IconComponent && <IconComponent className="w-4 h-4 text-muted-foreground" />} */}
                <CardTitle>{title || config.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3">
                    {!hasAnyValue ? (
                        <p className="text-sm text-muted-foreground">No details available</p>
                    ) : (
                        <>
                            {/* Main Fields */}
                            <div className="flex flex-col gap-2">
                                {config.fields.map(({ key, label, type, mono }) => {
                                    const value = typeData?.[key];
                                    if (value === undefined || value === null) return null;

                                    return (
                                        <div className="flex items-center gap-4" key={key}>
                                            <p className="w-1/4 text-sm font-normal text-muted-foreground">{label}:</p>
                                            <div className={`text-sm font-medium ${mono ? 'font-mono text-xs' : ''}`}>
                                                {formatValue(value, type)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Headers (for subdomain/application types) */}
                            {config.headerFields && typeData?.headers && (
                                <div className="mt-3 pt-3 border-t border-border">
                                    <p className="text-sm font-medium text-muted-foreground mb-2">HTTP Headers</p>
                                    <div className="flex flex-col gap-1.5">
                                        {config.headerFields.map(({ key, label }) => {
                                            const value = typeData.headers?.[key];
                                            if (!value) return null;

                                            return (
                                                <div className="flex items-center gap-4" key={key}>
                                                    <p className="w-1/4 text-xs font-normal text-muted-foreground">{label}:</p>
                                                    <Badge variant="secondary" className="text-xs font-mono">
                                                        {value}
                                                    </Badge>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* WAFs (for subdomain type) */}
                            {config.wafsField && typeData?.[config.wafsField] && (
                                <div className="mt-3 pt-3 border-t border-border flex gap-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                                        <p className="text-sm font-medium text-muted-foreground">WAF Detection :</p>
                                    </div>
                                    {typeData[config.wafsField].length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {typeData[config.wafsField].map((waf, index) => (
                                                <Badge key={index} variant="warning" appearance="outline" className="gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    {waf}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <Badge variant="success" appearance="outline" className="gap-1">
                                            <Check className="w-3 h-3" /> No WAF Detected
                                        </Badge>
                                    )}
                                </div>
                            )}

                            {/* Alt Names (for certificate type) */}
                            {config.altNamesField && typeData?.[config.altNamesField]?.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-border">
                                    <p className="text-sm font-medium text-muted-foreground mb-2">Subject Alternative Names (SANs)</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {typeData[config.altNamesField].map((name, index) => (
                                            <Badge key={index} variant="secondary" appearance="outline" className="text-xs font-mono">
                                                {name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* API Headers (for api type) */}
                            {config.headersField && typeData?.[config.headersField]?.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-border">
                                    <p className="text-sm font-medium text-muted-foreground mb-2">Request Headers</p>
                                    <div className="flex flex-col gap-1.5">
                                        {typeData[config.headersField].map((header, index) => (
                                            <div className="flex items-center gap-4" key={index}>
                                                <p className="w-1/4 text-xs font-normal text-muted-foreground truncate">{header.key || header.name}:</p>
                                                <Badge variant="secondary" className="text-xs font-mono truncate max-w-[200px]">
                                                    {header.value}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* API Query Params (for api type) */}
                            {config.queryParamsField && typeData?.[config.queryParamsField]?.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-border">
                                    <p className="text-sm font-medium text-muted-foreground mb-2">Query Parameters</p>
                                    <div className="flex flex-col gap-1.5">
                                        {typeData[config.queryParamsField].map((param, index) => (
                                            <div className="flex items-center gap-4" key={index}>
                                                <p className="w-1/4 text-xs font-normal text-muted-foreground truncate">{param.key || param.name}:</p>
                                                <Badge variant="secondary" className="text-xs font-mono truncate max-w-[200px]">
                                                    {param.value}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export { AssetTypeDetails };
