import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import DatePicker from '@/components/custom/date-picker';

export function LicenseTab({ licenseExpiry, onLicenseExpiryChange }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">License</h2>
        {(() => {
          const isExpired = licenseExpiry ? new Date(licenseExpiry) < new Date() : false;
          return isExpired ? (
            <Badge variant="destructive" appearance="outline" className="text-xs">
              ● Expired
            </Badge>
          ) : (
            <Badge variant="success" appearance="outline" className="text-xs">
              ● Active
            </Badge>
          );
        })()}
      </div>

      <div className="border-t border-border/30 pt-5">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium text-foreground">License expiry</Label>
          <DatePicker value={licenseExpiry} onChange={onLicenseExpiryChange} />
          <p className="text-xs text-muted-foreground mt-1">
            Access to all licensed products ends at midnight UTC on this date.
          </p>
        </div>
      </div>
    </div>
  );
}
