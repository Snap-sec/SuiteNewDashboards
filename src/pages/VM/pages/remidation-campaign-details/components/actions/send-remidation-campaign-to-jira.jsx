import { Download, ExternalLink, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useSendVmRemediationCampaignToJiraMutation } from '@/services/vm/remidationCampaignApi';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinners';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';

export default function SendRemediationCampaignToJira({
  campaignId,
  iconOnly = false,
  campaign,
  ...props
}) {
  const [sendToJira, { isLoading: isSending }] =
    useSendVmRemediationCampaignToJiraMutation();

  const handleSendToJira = () => {
    toast.promise(sendToJira(campaignId).unwrap(), {
      loading: 'Sending Remediation Campaign to Jira...',
      success: 'Remediation Campaign Sent to Jira Successfully',
      error: 'Failed to send Remediation Campaign to Jira',
    });
  };

  if (campaign?.sentToTicketingProvider && campaign?.externalTicketUrl) {
    return (
      <CustomTooltip text="View Jira Ticket">
        <Button
          variant="outline"
          onClick={() =>
            window.open(
              campaign.externalTicketUrl,
              '_blank',
              'noopener,noreferrer',
            )
          }
          className={iconOnly ? 'text-secondary-foreground' : 'flex'}
          {...props}
        >
          {iconOnly ? (
            <ExternalLink className="size-4" />
          ) : (
            <div className="font-normal flex gap-2 w-full items-center">
              <ExternalLink className="size-4" />
            </div>
          )}
        </Button>
      </CustomTooltip>
    );
  }

  return (
    <CustomTooltip text="Send To Jira">
      <div>
        <ButtonWithConfirm
          disabled={isSending}
          variant="outline"
          confirm={true}
          onConfirm={() => handleSendToJira()}
          confirmVariant="info"
          confirmTitle="Send To Jira?"
          dialog="This will send the remediation campaign to Jira. Proceed?"
          confirmButton={<Button variant="primary">Proceed</Button>}
          cancelButton={<Button variant="outline">Cancel</Button>}
          className={iconOnly ? 'text-secondary-foreground' : 'flex'}
          {...props}
        >
          {isSending ? (
            <Spinner className="w-4 h-4 animate-spin" />
          ) : iconOnly ? (
            <Send className="size-4" />
          ) : (
            <div className="font-normal flex gap-2 w-full items-center">
              <Send className="size-4" />
            </div>
          )}
        </ButtonWithConfirm>
      </div>
    </CustomTooltip>
  );
}
