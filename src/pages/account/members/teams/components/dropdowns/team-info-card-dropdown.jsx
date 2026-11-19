import { useState } from 'react';
import { Group } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useStore from '../../store';

export function TeamInfoCardDropdown({
  trigger,
  teamId,
  teamName,
  lastActive,
  description,
  teamMembers,
}) {
  const setShowAddTeamModal = useStore((state) => state.setShowAddTeamModal);
  const setUpdateTeamDetail = useStore((state) => state.setUpdateTeamDetail);

  const [open, setOpen] = useState(false); // 👈 Track dropdown open state

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px]" side="bottom" align="end">
        {/* <DropdownMenuItem
          onClick={() => {
            setUpdateTeamDetail({
              id: teamId,
              name: teamName,
              description: description,
              members: teamMembers,
            });
            setShowAddTeamModal(true);
          }}
        >
          <Group />
          Manage Team
        </DropdownMenuItem> */}

        {/* <DropdownMenuItem asChild>
          <DeleteTeam teamId={teamId} setDropdown={setOpen} />
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
