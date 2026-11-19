import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Bell, Calendar, Clock, InfoIcon, Loader2, RefreshCcw, RefreshCw, RefreshCwOff, Save, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAimAdapterSettingsQuery, useUpdateAimAdapterSettingsMutation } from '@/services/asset-inventory/settingsApi';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Select from '@/components/custom/select';
import TimePicker from '@/components/custom/time-picker';
import { SettingsAdapterSkeletonLoader } from './skeletons/adapter-settings-skeleton';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';


function AdapterSettings() {
  // Fetch adapter settings data
  const { data: adapterSettingsData, isLoading, isError, error } = useGetAimAdapterSettingsQuery();

  const [updateAdapterSettings, { isLoading: isUpdatingAdapterSettings }] =
    useUpdateAimAdapterSettingsMutation();

  const [schedule, setSchedule] = useState('Daily');
  const [time, setTime] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [autoSync, setAutoSync] = useState(false);
  const [retryOnFailure, setRetryOnFailure] = useState(false);
  const [maxRetry, setMaxRetry] = useState('3');
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [notifyFailed, setNotifyFailed] = useState(false);

  const scheduleOptions = [
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Monthly', value: 'Monthly' },
  ];

  // Week day options - using day names to match API format
  const weekDaysOptions = [
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday', value: 'sunday' },
  ];
  const [weekDay, setWeekDay] = useState('monday');

  //   Month day
  const monthDayOptions = Array.from({ length: 31 }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1),
  }));
  const [monthDay, setMonthDay] = useState('1');

  const formattedTime = time ? format(time, 'hh:mm a') : '00:00 AM';

  const handleSaveAdapterSettings = (overrides = {}) => {
    // Convert time into hh:mm format
    const date = new Date(time);
    const convertedTime = date.toISOString().substring(11, 16);

    const payload = {
      adapter_refresh_schedule: {
        enabled: overrides.enabled !== undefined ? overrides.enabled : autoSync,
        frequency: schedule?.toLowerCase(),
        time: convertedTime,
        day_of_week: weekDay,
        day_of_month: monthDay.padStart(2, '0'),
      },
    };

    toast.promise(updateAdapterSettings(payload).unwrap(), {
      loading: 'Updating Adapter settings..',
      success: 'Adapter settings updated successfully',
      error: 'Error Updating adapter settings',
    });
  };

  // Populate already saved settings from adapter_refresh_schedule
  useEffect(() => {
    const settings = adapterSettingsData?.adapter_refresh_schedule;
    if (settings) {
      setAutoSync(settings.enabled || false);

      // Capitalize first letter of frequency for display
      if (settings.frequency) {
        setSchedule(
          settings.frequency.charAt(0).toUpperCase() + settings.frequency.slice(1)
        );
      }

      // Parse time from "HH:mm" format
      if (settings.time) {
        const [hours, minutes] = settings.time.split(':');
        const d = new Date();
        d.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        setTime(d);
      }

      // Set day of week for weekly schedule
      if (settings.day_of_week) {
        setWeekDay(settings.day_of_week);
      }

      // Set day of month for monthly schedule
      if (settings.day_of_month) {
        setMonthDay(String(parseInt(settings.day_of_month, 10)));
      }
    }
  }, [adapterSettingsData]);

  if (isError) return <ApiErrorHandler error={error} />;

  if (isLoading) {
    return <SettingsAdapterSkeletonLoader />;
  }

  return (
    <div className="py-4 mx-auto">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="font-semibold">
            Global Sync Configuration
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure default sync settings that apply to all adapters
          </p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2 text-base">
                {autoSync ? (
                  <RefreshCcw className="size-4" />
                ) : (
                  <RefreshCwOff className="size-4 transition-all duration-200" />
                )}{' '}
                Enable Auto Sync
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically sync adapters on schedule
              </p>
            </div>
            <Switch checked={autoSync} onCheckedChange={(checked) => {
              setAutoSync(checked);
              handleSaveAdapterSettings({ enabled: checked });
            }} />
          </div>
          <div className="space-y-2 w-70">
            <Label className="flex items-center gap-2">
              <Calendar className="size-4" /> Sync Schedule
            </Label>
            <Select
              enableSearch={false}
              disabled={!autoSync}
              value={schedule}
              options={scheduleOptions}
              onChange={(opt) => setSchedule(opt.value)}
              placeholder="Select schedule"
            />

            {/* Show week days when weekly is selected */}
            {schedule == 'Weekly' && (
              <>
                <Label className="flex items-center gap-2 mt-4">
                  <Calendar className="size-4" /> Select week day
                </Label>
                <Select
                  disabled={!autoSync}
                  value={weekDay}
                  options={weekDaysOptions}
                  onChange={(opt) => setWeekDay(opt?.value)}
                  placeholder="Select Weekday"
                />
              </>
            )}

            {/* Show month days when monthly is selected */}
            {schedule == 'Monthly' && (
              <>
                <Label className="flex items-center gap-2 mt-4">
                  <Calendar className="size-4" /> Select month day
                </Label>
                <Select
                  disabled={!autoSync}
                  value={monthDay}
                  options={monthDayOptions}
                  onChange={(opt) => setMonthDay(opt.value)}
                  placeholder="Select day of month"
                />
              </>
            )}

            <p className="text-xs text-muted-foreground">
              Current: {schedule} at {formattedTime}
            </p>
          </div>

          <div className="space-y-2 w-70">
            <Label className="flex items-center gap-2">
              <Clock className="size-4" /> Time
            </Label>
            <TimePicker
              disabled={!autoSync}
              value={time}
              onChange={(newTime) => setTime(newTime)}
            />
            <p className="text-xs text-muted-foreground">
              Format: HH:MM (12-hour)
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={() => handleSaveAdapterSettings()}
              disabled={!autoSync || isUpdatingAdapterSettings}
            >
              {isUpdatingAdapterSettings ? (
                <>
                  <Loader2 className=" animate-spin" />
                  Saving..
                </>
              ) : (
                <>
                  {' '}
                  <Save className="size-4" /> Save Global Configuration
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdapterSettings;