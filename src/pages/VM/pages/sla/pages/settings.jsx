import { useEffect, useId, useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import PageHeading from '@/components/custom/page-heading';
import { Card } from '../../../../../components/ui/card';
import {
  useCreateVmSLAMutation,
  useGetVmSLAQuery,
} from '../../../../../services/vm/slaApi';
import { Helmet } from 'react-helmet';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';

function Settings() {
  const idFri = useId();
  const idSat = useId();
  const idSun = useId();

  // Form state for SLA days
  const [criticalDays, setCriticalDays] = useState('');
  const [highDays, setHighDays] = useState('');
  const [mediumDays, setMediumDays] = useState('');
  const [lowDays, setLowDays] = useState('');

  // Weekend checkbox states
  const [includeFriday, setIncludeFriday] = useState(false);
  const [includeSaturday, setIncludeSaturday] = useState(false);
  const [includeSunday, setIncludeSunday] = useState(false);

  // Holiday calendar iCal URL
  const [icalUrl, setIcalUrl] = useState('');
  const [icalUrlError, setIcalUrlError] = useState('');

  // Hooks
  const [createSLA, { isLoading: isCreating }] = useCreateVmSLAMutation();
  const { data: slaData, refetch, isLoading, error, isError } = useGetVmSLAQuery();

  // Populate form data from fetched API
  useEffect(() => {
    if (slaData) {
      setCriticalDays(String(slaData?.data?.critical ?? ''));
      setHighDays(String(slaData?.data?.high ?? ''));
      setMediumDays(String(slaData?.data?.medium ?? ''));
      setLowDays(String(slaData?.data?.low ?? ''));

      const weekendDays = slaData?.data?.weekendDays || [];
      setIncludeFriday(weekendDays.includes(5));
      setIncludeSaturday(weekendDays.includes(6));
      setIncludeSunday(weekendDays.includes(0));

      setIcalUrl(slaData?.data?.iCalUrl || '');
    }
  }, [slaData]);

  // Validate iCal URL (optional but must be a URL if provided)
  const validateIcalUrl = (value) => {
    if (!value) { setIcalUrlError(''); return true; }
    try { new URL(value); setIcalUrlError(''); return true; } catch {
      setIcalUrlError('Please enter a valid URL (e.g. https://calendar.example.com/holidays.ics)');
      return false;
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    // e.preventDefault();

    const payload = {
      critical: Number(criticalDays),
      high: Number(highDays),
      medium: Number(mediumDays),
      low: Number(lowDays),
      weekendDays: [
        ...(includeFriday ? [5] : []),
        ...(includeSaturday ? [6] : []),
        ...(includeSunday ? [0] : []),
      ],
      iCalUrl: icalUrl,
    };

    try {
      toast.promise(createSLA(payload).unwrap(), {
        loading: 'Creating SLA...',
        success: 'SLA created successfully',
        error: 'Failed to create SLA',
      });
      refetch();
    } catch (err) {
      console.error('Failed to create SLA:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Helmet>
          <title>UniRisk | SLA Settings</title>
        </Helmet>

        {/* Header Skeleton */}
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-7 w-32 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>

        <div className="flex flex-col gap-6">
          {/* SLA Fields Card Skeleton */}
          <Card className="p-4 rounded-lg flex flex-col gap-4">
            <Skeleton className="h-5 w-40 rounded-md" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-36 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-44 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </Card>

          {/* Weekend Config Card Skeleton */}
          <Card className="p-4 rounded-lg flex flex-col gap-4">
            <Skeleton className="h-5 w-44 rounded-md" />
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4 rounded-sm" />
                <Skeleton className="h-4 w-60 rounded-md" />
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4 rounded-sm" />
                <Skeleton className="h-4 w-64 rounded-md" />
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4 rounded-sm" />
                <Skeleton className="h-4 w-60 rounded-md" />
              </div>
            </div>
          </Card>

          {/* Holiday Exceptions Card Skeleton */}
          <Card className="p-4 rounded-lg flex flex-col gap-4">
            <Skeleton className="h-5 w-36 rounded-md" />
            <div className="flex flex-col gap-2 mt-2">
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </Card>

          {/* Footer Save Button Skeleton */}
          <div className="flex justify-end mt-2">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <div>
      <Helmet>
        <title>UniRisk | SLA Settings</title>
      </Helmet>

      <PageHeading
        title="SLA Setup"
        description="Configure Service Level Agreements (SLAs) for vulnerability remediation based on severity levels."
      />

      <div className="flex flex-col gap-6 ">
        {/* SLA Fields */}
        <Card className="p-4 rounded-lg">
          <h2 className="text-base font-semibold leading-none">
            SLA Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="criticalDays">Critical Severity (Days)</label>
              <Input
                type="number"
                id="criticalDays"
                value={criticalDays}
                onChange={(e) => setCriticalDays(e.target.value)}
                min={0}
                placeholder="e.g., 1"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="highDays">High Severity (Days)</label>
              <Input
                type="number"
                id="highDays"
                value={highDays}
                onChange={(e) => setHighDays(e.target.value)}
                min={0}
                placeholder="e.g., 3"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="mediumDays">Medium Severity (Days)</label>
              <Input
                type="number"
                id="mediumDays"
                value={mediumDays}
                onChange={(e) => setMediumDays(e.target.value)}
                min={0}
                placeholder="e.g., 7"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="lowDays">Low Severity (Days)</label>
              <Input
                type="number"
                id="lowDays"
                value={lowDays}
                onChange={(e) => setLowDays(e.target.value)}
                min={0}
                placeholder="e.g., 14"
              />
            </div>
          </div>
        </Card>

        {/* Weekend Config */}
        <Card className="p-4 rounded-lg">
          <h2 className="text-base font-semibold leading-none">
            Weekend Configuration
          </h2>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={idFri}
                checked={includeFriday}
                onCheckedChange={(val) => setIncludeFriday(!!val)}
              />
              <Label htmlFor={idFri}>Include Fridays In SLA Calculation</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={idSat}
                checked={includeSaturday}
                onCheckedChange={(val) => setIncludeSaturday(!!val)}
              />
              <Label htmlFor={idSat}>
                Include Saturdays In SLA Calculation
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={idSun}
                checked={includeSunday}
                onCheckedChange={(val) => setIncludeSunday(!!val)}
              />
              <Label htmlFor={idSun}>Include Sundays In SLA Calculation</Label>
            </div>
          </div>
        </Card>

        {/* Holiday Calendar */}
        <Card className="p-4 rounded-lg">
          <h2 className="text-base font-semibold leading-none">
            Holiday Exceptions
          </h2>
          <div className="flex flex-col gap-1 mt-4">
            <label htmlFor="icalUrl">Import Calendar (iCal)</label>
            <Input
              type="url"
              id="icalUrl"
              value={icalUrl}
              onChange={(e) => { setIcalUrl(e.target.value); validateIcalUrl(e.target.value); }}
              onBlur={(e) => validateIcalUrl(e.target.value)}
              placeholder="https://calendar.example.com/holidays.ics"
              className={icalUrlError ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {icalUrlError && (
              <p className="text-xs text-destructive mt-1">{icalUrlError}</p>
            )}
          </div>
        </Card>

        <div className="flex justify-end">
          <ButtonWithConfirm
            className="w-full"
            variant="primary"
            confirmVariant="info"
            confirmTitle="Save SLA Configuration"
            onConfirm={() => {
              if (isCreating) return;
              if (!validateIcalUrl(icalUrl)) return;
              handleSubmit();
            }}
            confirm={true}
            disabled={isCreating || !!icalUrlError}
            confirmButton={
              <Button variant="primary" disabled={isCreating}>
                Proceed
              </Button>
            }
            cancelButton={<Button variant="outline">Cancel</Button>}
          >
            <Save /> {isCreating ? 'Saving...' : 'Save SLA Configuration'}
          </ButtonWithConfirm>
        </div>
      </div>
    </div>
  );
}

export default Settings;
