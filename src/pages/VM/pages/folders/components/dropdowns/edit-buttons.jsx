import { useState } from 'react';
import { FolderPen, Move, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteVmFolderMutation } from '../../../../../../services/vm/foldersApi';
import DeleteFolder from '../actions/delete-folder-btn';
import EditModel from '../modals/edit-model';

export function EditButtons({ folderId, trigger, folders, allFolders }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-[175px]" side="bottom" align="end">
        {/* <DropdownMenuItem asChild>
          <div>
            <FolderPen />
            <span>Rename</span>
          </div>
        </DropdownMenuItem> */}

        <EditModel 
          folders={folders} 
          allFolders={allFolders} 
          onCloseDropdown={() => setDropdownOpen(false)} 
        />

        <DropdownMenuSeparator />
        {/* <DropdownMenuItem asChild> */}
        <div>
          <DeleteFolder folderId={folderId} />
        </div>
        {/* </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
