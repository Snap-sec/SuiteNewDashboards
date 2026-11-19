import { CircleSlash, Link2, MinusCircle, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '../../../../../components/custom/tooltip';
import {
  useSuppressAutoPtVulnMutation,
  useUnsuppressAutoPtVulnMutation,
} from '@/services/auto-pt/autoPtVulnerabilityApi';
import { useAuth } from '@/auth/context/auth-context';

function SuppressOrUnsuppressVuln({ row }) {
  const { user } = useAuth();
  const isAuditor = user?.role?.toLowerCase() === 'auditor';

  const [suppressVuln, { isLoading: isSuppressing }] =
    useSuppressAutoPtVulnMutation();

  const [unsuppressVuln, { isLoading: isUnsuppressing }] =
    useUnsuppressAutoPtVulnMutation();

  const handleSuppressVuln = () => {
    toast.promise(suppressVuln({ vulnId: row.original?._id }).unwrap(), {
      loading: 'Suppressing Vuln',
      error: (err) => {
        return err?.data?.message || 'Failed to Suppress Vuln';
      },
      success: 'Vuln Suppressed successfully ',
    });
  };

  const handleUnsuppressVuln = () => {
    toast.promise(unsuppressVuln({ vulnId: row.original?._id }).unwrap(), {
      loading: 'Unsuppressing Vuln',
      error: (err) => {
        return err?.data?.message || 'Failed to Unsuppress vuln';
      },
      success: 'Vuln Unsuppressed successfully',
    });
  };

  if (isAuditor) return null;

  return (
    <CustomTooltip
      text={`${row?.original?.isSuppressed ? "Unsuppress this vulnerability" : "Suppress this vulnerability"}`}
    >
      <ButtonWithConfirm
        confirm={true}
        variant="outline"
        onConfirm={() =>
          row?.original?.isSuppressed
            ? handleUnsuppressVuln()
            : handleSuppressVuln()
        }
      >
        {row?.original?.isSuppressed ? (
          <>
            <PlusCircle />
            {/* Unsuppress */}
          </>
        ) : (
          <>
            {' '}
            <CircleSlash />
            {/* Suppress */}
          </>
        )}
      </ButtonWithConfirm>
    </CustomTooltip>
  );
}

export default SuppressOrUnsuppressVuln;
