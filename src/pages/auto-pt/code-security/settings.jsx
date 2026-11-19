import { WEEKDAY_OPTIONS } from '@/pages/auto-pt/pentest-create/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, isValid, parse } from 'date-fns';
import { Zap } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  useGetCodeSecuritySettingsQuery,
  useUpdateCodeSecuritySettingsMutation,
} from '@/services/auto-pt/settingsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import PageHeading from '@/components/custom/page-heading';
import ShadcnDatePicker from '@/components/custom/shadcn-date-picker';
import ShadcnTimePicker from '@/components/custom/shadcn-time-picker';

const frequencies = [
  { value: 'once', label: 'Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];
const schema = z
  .object({
    scanType: z.enum(['sast', 'sca', 'both'], {
      message: 'Select a scanning type.',
    }),
    defaultBranch: z.string().trim(),
    frequency: z.enum(['immediate', 'once', 'daily', 'weekly', 'monthly']),
    date: z.string(),
    weekday: z.string(),
    time: z.string(),
    dayOfMonth: z.string(),
  })
  .superRefine((values, context) => {
    const addError = (field, message) =>
      context.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
    if (
      values.frequency !== 'immediate' &&
      !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(values.time)
    ) {
      addError('time', 'Select a valid scan time.');
    }
    if (values.frequency === 'once') {
      const date = parse(values.date, 'yyyy-MM-dd', new Date());
      if (!isValid(date) || format(date, 'yyyy-MM-dd') !== values.date)
        addError('date', 'Select a valid scan date.');
    }
    if (
      values.frequency === 'weekly' &&
      !WEEKDAY_OPTIONS.some(({ value }) => value === values.weekday)
    ) {
      addError('weekday', 'Select a weekday.');
    }
    if (values.frequency === 'monthly') {
      const day = Number(values.dayOfMonth);
      if (!Number.isInteger(day) || day < 1 || day > 31)
        addError('dayOfMonth', 'Select a day between 1 and 31.');
    }
  });

function formValues(settings) {
  const services = settings.services ?? [];
  const date = String(settings.date ?? '').trim();
  const frequency = settings.scan_frequency ?? 'weekly';
  return {
    defaultBranch: String(settings.default_branch ?? '').trim(),
    date: /^\d{4}-\d{2}-\d{2}(?:$|T)/.test(date) ? date.slice(0, 10) : '',
    weekday: String(settings.weekday ?? '')
      .trim()
      .toLowerCase(),
    time: String(settings.time ?? '').trim(),
    dayOfMonth:
      settings.day_of_month == null ? '' : String(settings.day_of_month),
    scanType:
      services.includes('sast') && services.includes('sca')
        ? 'both'
        : services.includes('sast')
          ? 'sast'
          : services.includes('sca')
            ? 'sca'
            : '',
    frequency:
      frequency === 'immediate' ||
      frequencies.some(({ value }) => value === frequency)
        ? frequency
        : '',
  };
}

function SettingsForm({ settings }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: formValues(settings),
    mode: 'onChange',
  });
  const frequency = useWatch({ control: form.control, name: 'frequency' });
  const [save, { isLoading: saving }] = useUpdateCodeSecuritySettingsMutation();
  const [setImmediate, { isLoading: applyingImmediate }] =
    useUpdateCodeSecuritySettingsMutation();
  const isLoading = saving || applyingImmediate;

  const onSubmit = async (values) => {
    if (isLoading) return;
    const body = {
      services:
        values.scanType === 'both' ? ['sca', 'sast'] : [values.scanType],
      scan_frequency: values.frequency,
      default_branch: values.defaultBranch,
      ...(values.frequency !== 'immediate' ? { time: values.time.trim() } : {}),
      ...(values.frequency === 'once' ? { date: values.date } : {}),
      ...(values.frequency === 'weekly' ? { weekday: values.weekday } : {}),
      ...(values.frequency === 'monthly'
        ? { day_of_month: Number(values.dayOfMonth) }
        : {}),
    };
    try {
      await save(body).unwrap();
      // Successful saves establish the form baseline; partial responses and
      // background refetches must not clear the submitted schedule fields.
      form.reset(values);
      toast.success('Code Security settings saved');
    } catch (err) {
      toast.error(
        err?.data?.message || 'Unable to save Code Security settings.',
      );
    }
  };

  const handleImmediate = async () => {
    if (isLoading) return;
    try {
      await setImmediate({ scan_frequency: 'immediate' }).unwrap();
      form.resetField('frequency', { defaultValue: 'immediate' });
      toast.success('Immediate scan frequency saved');
    } catch (err) {
      toast.error(
        err?.data?.message || 'Unable to save immediate scan frequency.',
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <fieldset disabled={isLoading} className="min-w-0 space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Scanning Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choose the security scans to run across your organization's code
                repositories.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="scanType"
                  render={({ field }) => (
                    <FormItem className="max-w-sm">
                      <FormLabel>Scanning type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select scanning type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sast">
                            SAST — Source code analysis
                          </SelectItem>
                          <SelectItem value="sca">
                            SCA — Dependency analysis
                          </SelectItem>
                          <SelectItem value="both">
                            Both SAST and SCA
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultBranch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default branch</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. main"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Scan Schedule</CardTitle>
              <Button
                type="button"
                variant="outline"
                onClick={handleImmediate}
                disabled={isLoading}
              >
                <Zap className="size-4 text-amber-500" />
                {applyingImmediate ? 'Applying…' : 'Run Immediately'}
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem className="max-w-sm">
                    <FormLabel>Frequency</FormLabel>
                    <Select
                      value={field.value === 'immediate' ? '' : field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {frequencies.map((frequency) => (
                          <SelectItem
                            key={frequency.value}
                            value={frequency.value}
                          >
                            {frequency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    {field.value === 'immediate' && (
                      <p className="text-sm text-muted-foreground">
                        Current scan frequency: Immediately.
                      </p>
                    )}
                  </FormItem>
                )}
              />
              {frequency === 'once' && (
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scan date</FormLabel>
                      <FormControl>
                        <ShadcnDatePicker {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {frequency === 'weekly' && (
                <FormField
                  control={form.control}
                  name="weekday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weekday</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select weekday" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {WEEKDAY_OPTIONS.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {frequency === 'monthly' && (
                <FormField
                  control={form.control}
                  name="dayOfMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day of month</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger ref={field.ref} onBlur={field.onBlur}>
                            <SelectValue placeholder="Select day of month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 31 }, (_, index) => {
                            const day = String(index + 1);
                            return (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {frequencies.some(({ value }) => value === frequency) && (
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scan time</FormLabel>
                      <FormControl>
                        <ShadcnTimePicker {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>
        </fieldset>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading || !form.formState.isDirty}
            onClick={() => {
              form.reset();
            }}
          >
            Discard Changes
          </Button>
          <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
            {isLoading ? 'Saving…' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function CodeSecuritySettings() {
  const { data, isLoading, error, refetch } = useGetCodeSecuritySettingsQuery();
  return (
    <div className="p-4 space-y-5">
      <Helmet>
        <title>Strike | Code Security - Settings</title>
      </Helmet>
      <PageHeading
        title="Code Security Settings"
        description="Set organization-wide scanning preferences and the default scan schedule for Code Security."
      />
      <AuthorityGuard forbidRoles={['Auditor']} showAccessDenied>
        {isLoading ? (
          <div className="space-y-5">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : error || !data?.data ? (
          <div role="alert" className="space-y-3">
            <p className="text-sm text-destructive">
              {error?.data?.message || 'Unable to load Code Security settings.'}
            </p>
            <Button variant="outline" onClick={refetch}>
              Retry
            </Button>
          </div>
        ) : (
          <SettingsForm settings={data.data} />
        )}
      </AuthorityGuard>
    </div>
  );
}
