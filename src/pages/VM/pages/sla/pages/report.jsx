import { useEffect, useState } from "react";
import { Loader2, Plus, Save, Send, X } from 'lucide-react';
import { Helmet } from "react-helmet";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useCreateVmSLAReportConfigMutation, useGetVmSLAReportConfigQuery, useSendVmSLAReportConfigMutation } from '@/services/vm/slaApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import PageHeading from '@/components/custom/page-heading';
import Select from "@/components/custom/select";
import TimePicker from '@/components/custom/time-picker';
import ApiErrorHandler from "../../../../../components/common/api-error-handler";


function convertISOToDate(isoString) {
  if (!isoString) return null;

  // Handle HH:MM format
  if (/^\d{2}:\d{2}$/.test(isoString)) {
    const [hours, minutes] = isoString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  // Handle ISO format
  return new Date(isoString);
}

function convertDateToISO(dateObj) {
  if (!dateObj) return null;
  return new Date(dateObj).toISOString();
}

// Day number <-> string mapping
const dayNumberToString = {
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
  0: "sunday"
};

const dayStringToNumber = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 0
};




function Report() {

  const [time, setTime] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [weekday, setWeekday] = useState(null);
  const [enabled, setEnabled] = useState(false); // Added enabled state

  const [emailInput, setEmailInput] = useState("");
  const [emailInputError, setEmailInputError] = useState("");
  const [emails, setEmails] = useState([]);

  const { data, isLoading, error, isError } = useGetVmSLAReportConfigQuery();
  const [saveConfig, { isLoading: saving }] = useCreateVmSLAReportConfigMutation();
  const [sendReport, { isLoading: sending }] = useSendVmSLAReportConfigMutation();

  useEffect(() => {
    if (!data?.data) return;

    const config = data.data;

    setEmails(config.recipients || []);
    setFrequency(config.frequency || null);
    setEnabled(config.enabled || false); // Load enabled state

    // Convert dayOfWeek number → string
    setWeekday(dayNumberToString[config.dayOfWeek] || null);

    setTime(convertISOToDate(config.sendTime));
  }, [data]);

  const frequencyOptions = [
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
  ];

  const weekdayOptions = [
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" },
  ];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmailInput = (value) => {
    if (!value) { setEmailInputError(''); return true; }
    if (!emailRegex.test(value)) {
      setEmailInputError('Please enter a valid email address');
      return false;
    }
    setEmailInputError('');
    return true;
  };

  const handleAddEmail = () => {
    const trimmed = emailInput.trim();

    if (!trimmed) {
      setEmailInputError('Email cannot be empty');
      return;
    }

    if (!validateEmailInput(trimmed)) return;

    if (emails.includes(trimmed)) {
      setEmailInputError('This email is already added');
      return;
    }

    setEmails(prev => [...prev, trimmed]);
    setEmailInput('');
    setEmailInputError('');
    toast.success(`Email added: ${trimmed}`);
  };


  const handleRemoveEmail = (index) => {
    const removedEmail = emails[index];
    setEmails(prev => prev.filter((_, i) => i !== index));
    toast.info(`Email removed: ${removedEmail}`);
  };

  const handleSave = async () => {
    // Validate required fields
    if (!frequency) {
      toast.error("Please select a frequency");
      return;
    }

    if (frequency === "Weekly" && !weekday) {
      toast.error("Please select a weekday for weekly reports");
      return;
    }

    if (!time) {
      toast.error("Please select a time");
      return;
    }

    if (emails.length === 0) {
      toast.error("Please add at least one recipient email");
      return;
    }

    const payload = {
      enabled: enabled, // Include enabled in payload
      recipients: emails,
      frequency: frequency,
      sendTime: convertDateToISO(time),

      // Convert weekday string → number for API
      dayOfWeek: frequency === "Weekly" ? dayStringToNumber[weekday] : null,
    };

    console.log("SENDING PAYLOAD:", payload);

    try {
      await saveConfig(payload).unwrap();
      toast.success("Configuration saved successfully");
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error?.data?.message || "Failed to save configuration");
    }
  };

  const handleSendNow = async () => {
    try {
      const tId = toast.loading("Saving configuration...");
      await handleSave();

      // Trigger the send report API
      await sendReport().unwrap();

      toast.success("Report sent successfully to all recipients");
      toast.dismiss(tId)
    } catch (error) {
      console.error("Send error:", error);
      toast.error(error?.data?.message || "Failed to send report");
    }
  };




  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Helmet>
          <title>UniRisk | SLA Report Configuration</title>
        </Helmet>
        
        {/* Header Skeleton */}
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-7 w-48 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>

        {/* Recipients Card Skeleton */}
        <div className="border rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <div className="flex justify-between items-center bg-muted px-3 py-2 rounded-md">
              <Skeleton className="h-4 w-48 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <div className="flex justify-between items-center bg-muted px-3 py-2 rounded-md">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>
        </div>

        {/* Schedule Card Skeleton */}
        <div className="border rounded-lg p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20 rounded-md" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12 rounded-md" />
              <Skeleton className="h-6 w-10 rounded-full" />
            </div>
          </div>

          {/* Frequency */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Weekday (optional weekly selector) */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Time */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-12 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
            <Skeleton className="h-10 w-40 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if(isError) return <ApiErrorHandler error={error} />
  


  return (
    <div className="flex flex-col ">
      <Helmet>
        <title>UniRisk | SLA Report Configuration</title>
      </Helmet>
      <div className="flex items-center justify-between gap-4">
        <PageHeading
          title="Reports Configuration"
          description="Set up and manage automated SLA reports to be sent to stakeholders."
        />
      </div>

      {/* Recipients */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm">
            Recipients <span className="text-destructive">*</span>
          </p>

          <ButtonWithConfirm
            disabled={sending}
            variant="link"
            className="h-auto p-0 text-primary underline decoration-dotted underline-offset-4"
            confirm={true}
            dialog="Are you sure want to send test email?"
            confirmVariant="info"
            confirmTitle="Send Test Email"
            onConfirm={() => {
              if (sending) return;
              handleSendNow();
            }}
            confirmButton={
              <Button variant="primary" disabled={sending}>
                Send
              </Button>
            }
            cancelButton={<Button variant="outline">Cancel</Button>}
          >
            {sending ? 'Sending...' : 'Send Test Email'}
          </ButtonWithConfirm>
        </div>

        <div className="flex flex-col gap-2 mt-3">
          {emails.map((email, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-muted px-3 py-2 rounded-md text-sm"
            >
              <span>{email}</span>
              <button
                onClick={() => handleRemoveEmail(index)}
                className="text-muted-foreground hover:text-red-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1 mt-3">
          <div className="flex items-center gap-4">
            <Input
              type="email"
              placeholder="email@company.com"
              value={emailInput}
              onChange={(e) => { setEmailInput(e.target.value); validateEmailInput(e.target.value); }}
              onBlur={(e) => validateEmailInput(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddEmail();
                }
              }}
              className={emailInputError ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            <Button variant="secondary" onClick={handleAddEmail}>
              <Plus /> Add
            </Button>
          </div>
          {emailInputError && (
            <p className="text-xs text-destructive">{emailInputError}</p>
          )}
        </div>
      </div>

      {/* Schedule */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="font-medium text-sm">Schedule</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {enabled ? 'Enabled' : 'Disabled'}
            </span>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
        </div>

        {/* Frequency */}
        <div className="flex flex-col gap-1 mt-2">
          <p className="text-sm text-muted-foreground">
            Frequency <span className="text-destructive">*</span>
          </p>

          <Select
            placeholder="Select frequency"
            options={frequencyOptions}
            searchPlaceholder="Search Frequency"
            value={frequency}
            onChange={(selected) => {
              setFrequency(selected.value);
              toast.info(`Frequency set to: ${selected.label}`);
              if (selected.value !== 'Weekly') {
                setWeekday(null);
                toast.info('Weekday cleared');
              }
            }}
          />
        </div>

        {/* Weekday (only for Weekly) */}
        {frequency === 'Weekly' && (
          <div className="flex flex-col gap-1 mt-4">
            <p className="text-sm text-muted-foreground">
              Weekday <span className="text-destructive">*</span>
            </p>

            <Select
              placeholder="Select weekday"
              options={weekdayOptions}
              value={weekday}
              searchPlaceholder="Search Weekday"
              onChange={(selected) => {
                setWeekday(selected.value);
                toast.info(`Weekday set to: ${selected.label}`);
              }}
            />
          </div>
        )}

        {/* Time */}
        <div className="flex flex-col gap-1 mt-4">
          <p className="text-sm text-muted-foreground">
            Time <span className="text-destructive">*</span>
          </p>

          <TimePicker
            value={time}
            onChange={(t) => {
              setTime(t);
              toast.info(`Time set to: ${t ? t.toLocaleTimeString() : 'None'}`);
            }}
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex justify-end gap-2 text-sm mt-4">
            <p className="font-medium">Last Send :</p>
            <p>
              {data?.data?.lastSent
                ? format(new Date(data.data.lastSent), 'dd MMM yyyy, hh:mm a').toLowerCase()
                : 'Never'}
            </p>
          </div>

          <Button className="mt-4" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className=" animate-spin" /> : <Save />}
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Report;