import { useEffect, useState } from 'react';
import {
  CalendarIcon,
  Check,
  Clock,
  Copy,
  Globe,
  Plus,
  ShieldCheck,
  Trash2,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetAsmSettingsQuery,
  useUpdateAsmSettingsMutation,
  useEnableDisableAsmConfigMutation,
} from '@/services/asm/configApi';
import { useGetVmAssessmentsQuery } from '@/services/vm/assessmentsApi';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import Select from '@/components/custom/select';
import TimePicker from '@/components/custom/time-picker';
import LaunchNewScan from './buttons/launch-new-scan';
import {
  ButtonWithConfirm as ConfirmationDialog,
  ConfirmDialog,
} from '@/components/custom/button-with-confirmation';
import CreateAssessmentModel from '../../../VM/pages/assessment/components/Modal/create-assessment-model';
import { useAuth } from '@/auth/context/auth-context';
import { cn } from '@/lib/utils';

function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(now.getMinutes()).padStart(2, '0');
  return { hours: hoursStr, minutes: minutesStr, period };
}

function getTargetBadgeInfo(target) {
  if (target.includes('/')) {
    return { label: 'CIDR', variant: 'info', appearance: 'light' };
  }
  const parts = target.split('.');
  if (
    parts.length === 4 &&
    parts.every((part) => {
      const num = parseInt(part, 10);
      return !isNaN(num) && num >= 0 && num <= 255 && String(num) === part;
    })
  ) {
    return { label: 'IP', variant: 'primary', appearance: 'light' };
  }
  return { label: 'Domain', variant: 'secondary', appearance: 'outline' };
}

export default function ASMConfiguration({ isDisabled = false }) {
  const { data: asmSettingsData, isLoading: loadingSettings } =
    useGetAsmSettingsQuery();
  const [assessmentSearch, setAssessmentSearch] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [createAssessmentOpen, setCreateAssessmentOpen] = useState(false);
  const [autoSyncConfirmOpen, setAutoSyncConfirmOpen] = useState(false);
  const CREATE_ASSESSMENT_VALUE = '__create_assessment__';
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';
  const activeAssessmentId =
    selectedAssessment || asmSettingsData?.data?.assessmentId;
  const {
    data: assessments,
    isLoading: assessmentsLoading,
    isFetching: assessmentsFetching,
  } = useGetVmAssessmentsQuery(
    {
      search: assessmentSearch,
      limit: 20,
      ...(activeAssessmentId ? { includeIds: activeAssessmentId } : {}),
    },
    { skip: loadingSettings }
  );
  const [enableDisableAsmConfig, { isLoading: isTogglingScanning }] =
    useEnableDisableAsmConfigMutation();

  const handleToggleScanning = (checked) => {
    toast.promise(
      enableDisableAsmConfig({ scanning_enabled: checked }).unwrap(),
      {
        loading: checked ? 'Resuming automated scanning...' : 'Pausing automated scanning...',
        success: checked
          ? 'Scanning resumed successfully'
          : 'Scanning paused successfully',
        error: (err) => err?.data?.message || 'Failed to update scanning status',
      }
    );
  };

  const [updateAsmSettings] = useUpdateAsmSettingsMutation();

  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState('');
  const [frequency, setFrequency] = useState('Weekly');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(getCurrentTime());
  const [autoSync, setAutoSync] = useState(true);
  const [domainError, setDomainError] = useState('');

  const [weekday, setWeekday] = useState('tuesday');
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
      if (freq) {
        setFrequency(freq.charAt(0).toUpperCase() + freq.slice(1).toLowerCase());
      }

      if (asmSettingsData.data.launchTime) {
        const dt = new Date(asmSettingsData.data.launchTime);
        setDate(dt);
        setTime2(dt);

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
    if (!domain || domainError) return;

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

  const handleCopyTarget = (text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      toast.success(`Copied "${text}" to clipboard`);
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
      return parts.every((part) => {
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
      const domainRegex =
        /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
      return domainRegex.test(domain);
    };

    if (
      !isValidDomain(inputVal) &&
      !isValidIPv4(inputVal) &&
      !isValidCidr(inputVal)
    ) {
      setDomainError(
        'Please enter a valid domain, IP, or CIDR block (e.g., example.com, 192.168.1.1, or 10.0.0.0/24)'
      );
    } else if (domains.includes(inputVal)) {
      setDomainError('This target has already been added.');
    } else {
      setDomainError('');
    }
  };

  const handleAutoSyncToggle = (checked) => {
    if (checked) {
      setAutoSyncConfirmOpen(true);
    } else {
      setAutoSync(false);
      toast.info('Vulnerability Synchronization Disabled');
      handleSaveOrUpdateSettings({ autoSync: false });
    }
  };

  const handleConfirmAutoSync = () => {
    setAutoSync(true);
    setAutoSyncConfirmOpen(false);
    toast.success('Vulnerability Synchronization Enabled');
    handleSaveOrUpdateSettings({ autoSync: true });
  };

  const handleSaveOrUpdateSettings = (overrides = {}) => {
    const currentDomains =
      overrides.domains !== undefined ? overrides.domains : domains;
    const currentFrequency =
      overrides.frequency !== undefined ? overrides.frequency : frequency;
    const currentAssessment =
      overrides.selectedAssessment !== undefined
        ? overrides.selectedAssessment
        : selectedAssessment;
    const currentAutoSync =
      overrides.autoSync !== undefined ? overrides.autoSync : autoSync;
    const currentDate = overrides.date !== undefined ? overrides.date : date;
    const currentTime2 =
      overrides.time2 !== undefined ? overrides.time2 : time2;
    const currentWeekday =
      overrides.weekday !== undefined ? overrides.weekday : weekday;

    const payload = {
      domains: currentDomains,
      frequency: currentFrequency.toLowerCase(),
      assessmentId: currentAssessment === 'none' ? null : currentAssessment,
      auto_sync_vm: currentAutoSync,
    };

    if (currentFrequency === 'Once') {
      if (!currentDate || !currentTime2) return;
      const combinedDate = new Date(currentDate);
      combinedDate.setHours(
        currentTime2.getHours(),
        currentTime2.getMinutes(),
        0,
        0
      );
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
      loading: 'Saving configuration...',
      success: 'Configuration saved automatically',
      error: (err) => err?.data?.message || 'Failed to update configuration',
    });
  };

  // Loading Skeleton View
  if (loadingSettings || assessmentsLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full pt-2">
        {/* Left Column Skeletons */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <Card>
            <CardHeader className="py-4 px-6 border-b border-border">
              <div className="flex items-center justify-between w-full">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-5 w-20" />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-11 w-full rounded-lg" />
                <Skeleton className="h-11 w-full rounded-lg" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4 px-6 border-b border-border">
              <Skeleton className="h-5 w-36" />
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-14 rounded-lg" />
                <Skeleton className="h-14 rounded-lg" />
                <Skeleton className="h-14 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-9 rounded-md" />
                <Skeleton className="h-9 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column Skeletons */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          <Card>
            <CardHeader className="py-4 px-6 border-b border-border">
              <div className="flex items-center justify-between w-full">
                <Skeleton className="h-5 w-32" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-14 rounded-md" />
                  <Skeleton className="h-5 w-9 rounded-full" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3.5 w-64" />
              <Skeleton className="h-9 w-full rounded-md" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4 px-6 border-b border-border">
              <div className="flex items-center justify-between w-full">
                <Skeleton className="h-5 w-36" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-14 rounded-md" />
                  <Skeleton className="h-5 w-9 rounded-full" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3.5 w-72" />
              <Skeleton className="h-9 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const sortedAssessments = [...(assessments?.data?.assessments || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const assessmentOptions = [
    ...(!isAuditor
      ? [
          {
            label: '+ Create Assessment',
            value: CREATE_ASSESSMENT_VALUE,
            className: 'text-primary font-medium',
            noNavigate: true,
          },
        ]
      : []),
    { label: 'None', value: 'none', noNavigate: true },
    ...sortedAssessments.map((a) => ({
      label: a.title,
      value: a._id,
    })),
  ];

  const isScanningActive = asmSettingsData?.data?.scanning_enabled ?? true;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full pt-2 items-start">
      {/* ========================================================
          LEFT COLUMN: Target Scope & Scan Schedule (7/12 or 8/12)
          ======================================================== */}
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 min-w-0">
        {/* CARD 1: Target Scope & Perimeter */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between gap-4 py-4 px-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Globe className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <CardTitle className="text-base font-semibold">
                  Target Scope & Perimeter
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Root domains, IPv4 addresses, and CIDR blocks monitored for external assets.
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" appearance="outline" size="sm" className="font-mono">
              {domains.length} {domains.length === 1 ? 'Target' : 'Targets'}
            </Badge>
          </CardHeader>

          <CardContent className="p-6 flex flex-col gap-5">
            {/* Input Row */}
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g. example.com, 192.168.1.1, or 10.0.0.0/24"
                  value={newDomain}
                  onChange={(e) => {
                    setNewDomain(e.target.value);
                    validateDomain(e.target.value);
                  }}
                  onKeyDown={handleKeyPress}
                  className={cn(
                    'flex-1 h-9',
                    domainError &&
                      'border-destructive focus-visible:ring-destructive/20'
                  )}
                  disabled={isDisabled}
                />
                <Button
                  type="button"
                  onClick={addDomain}
                  variant="default"
                  size="sm"
                  className="h-9 px-4 gap-1.5"
                  disabled={isDisabled || !!domainError || !newDomain.trim()}
                >
                  <Plus className="size-4" /> Add Target
                </Button>
              </div>

              {domainError ? (
                <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                  {domainError}
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Enter apex domains (e.g. <span className="font-mono">northwind.dev</span>), individual IP addresses, or network CIDRs.
                </p>
              )}
            </div>

            {/* Target List */}
            {domains.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl border border-dashed border-border bg-muted/20">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                  <Globe className="size-5" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No targets configured
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Add root domains or IP ranges above to begin continuous external attack surface discovery.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1">
                {domains.map((domain, index) => {
                  const badgeInfo = getTargetBadgeInfo(domain);
                  return (
                    <div
                      key={index}
                      className={cn(
                        'group flex items-center justify-between p-3 border border-border/80 rounded-xl bg-card hover:bg-muted/30 transition-colors',
                        isDisabled && 'opacity-60 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Badge
                          variant={badgeInfo.variant}
                          appearance={badgeInfo.appearance}
                          size="xs"
                          className="font-mono uppercase font-semibold text-[10px]"
                        >
                          {badgeInfo.label}
                        </Badge>
                        <span className="font-mono text-sm font-medium text-foreground truncate">
                          {domain}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Copy target ${domain}`}
                          className="size-7 text-muted-foreground hover:text-foreground opacity-70 group-hover:opacity-100"
                          onClick={() => handleCopyTarget(domain)}
                          title="Copy target"
                        >
                          <Copy className="size-3.5" />
                        </Button>

                        <ConfirmationDialog
                          variant="ghost"
                          size="icon"
                          confirm={true}
                          onConfirm={() => removeDomain(index)}
                          aria-label={`Remove target ${domain}`}
                          className="size-7 text-muted-foreground hover:text-destructive opacity-70 group-hover:opacity-100 cursor-pointer disabled:opacity-40"
                          disabled={isDisabled}
                          confirmTitle="Remove Target Perimeter"
                          dialog={`Are you sure you want to remove "${domain}" from monitored targets? Any discovered assets under this target may no longer update.`}
                          confirmVariant="destructive"
                          confirmButton={
                            <Button type="button" variant="destructive" size="sm">
                              Remove Target
                            </Button>
                          }
                        >
                          <Trash2 className="size-3.5" />
                        </ConfirmationDialog>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CARD 2: Scan Schedule & Cadence */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between gap-4 py-4 px-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <CardTitle className="text-base font-semibold">
                  Scan Schedule & Cadence
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Automated recurrence frequency, day of execution, and launch time.
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" size="sm">
              {frequency} Recurrence
            </Badge>
          </CardHeader>

          <CardContent className="p-6 flex flex-col gap-6">
            {/* Frequency Segmented Selector */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Recurrence Frequency
              </Label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  {
                    value: 'Weekly',
                    label: 'Weekly',
                    desc: 'Regular continuous perimeter audits',
                  },
                  {
                    value: 'Daily',
                    label: 'Daily',
                    desc: 'High-frequency exposure detection',
                  },
                  {
                    value: 'Once',
                    label: 'One-Time',
                    desc: 'Single audit at specified date & time',
                  },
                ].map((item) => {
                  const isSelected = frequency === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        setFrequency(item.value);
                        handleSaveOrUpdateSettings({ frequency: item.value });
                      }}
                      className={cn(
                        'flex flex-col items-start p-3 text-left border rounded-xl transition-colors cursor-pointer min-w-0',
                        isSelected
                          ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary shadow-xs'
                          : 'border-border bg-card hover:bg-muted/40 text-muted-foreground',
                        isDisabled && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={cn(
                            'text-xs font-semibold',
                            isSelected ? 'text-primary' : 'text-foreground'
                          )}
                        >
                          {item.label}
                        </span>
                        {isSelected && (
                          <Check className="size-3.5 text-primary shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timing Inputs (Clean, perfectly aligned 2-column grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Weekday (only for Weekly) */}
              {frequency === 'Weekly' && (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    Day of the Week
                  </Label>
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
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    Execution Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-9"
                        disabled={isDisabled}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? date.toLocaleDateString() : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                          setDate(d);
                          handleSaveOrUpdateSettings({ date: d });
                        }}
                        disabled={(d) =>
                          d < new Date().setHours(0, 0, 0, 0)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Start Time */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Execution Time
                </Label>
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

            {/* Active Schedule Summary Box */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/70 text-xs text-muted-foreground">
              <Clock className="size-4 shrink-0 text-primary" />
              <span>
                Configured schedule triggers{' '}
                <strong className="text-foreground font-medium">
                  {frequency === 'Weekly'
                    ? `every ${weekday ? weekday.charAt(0).toUpperCase() + weekday.slice(1) : 'week'}`
                    : frequency === 'Daily'
                    ? 'every day'
                    : date
                    ? `once on ${date.toLocaleDateString()}`
                    : 'once'}
                </strong>{' '}
                at{' '}
                <strong className="text-foreground font-medium font-mono">
                  {time2 ? `${time.hours}:${time.minutes} ${time.period}` : 'selected time'}
                </strong>
                .
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================
          RIGHT COLUMN: Scanning Engine & VM Sync (5/12 or 4/12)
          ======================================================== */}
      <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 min-w-0">
        {/* CARD 3: Scanning Engine & Operational Control */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between gap-4 py-4 px-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <CardTitle className="text-base font-semibold">
                  Scanning Engine
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Master automated engine controls.
                </CardDescription>
              </div>
            </div>

            {/* Switch moved directly into CardHeader on the right */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Badge
                variant={isScanningActive ? 'success' : 'warning'}
                appearance="light"
                size="sm"
              >
                {isScanningActive ? 'Active' : 'Paused'}
              </Badge>
              <Switch
                id="auto-scan"
                checked={isScanningActive}
                onCheckedChange={handleToggleScanning}
                disabled={isTogglingScanning}
                aria-label="Toggle automated scanning"
              />
            </div>
          </CardHeader>

          <CardContent className="p-6 flex flex-col gap-4">
            {/* Quick Manual Launch Action (inner box removed) */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Manual Discovery Scan
              </Label>
              <p className="text-xs text-muted-foreground">
                Run an immediate full perimeter refresh without waiting for the scheduled window.
              </p>
            </div>
            <LaunchNewScan className="w-full justify-center h-9" />
          </CardContent>
        </Card>

        {/* CARD 4: Vulnerability Management (VM) Sync */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between gap-4 py-4 px-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <CardTitle className="text-base font-semibold">
                  Vulnerability Sync
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Synchronize findings with VM pipelines.
                </CardDescription>
              </div>
            </div>

            {/* Switch moved directly into CardHeader on the right */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Badge
                variant={autoSync ? 'success' : 'secondary'}
                appearance={autoSync ? 'light' : 'outline'}
                size="sm"
              >
                {autoSync ? 'Active' : 'Disabled'}
              </Badge>
              <Switch
                id="header-auto-sync"
                checked={autoSync}
                onCheckedChange={handleAutoSyncToggle}
                disabled={isDisabled}
                aria-label="Toggle automatic vulnerability synchronization"
              />
            </div>
          </CardHeader>

          <CardContent className="p-6 flex flex-col gap-4">
            {/* Target Assessment Selector (inner box removed) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Target VM Assessment
                </Label>
                {selectedAssessment && selectedAssessment !== 'none' && (
                  <Badge variant="primary" appearance="light" size="xs">
                    Linked
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Exposures discovered during scans will route into this assessment ticket queue.
              </p>
              <Select
                value={selectedAssessment}
                options={assessmentOptions}
                onChange={(option) => {
                  if (option?.value === CREATE_ASSESSMENT_VALUE) {
                    setCreateAssessmentOpen(true);
                  } else {
                    setSelectedAssessment(option?.value);
                    handleSaveOrUpdateSettings({
                      selectedAssessment: option?.value,
                    });
                  }
                }}
                onSearchChange={(s) => setAssessmentSearch(s)}
                isSearching={assessmentsFetching}
                enableSearch={true}
                areOptionsNavigating={true}
                searchPlaceholder="Search assessments..."
                disabled={isDisabled}
              />
              <CreateAssessmentModel
                open={createAssessmentOpen}
                setOpen={setCreateAssessmentOpen}
              />
            </div>
          </CardContent>

          {/* Confirmation dialog for Auto-Sync */}
          <ConfirmDialog
            open={autoSyncConfirmOpen}
            setOpen={setAutoSyncConfirmOpen}
            onConfirm={handleConfirmAutoSync}
            confirmTitle="Enable Automatic Vulnerability Sync?"
            dialog="Auto-synchronization automatically creates and assigns VM tickets for all ASM exposures in real-time, which can generate high ticket volume. Are you sure you want to proceed?"
            confirmButton="Enable Sync"
          />
        </Card>

        {/* Audit & Auto-save Note */}
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/20 border border-border/50 text-xs text-muted-foreground">
          <Check className="size-4 shrink-0 text-primary" />
          <span>All configuration adjustments save automatically in real time.</span>
        </div>
      </div>
    </div>
  );
}
