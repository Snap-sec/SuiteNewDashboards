import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleHelp } from 'lucide-react';
import { CustomTooltip } from '@/components/custom/tooltip';

export function ComplianceOverview({ data, remediation, isLoading }) {
  const complianceData = data || [];

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Compliance Framework Overview
          </CardTitle>
          <CustomTooltip text="Pass/Fail status across active compliance benchmarks">
            <CircleHelp className="h-3.5 w-3.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer" />
          </CustomTooltip>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-4 pt-2">
        <div className="space-y-3">
          {complianceData.map((f) => {
            const total = f.pass + f.fail;
            const pctPass = total === 0 ? 0 : (f.pass / total) * 100;
            const pctFail = total === 0 ? 0 : (f.fail / total) * 100;

            return (
              <div key={f.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-foreground">{f.name}</span>
                  <span className="text-muted-foreground">
                    {f.pass}/{total} passing ({Math.round(pctPass)}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary/50 overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${pctPass}%` }}
                  />
                  <div
                    className="h-full bg-rose-500 transition-all duration-300"
                    style={{ width: `${pctFail}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="rounded-lg bg-secondary/30 border border-border/50 p-3">
            <div className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              AVG REMEDIATION
            </div>
            <div className="text-lg font-bold text-foreground mt-1">{remediation?.avgRemediationDays || 0}d</div>
          </div>
          <div className="rounded-lg bg-secondary/30 border border-border/50 p-3">
            <div className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              SCAN COVERAGE
            </div>
            <div className="text-lg font-bold text-foreground mt-1">{remediation?.scanCoveragePercent || 0}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ComplianceOverview;
