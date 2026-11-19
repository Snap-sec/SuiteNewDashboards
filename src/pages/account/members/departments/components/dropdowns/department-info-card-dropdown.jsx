import { useState } from 'react';
import { Group } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useStore from '../../store';

export function DepartmentInfoCardDropdown({
  trigger,
  departmentId,
  departmentName,
  lastActive,
  description,
  teamMembers,

  departmentLead,
  departmentTeams,
}) {
  const setShowAddTeamModal = useStore((state) => state.setShowAddTeamModal);
  const setUpdateDepartmentDetail = useStore(
    (state) => state.setUpdateDepartmentDetail,
  );
  const updateDepartmentDetail = useStore(
    (state) => state.updateDepartmentDetail,
  );

  const [open, setOpen] = useState(false); // 👈 Track dropdown open state

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <span
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {trigger}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px]" side="bottom" align="end">
        {/* <DropdownMenuItem
          onClick={() => {
            setUpdateDepartmentDetail({
              id: departmentId,
              name: departmentName,
              description: description,
              members: teamMembers,
              departmentLead,
              departmentTeams,
            });
            console.log(updateDepartmentDetail, 'DDDDDDDDDDDDDDDDDDDD');

            setShowAddTeamModal(true);
          }}
        >
          <Group />
          Manage Department
        </DropdownMenuItem> */}

        {/* <DropdownMenuItem
          onClick={(e) => e.stopPropagation()}
          onSelect={(e) => e.preventDefault()}
        >
          <DeleteDepartment
            departmentId={departmentId}
            setDropdown={setOpen}
            departmentTeams={departmentTeams}
          />
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
