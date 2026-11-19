import React from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBulkDeleteVmReportsMutation } from '@/services/vm/reportApi';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import FloatingCard from '@/components/custom/floating-card';
import useReportStore from '../store';

function CsmReportBulkUpdate() {
  const [bulkDelete, { isLoading: isDeleting }] = useBulkDeleteVmReportsMutation();
  const rowSelection = useReportStore((s) => s.rowSelection);
  const setRowSelection = useReportStore((s) => s.setRowSelection);

  const reportIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);

  const handleBulkDelete = async () => {
    if (!reportIds.length) return;
    toast.promise(bulkDelete(reportIds).unwrap(), {
      loading: 'Deleting reports...',
      success: (data) => {
        setRowSelection(() => ({}));
        return data?.message || 'Bulk delete successful';
      },
      error: (e) => e?.data?.message || 'Bulk delete failed',
    });
  };

  return (
    <FloatingCard position="sticky-bottom">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3 px-2 border-r pr-4 mr-2">
          <Checkbox
            checked={reportIds.length > 0}
            onCheckedChange={() => setRowSelection(() => ({}))}
            className="hover:cursor-pointer"
          />
          <span className="text-sm font-semibold whitespace-nowrap">
            {reportIds.length} Selected
          </span>
        </div>

        <ButtonWithConfirm
          disabled={isDeleting}
          variant="ghost"
          confirm={true}
          onConfirm={handleBulkDelete}
          confirmButton={<Button variant="destructive">Delete Reports</Button>}
          cancelButton={<Button variant="outline">Cancel</Button>}
          className="hover:bg-red-200/20"
        >
          <div className="flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors">
            <Trash2 size={16} />
            <span className="text-sm font-medium">Delete</span>
          </div>
        </ButtonWithConfirm>
      </div>
    </FloatingCard>
  );
}

export default CsmReportBulkUpdate;
