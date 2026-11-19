import { Fragment, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { useAuth } from '@/auth/context/auth-context';
import { PageNavbar } from '../page-navbar';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { useSettings } from '@/providers/settings-provider';
import { Container } from '@/components/common/container';
import { AIConfiguration } from './components/ai-configuration';
import {
  useGetComapnyProfileQuery,
  useSetCompanyProfileMutation,
} from '@/services/auth/orgApi';

export function AIConfigrationsPage() {
  const { settings } = useSettings();
  const { refreshToken } = useAuth();

  const { data: companyDetails, isLoading: isFetchingCompanyDetails, isError, error } =
    useGetComapnyProfileQuery();
  const [saveCompanyDetails] = useSetCompanyProfileMutation();

  const [aiConfig, setAiConfig] = useState({
    enabled: false,
    provider: '',
    model: '',
    api_key: '',
    api_base_url: '',
  });

  // Sync data from API to local state
  useEffect(() => {
    if (companyDetails?.data?.ai_configuration) {
      const data = companyDetails.data.ai_configuration;
      setAiConfig({
        enabled: data.enabled || false,
        provider: data.provider || '',
        model: data.model || '',
        api_key: data.api_key || '',
        api_base_url: data.api_base_url || '',
      });
    }
  }, [companyDetails]);

  const handleSaveCompanyDetails = (customPayload) => {
    // If it's a synthetic event from a button click, ignore it and use full state
    const isEvent = customPayload && customPayload.target;

    // Get existing company details to preserve general info and branding
    const existingData = companyDetails?.data || {};

    let updatedAiConfig = {
      enabled: aiConfig?.enabled || false,
      provider: aiConfig?.provider || '',
      model: aiConfig?.model || '',
      api_key: aiConfig?.api_key || '',
      api_base_url: aiConfig?.api_base_url || '',
    };

    if (customPayload && !isEvent) {
      // Merge partial updates into AI config
      if (customPayload.ai_configuration) {
        updatedAiConfig = {
          ...updatedAiConfig,
          ...customPayload.ai_configuration,
        };
      } else {
        updatedAiConfig = {
          ...updatedAiConfig,
          ...customPayload,
        };
      }
    }

    const payload = {
      name: existingData.name || '',
      website: existingData.website || '',
      logo: existingData.logo || '',
      branding: {
        primaryColor: existingData.branding?.primaryColor || '#BA35A0',
        secondaryColor: existingData.branding?.secondaryColor || '#BA35A0',
      },
      ai_configuration: updatedAiConfig,
    };

    toast.promise(saveCompanyDetails(payload).unwrap(), {
      loading: 'Saving AI configurations..',
      success: async () => {
        await refreshToken();
        return 'AI configuration saved successfully';
      },
      error: (err) => err?.data?.message || 'Error saving AI configuration!',
    });
  };

  return (
    <Fragment>
      <Helmet>
        <title>Auth | AI Configuration</title>
      </Helmet>
      <PageNavbar />
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-secondary-foreground font-medium">
                    Configure LLM integration and API credentials for your organization
                  </span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
          </Toolbar>
        </Container>
      )}
      <Container className="py-6">
        <AIConfiguration
          aiConfigData={companyDetails?.data?.ai_configuration}
          aiConfig={aiConfig}
          setAiConfig={setAiConfig}
          isLoading={isFetchingCompanyDetails}
          handleSaveCompanyDetails={handleSaveCompanyDetails}
          isError={isError}
          error={error}
        />
      </Container>
    </Fragment>
  );
}
