import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import FloatingCard from '../../../../../components/custom/floating-card';
import {
  useBulkSendVsToVmMutation,
  useBulkSuppressVsVulnsMutation,
  useBulkUnSuppressVsVulnsMutation,
} from '../../../../../services/vs/vsApi';
import useStore from '../store';
import { useAuth } from '@/auth/context/auth-context';

function BulkUpdate({ vulnerabilities }) {
  const { user } = useAuth();
  const isAuditor = user?.role?.toLowerCase() === 'auditor';

  const [bulkSentToVm, { isLoading: isSending }] = useBulkSendVsToVmMutation();
  const [bulkSuppressVulns, { isLoading: isSuppressing }] =
    useBulkSuppressVsVulnsMutation();
  const [bulkUnSuppressVulns, { isLoading: isUnSuppressing }] =
    useBulkUnSuppressVsVulnsMutation();

  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);
  const filters = useStore((state) => state.filters);

  const vulnIds = Object.keys(rowSelection);
  const isSuppressedView = filters?.suppressed === 'true';

  const handleBulkSendToVm = async () => {
    toast.promise(bulkSentToVm(vulnIds).unwrap(), {
      loading: 'Sending vulnerabilities to VM',
      success: () => {
        setRowSelection(() => ({}));
        return `Successfully sent ${vulnIds.length} vulnerabilities to VM`;
      },
      error: (err) => {
        console.log(err);

        return 'Failed to send vulnerabilities to VM';
      },
    });
  };

  const handleBulkSuppress = async () => {
    toast.promise(bulkSuppressVulns(vulnIds).unwrap(), {
      loading: 'Suppressing vulnerabilities',
      success: () => {
        setRowSelection(() => ({}));
        return `Successfully suppressed ${vulnIds.length} vulnerabilities`;
      },
      error: 'Failed to suppress vulnerabilities',
    });
  };

  const handleBulkUnSuppress = async () => {
    try {
      await bulkUnSuppressVulns(vulnIds).unwrap();
      toast.success(
        `Successfully unsuppressed ${vulnIds.length} vulnerabilities`,
      );
      setRowSelection({});
    } catch (error) {
      toast.error('Failed to unsuppress vulnerabilities');
      console.error(error);
    }
  };

  return (
    <FloatingCard position="sticky-bottom">
      <div className="flex flex-wrap items-center justify-start w-full gap-4">
        {!isAuditor && (
          isSuppressedView ? (
            <ButtonWithConfirm
              disabled={isUnSuppressing}
              variant="ghost"
              confirm={true}
              onConfirm={handleBulkUnSuppress}
              confirmButton={<Button variant="primary">Proceed</Button>}
              cancelButton={<Button variant="outline">Cancel</Button>}
              title="Unsuppress Vulnerabilities"
              description={`Are you sure you want to unsuppress ${vulnIds.length} vulnerabilities?`}
            >
              <Button variant={'outline'}>Unsuppress</Button>
            </ButtonWithConfirm>
          ) : (
            <ButtonWithConfirm
              disabled={isSuppressing}
              variant="ghost"
              confirm={true}
              onConfirm={handleBulkSuppress}
              confirmButton={<Button variant="primary">Proceed</Button>}
              cancelButton={<Button variant="outline">Cancel</Button>}
              title="Suppress Vulnerabilities"
              description={`Are you sure you want to suppress ${vulnIds.length} vulnerabilities?`}
            >
              <Button variant={'outline'}>Suppress</Button>
            </ButtonWithConfirm>
          )
        )}

        <ButtonWithConfirm
          disabled={isSending || isAuditor}
          variant="ghost"
          confirm={true}
          onConfirm={handleBulkSendToVm}
          confirmButton={<Button variant="primary">Proceed</Button>}
          cancelButton={<Button variant="outline">Cancel</Button>}
          title="Send to VM"
          description={`Are you sure you want to send ${vulnIds.length} vulnerabilities to VM?`}
        >
          <Button variant={'outline'} disabled={isAuditor}>Send to VM</Button>
        </ButtonWithConfirm>
      </div>
    </FloatingCard>
  );
}

export default BulkUpdate;
