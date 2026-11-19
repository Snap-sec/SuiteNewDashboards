import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {
  Package,
  BookOpen,
  Activity,
  HardDrive,
  Network,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { useConfigureAimAgentsSettingMutation } from '@/services/asset-inventory/agentsApi';
import { useGetAimOrgApiKeyQuery } from '@/services/asset-inventory/orgSettingsApi';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import PageHeading from '@/components/custom/page-heading';

// ─── Static collection categories ─────────────────────────────────────────────

const INITIAL_CATEGORIES = [
  {
    id: 'packages',
    icon: Package,
    title: 'Installed Packages & Software',
    description: 'OS packages, applications, and versions installed on the host.',
    stats: '1,284 packages',
    lastSeen: '6m ago',
    enabled: true,
  },
  {
    id: 'libraries',
    icon: BookOpen,
    title: 'Libraries & Dependencies',
    description: 'Language-level libraries (e.g. npm, pip, gem) discovered on disk.',
    stats: '382 libraries',
    lastSeen: '6m ago',
    enabled: true,
  },
  {
    id: 'processes',
    icon: Activity,
    title: 'Running Processes',
    description: 'Active processes, owning users, and listening sockets.',
    stats: '96 running processes',
    lastSeen: '2m ago',
    enabled: true,
  },
  {
    id: 'hardware',
    icon: HardDrive,
    title: 'Host Hardware',
    description: 'CPU, memory, storage, and firmware inventory.',
    stats: 'CPU, memory, disk, BIOS',
    lastSeen: '1h ago',
    enabled: true,
  },
  {
    id: 'networking',
    icon: Network,
    title: 'Networking',
    description: 'Interfaces, routes, DNS config, and open ports.',
    stats: '14 interfaces, 6 open ports',
    lastSeen: '6m ago',
    enabled: true,
  },
  {
    id: 'users',
    icon: Users,
    title: 'Users & Access',
    description: 'Local accounts, groups, and sudoers configuration.',
    stats: null,
    lastSeen: null,
    enabled: false,
  },
];

const INTERVALS = ['15m', '1h', '6h', '24h'];

// ─── Collection Card ───────────────────────────────────────────────────────────

function CollectionCard({ category, onToggle }) {
  const { icon: Icon, title, description, stats, lastSeen, enabled } = category;

  return (
    <div className="rounded-xl border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon size={16} className="text-primary" />
        </div>
        <Switch checked={enabled} onCheckedChange={(val) => onToggle(category.id, val)} size="sm" />
      </div>

      <div className="space-y-1">
        <p className="font-semibold text-sm text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <div className="mt-auto">
        {enabled && stats ? (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
            {stats} · last seen {lastSeen}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
            Collection disabled
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const AgentSettings = () => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [interval, setInterval] = useState('6h');
  const [collectOnStart, setCollectOnStart] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  const { data: orgApiKeyData } = useGetAimOrgApiKeyQuery();
  const [configureAimAgentsSetting, { isLoading: isConfiguring }] =
    useConfigureAimAgentsSettingMutation();
  const [scanConfig, setScanConfig] = useState(null);

  useEffect(() => {
    if (orgApiKeyData) {
      const aimConfig = orgApiKeyData.aim_agent_configuration || {};
      if (aimConfig.collection_interval) setInterval(aimConfig.collection_interval);
      if (aimConfig.collect_on_start !== undefined) setCollectOnStart(aimConfig.collect_on_start);
      if (aimConfig.collection_categories) {
        setCategories(INITIAL_CATEGORIES.map((cat) => ({
          ...cat,
          enabled: aimConfig.collection_categories.includes(cat.id)
        })));
      }
    }
  }, [orgApiKeyData]);

  const handleIngestionToggle = (checked) => {
    toast.promise(
      configureAimAgentsSetting({ active_ingestion: checked }),
      {
        loading: 'Configuring agent ingestion...',
        success: 'Agent ingestion configured successfully',
        error: 'Failed to configure agent ingestion',
      },
    );
  };

  const handleCategoryToggle = (id, val) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: val } : c)),
    );
    setIsDirty(true);
  };

  const handleIntervalChange = (val) => {
    setInterval(val);
    setIsDirty(true);
  };

  const handleCollectOnStartChange = (val) => {
    setCollectOnStart(val);
    setIsDirty(true);
  };

  const handleDiscard = () => {
    setCategories(INITIAL_CATEGORIES);
    setInterval('6h');
    setCollectOnStart(true);
    setIsDirty(false);
  };

  const handleSave = async () => {
    const payload = {
      collection_categories: categories.filter((c) => c.enabled).map((c) => c.id),
      collection_interval: interval,
      collect_on_start: collectOnStart
    };
    try {
      await configureAimAgentsSetting(payload).unwrap();
      toast.success('Collection settings saved');
      setIsDirty(false);
    } catch (error) {
      toast.error('Failed to save collection settings');
    }
  };

  const handleScanConfigChange = (field, value) => {
    setScanConfig((prev) => ({
      ...prev,
      [selectedConfigOS]: {
        ...prev?.[selectedConfigOS],
        [field]: value.split('\n').map(v => v.trim()).filter(v => v !== ''),
      },
    }));
  };

  const handleSaveScanConfig = async () => {
    if (!scanConfig) return;
    try {
      await updateScanTargets(scanConfig).unwrap();
      toast.success('Scanning configuration updated successfully');
    } catch (error) {
      toast.error('Failed to update scanning configuration');
    }
  };

  return (
    <div className="p-4 flex flex-col gap-5">
      <Helmet>
        <title>AssetIQ | Agent Settings</title>
      </Helmet>

      <PageHeading
        title="Agent Settings"
        description="Manage asset inventory agent settings."
      />

      {/* ── Data Collection ── */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle>Data Collection</CardTitle>
              <CardDescription className="mt-1">
                Choose what the agent collects from this fleet for asset inventory.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium shrink-0">
              Agent Ingestion
              <Switch
                checked={orgApiKeyData?.aim_agent_configuration?.active ?? true}
                onCheckedChange={handleIngestionToggle}
                disabled={isConfiguring}
                size="sm"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <CollectionCard
                key={cat.id}
                category={cat}
                onToggle={handleCategoryToggle}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Collection Schedule ── */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Collection Schedule</CardTitle>
          <CardDescription>
            Controls how often the agent refreshes inventory data.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-5 divide-y">
          {/* Collection interval */}
          <div className="flex items-center justify-between py-4 first:pt-0">
            <div>
              <p className="text-sm font-medium text-foreground">Collection interval</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                How frequently enabled categories are re-scanned.
              </p>
            </div>
            <div className="flex items-center border rounded-lg overflow-hidden shrink-0">
              {INTERVALS.map((iv) => (
                <button
                  key={iv}
                  onClick={() => handleIntervalChange(iv)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors border-r last:border-r-0 ${interval === iv
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                    }`}
                >
                  {iv}
                </button>
              ))}
            </div>
          </div>

          {/* Collect on startup */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-foreground">Collect on agent startup</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Run a full collection immediately after the agent starts or restarts.
              </p>
            </div>
            <Switch
              checked={collectOnStart}
              onCheckedChange={handleCollectOnStartChange}
              size="sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Footer actions ── */}
      {
        isDirty && (
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={handleDiscard}>
              Discard changes
            </Button>
            <Button onClick={handleSave}>
              Save collection settings
            </Button>
          </div>
        )
      }
    </div >
  );
};

export default AgentSettings;
