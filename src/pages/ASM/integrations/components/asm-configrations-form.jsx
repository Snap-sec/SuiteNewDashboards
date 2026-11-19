import { useEffect, useState } from 'react';
import { CalendarIcon, Plus, Rocket, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetAsmSettingsQuery,
  useUpdateAsmSettingsMutation,
  useEnableDisableAsmConfigMutation,
} from '@/services/asm/configApi';
import { useGetVmAssessmentsQuery } from '@/services/vm/assessmentsApi';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import Select from '@/components/custom/select';
import TimePicker from '@/components/custom/time-picker';
import AutomaticSyncSwitch from './switches/automatic-syncronization-switch';
import { ButtonWithConfirm as ConfirmationDialog } from '@/components/custom/button-with-confirmation';
import CreateAssessmentModel from '../../../VM/pages/assessment/components/Modal/create-assessment-model';
import { useAuth } from '@/auth/context/auth-context';

function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(now.getMinutes()).padStart(2, '0');
  return { hours: hoursStr, minutes: minutesStr, period };
}

export default function ASMConfiguration({ isDisabled = false }) {
  const { data: asmSettingsData, isLoading: loadingSettings } =
    useGetAsmSettingsQuery();
  const [assessmentSearch, setAssessmentSearch] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [createAssessmentOpen, setCreateAssessmentOpen] = useState(false);
  const CREATE_ASSESSMENT_VALUE = '__create_assessment__';
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';
  const activeAssessmentId = selectedAssessment || asmSettingsData?.data?.assessmentId;
  const {
    data: assessments,
    isLoading: assessmentsLoading,
    isFetching: assessmentsFetching,
  } = useGetVmAssessmentsQuery({
    search: assessmentSearch,
    limit: 20,
    ...(activeAssessmentId ? { includeIds: activeAssessmentId } : {}),
  }, { skip: loadingSettings });
  const [enableDisableAsmConfig, { isLoading: isTogglingScanning }] = useEnableDisableAsmConfigMutation();

  const handleToggleScanning = (checked) => {
    toast.promise(
      enableDisableAsmConfig({ scanning_enabled: checked }).unwrap(),
      {
        loading: checked ? 'Enabling scanning...' : 'Disabling scanning...',
        success: checked ? 'Scanning enabled successfully' : 'Scanning disabled successfully',
        error: (err) => err?.data?.message || 'Failed to update scanning status',
      }
    );
  };
  const [updateAsmSettings, {isLoading: isUpdatingSettings}] = useUpdateAsmSettingsMutation();

  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState('');
  const [frequency, setFrequency] = useState('Weekly');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(getCurrentTime());
  const [autoSync, setAutoSync] = useState(true);
  const [domainError, setDomainError] = useState('');

  const [weekday, setWeekday] = useState(null);
  const [time2, setTime2] = useState(null);

  const weekdayOptions = [
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday', value: 'sunday' },
  ];

  useEffect(() => {
    if (asmSettingsData && asmSettingsData.data) {
      setDomains(asmSettingsData.data.domains || []);
      const freq = asmSettingsData.data.frequency || '';
      setFrequency(freq.charAt(0).toUpperCase() + freq.slice(1).toLowerCase());

      if (asmSettingsData.data.launchTime) {
        const dt = new Date(asmSettingsData.data.launchTime);
        setDate(dt);
        setTime2(dt);

        // Derive weekday
        const days = [
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
        ];
        setWeekday(days[dt.getDay()]);

        let h = dt.getHours();
        const period = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        const hours = String(h).padStart(2, '0');
        const minutes = String(dt.getMinutes()).padStart(2, '0');
        setTime({ hours, minutes, period });
      } else {
        setDate(new Date());
        setTime(getCurrentTime());
        setTime2(new Date());
      }

      setSelectedAssessment(asmSettingsData.data.assessmentId || 'none');

      if (asmSettingsData.data.auto_sync_vm !== undefined) {
        setAutoSync(asmSettingsData.data.auto_sync_vm);
      }
    }
  }, [asmSettingsData]);

  const addDomain = () => {
    const domain = newDomain.trim().toLowerCase();
    if (!domain) return;

    if (domainError) return;

    if (domains.includes(domain)) {
      setDomainError('This target has already been added.');
      return;
    }

    const newDomainsList = [...domains, domain];
    setDomains(newDomainsList);
    setNewDomain('');
    setDomainError('');
    handleSaveOrUpdateSettings({ domains: newDomainsList });
  };

  const removeDomain = (index) => {
    const newDomainsList = domains.filter((_, i) => i !== index);
    setDomains(newDomainsList);
    handleSaveOrUpdateSettings({ domains: newDomainsList });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !domainError && newDomain.trim()) {
      addDomain();
    }
  };

  const validateDomain = (value) => {
    const inputVal = value.trim().toLowerCase();
    if (!inputVal) {
      setDomainError('');
      return;
    }

    const isValidIPv4 = (ip) => {
      const parts = ip.split('.');
      if (parts.length !== 4) return false;
      return parts.every(part => {
        const num = parseInt(part, 10);
        return !isNaN(num) && num >= 0 && num <= 255 && String(num) === part;
      });
    };

    const isValidCidr = (cidr) => {
      const parts = cidr.split('/');
      if (parts.length !== 2) return false;
      const [ip, prefixStr] = parts;
      if (!isValidIPv4(ip)) return false;
      const prefix = parseInt(prefixStr, 10);
      return !isNaN(prefix) && prefix >= 0 && prefix <= 32 && String(prefix) === prefixStr;
    };

    const isValidDomain = (domain) => {
      const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
      return domainRegex.test(domain);
    };

    if (!isValidDomain(inputVal) && !isValidIPv4(inputVal) && !isValidCidr(inputVal)) {
      setDomainError('Please enter a valid domain, IP, or IP range (e.g., example.com or 199.200.2.2/22)');
    } else if (domains.includes(inputVal)) {
      setDomainError('This target has already been added.');
    } else {
      setDomainError('');
    }
  };

  const formatDateTime = () => {
    if (!date) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}, ${time.hours}:${time.minutes} ${time.period}`;
  };

  const handleSaveOrUpdateSettings = (overrides = {}) => {
    const currentDomains = overrides.domains !== undefined ? overrides.domains : domains;
    const currentFrequency = overrides.frequency !== undefined ? overrides.frequency : frequency;
    const currentAssessment = overrides.selectedAssessment !== undefined ? overrides.selectedAssessment : selectedAssessment;
    const currentAutoSync = overrides.autoSync !== undefined ? overrides.autoSync : autoSync;
    const currentDate = overrides.date !== undefined ? overrides.date : date;
    const currentTime2 = overrides.time2 !== undefined ? overrides.time2 : time2;
    const currentWeekday = overrides.weekday !== undefined ? overrides.weekday : weekday;

    const payload = {
      domains: currentDomains,
      frequency: currentFrequency.toLowerCase(),
      assessmentId: currentAssessment === 'none' ? null : currentAssessment,
      auto_sync_vm: currentAutoSync,
    };

    if (currentFrequency === 'Once') {
      if (!currentDate || !currentTime2) return;
      const combinedDate = new Date(currentDate);
      combinedDate.setHours(currentTime2.getHours(), currentTime2.getMinutes(), 0, 0);
      payload.launchTime = combinedDate.toISOString();
    } else {
      if (!currentTime2) return;
      payload.time = currentTime2.toISOString();
      if (currentFrequency === 'Weekly') {
        if (!currentWeekday) return;
        payload.weekday = currentWeekday;
      }
    }
    
    toast.promise(updateAsmSettings(payload).unwrap(), {
      loading: 'Updating configuration...',
      success: 'Configuration updated automatically',
      error: (err) => err?.data?.message || 'Failed to update configuration',
    });
  };

  if (loadingSettings || assessmentsLoading) {
    return (
      <div className="space-y-6 pt-4">
        {/* Card 1: Target Domains Skeleton */}
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Scan Schedule Skeleton */}
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex flex-row gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-8 gap-6 pb-2">
              <div className="flex flex-col gap-2 col-span-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Vulnerability Synchronization Configuration Skeleton */}
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-80" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-60" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="border-t pt-6 flex justify-end">
              <Skeleton className="h-10 w-40" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }


  const sortedAssessments = [...(assessments?.data?.assessments || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const assessmentOptions = [
    ...(!isAuditor ? [{ label: '+ Create Assessment', value: CREATE_ASSESSMENT_VALUE, className: 'text-primary font-medium', noNavigate: true }] : []),
    { label: 'None', value: 'none', noNavigate: true },
    ...sortedAssessments.map((a) => ({
      label: a.title,
      value: a._id,
    })),
  ];

  return (
    <div className="space-y-6 pt-4">
      {/* Card 1: Target Domains */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Target Domains</h3>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="example.com or 199.200.2.2/22"
                value={newDomain}
                onChange={(e) => {
                  setNewDomain(e.target.value);
                  validateDomain(e.target.value);
                }}
                onKeyPress={handleKeyPress}
                className={`flex-1 ${domainError ? 'border-destructive focus-visible:ring-destructive/20' : ''}`}
                disabled={isDisabled}
              />
              <Button
                onClick={addDomain}
                variant="outline"
                disabled={isDisabled || !!domainError || !newDomain.trim()}
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            {domainError && (
              <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                {domainError}
              </p>
            )}
          </div>
          <div className="space-y-2">
            {domains.map((domain, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 border rounded-lg ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="text-sm">{domain}</span>
                <ConfirmationDialog
                  variant="ghost"
                  size="icon"
                  confirm={true}
                  onConfirm={() => removeDomain(index)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDisabled}
                  confirmTitle="Remove Target Domain"
                  dialog={`Are you sure you want to remove "${domain}" from target domains?`}
                  confirmVariant="destructive"
                  confirmButton={<Button variant="destructive">Remove</Button>}
                >
                  <X className="w-4 h-4 text-destructive" />
                </ConfirmationDialog>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Scan Schedule */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Scan Schedule</h3>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Frequency</p>
            <div className="flex flex-row gap-3">
              <Button
                variant={frequency === 'Once' ? 'secondary' : 'outline'}
                onClick={() => {
                  setFrequency('Once');
                  handleSaveOrUpdateSettings({ frequency: 'Once' });
                }}
                disabled={isDisabled}
                className="w-32"
              >
                Once
              </Button>
              <Button
                variant={frequency === 'Daily' ? 'secondary' : 'outline'}
                onClick={() => {
                  setFrequency('Daily');
                  handleSaveOrUpdateSettings({ frequency: 'Daily' });
                }}
                disabled={isDisabled}
                className="w-32"
              >
                Daily
              </Button>
              <Button
                variant={frequency === 'Weekly' ? 'secondary' : 'outline'}
                onClick={() => {
                  setFrequency('Weekly');
                  handleSaveOrUpdateSettings({ frequency: 'Weekly' });
                }}
                disabled={isDisabled}
                className="w-32"
              >
                Weekly
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">
                {asmSettingsData?.data?.scanning_enabled ?? true ? 'Pause Scanning' : 'Resume Scanning'}
              </span>
              <span className="text-xs text-muted-foreground">
                {asmSettingsData?.data?.scanning_enabled ?? true
                  ? 'Temporarily pause all automated scans.'
                  : 'Resume automated scans.'}
              </span>
            </div>
            <Switch
              id="auto-scan"
              checked={asmSettingsData?.data?.scanning_enabled ?? true}
              onCheckedChange={handleToggleScanning}
              disabled={isTogglingScanning}
            />
          </div>

          <div className="grid grid-cols-8 gap-6 pb-2">
            {/* Weekday (only for Weekly) */}
            {frequency === 'Weekly' && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Weekday</p>
                <Select
                  placeholder="Select weekday"
                  options={weekdayOptions}
                  value={weekday}
                  onChange={(selected) => {
                    setWeekday(selected.value);
                    handleSaveOrUpdateSettings({ weekday: selected.value });
                  }}
                  disabled={isDisabled}
                />
              </div>
            )}

            {/* Date (only for Once) */}
            {frequency === 'Once' && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={isDisabled}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        date.toLocaleDateString()
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        setDate(d);
                        handleSaveOrUpdateSettings({ date: d });
                      }}
                      disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Time */}
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Time</p>
              <TimePicker
                value={time2}
                onChange={(t) => {
                  setTime2(t);
                  handleSaveOrUpdateSettings({ time2: t });
                }}
                disabled={isDisabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Vulnerability Synchronization Configuration */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold">Vulnerability Synchronization Configuration</h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              Configure the vulnerability synchronization to your asset inventory.
            </p>
          </div>

          <AutomaticSyncSwitch
            autoSync={autoSync}
            setAutoSync={setAutoSync}
            isDisabled={isDisabled}
            onToggle={(newValue) => {
              toast.promise(
                updateAsmSettings({ auto_sync_vm: newValue }).unwrap(),
                {
                  loading: 'Updating sync setting...',
                  success: `Auto-sync ${newValue ? 'enabled' : 'disabled'} successfully`,
                  error: (err) => err?.data?.message || 'Failed to update sync setting',
                }
              );
            }}
          />

          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Select Assessment</p>
            <Select
              value={selectedAssessment}
              options={assessmentOptions}
              onChange={(option) => {
                if (option?.value === CREATE_ASSESSMENT_VALUE) {
                  setCreateAssessmentOpen(true);
                } else {
                  setSelectedAssessment(option?.value);
                  handleSaveOrUpdateSettings({ selectedAssessment: option?.value });
                }
              }}
              onSearchChange={(s) => setAssessmentSearch(s)}
              isSearching={assessmentsFetching}
              enableSearch={true}
              areOptionsNavigating={true}
              searchPlaceholder="Search by Assessment"
              disabled={isDisabled}
            />
            <CreateAssessmentModel
              open={createAssessmentOpen}
              setOpen={setCreateAssessmentOpen}
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
