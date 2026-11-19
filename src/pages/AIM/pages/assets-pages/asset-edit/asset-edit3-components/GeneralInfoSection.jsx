import { useEffect, useMemo, useState } from 'react';
import { Check, Edit, ExternalLink, Info, Tag, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { timeAgo } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useGetAimLicensesQuery,
  useUpdateAimLicenseMutation,
} from '@/services/asset-inventory/licensesApi';
import { useGetAimVendorsQuery } from '@/services/asset-inventory/vendorsApi';
import { formatDateTime } from '../../../../../../lib/helpers';
import InfoTable from './InfoTable';
import SectionCard from './SectionCard';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';
import { useGetAimTagsQuery } from '@/services/asset-inventory/tagsApi';
import MultiSelect from '@/components/custom/multi-select';
import { useAuth } from '@/auth/context/auth-context';
import CreateTagModal from '@/pages/AIM/pages/settings/components/modals/create-tag-modal';

const GeneralInfoSection = ({
  asset,
  assetConfigs,
  handleUpdate,
  isUpdating,
}) => {
  const [searchParams] = useSearchParams();

  const workstation = asset?.workstation;

  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';
  const [isCreateTagModalOpen, setIsCreateTagModalOpen] = useState(false);
  const { data: apiLicenses } = useGetAimLicensesQuery();
  const [updateAimLicense] = useUpdateAimLicenseMutation();
  const { data: apiVendors } = useGetAimVendorsQuery();

  const licensesList = useMemo(() => {
    if (apiLicenses?.data?.assets && Array.isArray(apiLicenses.data.assets)) {
      return apiLicenses.data.assets;
    }
    if (apiLicenses?.assets && Array.isArray(apiLicenses.assets)) {
      return apiLicenses.assets;
    }
    if (apiLicenses?.data?.licenses && Array.isArray(apiLicenses.data.licenses)) {
      return apiLicenses.data.licenses;
    }
    if (apiLicenses?.licenses && Array.isArray(apiLicenses.licenses)) {
      return apiLicenses.licenses;
    }
    if (Array.isArray(apiLicenses?.data)) {
      return apiLicenses.data;
    }
    if (Array.isArray(apiLicenses)) {
      return apiLicenses;
    }
    return [];
  }, [apiLicenses]);

  const vendorsList = useMemo(() => {
    if (apiVendors?.data?.assets && Array.isArray(apiVendors.data.assets)) {
      return apiVendors.data.assets;
    }
    if (apiVendors?.assets && Array.isArray(apiVendors.assets)) {
      return apiVendors.assets;
    }
    if (apiVendors?.data?.vendors && Array.isArray(apiVendors.data.vendors)) {
      return apiVendors.data.vendors;
    }
    if (apiVendors?.vendors && Array.isArray(apiVendors.vendors)) {
      return apiVendors.vendors;
    }
    if (Array.isArray(apiVendors?.data)) {
      return apiVendors.data;
    }
    if (Array.isArray(apiVendors)) {
      return apiVendors;
    }
    return [];
  }, [apiVendors]);

  const [isEditingEnv, setIsEditingEnv] = useState(false);
  const [isEditingInternal, setIsEditingInternal] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);

  const { data: aimTagsData } = useGetAimTagsQuery();
  const [isEditingLicense, setIsEditingLicense] = useState(false);
  const [isEditingVendor, setIsEditingVendor] = useState(false);

  const [isEditingBackupRequired, setIsEditingBackupRequired] = useState(false);
  const [isEditingBackupStatus, setIsEditingBackupStatus] = useState(false);
  const [env, setEnv] = useState(asset?.environment || 'unknown');
  const [isInternal, setIsInternal] = useState(
    asset?.is_internal ? 'true' : 'false',
  );
  const [isBackupRequired, setIsBackupRequired] = useState(
    (asset?.backup?.required ?? asset?.backup_required ?? asset?.is_backup_required ?? asset?.is_backup) ? 'true' : 'false',
  );
  const [backupStatus, setBackupStatus] = useState(
    asset?.backup?.status || asset?.backup_status || asset?.is_backup_status || 'inactive',
  );

  const currentAssetTags = useMemo(() => {
    const raw = asset?.tags || [];
    return raw
      .map((t) => (typeof t === 'string' ? t : t.tag_id || t.value || t.name || t.label || ''))
      .filter(Boolean);
  }, [asset?.tags]);

  const [selectedTags, setSelectedTags] = useState(currentAssetTags);
  const getInitialLicenseId = (a) => {
    let rawLic = null;
    if (Array.isArray(a?.licenses) && a.licenses.length > 0) {
      rawLic = a.licenses[0];
    } else if (a?.license) {
      rawLic = a.license;
    } else if (a?.license_id) {
      return String(a.license_id);
    }
    
    if (!rawLic) return '';
    if (typeof rawLic === 'object') {
      if (rawLic._id || rawLic.id) return String(rawLic._id || rawLic.id);
      const nameToCheck = rawLic.name || rawLic.value;
      if (nameToCheck) {
        const match = licensesList.find((l) => (l.name || l.value) === nameToCheck);
        if (match) return String(match._id || match.id);
        return nameToCheck;
      }
    }
    return String(rawLic);
  };

  const getInitialVendorId = (a) => {
    let rawVen = null;
    if (Array.isArray(a?.vendors) && a.vendors.length > 0) {
      rawVen = a.vendors[0];
    } else if (a?.vendor) {
      rawVen = a.vendor;
    } else if (a?.vendor_id) {
      return String(a.vendor_id);
    }
    
    if (!rawVen) return '';
    if (typeof rawVen === 'object') {
      if (rawVen._id || rawVen.id) return String(rawVen._id || rawVen.id);
      const nameToCheck = rawVen.name || rawVen.value;
      if (nameToCheck) {
        const match = vendorsList.find((v) => (v.name || v.value) === nameToCheck);
        if (match) return String(match._id || match.id);
        return nameToCheck;
      }
    }
    return String(rawVen);
  };

  const [selectedLicenseId, setSelectedLicenseId] = useState(getInitialLicenseId(asset));
  const [selectedVendorId, setSelectedVendorId] = useState(getInitialVendorId(asset));

  const envOptions = assetConfigs?.find((c) => c.key === 'environment')
    ?.options || ['production', 'staging', 'development'];
  const internalOptions = assetConfigs?.find((c) => c.key === 'is_internal')
    ?.options || ['true', 'false'];
  const backupRequiredOptions = assetConfigs?.find((c) => c.key === 'backup.required' || c.key === 'backup_required' || c.key === 'is_backup_required' || c.key === 'backup')
    ?.options || ['true', 'false'];
  const backupStatusOptions = assetConfigs?.find((c) => c.key === 'backup.status' || c.key === 'backup_status' || c.key === 'is_backup_status')
    ?.options || ['active', 'inactive'];

  useEffect(() => {
    if (asset) {
      setEnv(asset?.environment || 'unknown');
      setIsInternal(asset?.is_internal ? 'true' : 'false');
      setSelectedTags(currentAssetTags);
      setSelectedLicenseId(getInitialLicenseId(asset));
      setSelectedVendorId(getInitialVendorId(asset));
      setIsBackupRequired((asset?.backup?.required ?? asset?.backup_required ?? asset?.is_backup_required ?? asset?.is_backup) ? 'true' : 'false');
      setBackupStatus(asset?.backup?.status || asset?.backup_status || asset?.is_backup_status || 'inactive');
    }
  }, [asset, currentAssetTags, licensesList, vendorsList]);

  const tagOptions = useMemo(() => {
    let list = [];
    if (aimTagsData) {
      if (Array.isArray(aimTagsData)) list = aimTagsData;
      else if (Array.isArray(aimTagsData.data)) list = aimTagsData.data;
      else if (Array.isArray(aimTagsData.data?.tags)) list = aimTagsData.data.tags;
      else if (Array.isArray(aimTagsData.tags)) list = aimTagsData.tags;
    }

    const map = new Map();

    list.forEach((t) => {
      if (typeof t === 'string') {
        map.set(t, { id: t, value: t, label: t, tag_id: t });
      } else {
        const tagId = t.tag_id || t.value || t._id || t.id || '';
        const label = t.value || t.name || t.label || t.tag_id || tagId;
        if (tagId) {
          map.set(tagId, { id: tagId, value: tagId, label: label, tag_id: tagId });
        }
      }
    });

    currentAssetTags.forEach((tagId) => {
      if (!map.has(tagId)) {
        map.set(tagId, { id: tagId, value: tagId, label: tagId, tag_id: tagId });
      }
    });

    return Array.from(map.values());
  }, [aimTagsData, currentAssetTags]);

  const handleTagCreated = (res, newTagName) => {
    const newTagId =
      res?.data?._id ||
      res?._id ||
      res?.data?.id ||
      res?.id ||
      res?.data?.tag_id ||
      res?.tag_id ||
      res?.data?.value ||
      res?.value ||
      newTagName;

    if (newTagId) {
      setSelectedTags((prev) => {
        if (!prev.includes(newTagId)) {
          return [...prev, newTagId];
        }
        return prev;
      });
    }
  };

  const rows = [
    { label: 'Asset ID', value: asset?._id, highlight: true },
    {
      label: 'Type',
      value: asset?.type,
      render: (val) =>
        val ? (
          <Badge variant="primary" appearance="outline" size="sm">
            {val}
          </Badge>
        ) : (
          '—'
        ),
    },
    {
      label: 'Value',
      value: asset?.value,
      highlight: true,
      render: (val) => {
        if (!val) return '—';
        const assetType = asset?.type?.toLowerCase()?.replace(/[-_\s]/g, '');
        const isLinkable = assetType === 'subdomain' || assetType === 'webserver';
        const formattedLink = isLinkable
          ? val.startsWith('http://') || val.startsWith('https://')
            ? val
            : `https://${val}`
          : null;

        if (isLinkable && formattedLink) {
          return (
            <div className="flex items-center gap-1.5">
              <span>{val}</span>
              <a
                href={formattedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center p-0.5 rounded hover:bg-muted"
                title={`Open ${formattedLink}`}
              >
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          );
        }
        return <p>{val}</p>;
      },
    },

    // show certificate detials when assetType == certificates
    asset?.type === 'certificate' && { label: 'Issuer', value: asset?.certificate?.issuer },
    asset?.type === 'certificate' && { label: 'Issuer cn', value: asset?.certificate?.issuer_cn },
    asset?.type === 'certificate' && { label: 'Issuer Country', value: asset?.certificate?.issuer_country },
    asset?.type === 'certificate' && {
      label: 'Issuer Organization',
      value: asset?.certificate?.issuer_organization,
    },
   asset?.type === 'certificate' && {
      label: 'Last Checked',
      value: `${timeAgo(asset?.certificate?.lastChecked)} (${formatDateTime(asset?.last_detected)})`,
      highlight: true,
    },
   asset?.type === 'certificate' && {
      label: 'Status',
      value: (
        <Badge
          variant={asset?.certificate?.status === 'valid' ? 'success' : 'error'}
          appearance="outline"
          size="sm"
        >
          {asset?.certificate?.status}
        </Badge>
      ),
      highlight: true,
    },
    asset?.type === 'certificate' && {
      label: 'Issuer Organization',
      value: asset?.certificate?.serial_number,
      highlight: true,
    },
    // End of showing certificate details
  ];
  

  if (workstation) {
    rows.push(
      {
        label: 'Hostname',
        value: workstation?.hostname,
        render: (val) =>
          val ? (
            <Badge variant="success" appearance="outline" size="sm">
              {val}
            </Badge>
          ) : (
            '—'
          ),
      },
      {
        label: 'FQDN',
        value: workstation?.fqdn,
        render: (val) =>
          val ? (
            <Badge variant="warning" appearance="outline" size="sm">
              {val}
            </Badge>
          ) : (
            '—'
          ),
      },
      { label: 'Machine ID', value: workstation?.machine_id, highlight: true },
      {
        label: 'Timezone',
        value: workstation?.timezone,
        render: (val) =>
          val ? (
            <Badge variant="info" appearance="outline" size="sm">
              {val}
            </Badge>
          ) : (
            '—'
          ),
      },
      {
        label: 'Uptime',
        value: workstation?.uptime,
        render: (val) =>
          val ? (
            <Badge variant="success" appearance="outline" size="sm">
              {val}
            </Badge>
          ) : (
            '—'
          ),
      },
      {
        label: 'Agent Version',
        value: workstation?.agent_version,
        highlight: true,
      },
    );
  }

  const resolvedIp = asset?.ips?.[0]?.value;
  if (resolvedIp) {
    rows.push({
      label: 'Resolved IP',
      value: resolvedIp,
      render: (val) => (
        // <Badge variant="primary" appearance="outline" size="sm">
        //   {val}
        // </Badge>
        <p>{val}</p>
      ),
    });
  }

  rows.push(
    searchParams.get('asset') !== 'certificates' && {
      label: 'Environment',
      value: env,
      render: (val) => (
        <div className="flex items-center justify-start gap-4 w-full h-7">
          {isEditingEnv ? (
            <div className="flex items-center gap-1.5">
              <Select
                value={env}
                onValueChange={(newVal) => {
                  setEnv(newVal);
                }}
              >
                <SelectTrigger className="h-7 w-[120px] text-xs focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  {envOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate({ environment: env });
                    setIsEditingEnv(false);
                  }}
                  className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-green-600 transition-colors"
                  title="Save"
                >
                  <Check size={16} strokeWidth={3} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEnv(asset?.environment || 'unknown');
                    setIsEditingEnv(false);
                  }}
                  className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-red-600 transition-colors"
                  title="Cancel"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <Badge
                variant={val === 'unknown' ? 'warning' : 'success'}
                appearance="outline"
                size="sm"
              >
                {val}
              </Badge>
              <AuthorityGuard forbidRoles={['Auditor']}>
              <button
                disabled={isUpdating}
                onClick={() => setIsEditingEnv(true)}
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
    searchParams.get('asset') !== 'certificates' && {
      label: 'Internal Asset',
      value: isInternal,
      render: (val) => (
        <div className="flex items-center justify-start gap-4 w-full h-7">
          {isEditingInternal ? (
            <div className="flex items-center gap-1.5">
              <Select
                value={isInternal}
                onValueChange={(newVal) => {
                  setIsInternal(newVal);
                }}
              >
                <SelectTrigger className="h-7 w-[120px] text-xs focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select internal" />
                </SelectTrigger>
                <SelectContent>
                  {internalOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt === 'true' ? 'Yes' : 'No'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate({ is_internal: isInternal === 'true' });
                    setIsEditingInternal(false);
                  }}
                  className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-green-600 transition-colors"
                  title="Save"
                >
                  <Check size={16} strokeWidth={3} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsInternal(asset?.is_internal ? 'true' : 'false');
                    setIsEditingInternal(false);
                  }}
                  className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-red-600 transition-colors"
                  title="Cancel"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <span className="capitalize">
                {val === 'true' ? 'Yes' : 'No'}
              </span>
              <AuthorityGuard forbidRoles={['Auditor']}>
              <button
                onClick={() => setIsEditingInternal(true)}
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
      label: 'Tags',
      value: selectedTags,
      render: () => (
        <div className="flex items-center justify-start gap-4 w-full min-h-7">
          {isEditingTags ? (
            <div className="flex items-center gap-1.5 w-full max-w-md">
              <MultiSelect
                options={tagOptions}
                values={selectedTags}
                onChange={(newOptions) => {
                  setSelectedTags(newOptions.map((o) => o.tag_id || o.value || o.id));
                }}
                actionOption={
                  !isAuditor
                    ? {
                        label: '+ Create Tag',
                        onSelect: () => setIsCreateTagModalOpen(true),
                        className: 'text-primary font-medium',
                      }
                    : undefined
                }
                placeholder="Select tags..."
                enableSearch={true}
                searchPlaceholder="Search tags..."
              />
              <CreateTagModal
                open={isCreateTagModalOpen}
                setOpen={setIsCreateTagModalOpen}
                onSuccess={handleTagCreated}
              />
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate({ tags: selectedTags });
                    setIsEditingTags(false);
                  }}
                  className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-green-600 transition-colors"
                  title="Save Tags"
                >
                  <Check size={16} strokeWidth={3} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTags(currentAssetTags);
                    setIsEditingTags(false);
                  }}
                  className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-red-600 transition-colors"
                  title="Cancel"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5 flex-wrap">
                {currentAssetTags.length > 0 ? (
                  currentAssetTags.map((tagId, idx) => {
                    const opt = tagOptions.find(
                      (o) => o.id === tagId || o.value === tagId || o.tag_id === tagId
                    );
                    const label = opt?.label || tagId;
                    return (
                      <Badge
                        key={idx}
                        variant="secondary"
                        appearance="light"
                        size="sm"
                        className="inline-flex items-center gap-1"
                      >
                        <Tag className="size-3 shrink-0" />
                        <span>{label}</span>
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
              <AuthorityGuard forbidRoles={['Auditor']}>
                <button
                  disabled={isUpdating}
                  onClick={() => {
                    setSelectedTags(currentAssetTags);
                    setIsEditingTags(true);
                  }}
                  className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-primary transition-all duration-200"
                  title="Edit Tags"
                >
                  <Edit className="size-3.5" />
                </button>
              </AuthorityGuard>
            </>
          )}
        </div>
      ),
    },
    searchParams.get('asset') !== 'certificates' && {
      label: 'Backup Required',
      value: isBackupRequired,
      render: (val) => (
        <div className="flex items-center justify-start gap-4 w-full h-7">
          {isEditingBackupRequired ? (
            <div className="flex items-center gap-1.5">
              <Select
                value={isBackupRequired}
                onValueChange={(newVal) => {
                  setIsBackupRequired(newVal);
                }}
              >
                <SelectTrigger className="h-7 w-[120px] text-xs focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {backupRequiredOptions.map((opt) => (
                    <SelectItem key={opt} value={opt} className="capitalize">
                      {opt === 'true' ? 'True' : opt === 'false' ? 'False' : opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate({ 'backup.required': isBackupRequired === 'true' });
                    setIsEditingBackupRequired(false);
                  }}
                  className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-green-600 transition-colors"
                  title="Save"
                >
                  <Check size={16} strokeWidth={3} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBackupRequired((asset?.backup?.required ?? asset?.backup_required ?? asset?.is_backup_required ?? asset?.is_backup) ? 'true' : 'false');
                    setIsEditingBackupRequired(false);
                  }}
                  className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-red-600 transition-colors"
                  title="Cancel"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <span className="capitalize">
                {val === 'true' ? 'True' : 'False'}
              </span>
              <AuthorityGuard forbidRoles={['Auditor']}>
                <button
                  disabled={isUpdating}
                  onClick={() => setIsEditingBackupRequired(true)}
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
      label: 'License',
      value: selectedLicenseId,
      render: () => {
        const assetLicenseObj = Array.isArray(asset?.licenses) && asset.licenses.length > 0 && typeof asset.licenses[0] === 'object'
          ? asset.licenses[0]
          : typeof asset?.license === 'object' ? asset.license : null;

        const currentLicense = licensesList.find(
          (l) => (l._id || l.id) === selectedLicenseId
        ) || assetLicenseObj;

        const currentLicenseName =
          currentLicense?.name || currentLicense?.value ||
          (Array.isArray(asset?.licenses) && asset.licenses.length > 0 && typeof asset.licenses[0] === 'string'
            ? asset.licenses[0]
            : null) ||
          (typeof asset?.license === 'string' ? asset.license : 'None');

        return (
          <div className="flex items-center justify-start gap-4 w-full h-7">
            {isEditingLicense ? (
              <div className="flex items-center gap-1.5">
                <Select
                  value={selectedLicenseId || 'none'}
                  onValueChange={(newVal) => {
                    setSelectedLicenseId(newVal === 'none' ? '' : newVal);
                  }}
                >
                  <SelectTrigger className="h-7 w-[160px] text-xs focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select license" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {licensesList.map((lic) => {
                      const id = lic._id || lic.id;
                      return (
                        <SelectItem key={id} value={id}>
                          {lic.name || lic.value}
                        </SelectItem>
                      );
                    })}
                    {selectedLicenseId && !licensesList.some(l => (l._id || l.id) === selectedLicenseId) && (
                      <SelectItem value={selectedLicenseId}>{selectedLicenseId}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const valToSave = selectedLicenseId || null;
                      const licenseArray = valToSave ? [valToSave] : [];

                      await handleUpdate({ licenses: licenseArray });

                      if (valToSave && (asset?._id || asset?.id)) {
                        try {
                          await updateAimLicense({ id: valToSave, assets: [asset._id || asset.id] }).unwrap();
                        } catch (err) {
                          // silent fallback if endpoint does not track back-references
                        }
                      }
                      setIsEditingLicense(false);
                    }}
                    className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-green-600 transition-colors"
                    title="Save"
                  >
                    <Check size={16} strokeWidth={3} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLicenseId(getInitialLicenseId(asset));
                      setIsEditingLicense(false);
                    }}
                    className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-red-600 transition-colors"
                    title="Cancel"
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                {currentLicense ? (
                  <Badge variant="primary" appearance="outline" size="sm">
                    {currentLicense.name || currentLicense.value}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {currentLicenseName !== 'None' ? currentLicenseName : '—'}
                  </span>
                )}
                <AuthorityGuard forbidRoles={['Auditor']}>
                  <button
                    disabled={isUpdating}
                    onClick={() => setIsEditingLicense(true)}
                    className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-primary transition-all duration-200"
                    title="Edit License"
                  >
                    <Edit className="size-3.5" />
                  </button>
                </AuthorityGuard>
              </>
            )}
          </div>
        );
      },
    },
    {
      label: 'Vendor',
      value: selectedVendorId,
      render: () => {
        const assetVendorObj = Array.isArray(asset?.vendors) && asset.vendors.length > 0 && typeof asset.vendors[0] === 'object'
          ? asset.vendors[0]
          : typeof asset?.vendor === 'object' ? asset.vendor : null;

        const currentVendor = vendorsList.find(
          (v) => (v._id || v.id) === selectedVendorId
        ) || assetVendorObj;

        const currentVendorName =
          currentVendor?.name || currentVendor?.value ||
          (Array.isArray(asset?.vendors) && asset.vendors.length > 0 && typeof asset.vendors[0] === 'string'
            ? asset.vendors[0]
            : null) ||
          (typeof asset?.vendor === 'string' ? asset.vendor : 'None');

        return (
          <div className="flex items-center justify-start gap-4 w-full h-7">
            {isEditingVendor ? (
              <div className="flex items-center gap-1.5">
                <Select
                  value={selectedVendorId || 'none'}
                  onValueChange={(newVal) => {
                    setSelectedVendorId(newVal === 'none' ? '' : newVal);
                  }}
                >
                  <SelectTrigger className="h-7 w-[160px] text-xs focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {vendorsList.map((ven) => {
                      const id = ven._id || ven.id;
                      return (
                        <SelectItem key={id} value={id}>
                          {ven.name || ven.value}
                        </SelectItem>
                      );
                    })}
                    {selectedVendorId && !vendorsList.some(v => (v._id || v.id) === selectedVendorId) && (
                      <SelectItem value={selectedVendorId}>{selectedVendorId}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const vendorsArray = selectedVendorId ? [selectedVendorId] : [];
                      await handleUpdate({ vendors: vendorsArray });
                      setIsEditingVendor(false);
                    }}
                    className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-green-600 transition-colors"
                    title="Save"
                  >
                    <Check size={16} strokeWidth={3} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVendorId(getInitialVendorId(asset));
                      setIsEditingVendor(false);
                    }}
                    className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-red-600 transition-colors"
                    title="Cancel"
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                {currentVendor ? (
                  <Badge variant="secondary" appearance="outline" size="sm">
                    {currentVendor.name || currentVendor.value}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {currentVendorName !== 'None' ? currentVendorName : '—'}
                  </span>
                )}
                <AuthorityGuard forbidRoles={['Auditor']}>
                  <button
                    disabled={isUpdating}
                    onClick={() => setIsEditingVendor(true)}
                    className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-primary transition-all duration-200"
                    title="Edit Vendor"
                  >
                    <Edit className="size-3.5" />
                  </button>
                </AuthorityGuard>
              </>
            )}
          </div>
        );
      },
    },
    searchParams.get('asset') !== 'certificates' && {
      label: 'Backup Status',
      value: backupStatus,
      render: (val) => (
        <div className="flex items-center justify-start gap-4 w-full h-7">
          {isEditingBackupStatus ? (
            <div className="flex items-center gap-1.5">
              <Select
                value={backupStatus}
                onValueChange={(newVal) => {
                  setBackupStatus(newVal);
                }}
              >
                <SelectTrigger className="h-7 w-[120px] text-xs focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {backupStatusOptions.map((opt) => (
                    <SelectItem key={opt} value={opt} className="capitalize">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate({ 'backup.status': backupStatus });
                    setIsEditingBackupStatus(false);
                  }}
                  className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-green-600 transition-colors"
                  title="Save"
                >
                  <Check size={16} strokeWidth={3} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setBackupStatus(asset?.backup?.status || asset?.backup_status || asset?.is_backup_status || 'inactive');
                    setIsEditingBackupStatus(false);
                  }}
                  className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-red-600 transition-colors"
                  title="Cancel"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <span className="capitalize">{val}</span>
              <AuthorityGuard forbidRoles={['Auditor']}>
                <button
                  disabled={isUpdating}
                  onClick={() => setIsEditingBackupStatus(true)}
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
    { label: 'Is New', value: asset?.is_new ? 'Yes' : 'No' },

    {
      label: 'Associated Assets',
      value: asset?.total_associated_assets,
      render: (val) =>
        val != null ? (
          // <Badge variant="info" appearance="outline" size="sm">
          //   {val}
          // </Badge>
          <p>{val} Assets</p>
        ) : (
          '—'
        ),
    },
    {
      label: 'First Detected',
      value: `${timeAgo(asset?.first_detected || asset?.createdAt)} (${formatDateTime(asset?.first_detected)})`,
      highlight: true,
    },
    {
      label: 'Last Detected',
      value: `${timeAgo(asset?.last_detected)} (${formatDateTime(asset?.last_detected)})`,
      highlight: true,
    },
  );

  return (
    <SectionCard
      icon={<Info className="size-4" />}
      iconColor="text-orange-500"
      title="General Information"
    >
      <InfoTable rows={rows?.filter(Boolean)} />
    </SectionCard>
  );
};

export default GeneralInfoSection;
