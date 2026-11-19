import { Download, LayoutGrid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { SearchInput } from '@/components/custom/search';
import { useStore } from '../store';
import CreateScannerModel from './Modal/create-scanner-model';
import appConfig from "@/config/appConfig";
import { Button } from '../../../../../components/ui/button';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';
import { CustomTooltip } from '../../../../../components/custom/tooltip';


function Toolbar() {
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const activeView = useStore((state) => state.activeView);
  const setActiveView = useStore((state) => state.setActiveView);

  return (
    <div className="w-full flex gap-4 items-center justify-between mb-4">
      <SearchInput
        placeholder="Search Scanners ..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="flex gap-4 items-center">
        <a className="text-[12px] text-primary underline cursor-pointer" download href={`${appConfig.BASE_URL}/sample/download/install.sh`}>
          <Button variant="outline"> <Download /> Download</Button>
        </a>

        <AuthorityGuard forbidRoles={['Auditor']}>
          <CreateScannerModel />
        </AuthorityGuard>
      </div>
    </div>
  );
}

export default Toolbar;
