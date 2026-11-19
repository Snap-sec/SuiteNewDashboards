import React from 'react';
import IntegrationsPanel from '@/pages/integrations/components/integrations-panel';
import { CLOUD_INTEGRATION_CATEGORY } from '@/pages/integrations/utils';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageHeading from '@/components/custom/page-heading';

export default function CloudSecurityConnect() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      <Helmet>
        <title>APT | Cloud Security - Connect Account</title>
      </Helmet>

      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/apt/cloud-security/projects?type=cloud')}
          className="gap-2 text-sm text-secondary-foreground hover:text-foreground mb-3 -ml-2"
        >
          <ArrowLeft className="size-4" />
          Back to Projects
        </Button>

        <IntegrationsPanel
          mode="compact"
          columns={4}
          category={CLOUD_INTEGRATION_CATEGORY}
          headerSlot={
            <PageHeading
              title="Connect Cloud Account"
              description="Connect your cloud providers (AWS, GCP, Azure, Oracle Cloud) to discover assets and monitor posture."
              className="mb-0"
            />
          }
        />
      </div>
    </div>
  );
}
