import React from 'react';
import { useState, useEffect } from 'react';
import {
  Package,
  BookOpen,
  Activity,
  HardDrive,
  Network,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { CollectionCard } from './collection-card';
import { useConfigureAimAgentMutation } from '@/services/agent/agentApi';

// ─── Static collection categories ─────────────────────────────────────────────

const INITIAL_CATEGORIES = [
  {
    id: 'installed_packages',
    icon: Package,
    title: 'Installed Packages & Software',
    description: 'OS packages, applications, and versions installed on the host.',
    stats: null,
    lastSeen: null,
    enabled: true,
  },
  {
    id: 'libraries_and_deps',
    icon: BookOpen,
    title: 'Libraries & Dependencies',
    description: 'Language-level libraries (e.g. npm, pip, gem) discovered on disk.',
    stats: null,
    lastSeen: null,
    enabled: true,
  },
  {
    id: 'running_processes',
    icon: Activity,
    title: 'Running Processes',
    description: 'Active processes, owning users, and listening sockets.',
    stats: null,
    lastSeen: null,
    enabled: true,
  },
  {
    id: 'host_hardware',
    icon: HardDrive,
    title: 'Host Hardware',
    description: 'CPU, memory, storage, and firmware inventory.',
    stats: null,
    lastSeen: null,
    enabled: true,
  },
  {
    id: 'network',
    icon: Network,
    title: 'Networking',
    description: 'Interfaces, routes, DNS config, and open ports.',
    stats: null,
    lastSeen: null,
    enabled: true,
  },
  {
    id: 'users_and_access',
    icon: Users,
    title: 'Users & Access',
    description: 'Local accounts, groups, and sudoers configuration.',
    stats: null,
    lastSeen: null,
    enabled: false,
  },
];

const INTERVALS = ['15m', '30m', '1h', '6h', '24h'];

// ─── Data Collection Tab ────────────────────────────────────────────────────────

export function DataCollectionTab({ settingsData, isLoading }) {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [interval, setInterval] = useState('6h'); // default to 6h
  const [collectOnStart, setCollectOnStart] = useState(true);
  const [activeIngestion, setActiveIngestion] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [configureAimAgent, { isLoading: isSaving }] = useConfigureAimAgentMutation();

  useEffect(() => {
    if (settingsData?.agent_settings?.active_ingestion !== undefined) {
      setActiveIngestion(settingsData.agent_settings.active_ingestion);
    }

    const aimConfig = settingsData?.agent_settings?.aim_agent_configuration;
    if (aimConfig) {
      if (aimConfig.collection_interval) {
        setInterval(aimConfig.collection_interval);
      }
      if (typeof aimConfig.collect_on_start === 'boolean') {
        setCollectOnStart(aimConfig.collect_on_start);
      }
      if (Array.isArray(aimConfig.collection_categories)) {
        setCategories((prev) =>
          prev.map((c) => ({
            ...c,
            enabled: aimConfig.collection_categories.includes(c.id),
          }))
        );
      }
    }
  }, [settingsData]);

  const handleIngestionToggle = (val) => {
    setActiveIngestion(val);
    setIsDirty(true);
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
    if (settingsData?.agent_settings?.active_ingestion !== undefined) {
      setActiveIngestion(settingsData.agent_settings.active_ingestion);
    } else {
      setActiveIngestion(true);
    }

    const aimConfig = settingsData?.agent_settings?.aim_agent_configuration;
    if (aimConfig) {
      if (aimConfig.collection_interval) setInterval(aimConfig.collection_interval);
      if (typeof aimConfig.collect_on_start === 'boolean') setCollectOnStart(aimConfig.collect_on_start);
      if (Array.isArray(aimConfig.collection_categories)) {
        setCategories((prev) =>
          prev.map((c) => ({
            ...c,
            enabled: aimConfig.collection_categories.includes(c.id),
          }))
        );
      }
    } else {
      setCategories(INITIAL_CATEGORIES);
      setInterval('6h'); // 6h default
      setCollectOnStart(true);
    }
    setIsDirty(false);
  };

  const handleSave = () => {
    const collection_categories = categories
      .filter((cat) => cat.enabled)
      .map((cat) => cat.id);

    toast.promise(
      configureAimAgent({
        agent_settings: {
          ...settingsData?.agent_settings,
          active_ingestion: activeIngestion,
          aim_agent_configuration: {
            ...settingsData?.agent_settings?.aim_agent_configuration,
            collection_categories,
            collection_interval: interval,
            collect_on_start: collectOnStart,
          }
        }
      }).unwrap(),
      {
        loading: 'Saving collection settings...',
        success: () => {
          setIsDirty(false);
          return 'Collection settings saved';
        },
        error: 'Failed to save collection settings',
      }
    );
  };

  return (
    <div className="flex flex-col gap-5 mt-4">
      {/* ── Data Collection ── */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Data Collection</CardTitle>
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

          {/* Agent Ingestion */}
          {/* <div className="flex items-center justify-between py-4 border-t">
            <div>
              <p className="text-sm font-medium text-foreground">Agent Ingestion</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enable or disable global telemetry and data ingestion for this agent.
              </p>
            </div>
            <Switch
              checked={activeIngestion}
              onCheckedChange={handleIngestionToggle}
              size="sm"
            />
          </div> */}
        </CardContent>
      </Card>

      {/* ── Footer actions ── */}
      {isDirty && (
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={handleDiscard} disabled={isSaving}>
            Discard changes
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            Save collection settings
          </Button>
        </div>
      )}
    </div>
  );
}
