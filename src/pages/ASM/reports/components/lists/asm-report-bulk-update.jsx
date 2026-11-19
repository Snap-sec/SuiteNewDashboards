import React from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import FloatingCard from '@/components/custom/floating-card';
import { useBulkDeleteAsmReportsMutation } from '../../../../../services/asm/reportsApi';
import useStore from '../../store';

function AsmReportBulkUpdate() {
  const [bulkDelete, { isLoading: isDeleting }] = useBulkDeleteAsmReportsMutation();
  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);

  const reportIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);

  const handleBulkDelete = async () => {
    if (!reportIds.length) return;
    toast.promise(bulkDelete(reportIds).unwrap(), {
      loading: 'Deleting reports...',
      success: (data) => {
        setRowSelection(() => ({}));
        return data?.message || 'Bulk delete successful';
      },
      error: (e) => {
        return e?.data?.message || 'Bulk delete failed';
      },
    });
  };

  return (
    <FloatingCard
      position="sticky-bottom"
    >
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-primary">
            {reportIds.length} items selected
          </span>
        </div>
        
        <div className="flex items-center gap-3">
            <ButtonWithConfirm
                disabled={isDeleting}
                variant="ghost"
                confirm={true}
                className="hover:!bg-red-300/20"
                onConfirm={handleBulkDelete}
                confirmButton={<Button variant="destructive">Delete Reports</Button>}
                cancelButton={<Button variant="outline">Cancel</Button>}
            >
                <div className='flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors'>
                    <Trash2 size={16} />
                    <span className='text-sm font-medium'>Delete</span>
                </div>
            </ButtonWithConfirm>
        </div>
      </div>
    </FloatingCard>
  );
}

export default AsmReportBulkUpdate;
