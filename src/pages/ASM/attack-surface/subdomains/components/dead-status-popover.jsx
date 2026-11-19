import { Badge } from '@/components/ui/badge';
import { Skull, XCircle, Clock } from 'lucide-react';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

function DeadStatusPopover({
    subdomain = '',
    deadReasons = [],
    lastSeen = null,
    position = 'top',
    trigger = 'hover',
    showText = true,
}) {
    // Default reasons if none provided
    const reasons = deadReasons.length > 0
        ? deadReasons
        : ['DNS resolution failed (NXDOMAIN)', 'No active hosting detected'];

    // Format last seen date
    const formatLastSeen = (date) => {
        if (!date) return null;
        const now = new Date();
        const lastSeenDate = new Date(date);
        const diffInDays = Math.floor((now - lastSeenDate) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return '1 day ago';
        return `${diffInDays} days ago`;
    };

    // Content to display inside the popover
    const popoverContent = (
        <div className="space-y-3">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Status:</span>
                <Badge variant="destructive" appearance="outline">
                    <Skull size={14} />Dead
                </Badge>
            </div>

            {/* Reasons Section */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Reason:</span>
                </div>

                <div className="space-y-2 pl-3">
                    {reasons.map((reason, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <XCircle size={12} className="text-destructive mt-0.5 shrink-0" />
                            <span className="text-xs">{reason}</span>
                        </div>
                    ))}

                    {lastSeen && (
                        <div className="flex items-start gap-2">
                            <Clock size={12} className="text-muted-foreground mt-0.5 shrink-0" />
                            <span className="text-xs text-muted-foreground">
                                Last seen: {formatLastSeen(lastSeen)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Custom trigger badge for dead status
    const triggerBadge = (
        <Badge
            variant="secondary"
            appearance="outline"
            className={`cursor-pointer text-muted-foreground border-border ${!showText ? 'px-1.5 py-0.5' : ''}`}
        >
            <Skull size={14} />
            {showText && 'Dead'}
        </Badge>
    );

    return (
        <DetailedHoverPopover
            popoverTitle={subdomain}
            buttonText={triggerBadge}
            popoverContent={popoverContent}
            position={position}
            trigger={trigger}
            showBadge={false}
            width="w-[320px]"
        />
    );
}

export default DeadStatusPopover;
