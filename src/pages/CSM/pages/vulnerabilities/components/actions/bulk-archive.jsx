import { Archive, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBulkArchiveVmVulnsMutation } from '@/services/vm/archivedVulnsApi';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import useStore from '../../store';

const BulkArchive = ({ vulnIds = [] }) => {
  const [bulkArchiveVmVulns, { isLoading: isArchiving }] =
    useBulkArchiveVmVulnsMutation();

  const setRowSelection = useStore((state) => state.setRowSelection);

  const handleBulkArchive = () => {
    if (vulnIds?.length == 0)
      return toast.error('Please select at least one vulnerability');

    toast.promise(bulkArchiveVmVulns(vulnIds).unwrap(), {
      loading: 'Archiving vulnerabilities...',
      success: (data) => {
        setRowSelection(() => ({}));
        return 'Vulnerabilities archived successfully';
      },
      error: (e) => e?.data?.message || 'Failed to archive vulnerabilities',
    });
  };

  return (
    <ButtonWithConfirm
      disabled={isArchiving}
      variant="outline"
      confirm={true}
      onConfirm={handleBulkArchive}
      confirmButton={<Button variant="primary">Proceed</Button>}
      cancelButton={<Button variant="outline">Cancel</Button>}
    >
      <Archive size={14} /> Archive
    </ButtonWithConfirm>
  );
};

export default BulkArchive;
