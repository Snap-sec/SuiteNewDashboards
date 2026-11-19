import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export function ScanOptionsCard({ options, setOptions }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Scan Options</CardTitle>
        <CardDescription>
          Fine-tune how the agent traverses the filesystem.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="divide-y">
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Follow symbolic links</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Traverse into directories referenced by symlinks.
              </p>
            </div>
            <Switch
              checked={options.followSymlinks}
              onCheckedChange={(val) => setOptions({ ...options, followSymlinks: val })}
            />
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Scan inside archives</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Inspect contents of .zip, .tar, and .jar files for vulnerable dependencies.
              </p>
            </div>
            <Switch
              checked={options.scanArchives}
              onCheckedChange={(val) => setOptions({ ...options, scanArchives: val })}
            />
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Skip files over 500 MB</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Avoid scanning unusually large files to keep scans fast.
              </p>
            </div>
            <Switch
              checked={options.skipLargeFiles}
              onCheckedChange={(val) => setOptions({ ...options, skipLargeFiles: val })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
