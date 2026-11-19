import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/custom/status-badge';

export function RecentScansCard({ scans = [] }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (start, end) => {
    if (!start || !end) return '—';
    const diff = new Date(end) - new Date(start);
    if (diff < 0) return '—';
    const totalSeconds = Math.floor(diff / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;


    return `${s}s`;
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center gap-2 text-muted-foreground font-sans text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
            Completed
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center gap-2 text-muted-foreground font-sans text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
            Failed
          </div>
        );
      case 'running':
      case 'scanning':
        return (
          <div className="flex items-center gap-2 text-muted-foreground font-sans text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 animate-pulse" />
            Scanning
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 text-muted-foreground font-sans text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />
            Pending
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-muted-foreground font-sans text-sm capitalize">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
            {status || 'Unknown'}
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Recent Scans</CardTitle>
        <CardDescription>
          History of scheduled and on-demand scans on this fleet.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-muted-foreground bg-transparent border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Started</th>
                <th className="px-6 py-3 font-medium">Duration</th>
                <th className="px-6 py-3 font-medium">Findings</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {scans.length > 0 ? (
                scans.map((scan, idx) => (
                  <tr key={scan.id || idx} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">{formatDate(scan.createdAt)}</td>
                    <td className="px-6 py-4">{scan.duration ? scan.duration : formatDuration(scan.createdAt, scan.completedAt || scan.updatedAt)}</td>
                    <td className="px-6 py-4">
                      {scan.findings ? (
                        <div className="flex items-center gap-2 text-xs">
                          {scan.findings.critical > 0 && <span className="px-1.5 py-0.5 rounded bg-destructive/15 text-destructive font-semibold">{scan.findings.critical} crit</span>}
                          {scan.findings.high > 0 && <span className="px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-500 font-semibold">{scan.findings.high} high</span>}
                          {scan.findings.medium > 0 && <span className="px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-500 font-semibold">{scan.findings.medium} med</span>}
                          {scan.findings.low > 0 && <span className="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-500 font-semibold">{scan.findings.low} low</span>}
                          {(!scan.findings.critical && !scan.findings.high && !scan.findings.medium && !scan.findings.low) && <span className="text-muted-foreground">No findings</span>}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={scan.status === 'running' ? 'scanning' : scan.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">
                    No recent scans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
