import { Link } from 'react-router-dom';
import { ShieldCheck, XCircle, AlertOctagon, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '@/components/custom/profile';

export default function VsScan({ notification }) {
    const isSystem = !notification.actor || notification.actor?.name?.trim().toLowerCase() === 'system';
    const action = notification.event_key?.split('.')[2] || 'completed';

    const userName = notification.actor?.name || 'System';
    const avatar = notification.actor?.avatar || '300-1.png';
    const badgeColor = notification.context?.status === 'success' ? 'online' : 'offline';

    const description = 'completed the scan';
    const targetLink = notification.target?.url || '#';
    const targetTitle = 'Vulnerability Scan';

    // Format date nicely, with robust fallback
    const date = notification.context?.timestamp || (() => {
        if (!notification.createdAt) return 'Recent';
        try {
            const d = new Date(notification.createdAt);
            if (isNaN(d.getTime())) return 'Recent';
            return d.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            return 'Recent';
        }
    })();

    const info = (notification.origin || 'vs').toUpperCase();

    // Helper to get system status icon
    const getSystemIcon = () => {
        switch (action) {
            case 'completed':
                return (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                );
            case 'cancelled':
                return (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <XCircle className="h-5 w-5" />
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                        <AlertOctagon className="h-5 w-5" />
                    </div>
                );
            case 'stopped':
                return (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/20">
                        <StopCircle className="h-5 w-5" />
                    </div>
                );
            default:
                return (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                );
        }
    };

    // Helper to render customized scan message
    const renderTitleContent = () => {
        if (isSystem) {
            let statusText = '';
            if (action === 'completed') {
                statusText = 'was completed successfully.';
            } else if (action === 'cancelled') {
                statusText = 'was cancelled.';
            } else if (action === 'failed') {
                statusText = 'failed.';
            } else if (action === 'stopped') {
                statusText = 'was stopped.';
            } else {
                statusText = 'was updated.';
            }

            return (
                <div className="text-sm font-medium mb-px leading-normal text-secondary-foreground">
                    <Link to={targetLink} className="hover:text-primary text-primary font-semibold mr-1">
                        {targetTitle}
                    </Link>
                    <span className="text-secondary-foreground">{statusText}</span>
                </div>
            );
        }

        return (
            <div className="text-sm font-medium mb-px leading-normal">
                <span className="hover:text-primary text-mono font-semibold mr-1">
                    {userName}
                </span>
                <span className="text-secondary-foreground mr-1">{description} </span>
                <Link to={targetLink} className="hover:text-primary text-primary font-semibold hover:underline break-words">
                    {targetTitle}
                </Link>
            </div>
        );
    };

    return (
        <div className="flex grow gap-2.5 px-5 py-2">
            <div className="flex items-start gap-1.5 shrink-0 mt-0.5">
                <div className="flex items-center justify-center w-1.5 mt-2.5">
                    {!notification?.seen && (
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                    )}
                </div>
                {isSystem ? (
                    getSystemIcon()
                ) : (
                    <Profile
                        userId={notification.actor?.id}
                        name={notification.actor?.name}
                        email={notification.actor?.email}
                        size="30px"
                        showName={false}
                    />
                )}
            </div>

            <div className="flex flex-col gap-3.5 grow">
                <div className="flex flex-col gap-1">
                    {renderTitleContent()}
                    <span className="flex items-center text-xs font-medium text-muted-foreground">
                        {date}
                        <span className="rounded-full size-1 bg-mono/30 mx-1.5"></span>
                        {info}
                    </span>
                </div>

                {/* High-quality contextual action buttons styled exactly like item-3 */}
                {notification.context?.status == "completed" && <div className="flex flex-wrap gap-2.5">
                    <Link to={targetLink}>
                        <Button size="sm" variant="mono">
                            View Findings
                        </Button>
                    </Link>
                </div>}
            </div>
        </div>
    );
}