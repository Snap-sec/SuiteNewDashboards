import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function OrganizationTab({
  orgName,
  orgWebsite,
  isLocked,
  onOrgNameChange,
  onOrgWebsiteChange,
  onIsLockedChange,
  onOrgNameBlur,
  onOrgWebsiteBlur,
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* <h2 className="text-base font-semibold text-foreground">Organization</h2> */}

      {/* <div className="border-t border-border/30 pt-5 flex flex-col gap-5"> */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="org-name" className="text-sm font-medium">Organization name</Label>
          <Input
            id="org-name"
            value={orgName}
            onChange={(e) => onOrgNameChange(e.target.value)}
            onBlur={onOrgNameBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.target.blur();
              }
            }}
            placeholder="Enter organization name"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="org-website" className="text-sm font-medium">Website</Label>
          <Input
            id="org-website"
            value={orgWebsite}
            onChange={(e) => onOrgWebsiteChange(e.target.value)}
            onBlur={onOrgWebsiteBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.target.blur();
              }
            }}
            placeholder="https://example.com"
          />
        </div>

        <div className="border-t border-border/30 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <Lock className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Lock organization</p>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-sm">
                  Members and service accounts won't be able to log in while this organization is locked.
                </p>
              </div>
            </div>
            <Switch checked={isLocked} onCheckedChange={onIsLockedChange} className="shrink-0 mt-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
