import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Webhook, RotateCw, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useIntegration } from '../context/integration-context';
import appConfig from '@/config/appConfig';

export function ScaWebhooksPanel({
  systemWebhookToken: propsToken,
  rotatingId: propsRotatingId,
  handleRotateSystemToken: propsHandleRotate,
}) {
  const context = useIntegration() || {};
  const systemWebhookToken = propsToken ?? context.systemWebhookToken ?? '';
  const rotatingId = propsRotatingId ?? context.rotatingId;
  const handleRotateSystemToken = propsHandleRotate ?? context.handleRotateSystemToken;

  return (
    <div className="flex flex-col gap-5">
      <Card className="border border-border/80 shadow-sm">
        <CardHeader className="text-base font-semibold leading-none tracking-tight">
          Scan Trigger Webhook
        </CardHeader>

        <CardContent className="px-4 flex flex-col gap-3">
          <div className="bg-muted/50 rounded-lg p-3 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-xs text-muted-foreground font-mono font-medium">System Webhook Token (Shared Secret):</span>
              <code className="text-xs font-mono text-foreground font-semibold truncate bg-background px-2.5 py-1 rounded border border-border/60">
                {systemWebhookToken || 'Loading token...'}
              </code>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <ButtonWithConfirm
                confirm={true}
                confirmVariant="destructive"
                confirmTitle="Rotate System Webhook Secret"
                dialog="Are you sure you want to rotate the system-wide webhook secret? All active CI/CD webhook triggers using the old token will stop working until updated."
                onConfirm={handleRotateSystemToken}
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                disabled={rotatingId === 'global'}
              >
                {rotatingId === 'global' ? (
                  <Loader2 className="size-3 animate-spin text-primary" />
                ) : (
                  <RotateCw className="size-3 " />
                )}
                <span>Rotate Token</span>
              </ButtonWithConfirm>

              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => {
                  navigator.clipboard.writeText(systemWebhookToken);
                  toast.success('System Webhook Token copied to clipboard!');
                }}
              >
                <Copy className="size-3" />
                <span>Copy Secret</span>
              </Button>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-3 border border-border/40 flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground font-medium">Generic Webhook Curl Trigger Template:</span>
            <div className="bg-background p-2 rounded border border-border flex items-center justify-between overflow-x-auto text-primary font-mono text-[11px]">
              <code>curl -X POST {window.location.origin}/sca/webhooks/{systemWebhookToken || '<token>'}/&lt;projectName&gt;</code>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[10px] gap-1 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  navigator.clipboard.writeText(`curl -X POST ${window.location.href}/sca/webhooks/${systemWebhookToken}/<projectName>`);
                  toast.success('Curl command template copied!');
                }}
              >
                <Copy className="size-3" />
                <span>Copy</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
