import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';




const AdvancedSettingsPreferences = ({ profile, handleUpdate }) => {
  const defaults = {
    language: "1",
    timezone: "4",
    currency: "7"
  };

  const [payload, setPayload] = useState({
    language: profile?.preferences?.language || defaults.language,
    timezone: profile?.preferences?.timezone || defaults.timezone,
    currency: profile?.preferences?.currency || defaults.currency
  });

  const hasChanges = 
    payload.language !== (profile?.preferences?.language || defaults.language) ||
    payload.timezone !== (profile?.preferences?.timezone || defaults.timezone) ||
    payload.currency !== (profile?.preferences?.currency || defaults.currency);

  return (
    <Card>
      <CardHeader id="advanced_settings_preferences">
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 lg:py-7.5">
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">Language</Label>
          <div className="grow">
            <Select 
              value={payload.language} 
              onValueChange={(val) => setPayload(prev => ({ ...prev, language: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">American English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">Time zone</Label>
          <div className="grow">
            <Select 
              value={payload.timezone} 
              onValueChange={(val) => setPayload(prev => ({ ...prev, timezone: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">
                    GMT -5:00 - Eastern Time(US & Canada)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 mb-2">
          <Label className="flex w-full max-w-56">Currency</Label>
          <div className="grow">
            <Select 
              value={payload.currency} 
              onValueChange={(val) => setPayload(prev => ({ ...prev, currency: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">United States Dollar (USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={() => handleUpdate({ preferences: payload }, "Preferences")}
            disabled={!hasChanges}
          >
            <Save className="size-4" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { AdvancedSettingsPreferences };
