import React from 'react';

const ApprovalProgress = ({ pending, accepted, rejected, total }) => {
  const acceptedWidth = (accepted / total) * 100;
  const rejectedWidth = (rejected / total) * 100;
  const pendingWidth = (pending / total) * 100;

  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">Approval Progress</h3>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-orange-500" />
            <span className="text-muted-foreground">{pending} Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">{accepted} Accepted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-red-500" />
            <span className="text-muted-foreground">{rejected} Rejected</span>
          </div>
        </div>
      </div>

      <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${acceptedWidth}%` }}
        />
        <div
          className="h-full bg-red-500 transition-all duration-500"
          style={{ width: `${rejectedWidth}%` }}
        />
        <div
          className="h-full bg-orange-500 transition-all duration-500"
          style={{ width: `${pendingWidth}%` }}
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span role="img" aria-label="hourglass">⌛</span>
        {pending > 0 ? (
          <span>Waiting for {pending} more approvals before decommission can proceed.</span>
        ) : rejected > 0 ? (
          <span className="text-red-500 font-medium">Decommission blocked by rejection.</span>
        ) : (
          <span className="text-green-500 font-medium">All approvals received. You can now proceed with decommissioning.</span>
        )}
      </div>
    </div>
  );
};

export default ApprovalProgress;
