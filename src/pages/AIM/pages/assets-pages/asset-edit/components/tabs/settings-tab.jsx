import { Monitor, MonitorX, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardHeading,
  CardTitle,
} from '@/components/ui/card';
import { EmptyScreen } from '../../../../../../../components/common/empty-screen';

export function SettingsTab({ asset }) {
  const users = asset?.workstation?.users || [];

  if (!asset?.workstation) {
    return <EmptyScreen />;
  }

  //   Format Hardware info
  const hw = asset?.workstation?.hardware || {};
  const formattedHardwareInfo = [
    { label: 'CPU Model', value: hw.cpuModel },
    { label: 'CPU Cores', value: hw.cpuCores },
    { label: 'CPU Threads', value: hw.cpuThreads },
    {
      label: 'CPU Frequency',
      value: hw.cpuFrequency ? `${hw.cpuFrequency} MHz` : null,
    },
    { label: 'RAM Total', value: hw.ramTotal ? `${hw.ramTotal} MB` : null },
    {
      label: 'RAM Available',
      value: hw.ramAvailable ? `${hw.ramAvailable} MB` : null,
    },
    { label: 'Disk Total', value: hw.diskTotal ? `${hw.diskTotal} MB` : null },
  ];

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="grid grid-cols-12 gap-6">
        {/* OS information Card*/}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardHeading>
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <CardTitle>OS Information</CardTitle>
                </div>
              </CardHeading>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Version
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {asset?.workstation?.os?.version || 'N/A'}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Architecture
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {asset?.workstation?.os?.architecture || 'N/A'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Users Card*/}
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader>
              <CardHeading>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <CardTitle>System Users</CardTitle>
                </div>
              </CardHeading>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b transition-colors border-border/50">
                      <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">
                        UID
                      </th>
                      <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">
                        Username
                      </th>
                      <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">
                        Groups
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <tr
                          key={index}
                          className="border-b transition-colors hover:bg-muted/30 border-border/50"
                        >
                          <td className="p-4 px-6 align-middle text-left font-mono text-xs text-muted-foreground">
                            {user.uid}
                          </td>
                          <td className="p-4 px-6 align-middle font-medium flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                              <User className="h-3 w-3 text-muted-foreground" />
                            </div>
                            {user.username}
                          </td>
                          <td className="p-4 px-6 align-middle">
                            {user.groups && user.groups.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {user.groups.map((group, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-[10px] py-0"
                                  >
                                    {group}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">
                                -
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-8 text-center text-muted-foreground italic tracking-wide"
                        >
                          No Data Available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hardware information Card*/}
        <div className="col-span-12">
          <Card className="h-full">
            <CardHeader>
              <CardHeading>
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <CardTitle>Hardware Information</CardTitle>
                </div>
              </CardHeading>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
                {formattedHardwareInfo.map(({ label, value }) => (
                  <div key={label} className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {label}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {value ?? 'N/A'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Storage Card */}
              <div className="col-span-12 mt-3">
                <Card>
                  <CardHeader>
                    <CardHeading>
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                        <CardTitle>Storage</CardTitle>
                      </div>
                    </CardHeading>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b transition-colors border-border/50">
                            <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">
                              Device
                            </th>
                            <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">
                              Type
                            </th>
                            <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">
                              Size
                            </th>
                            <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">
                              Mount Point
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {(asset?.workstation?.hardware?.storage || [])
                            .length > 0 ? (
                            asset?.workstation?.hardware?.storage?.map(
                              (disk, index) => (
                                <tr
                                  key={index}
                                  className="border-b transition-colors hover:bg-muted/30 border-border/50"
                                >
                                  <td className="p-4 px-6 align-middle font-mono text-xs text-muted-foreground">
                                    {disk.device}
                                  </td>
                                  <td className="p-4 px-6 align-middle">
                                    <Badge
                                      variant="outline"
                                      className="font-mono text-[10px] py-0"
                                    >
                                      {disk.type}
                                    </Badge>
                                  </td>
                                  <td className="p-4 px-6 align-middle">
                                    <Badge
                                      variant="secondary"
                                      className="font-mono text-xs"
                                    >
                                      {disk.size_gb} GB
                                    </Badge>
                                  </td>
                                  <td className="p-4 px-6 align-middle font-mono text-xs">
                                    {disk.mountpoint}
                                  </td>
                                </tr>
                              ),
                            )
                          ) : (
                            <tr>
                              <td
                                colSpan={4}
                                className="p-8 text-center text-muted-foreground italic tracking-wide"
                              >
                                No Data Available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
