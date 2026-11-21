import { useEffect } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdapterSettings from './components/adapter-settings';
import CustomFieldsSettings from './components/custom-fields';
import DefaultOwnership from './components/default-ownership';
import GlobalSettings from './components/global-settings';
import LifecycleSettings from './components/lifecycle-settings';
import TagsSettings from './components/tags-settings';

const SETTINGS_SECTIONS = {
  'adapter-settings': {
    title: 'Adapter Settings',
    description:
      'Configure synchronization schedules, retries, and notification preferences for inventory adapters.',
  },
  'global-settings': {
    title: 'Global Settings',
    description: 'Manage public asset search and global asset editing links.',
  },
  'lifecycle-management': {
    title: 'Decommission Workflow',
    description:
      'Configure rules and automated lifecycle workflows for decommissioned assets.',
  },
  'default-ownership': {
    title: 'Default Ownership',
    description:
      'Set default business units, users, and teams for unassigned assets.',
  },
  'custom-fields': {
    title: 'Custom Fields',
    description:
      'Define and manage custom metadata fields across your asset inventory.',
  },
  tags: {
    title: 'Tags',
    description:
      'Create and organize asset tags to streamline filtering and grouping.',
  },
};

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'adapter-settings';

  const { user } = useAuth();
  const orgID = user?.orgId;

  useEffect(() => {
    if (!searchParams.get('tab')) {
      setSearchParams({ tab: 'adapter-settings' }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const activeSection =
    SETTINGS_SECTIONS[currentTab] || SETTINGS_SECTIONS['adapter-settings'];

  const renderContent = () => {
    switch (currentTab) {
      case 'adapter-settings':
        return <AdapterSettings />;
      case 'global-settings':
        return <GlobalSettings orgID={orgID} />;
      case 'lifecycle-management':
        return <LifecycleSettings />;
      case 'default-ownership':
        return <DefaultOwnership />;
      case 'custom-fields':
        return <CustomFieldsSettings />;
      case 'tags':
        return <TagsSettings />;
      default:
        return <AdapterSettings />;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Helmet>
        <title>AssetIQ | {activeSection.title}</title>
      </Helmet>

      <Tabs
        value={currentTab}
        onValueChange={(tab) => setSearchParams({ tab })}
      >
        <TabsList
          variant="line"
          size="md"
          className="border-b w-full justify-start overflow-x-auto gap-6"
        >
          {Object.entries(SETTINGS_SECTIONS).map(([key, section]) => (
            <TabsTrigger key={key} value={key}>
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4">{renderContent()}</div>
    </div>
  );
};

export default Settings;
