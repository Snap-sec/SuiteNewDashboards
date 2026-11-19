import { useState } from 'react';
import {
  CircleMinus,
  Link2,
  MoreHorizontal,
  Send,
  Star,
  Trash2,
  UserCircle2,
  PlusCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import {
  useSendVsToVmMutation,
  useSuppressVsVulnMutation,
  useUnSuppressVsVulnMutation,
} from '@/services/vs/vsApi';


const ActionsCell = ({ row, onlyShowIcon = false }) => {
  const [suppressVuln] = useSuppressVsVulnMutation();
  const [unsuppressVuln] = useUnSuppressVsVulnMutation();
  const [sendToVm] = useSendVsToVmMutation();

  const handleActions = {
    suppress: async () => {
      const payload = {
        vulnId: row.original._id,
        matcher_name: row.original.matcher_name,
        template_id: row.original.template_id,
        matched_at: row.original.matched_at,
        host: row.original.host,
      };

      toast.promise(suppressVuln(payload).unwrap(), {
        loading: 'Suppressing vulnerability',
        success: 'Vulnerability suppressed successfully',
        error: 'Failed to suppress vulnerability',
      });
    },

    unsuppress: async () => {
      const payload = {
        vulnId: row.original._id,
        matcher_name: row.original.matcher_name,
        template_id: row.original.template_id,
        matched_at: row.original.matched_at,
        host: row.original.host,
      };

      toast.promise(unsuppressVuln(payload).unwrap(), {
        loading: 'Un Suppressing vulnerability',
        success: 'Vulnerability Un suppressed successfully',
        error: 'Failed to unsuppress vulnerability',
      });
    },
  };

  const handleSendToVm = () => {
    toast.promise(sendToVm({ vulnIds: [row.original?._id] }).unwrap(), {
      loading: 'Sending to VM',
      error: 'Failed to send to VM',
      success: 'Ticket created in VM',
    });
  };

  return (
    <div className="flex">
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="flex flex-col mb-1"> */}

      <Button
        variant="ghost"
        className="-ml-2"
        onClick={row?.original?.is_suppressed ? handleActions.unsuppress : handleActions.suppress}
      >
        {row?.original?.is_suppressed ? <PlusCircle className="h-4 w-4 mr-2 text-blue-500" /> : <CircleMinus className="h-4 w-4 mr-2 text-orange-500" />}
        {!onlyShowIcon && (row?.original?.is_suppressed ? 'Un-supress' : 'Suppress')}
      </Button>
      {/* </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
};

export default ActionsCell;
