import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Layers, Plus, Target, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllVsGroupAssetsQuery, useGetVsGroupsQuery } from '@/services/vs/groupApi';
import { useCreateVsScanMutation, useUpdateVsScanMutation } from '@/services/vs/scansApi';
import { useGetVsScannersQuery, useGetVsAssetsQuery } from '@/services/vs/vsApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Modal } from '@/components/custom/modal';
import Select from '@/components/custom/select';
import TimePicker from '@/components/custom/time-picker';
import useStore from '../../store';
import RunImmediatly from '../tab-content/create-scan-run-immediatly-tab-content';


const SCAN_TYPES = [
  { label: 'Full', value: 'full' },
  { label: 'Test', value: 'test' },
];

const frequencyOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

// Custom hook for debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function CreateScanModel() {
  const showCreateUpdateModal = useStore(
    (state) => state.showCreateUpdateModal,
  );
  const setShowCreateUpdateModal = useStore(
    (state) => state.setShowCreateUpdateModal,
  );
  const modalMode = useStore((state) => state.modalMode);
  const setModalMode = useStore((state) => state.setModalMode);
  const selectedScan = useStore((state) => state.selectedScan);
  const setSelectedScan = useStore((state) => state.setSelectedScan);

  const [payload, setPayload] = useState({
    groupId: selectedScan?.group?._id || '',
    scannerId: selectedScan?.scanner?._id || '',
    scanType: selectedScan?.scanType || '',
    schedule: selectedScan?.schedule || 'immediate', // immediate, scheduleScan, recurring
    nextScan: selectedScan?.nextScan || '', // set when schedule: scheduleScan 2nd tab
    frequency: selectedScan?.frequency || 'daily', // schedule: recurring-> daily,weekly,monthly
    scanTime: selectedScan?.scanTime || null, // set when frequency: daily
    weekDay: selectedScan?.weekDay ?? 'monday', // set when frequency: weekly
    monthDay: selectedScan?.monthDay ?? 1, // set when frequency: monthly (1-31)
    assetId: selectedScan?.assetId || null,
  });

  // Scan mode: 'group' or 'asset'
  const [scanMode, setScanMode] = useState('group');

  // Asset search state
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const debouncedAssetSearch = useDebounce(assetSearchQuery, 300);

  const { data: scanners } = useGetVsScannersQuery();
  const { data: groups } = useGetVsGroupsQuery({ hasAssets: true });

  // Fetch assets with search and limit
  const { data: allAssets, isFetching: isSearchingAssets } = useGetVsAssetsQuery(
    { limit: 10, search: debouncedAssetSearch || undefined, type: 'ip,subdomain' },
    { skip: scanMode !== 'asset' },
  );

  useEffect(() => {
    setPayload({
      groupId: selectedScan?.group?._id || groups?.groups[0]?._id || '',
      assetId: selectedScan?.assetId || '',
      scannerId: selectedScan?.scanner?._id || scanners?.scanners[0]?._id || '',
      scanType: selectedScan?.scanType || SCAN_TYPES[1]?.value, // full, test
      schedule: selectedScan?.schedule || 'immediate', // immediate, scheduleScan, recurring
      nextScan: selectedScan?.nextScan || new Date(),
      frequency: selectedScan?.frequency || 'daily',
      scanTime: selectedScan?.scanTime || null,
      weekDay: selectedScan?.weekDay ?? 'monday',
      monthDay: selectedScan?.monthDay ?? 1,
    });
  }, [selectedScan, scanners, groups]);

  const [createScan] = useCreateVsScanMutation();
  const [updateScan] = useUpdateVsScanMutation();

  const handleCreateScan = () => {
    // Validate based on scan mode
    if (scanMode === 'group' && !payload.groupId) {
      return toast.error('Please select a group to scan!');
    }
    if (scanMode === 'asset' && !payload.assetId) {
      return toast.error('Please select an asset to scan!');
    }
    if (!payload.scannerId || !payload.scanType || !payload.schedule || !payload.nextScan) {
      return toast.error('All fields are required!');
    }

    // Build clean payload - only include groupId/assetId if they have values
    // Calculate correct nextScan for daily schedule
    let initialNextScan = payload.nextScan;
    if (payload.schedule === 'recurringScan' && payload.frequency === 'daily' && payload.scanTime) {
      const scanTimeDate = new Date(payload.scanTime);
      const nextRun = new Date();
      nextRun.setHours(scanTimeDate.getHours(), scanTimeDate.getMinutes(), 0, 0);

      // If that time has passed today, schedule for tomorrow
      if (nextRun <= new Date()) {
        nextRun.setDate(nextRun.getDate() + 1);
      }
      initialNextScan = nextRun;
    }

    const cleanPayload = {
      scannerId: payload.scannerId,
      scanType: payload.scanType,
      schedule:
        payload.schedule === 'recurringScan'
          ? payload.frequency
          : payload.schedule == 'scheduleScan'
            ? 'immediate'
            : payload.schedule,
      nextScan: payload.nextScan
        ? new Date(payload.nextScan).toISOString()
        : initialNextScan,
    };

    // Attach frequency-specific scheduling keys
    if (payload.schedule === 'recurringScan') {
      cleanPayload.frequency = payload.frequency;
      if (payload.frequency === 'daily')   cleanPayload.scanTime  = payload.scanTime;
      if (payload.frequency === 'weekly')  cleanPayload.weekDay   = payload.weekDay;
      if (payload.frequency === 'monthly') cleanPayload.monthDay  = payload.monthDay;
    }

    if (payload.groupId) cleanPayload.groupId = payload.groupId;
    if (payload.assetId) cleanPayload.assetId = payload.assetId;

    toast.promise(createScan(cleanPayload).unwrap(), {
      loading: 'Creating Scan',
      success: 'Scan Created',
      error: (err) => {
        return err?.data?.message || 'Failed to create Scan';
      },
    });
    setShowCreateUpdateModal(false);
  };

  const handleUpdateScan = () => {
    // Build clean payload - only include groupId/assetId if they have values
    const cleanPayload = {
      scanId: selectedScan._id,
      scannerId: payload.scannerId,
      scanType: payload.scanType,
      schedule: payload.schedule === 'recurringScan' ? payload.frequency : payload.schedule,
      nextScan: payload.nextScan,
    };

    // Attach frequency-specific scheduling keys
    if (payload.schedule === 'recurringScan') {
      cleanPayload.frequency = payload.frequency;
      if (payload.frequency === 'daily')   cleanPayload.scanTime  = payload.scanTime;
      if (payload.frequency === 'weekly')  cleanPayload.weekDay   = payload.weekDay;
      if (payload.frequency === 'monthly') cleanPayload.monthDay  = payload.monthDay;
    }

    if (payload.groupId) cleanPayload.groupId = payload.groupId;
    if (payload.assetId) cleanPayload.assetId = payload.assetId;

    toast.promise(
      updateScan(cleanPayload).unwrap(),
      {
        loading: 'Updating Scan',
        success: 'Scan Updated',
        error: (err) => err?.data?.message || 'Failed to update Scan',
      },
    );
    setShowCreateUpdateModal(false);
  };

  const handleSubmit = () => {
    if (modalMode == 'update') {
      handleUpdateScan();
    } else {
      handleCreateScan();
    }
  };

  return (
    <Modal
      open={showCreateUpdateModal}
      setOpen={setShowCreateUpdateModal}
      title={modalMode == 'update' ? 'Update Scan' : 'Create Scan'}
      description={
        modalMode == 'update' ? 'Update the scan' : 'Create a new scan.'
      }
      trigger={
        <Button
          onClick={() => {
            setModalMode('create');
            setSelectedScan({});
          }}
        >
          <Plus /> Create Scan
        </Button>
      }
      footer={
        <div className="mt-2">
          <Button onClick={() => handleSubmit()}>
            <Plus /> {modalMode == 'update' ? 'Update Scan' : 'Create Scan'}
          </Button>
        </div>
      }
      className="w-1/3 max-h-[90vh] overflow-y-auto hide-scrollbar"
    >
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Scan Type</Label>
          <div className="grid grid-cols-2 gap-4">
            <Card
              className={`relative p-5 cursor-pointer transition-all duration-200 hover:bg-accent/50 ${payload?.scanType == 'full' ? 'border-primary ring-1 ring-primary/20' : 'border-border'}`}
              onClick={() => setPayload({ ...payload, scanType: 'full' })}
            >
              <Badge variant="outline" className="absolute top-4 right-4 text-[10px] py-0 px-2 h-5 border-primary/30 text-primary font-bold">RECOMMENDED</Badge>
              
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${payload?.scanType == 'full' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              
              <CardTitle className="text-sm font-bold mb-1.5">Full Scan</CardTitle>
              <CardDescription className="text-xs leading-relaxed text-muted-foreground/80">
                Comprehensive security scan including all vulnerability checks
              </CardDescription>
            </Card>

            <Card
              className={`p-5 cursor-pointer transition-all duration-200 hover:bg-accent/50 ${payload?.scanType == 'test' ? 'border-primary ring-1 ring-primary/20' : 'border-border'}`}
              onClick={() => setPayload({ ...payload, scanType: 'test' })}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${payload?.scanType == 'test' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <Zap className="w-5 h-5" />
              </div>
              
              <CardTitle className="text-sm font-bold mb-1.5">Quick Scan</CardTitle>
              <CardDescription className="text-xs leading-relaxed text-muted-foreground/80">
                Top vulnerability checks with faster turnaround
              </CardDescription>
            </Card>
          </div>
        </div>

        {/* Scan Mode Selection Tabs */}
        <Tabs
          value={scanMode}
          onValueChange={(val) => {
            setScanMode(val);
            // Reset selections when switching modes
            setPayload((prev) => ({
              ...prev,
              groupId: val === 'group' ? (groups?.groups[0]?._id || '') : '',
              assetId: ''
            }));
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="group" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Scan by Group
            </TabsTrigger>
            <TabsTrigger value="asset" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Scan by Asset
            </TabsTrigger>
          </TabsList>

          {/* Scan by Group */}
          <TabsContent value="group" className="space-y-4 mt-4">
            <div className="flex flex-col gap-0.5">
              <CardDescription>
                Select the group of endpoints to scan
              </CardDescription>
              <Select
                searchPlaceholder="Search asset group"
                defaultValue={selectedScan?.group?._id || payload.groupId}
                options={groups?.groups?.map((group) => ({
                  label: group.name + `  [${group?.totalAssets}]`,
                  value: group._id,
                }))}
                onChange={(option) =>
                  setPayload((prev) => ({ ...prev, groupId: option.value, assetId: '' }))
                }
              />
            </div>


          </TabsContent>

          {/* Scan by Asset */}
          <TabsContent value="asset" className="space-y-4 mt-4">
            <div className="flex flex-col gap-0.5">
              <CardDescription>
                Select an asset to scan directly
              </CardDescription>
              <Select
                searchPlaceholder="Search asset..."
                defaultValue={payload.assetId}
                options={allAssets?.assets?.map((asset) => ({
                  label: `${asset.value} (${asset.type})`,
                  value: asset._id,
                })) || []}
                onChange={(option) =>
                  setPayload((prev) => ({ ...prev, assetId: option.value, groupId: '' }))
                }
                onSearchChange={setAssetSearchQuery}
                isSearching={isSearchingAssets}
                emptyMessage={assetSearchQuery ? "No assets found. Try a different search." : "Type to search assets..."}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col gap-0.5">
          <CardDescription>
            Choose which scanner will execute the scan
          </CardDescription>
          <Select
            searchPlaceholder="Search scanner"
            defaultValue={selectedScan?.scanner?._id || payload.scannerId}
            options={scanners?.scanners?.map((scanner) => ({
              label: scanner.name,
              value: scanner._id,
            }))}
            onChange={(option) =>
              setPayload((prev) => ({ ...prev, scannerId: option.value }))
            }
          />
        </div>

        <Card className="p-4">
          <CardTitle>Schedule Configuration</CardTitle>
          <CardDescription>When should this scan run?</CardDescription>

          <Tabs
            defaultValue="immediate"
            value={payload?.schedule}
            onValueChange={(val) =>
              setPayload({
                ...payload,
                schedule: val,
              })
            }
            className="mt-4"
          >
            {/* Tabs header */}
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="immediate" className="flex items-center gap-2">Run Immediately</TabsTrigger>
              <TabsTrigger value="scheduleScan" className="flex items-center gap-2">Schedule Scan</TabsTrigger>
              <TabsTrigger value="recurringScan" className="flex items-center gap-2">Recurring Scan</TabsTrigger>
            </TabsList>

            {/* Tabs content */}
            <div className="mt-4">
              <TabsContent value="immediate">
                <RunImmediatly />
              </TabsContent>

              {/* Schedule scan Tab */}
              <TabsContent value="scheduleScan">
                <div className="space-y-2">
                  <Label htmlFor="scheduleDate">Schedule Date & Time *</Label>
                  <Input
                    id="scheduleDate"
                    type="datetime-local"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={payload?.nextScan}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        nextScan: e.target.value,
                      })
                    }
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </TabsContent>

              {/* Recurring scan Tab */}
              <TabsContent value="recurringScan">
                <div className="flex flex-col gap-2 mt-4">
                  <Label className="text-sm text-muted-foreground">
                    Frequency *
                  </Label>

                  <Select
                    placeholder="Select Frequency"
                    searchPlaceholder="Search frequency"
                    options={frequencyOptions}
                    value={payload?.frequency}
                    onChange={(selected) => {
                      setPayload({ ...payload, frequency: selected.value });
                    }}
                  />
                </div>

                {/* Daily → Time picker */}
                {payload?.frequency === 'daily' && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Label className="text-sm text-muted-foreground">Time *</Label>
                    <TimePicker
                      value={payload?.scanTime}
                      onChange={(t) => setPayload({ ...payload, scanTime: t })}
                    />
                  </div>
                )}

                {/* Weekly → Weekday dropdown */}
                {payload?.frequency === 'weekly' && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Label className="text-sm text-muted-foreground">Day of Week *</Label>
                    <Select
                      placeholder="Select day"
                      searchPlaceholder="Search day"
                      value={payload?.weekDay}
                      options={[
                        { label: 'Monday',    value: 'monday' },
                        { label: 'Tuesday',   value: 'tuesday' },
                        { label: 'Wednesday', value: 'wednesday' },
                        { label: 'Thursday',  value: 'thursday' },
                        { label: 'Friday',    value: 'friday' },
                        { label: 'Saturday',  value: 'saturday' },
                        { label: 'Sunday',    value: 'sunday' },
                      ]}
                      onChange={(selected) => setPayload({ ...payload, weekDay: selected.value })}
                    />
                  </div>
                )}

                {/* Monthly → Day-of-month dropdown */}
                {payload?.frequency === 'monthly' && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Label className="text-sm text-muted-foreground">Day of Month *</Label>
                    <Select
                      placeholder="Select day"
                      searchPlaceholder="Search day (1–31)"
                      value={String(payload?.monthDay ?? '')}
                      options={Array.from({ length: 31 }, (_, i) => ({
                        label: `Day ${i + 1}`,
                        value: String(i + 1),
                      }))}
                      onChange={(selected) => setPayload({ ...payload, monthDay: Number(selected.value) })}
                    />
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </Modal>
  );
}

export default CreateScanModel;