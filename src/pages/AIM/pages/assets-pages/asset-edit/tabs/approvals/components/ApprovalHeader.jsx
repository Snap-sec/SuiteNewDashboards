import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Archive } from 'lucide-react';

const StatBox = ({ label, count, colorClass }) => (
  <div className="border border-dashed rounded-lg px-4 py-2 flex flex-col items-center min-w-[90px] bg-muted/30">
    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-tight">
      {label}
    </span>
    <span className={`text-lg font-bold ${colorClass} leading-tight`}>
      {count}
    </span>
  </div>
);

const ApprovalHeader = ({ asset, allApproved, onDecommission, pending, accepted, rejected }) => {
  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-mono">
              AST-2024-0891
            </Badge>
            <Badge variant="success" className="bg-green-500/10 text-green-500 border-green-500/20">
              ACTIVE
            </Badge>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">
              {asset?.value || 'api.bugcrowd.com'}
            </h1>
            <p className="text-muted-foreground text-sm">
              Physical Hardware · Infrastructure · Data Center A – Rack 12
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end justify-between gap-4">
          {allApproved && (
            <Button
              onClick={onDecommission}
              variant="destructive"
            >
              <Archive className="size-4" />
              Decommission Asset
            </Button>
          )}
          <div className="flex items-center gap-3">
            <StatBox
              label="Pending"
              count={pending}
            />
            <StatBox
              label="Accepted"
              count={accepted}
            />
            <StatBox
              label="Rejected"
              count={rejected}
            />
          </div>


        </div>
      </div>
    </div>
  );
};

export default ApprovalHeader;
