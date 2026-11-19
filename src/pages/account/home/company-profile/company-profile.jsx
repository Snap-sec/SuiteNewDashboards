import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import {
  useGetComapnyProfileQuery,
  useSetCompanyProfileMutation,
} from '../../../../services/auth/orgApi';
import { AccountSettings } from './components/account-settings';
import { Branding } from './components/branding';
import { GeneralInfo } from './components/general';
import { useAuth } from '@/auth/context/auth-context';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

function CompanyProfile() {
  const { refreshToken } = useAuth();

  const { data: companyDetails, isLoading: isFetchingCompanyDetails, isError, error } =
    useGetComapnyProfileQuery();
  const [saveCompanyDetails, { isLoading: isSavingCompanyDetails }] =
    useSetCompanyProfileMutation();

  //General info section states
  const [form, setForm] = useState({
    companyName: '',
    phone: '',
    vat: '',
    registration: '',
    website: '',
  });

  // Branding info section states
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#BA35A0');
  const [secondaryColor, setSecondaryColor] = useState('#BA35A0');

  // AI Configuration section states
  const [aiConfig, setAiConfig] = useState({
    enabled: false,
    provider: '',
    model: '',
    api_key: '',
    api_base_url: '',
  });

  // Sync data from API to local state
  useEffect(() => {
    if (companyDetails?.data) {
      const data = companyDetails.data;

      setForm({
        companyName: data.name || '',
        phone: data.phone || '',
        vat: data.vat || '',
        registration: data.registration || '',
        website: data.website || '',
      });

      if (data.logo) setCompanyLogoUrl(data.logo);
      if (data.branding?.primaryColor) setPrimaryColor(data.branding.primaryColor);
      if (data.branding?.secondaryColor) setSecondaryColor(data.branding.secondaryColor);

      if (data.ai_configuration) {
        setAiConfig({
          enabled: data.ai_configuration.enabled || false,
          provider: data.ai_configuration.provider || '',
          model: data.ai_configuration.model || '',
          api_key: data.ai_configuration.api_key || '',
          api_base_url: data.ai_configuration.api_base_url || '',
        });
      }
    }
  }, [companyDetails]);

  const handleSaveCompanyDetails = (customPayload) => {
    // If it's a synthetic event from a button click, ignore it and use full state
    const isEvent = customPayload && customPayload.target;

    let payload;
    if (customPayload && !isEvent) {
      payload = customPayload;
    } else {
      // website validation for checking wherther it is website or not
      const websiteRegex =
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

      if (form?.website && !websiteRegex.test(form?.website)) {
        toast.error('Please enter a valid website');
        return;
      }

      // Constructing full payload for general/branding saves
      payload = {
        name: form?.companyName || '',
        website: form?.website || '',
        logo: companyLogoUrl,
        branding: {
          primaryColor: primaryColor,
          secondaryColor: secondaryColor,
        },
        ai_configuration: {
          enabled: aiConfig?.enabled || false,
          provider: aiConfig?.provider || '',
          model: aiConfig?.model || '',
          api_key: aiConfig?.api_key || '',
        },
      };
    }

    toast.promise(saveCompanyDetails(payload).unwrap(), {
      loading: 'Saving Company details..',
      success: async () => {
        await refreshToken();
        return 'Company details saved successfully';
      },
      error: (err) => err?.data?.message || 'Error saving Company details!',
    });
  };

  if (isError) return <ApiErrorHandler error={error} />

  return (
    <div className="flex flex-col gap-6 p-4">
      <Helmet>
        <title>Auth | Company Profile</title>
      </Helmet>
      <GeneralInfo
        generalInfo={companyDetails?.data?.generalInfo}
        companyDetails={companyDetails?.data}
        isLoading={isFetchingCompanyDetails}
        setForm={setForm}
        form={form}
        handleSaveCompanyDetails={handleSaveCompanyDetails}
      />

      <Branding
        brandingInfo={companyDetails?.data?.branding}
        logo={companyDetails?.data?.logo}
        website={form?.website}
        isLoading={isFetchingCompanyDetails}
        companyLogoUrl={companyLogoUrl}
        setCompanyLogoUrl={setCompanyLogoUrl}
        primaryColor={primaryColor}
        setPrimaryColor={setPrimaryColor}
        secondaryColor={secondaryColor}
        setSecondaryColor={setSecondaryColor}
        handleSaveCompanyDetails={handleSaveCompanyDetails}
        isSavingCompanyDetails={isSavingCompanyDetails}
      />
    </div>
  );
}

export default CompanyProfile;
