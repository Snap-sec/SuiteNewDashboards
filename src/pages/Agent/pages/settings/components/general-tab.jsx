import React, { useState, useEffect } from 'react';
import { Play, ShieldCheck, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

import { PathConfigCard } from './path-config-card';
import { ScanOptionsCard } from './scan-options-card';
import { RecentScansCard } from './recent-scans-card';
import { StatusBadge } from '@/components/custom/status-badge';
import { useConfigureAimAgentMutation, useRunAgentScanMutation } from '@/services/agent/agentApi';

const DEFAULT_TARGETS = {
  windows: { includeDirs: [], excludeDirs: [], scheduledScans: [] },
  linux: { includeDirs: [], excludeDirs: [], scheduledScans: [] },
  darwin: { includeDirs: [], excludeDirs: [], scheduledScans: [] },
};

export function GeneralTab({ settingsData }) {
  const [os, setOs] = useState('linux');

  const [scanTargets, setScanTargets] = useState(DEFAULT_TARGETS);

  const [options, setOptions] = useState({
    followSymlinks: false,
    scanArchives: true,
    skipLargeFiles: true,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [configureAgent, { isLoading: isSaving }] = useConfigureAimAgentMutation();
  const [runAgentScan, { isLoading: isScanning }] = useRunAgentScanMutation();

  const handleRunScan = () => {
    toast.promise(
      runAgentScan({}).unwrap(),
      {
        loading: 'Initiating agent scan...',
        success: 'Scan initiated successfully',
        error: 'Failed to initiate scan',
      }
    );
  };

  useEffect(() => {
    const vsConfig = settingsData?.agent_settings?.vs_agent_configuration;
    if (vsConfig?.scan_targets) {
      setScanTargets({
        windows: vsConfig.scan_targets.windows || DEFAULT_TARGETS.windows,
        linux: vsConfig.scan_targets.linux || DEFAULT_TARGETS.linux,
        darwin: vsConfig.scan_targets.darwin || DEFAULT_TARGETS.darwin,
      });
    }
  }, [settingsData]);

  const handleIncludeChange = (newPaths) => {
    setScanTargets((prev) => ({
      ...prev,
      [os]: {
        ...prev[os],
        includeDirs: newPaths,
      }
    }));
    setIsDirty(true);
  };

  const handleExcludeChange = (newPaths) => {
    setScanTargets((prev) => ({
      ...prev,
      [os]: {
        ...prev[os],
        excludeDirs: newPaths,
      }
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    toast.promise(
      configureAgent({
        agent_settings: {
          ...settingsData?.agent_settings,
          vs_agent_configuration: {
            ...settingsData?.agent_settings?.vs_agent_configuration,
            scan_targets: scanTargets,
          }
        }
      }).unwrap(),
      {
        loading: 'Saving scan configuration...',
        success: () => {
          setIsDirty(false);
          return 'Scan configuration saved';
        },
        error: 'Failed to save configuration',
      }
    );
  };

  const handleDiscard = () => {
    const vsConfig = settingsData?.agent_settings?.vs_agent_configuration;
    if (vsConfig?.scan_targets) {
      setScanTargets({
        windows: vsConfig.scan_targets.windows || DEFAULT_TARGETS.windows,
        linux: vsConfig.scan_targets.linux || DEFAULT_TARGETS.linux,
        darwin: vsConfig.scan_targets.darwin || DEFAULT_TARGETS.darwin,
      });
    } else {
      setScanTargets(DEFAULT_TARGETS);
    }
    setIsDirty(false);
  };

  const scheduledScans = settingsData?.agent_settings?.vs_agent_configuration?.scheduled_scans || [];
  const sortedScans = [...scheduledScans].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const latestScan = sortedScans.length > 0 ? sortedScans[0] : null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };



  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* Header section */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">Scan Configuration</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Launch vulnerability scans and control which paths the agent scans.
        </p>
      </div>

      {/* Last Scan Status */}
      <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 shrink-0">
            <ShieldCheck size={20} className="text-green-500" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Last scan</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {latestScan ? formatDate(latestScan.createdAt) : "No scans run yet"}
            </p>
          </div>
        </div>
        {isScanning || latestScan?.status === 'pending' || latestScan?.status === 'running' ? (
          <StatusBadge
            status={isScanning ? 'scanning' : latestScan?.status === 'running' ? 'scanning' : 'pending'}
            label={isScanning ? 'Initiating...' : undefined}
          />
        ) : (
          <Button
            className="shrink-0 gap-2 font-medium bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleRunScan}
          >
            <Play size={14} className="fill-current" />
            Run scan now
          </Button>
        )}
      </Card>

      {/* Paths Config */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Tabs value={os} onValueChange={setOs} className="w-full">
            <TabsList variant="line">
              <TabsTrigger value="linux">Linux</TabsTrigger>
              <TabsTrigger value="windows">Windows</TabsTrigger>
              <TabsTrigger value="darwin">macOS</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PathConfigCard
            title="Include Paths"
            placeholder={os === 'windows' ? "C:\\path\\to\\scan" : "/path/to/scan"}
            paths={scanTargets[os]?.includeDirs || []}
            onChange={handleIncludeChange}
          />
          <PathConfigCard
            title="Exclude Paths"
            placeholder={os === 'windows' ? "C:\\path\\to\\skip" : "/path/to/skip"}
            paths={scanTargets[os]?.excludeDirs || []}
            onChange={handleExcludeChange}
          />
        </div>
      </div>

      {/* Scan Options */}
      {/* <ScanOptionsCard options={options} setOptions={setOptions} /> */}

      {/* Recent Scans */}
      <RecentScansCard scans={sortedScans} />

      {/* Footer actions */}
      {isDirty && (
        <div className="flex items-center justify-end gap-3 pb-6">
          <Button variant="outline" onClick={handleDiscard} disabled={isSaving}>
            Discard changes
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            Save configuration
          </Button>
        </div>
      )}
    </div>
  );
}
