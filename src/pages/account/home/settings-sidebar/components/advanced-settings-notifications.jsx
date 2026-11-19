import { useId } from 'react';
import { HexagonBadge } from '@/partials/common/hexagon-badge';
import { Mail } from 'lucide-react';
import { Link } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const AdvancedSettingsNotifications = ({ profile, handleUpdate }) => {
  const items = [
    {
      title: 'Email',
      description: 'Tailor Your Email Preferences.',
      badge: <Mail className="text-xl text-muted-foreground" />,
    },
    {
      title: 'Slack',
      description: 'Stay Updated on Slack.',
      badge: (
        <img
          src={toAbsoluteUrl('/media/brand-logos/slack.svg')}
          className="h-5"
          alt="image"
        />
      ),
    },
  ];

  // Get overall channel on/off (if any item under the channel is true)
  const isChecked = (channel) => {
    if (channel === 'email') {
      return Object.entries(profile?.notificationPreferences?.email || {}).some(([k, v]) => v === true);
    } else if (channel === 'slack') {
      return Object.entries(profile?.notificationPreferences?.slack || {}).some(([k, v]) => v === true);
    }
  };

  // Update all preferences + root boolean for email channel
  const handleNotificationPreferencesUpdate = (channel) => {
    const newChecked = !isChecked(channel);

    let payload;

    if (channel === "email") {
      payload = {
        emailNotifications: newChecked, // Add root flag
        notificationPreferences: {
          ...(profile?.notificationPreferences || {}),
          email: {
            critical: newChecked,
            high: newChecked,
            medium: newChecked,
            low: newChecked,
            remediationUpdates: newChecked,
            statusUpdates: newChecked,
          }
        }
      };
    } else if (channel === "slack") {
      payload = {
        notificationPreferences: {
          ...(profile?.notificationPreferences || {}),
          slack: {
            critical: newChecked,
            high: newChecked,
            medium: newChecked,
            low: newChecked,
            remediationUpdates: newChecked,
            statusUpdates: newChecked,
          }
        }
      };
    }

    handleUpdate(payload, "Notification settings");
  };

  // Update individual subsettings for channel; for email also consider updating root flag if desired
  const handleIndividualNotifications = (channel, update) => {
    const updatedChannelPrefs = {
      ...(profile?.notificationPreferences[channel] || {}),
      [update]: !profile?.notificationPreferences[channel][update]
    };

    let payload = {
      notificationPreferences: {
        ...(profile?.notificationPreferences || {}),
        [channel]: updatedChannelPrefs,
      }
    };

    // For email, update root flag if any are true
    if (channel === "email") {
      const newEmailNotifications = Object.values(updatedChannelPrefs).some(v => v);
      payload.emailNotifications = newEmailNotifications;
    }

    handleUpdate(payload, "Notification settings");
  };

  const renderItem = (item, index) => {
    const channel = item.title.toLowerCase();

    return (
      <div
        key={index}
        className="flex items-center justify-between flex-wrap grow border border-border rounded-xl gap-2 px-3.5 py-2.5"
      >
        <div className="flex items-center flex-wrap gap-3.5">
          <HexagonBadge
            stroke="stroke-input"
            fill="fill-muted/30"
            size="size-[50px]"
            badge={item.badge}
          />

          <div className="flex flex-col">
            <p className="text-sm font-medium text-mono hover:text-primary-active mb-px">
              {item.title}
            </p>
            <span className="text-sm text-secondary-foreground">
              {item.description}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {item.title === "Slack" ? (
            <Switch id="size-sm" size="sm" checked={false} onClick={() => toast.error("Not yet supported!")} />
          ) : (
            <Switch
              id="size-sm"
              size="sm"
              checked={isChecked(channel)}
              onClick={() => handleNotificationPreferencesUpdate(channel)}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader id="advanced_settings_notifications">
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="lg:py-7.5">
        <div className="flex flex-wrap items-center gap-5 mb-5 lg:mb-7">
          {items.map((item, index) => renderItem(item, index))}
        </div>
        <div className='w-full flex items-center gap-20 justify-between'>
          <div className="w-full flex flex-col gap-3.5 mb-7">
            <span className="text-base font-medium text-mono pb-0.5">
              Email notifications
            </span>
            <div className="flex flex-col items-start gap-4">
              <Label className="flex gap-2 items-center" onClick={() => handleIndividualNotifications("email", "critical")}>
                <Checkbox checked={profile?.notificationPreferences?.email?.critical} />
                Critical
              </Label>
              <Label className="flex gap-2 items-center" onClick={() => handleIndividualNotifications("email", "high")}>
                <Checkbox checked={profile?.notificationPreferences?.email?.high} />
                High
              </Label>
              <Label className="flex gap-2 items-center" onClick={() => handleIndividualNotifications("email", "medium")}>
                <Checkbox checked={profile?.notificationPreferences?.email?.medium} />
                Medium
              </Label>
              <Label className="flex gap-2 items-center" onClick={() => handleIndividualNotifications("email", "low")}>
                <Checkbox checked={profile?.notificationPreferences?.email?.low} />
                Low
              </Label>
              <Label className="flex gap-2 items-center" onClick={() => handleIndividualNotifications("email", "remediationUpdates")}>
                <Checkbox checked={profile?.notificationPreferences?.email?.remediationUpdates} />
                Remediation Updates
              </Label>
              <Label className="flex gap-2 items-center" onClick={() => handleIndividualNotifications("email", "statusUpdates")}>
                <Checkbox checked={profile?.notificationPreferences?.email?.statusUpdates} />
                Status Updates
              </Label>
            </div>
          </div>
          <div className="w-full flex flex-col gap-3.5 mb-7">
            <span className="text-base font-medium text-mono pb-0.5">
              Slack notifications
            </span>
            <div className="flex flex-col items-start gap-4">
              <Label className="flex gap-2 items-center">
                <Checkbox checked={profile?.notificationPreferences?.slack?.critical} />
                Critical
              </Label>
              <Label className="flex gap-2 items-center">
                <Checkbox checked={profile?.notificationPreferences?.slack?.high} />
                High
              </Label>
              <Label className="flex gap-2 items-center">
                <Checkbox checked={profile?.notificationPreferences?.slack?.medium} />
                Medium
              </Label>
              <Label className="flex gap-2 items-center">
                <Checkbox checked={profile?.notificationPreferences?.slack?.low} />
                Low
              </Label>
              <Label className="flex gap-2 items-center">
                <Checkbox checked={profile?.notificationPreferences?.slack?.remediationUpdates} />
                Remediation Updates
              </Label>
              <Label className="flex gap-2 items-center">
                <Checkbox checked={profile?.notificationPreferences?.slack?.statusUpdates} />
                Status Updates
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { AdvancedSettingsNotifications };
