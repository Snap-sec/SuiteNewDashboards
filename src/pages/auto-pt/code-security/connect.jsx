import React from 'react';
import IntegrationsPanel from '@/pages/integrations/components/integrations-panel';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageHeading from '@/components/custom/page-heading';

export default function CodeSecurityConnect() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      <Helmet>
        <title>APT | Code Security - Connect Account</title>
      </Helmet>

      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            navigate('/apt/code-security/projects?type=code-security')
          }
          className="gap-2 text-sm text-secondary-foreground hover:text-foreground mb-3 -ml-2"
        >
          <ArrowLeft className="size-4" />
          Back to Projects
        </Button>

        <IntegrationsPanel
          mode="compact"
          columns={4}
          filterTypes={['github', 'gitlab']}
          headerSlot={
            <PageHeading
              title="Connect Code Account"
              description="Connect your code repositories and version control providers (GitHub, GitLab, Bitbucket) to discover code assets and run security scans."
              className="mb-0"
            />
          }
        />
      </div>
    </div>
  );
}
