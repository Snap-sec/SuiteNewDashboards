import { Fragment, useEffect, useState } from 'react';
import { PageNavbar } from '@/pages/account';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Activity, Terminal } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Container } from '@/components/common/container';
import { McpSessionsTab } from './tabs/mcp-sessions-tab/mcp-sessions-tab';
import { McpsTab } from './tabs/mcps-tab/mcps-tab';

export function AccountMcpAccessPage() {
  const { settings } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabFromUrl = searchParams.get('tab') || 'mcps';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', tab);
      return next;
    });
  };

  return (
    <Fragment>
      <PageNavbar />
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                Central Hub for Personal Customization
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" asChild>
                <Link to="/profile/account/security/privacy-settings">
                  Privacy Settings
                </Link>
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container className="flex flex-col gap-5 lg:gap-7.5">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full flex flex-col gap-5 lg:gap-7.5"
        >
          <TabsList variant="line" className="flex items-center gap-6">
            <TabsTrigger value="mcps" className="gap-2">
              <Terminal className="size-4" />
              <span>MCP Configuration</span>
            </TabsTrigger>
            <TabsTrigger value="sessions" className="gap-2">
              <Activity className="size-4" />
              <span>MCP Sessions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mcps" className="mt-0">
            <McpsTab />
          </TabsContent>

          <TabsContent value="sessions" className="mt-0">
            <McpSessionsTab onSwitchToSetup={() => handleTabChange('mcps')} />
          </TabsContent>
        </Tabs>
      </Container>
    </Fragment>
  );
}
