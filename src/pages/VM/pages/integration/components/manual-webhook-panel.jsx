import { useState } from 'react';
import { Copy, Check, AlertTriangle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Shows the public webhook URL + manual setup instructions for Jira
 * basic-auth integrations. Atlassian disallows programmatic registration
 * for these, so the operator must paste the URL into Jira's UI once.
 */
const CopyField = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Copy failed — select manually');
    }
  };

  return (
    <div className="flex items-stretch gap-1 rounded-md border border-border bg-muted/40">
      <code className="flex-1 px-2 py-1.5 text-xs break-all font-mono text-foreground">
        {value}
      </code>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-none rounded-r-md"
        onClick={onCopy}
        aria-label="Copy"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </Button>
    </div>
  );
};

const ManualWebhookPanel = ({ carrier = 'jira' }) => {
  const { data, isLoading, isError } = useGetVmWebhookStatusQuery(carrier);

  if (isLoading) {
    return (
      <div className="px-5 lg:px-7.5 pb-5 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (isError || !data) return null;

  // Already auto-registered — nothing to surface.
  if (data.status === 'registered' && !data.manualSetup) return null;

  // Hide when there's no secret yet (integration not configured).
  if (!data.hasSecret || !data.webhookUrl) return null;

  const manual = data.manualSetup;
  const isManual = !!manual;

  return (
    <div className="px-5 lg:px-7.5 pb-5 pt-3 border-t border-border/50 bg-muted/20">
      <div className="flex items-start gap-2 mb-2">
        <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">
            {isManual ? 'Manual webhook setup required' : 'Webhook not registered'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isManual
              ? 'Jira basic auth (email + API token) cannot register webhooks via API. Add the webhook manually in Jira so issue updates and comments sync back to SnapSec.'
              : (data.note || 'Webhook is provisioned but not registered with the provider yet.')}
          </p>
        </div>
      </div>

      <div className="space-y-2 mt-3">
        <div>
          <label className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
            Webhook URL
          </label>
          <CopyField value={data.webhookUrl} />
        </div>

        {isManual && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Events: </span>
                <span className="text-foreground">{manual.events.join(', ')}</span>
              </div>
              {manual.jqlFilter && (
                <div>
                  <span className="text-muted-foreground">JQL Filter: </span>
                  <code className="text-foreground">{manual.jqlFilter}</code>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    'https://id.atlassian.com/manage-profile/security/api-tokens',
                    '_blank',
                  )
                }
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    'https://support.atlassian.com/jira-cloud-administration/docs/manage-webhooks/',
                    '_blank',
                  )
                }
              >
                <ExternalLink size={12} /> Jira Webhooks Docs
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Steps: open <b>Jira Settings → System → WebHooks → Create webhook</b>,
              paste the URL above, tick <b>{manual.events.join(' & ')}</b>, set
              JQL filter to <code>{manual.jqlFilter || 'project = YOUR_KEY'}</code>,
              and save.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export { ManualWebhookPanel };
