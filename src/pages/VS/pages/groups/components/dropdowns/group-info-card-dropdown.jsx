import { useState } from 'react';
import { Download, Eye, FolderCog, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';

const DropdownMenu3 = ({
  trigger,
  onAddVulnerabilities,
  onDeleteList,
  onEditList,
}) => {
  const [open, setOpen] = useState(false); // 👈 Track dropdown open state

  const options = [
    // {
    //   optionName: 'View Vulnerabilities',
    //   icon: <Eye />,
    //   link: '#',
    // },

    {
      optionName: 'Manage Assets',
      link: '#',
      onClick: () => onAddVulnerabilities?.(),
    },

    {
      optionName: 'Edit',
      // link: '#',
      onClick: () => onEditList(),
    },

    {
      optionName: 'Delete',
      link: '#',
      onClick: onDeleteList,
    },

    // {
    //   optionName: 'Export Vulnerabilities',
    //   icon: <Download />,
    //   link: '#',
    // },
  ];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-[160px]" side="bottom" align="end">
        {options?.map((option) => (
          <DropdownMenuItem key={option.optionName} asChild>
            {option?.optionName === 'Manage Assets' && option.onClick ? (
              <button
                onClick={option.onClick}
                className="flex items-center gap-2 w-full"
              >
                {option.icon}
                <span>{option.optionName}</span>
              </button>
            ) : option?.optionName === 'Delete' && option.onClick ? (
              <>
              <DropdownMenuSeparator />
              <ButtonWithConfirm
                variant="ghost"
                confirm={true}
                dialog="This action requires confirmation, click delete to proceed."
                confirmOnInput="shoaibwani"
                onConfirm={() => {
                  option.onClick();
                  setOpen(false);
                }}
                confirmButton={<Button variant="destructive">Delete</Button>}
                cancelButton={<Button variant="outline">Cancel</Button>}
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-red-200/20 "
              >
                {option.icon}
                <span className="!font-normal !hover:bg-transparent !bg-transparent !text-inherit ">
                  Delete
                </span>
              </ButtonWithConfirm>
                            </>
            ) : option.link ? (
              <Link to={option.link} className="flex items-center gap-2 w-full">
                {option.icon}
                <span>{option.optionName}</span>
              </Link>
            ) : (
              <button
                onClick={option.onClick}
                className="flex items-center gap-2 w-full text-left"
              >
                {option.icon}
                <span>{option.optionName}</span>
              </button>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownMenu3;
