import { Ellipsis } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { useRaiseAsmExposureMutation } from '@/services/asm/exposureApi';

export default function ExposureRowActions({ item }) {
  const [raiseExposure, { isLoading: isRaisingExposure }] =
    useRaiseAsmExposureMutation();

  const assetId = item?._id;
  const ruleId = item?.marked_by_rule_snapshot?._id;

  return (
    <div className="flex items-center justify-end pr-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Ellipsis size={14} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[190px]">
          <DropdownMenuItem asChild>
            <ButtonWithConfirm
              variant="ghost"
              confirm={true}
              disabled={!assetId || !ruleId || isRaisingExposure}
              onConfirm={() => {
                toast.promise(raiseExposure({ assetId, ruleId }).unwrap(), {
                  loading: 'Sending to VM...',
                  success: 'Sent to VM successfully',
                  error: 'Failed to send to VM',
                });
              }}
              confirmButton={<Button variant="primary">Send to VM</Button>}
              cancelButton={<Button variant="outline">Cancel</Button>}
              className="w-full justify-start h-8 px-2 font-normal"
            >
              Send to VM
            </ButtonWithConfirm>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

