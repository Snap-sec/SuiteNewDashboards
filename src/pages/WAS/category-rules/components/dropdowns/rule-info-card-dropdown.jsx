import { useState } from 'react';
import { Edit, Group } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteRule from '../actions/delete-rule';

export function RuleInfoCardDropdown({ trigger, rule }) {
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

        <DropdownMenuItem
          onClick={(e) => e.stopPropagation()}
          onSelect={(e) => e.preventDefault()}
          className=" ml-3"
        >
          <Edit /> Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => e.stopPropagation()}
          onSelect={(e) => e.preventDefault()}
        >
          <DeleteRule ruleId={rule?._id} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
