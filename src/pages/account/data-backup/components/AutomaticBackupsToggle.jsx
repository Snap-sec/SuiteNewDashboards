import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export function AutomaticBackupsToggle({ autoBackup, onToggle }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between py-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Automatic Backups</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Snapsec Data will automatically capture and store backups on the schedule below
          </p>
        </div>
        <Switch checked={autoBackup} onCheckedChange={onToggle} />
      </CardContent>
    </Card>
  );
}
