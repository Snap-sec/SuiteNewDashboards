import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  useGetBackupsQuery,
  useGetBackupSettingsQuery,
  useUpdateBackupSettingsMutation,
  useCreateBackupMutation,
  useDeleteBackupMutation,
  useRestoreBackupMutation,
} from '@/services/auth/backupsApi';
import appConfig from '@/config/appConfig';
import { AutomaticBackupsToggle } from './AutomaticBackupsToggle';
import { BackupFrequency } from './BackupFrequency';
import { RetentionPolicy } from './RetentionPolicy';
import { BackupList } from './BackupList';
import { Skeleton } from '@/components/ui/skeleton';
import ActiveDonutChart from '@/components/custom/charts/reui/active-donut-chart';

export function DataBackup() {
  const [autoBackup, setAutoBackup] = useState(true);
  const [selectedFrequency, setSelectedFrequency] = useState('monthly');
  const [retention, setRetention] = useState('5');

  // ─── API ────────────────────────────────────────────────────────────
  const { data: settingsResponse, isLoading: isSettingsLoading } = useGetBackupSettingsQuery();
  const { data: backupsResponse, isLoading, isFetching } = useGetBackupsQuery(undefined, {
    pollingInterval: 10000,
  });

  const [updateSettings] = useUpdateBackupSettingsMutation();
  const [createBackup] = useCreateBackupMutation();
  const [deleteBackup] = useDeleteBackupMutation();
  const [restoreBackup] = useRestoreBackupMutation();

  const backups = backupsResponse?.data?.backups || [];
  const storage = settingsResponse?.data?.storage;

  const totalBackupsSize = storage?.backupsBytes || 0;
  const usedSpace = storage ? storage.totalBytes - storage.freeBytes : 0;
  const otherUsedSpace = Math.max(0, usedSpace - totalBackupsSize);

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // ─── Sync settings from API on first load ───────────────────────────
  useEffect(() => {
    const s = settingsResponse?.data?.settings;
    if (!s) return;
    setAutoBackup(s.automaticBackups ?? true);
    setSelectedFrequency((s.frequency ?? 'Monthly').toLowerCase());
    setRetention(String(s.retentionCount ?? 5));
  }, [settingsResponse]);

  // ─── Persist changes to the API ─────────────────────────────────────
  const saveSettings = (patch) => {
    const current = settingsResponse?.data?.settings || {};
    toast.promise(
      updateSettings({
        automaticBackups: autoBackup,
        frequency: selectedFrequency.charAt(0).toUpperCase() + selectedFrequency.slice(1),
        retentionCount: Number(retention),
        ...patch,
      }).unwrap(),
      {
        loading: 'Saving settings...',
        success: 'Settings saved.',
        error: (err) => err?.data?.message || 'Failed to save settings.',
      },
    );
  };

  const handleToggleAutoBackup = (val) => {
    setAutoBackup(val);
    saveSettings({ automaticBackups: val });
  };

  const handleSelectFrequency = (val) => {
    setSelectedFrequency(val);
    saveSettings({ frequency: val.charAt(0).toUpperCase() + val.slice(1) });
  };

  const handleRetentionChange = (val) => {
    setRetention(val);
    saveSettings({ retentionCount: Number(val) });
  };

  // ─── Backup actions ─────────────────────────────────────────────────
  const handleCreateBackup = () => {
    toast.promise(createBackup().unwrap(), {
      loading: 'Creating backup...',
      success: 'Backup created successfully!',
      error: (err) => err?.data?.message || 'Failed to create backup.',
    });
  };

  const handleDelete = (id) => {
    toast.promise(deleteBackup(id).unwrap(), {
      loading: 'Deleting backup...',
      success: 'Backup deleted.',
      error: (err) => err?.data?.message || 'Failed to delete backup.',
    });
  };



  const handleRestore = (backup) => {
    toast.promise(restoreBackup(backup._id).unwrap(), {
      loading: `Restoring from ${backup.name}...`,
      success: 'Restore initiated successfully!',
      error: 'Failed to initiate restore.',
    });
  };

  if (isSettingsLoading) {
    return (
      <div className="flex flex-col gap-6 p-4">
        {/* Toggle skeleton */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-72" />
          </div>
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>

        {/* Frequency skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        </div>

        {/* Retention skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-80" />
            </div>
            <Skeleton className="h-9 w-36 rounded-md" />
          </div>
        </div>

        {/* Existing backups header skeleton */}
        <div>
          <Skeleton className="h-4 w-36 mb-3" />
          <BackupList
            backups={[]}
            isLoading={true}
            onCreateBackup={handleCreateBackup}
            onRestore={handleRestore}
            onDelete={handleDelete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <AutomaticBackupsToggle autoBackup={autoBackup} onToggle={handleToggleAutoBackup} />

      <BackupFrequency
        disabled={!autoBackup}
        selectedFrequency={selectedFrequency}
        onSelect={handleSelectFrequency}
      />

      <RetentionPolicy
        disabled={!autoBackup}
        retention={retention}
        onRetentionChange={handleRetentionChange}
      />

      {storage && (
        <div>
          <ActiveDonutChart
            data={[
              { name: 'Backups', value: totalBackupsSize },
              { name: 'Other Used Space', value: otherUsedSpace },
              { name: 'Free Space', value: storage.freeBytes },
            ]}
            colors={['#3b82f6', '#64748b', '#10b981']}
            title="Server Storage Capacity"
            description={`Total Capacity: ${formatBytes(storage.totalBytes)}`}
            centerValue={`${((storage.freeBytes / storage.totalBytes) * 100).toFixed(1)}%`}
            // centerLabel="Percentage"
            activeIndex={2}
            valueFormatter={(val) => formatBytes(val)}
            height={300}
          />
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-foreground mb-2">
          Existing Backups
          {!isLoading && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">({backups.length})</span>
          )}
        </p>
        <BackupList
          backups={backups}
          retention={retention}
          isLoading={isLoading}
          onCreateBackup={handleCreateBackup}
          onRestore={handleRestore}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
