import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
  useGetOrgDetailsQuery,
  useUpdateOrgDetailsMutation,
  useUpdateLicenseMutation,
  useUpdateProductAccessMutation,
} from '@/services/auth/serviceProviderApi';

import { OrgSettingsHeader } from './components/org-settings-header';
import { OrgSettingsNav } from './components/org-settings-nav';
import { LicenseTab } from './components/license-tab';
import { ProductAccessTab } from './components/product-access-tab';
import { OrganizationTab } from './components/organization-tab';
import { MembersTab } from './components/members-tab';

export default function OrgSettingsPage() {
  const { orgId } = useParams();

  const { data: orgData } = useGetOrgDetailsQuery(orgId);
  const org = orgData?.data;

  const [updateOrgDetails] = useUpdateOrgDetailsMutation();
  const [updateLicense] = useUpdateLicenseMutation();
  const [updateProductAccess] = useUpdateProductAccessMutation();

  const [activeTab, setActiveTab] = useState('organization');

  const [licenseExpiry, setLicenseExpiry] = useState(null);
  const [enabledProducts, setEnabledProducts] = useState(new Set());
  const [orgName, setOrgName] = useState('');
  const [orgWebsite, setOrgWebsite] = useState('');
  const [orgLogo, setOrgLogo] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  const lastSavedOrgRef = useRef({ name: '', website: '', logo: '', locked: false });
  const debounceOrgTimerRef = useRef(null);

  useEffect(() => {
    if (!org) return;
    setOrgName(org.name || '');
    setOrgWebsite(org.website || '');
    setOrgLogo(org.logo || '');
    setIsLocked(!!org.locked);
    lastSavedOrgRef.current = {
      name: org.name || '',
      website: org.website || '',
      logo: org.logo || '',
      locked: !!org.locked,
    };
    if (org.licenceExpiry) setLicenseExpiry(new Date(org.licenceExpiry));
    if (Array.isArray(org.accessTo)) setEnabledProducts(new Set(org.accessTo));
  }, [org]);

  useEffect(() => {
    return () => {
      clearTimeout(debounceOrgTimerRef.current);
    };
  }, []);

  const handleLicenseExpiryChange = (date) => {
    setLicenseExpiry(date);
    toast.promise(
      updateLicense({
        orgId,
        licenceExpiry: date ? new Date(date).toISOString() : null,
      }).unwrap(),
      {
        loading: 'Updating license expiry…',
        success: 'License expiry updated!',
        error: (err) => err?.data?.message || 'Failed to update license expiry.',
      }
    );
  };

  const toggleProduct = (key) => {
    const next = new Set(enabledProducts);
    const willEnable = !next.has(key);
    if (willEnable) {
      next.add(key);
    } else {
      next.delete(key);
    }
    setEnabledProducts(next);

    const accessTo = Array.from(next);
    toast.promise(
      updateProductAccess({ orgId, accessTo }).unwrap(),
      {
        loading: willEnable ? 'Enabling product access…' : 'Disabling product access…',
        success: 'Product access updated!',
        error: (err) => err?.data?.message || 'Failed to update product access.',
      }
    );
  };

  const handleUpdateOrgDetails = (overrides = {}) => {
    const currentName = overrides.name !== undefined ? overrides.name : orgName;
    const currentWebsite = overrides.website !== undefined ? overrides.website : orgWebsite;
    const currentLogo = overrides.logo !== undefined ? overrides.logo : orgLogo;
    const currentLocked = overrides.locked !== undefined ? overrides.locked : isLocked;

    const lastSaved = lastSavedOrgRef.current;
    if (
      lastSaved.name === currentName &&
      lastSaved.website === currentWebsite &&
      lastSaved.logo === currentLogo &&
      lastSaved.locked === currentLocked
    ) {
      return;
    }

    lastSavedOrgRef.current = {
      name: currentName,
      website: currentWebsite,
      logo: currentLogo,
      locked: currentLocked,
    };

    toast.promise(
      updateOrgDetails({
        payload: {
          orgId,
          name: currentName,
          website: currentWebsite,
          logo: currentLogo,
          locked: currentLocked,
        },
      }).unwrap(),
      {
        loading: 'Updating organization…',
        success: 'Organization updated!',
        error: (err) => err?.data?.message || 'Failed to update organization.',
      }
    );
  };

  const handleOrgNameChange = (val) => {
    setOrgName(val);
    clearTimeout(debounceOrgTimerRef.current);
    debounceOrgTimerRef.current = setTimeout(() => {
      handleUpdateOrgDetails({ name: val });
    }, 800);
  };

  const handleOrgWebsiteChange = (val) => {
    setOrgWebsite(val);
    clearTimeout(debounceOrgTimerRef.current);
    debounceOrgTimerRef.current = setTimeout(() => {
      handleUpdateOrgDetails({ website: val });
    }, 800);
  };

  const handleOrgNameBlur = () => {
    clearTimeout(debounceOrgTimerRef.current);
    handleUpdateOrgDetails({ name: orgName });
  };

  const handleOrgWebsiteBlur = () => {
    clearTimeout(debounceOrgTimerRef.current);
    handleUpdateOrgDetails({ website: orgWebsite });
  };

  const handleIsLockedChange = (checked) => {
    setIsLocked(checked);
    clearTimeout(debounceOrgTimerRef.current);
    handleUpdateOrgDetails({ locked: checked });
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-background text-foreground p-8 lg:p-12">
      <Helmet>
        <title>Auth | Orgnization Settings</title>
      </Helmet>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-4">
        <OrgSettingsHeader org={org} />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <OrgSettingsNav />

          <TabsContent value="license" className="pt-6">
            <LicenseTab licenseExpiry={licenseExpiry} onLicenseExpiryChange={handleLicenseExpiryChange} />
          </TabsContent>

          <TabsContent value="product-access" className="pt-6">
            <ProductAccessTab products={orgData?.available_products} enabledProducts={enabledProducts} onToggle={toggleProduct} />
          </TabsContent>

          <TabsContent value="organization" className="pt-6">
            <OrganizationTab
              orgName={orgName}
              orgWebsite={orgWebsite}
              isLocked={isLocked}
              onOrgNameChange={handleOrgNameChange}
              onOrgWebsiteChange={handleOrgWebsiteChange}
              onIsLockedChange={handleIsLockedChange}
              onOrgNameBlur={handleOrgNameBlur}
              onOrgWebsiteBlur={handleOrgWebsiteBlur}
            />
          </TabsContent>

          <TabsContent value="members" className="pt-6">
            <MembersTab orgId={orgId} products={orgData?.available_products} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
