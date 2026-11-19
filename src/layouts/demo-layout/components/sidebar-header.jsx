import { ChevronFirst } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';



function useSegment(index) {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  const seg = segments[index];
  if (seg === 'sca-ui' || seg?.startsWith('sca')) {
    return 'sca';
  }
  return seg;
}

export function SidebarHeader() {
  const { settings, storeOption } = useSettings();
  const segment = useSegment(0);

  const handleToggleClick = () => {
    storeOption(
      'layouts.demo1.sidebarCollapse',
      !settings.layouts.demo1.sidebarCollapse,
    );
  };

  const ProductName= {
    "vm": "UniRisk",
    "caim": "AssetIQ",
    "aim": "AssetIQ",
    "assetinventory": "AssetIQ",
    "casm": "Xpose",
    "asm": "Xpose",
    "apt": "Strike",
    "csm": "Cloud Security Management",
    "csp-m": "Cloud Security Management",
    "vs": "Vulnerability Scanner",
    "vdp": "Vulnerability Disclosure Programme",
    "tm": "Threat Management",
    "threat-modeler": "Threat Management",
    "admin": "Admin",
    "rr": "Risk Register",
    "api-sec": "API Sec",
    "demo": "Snapsec Suite",
    "sca": "Software Composition Analysis",
    "sca-ui": "Software Composition Analysis",
    "automation": "Automation Agents",
  }

  const logoMap = {
    automation: 'agent',
    assetinventory: 'aim',
    caim: 'aim',
    aim: 'aim',
    apt: 'autopt',
    casm: 'asm',
    asm: 'asm',
    vm: 'vm',
    'csp-m': 'cspm',
    csm: 'cspm',
  };

  const logoSegment = logoMap[segment] || segment;



  return (
    <div className="sidebar-header hidden lg:flex items-center relative justify-between px-3 lg:px-6 shrink-0">
      <Link to="/">
        <div className="dark:hidden">
          <div className='flex items-center gap-2'>
            <img
              src={`/media/logos/${logoSegment}.svg`}
              className="default-logo h-[24px] max-w-none"
              alt="Default Logo"
            />
            <p className='default-logo font-bold text-[14px]'>
              {ProductName[segment]}
            </p>
          </div>

          <img
            src={`/media/logos/${logoSegment}.svg`}
            className="small-logo h-[24px] max-w-none"
            alt="Mini Logo"
          />
        </div>
    

        <div className="hidden dark:block">
          <div className='flex items-center gap-2'>
            <img
              src={`/media/logos/${logoSegment}.svg`}
              className="default-logo h-[24px] max-w-none"
              alt="Default Dark Logo"
            />
            <p className='default-logo font-bold text-[13px]'>
              {ProductName[segment]}
            </p>
          </div>

          <img
            src={`/media/logos/${logoSegment}.svg`}
            className="small-logo h-[24px] max-w-none"
            alt="Mini Logo"
          />
        </div>
      </Link>
      <Button
        onClick={handleToggleClick}
        size="sm"
        mode="icon"
        variant="outline"
        className={cn(
          'size-7 absolute start-full top-2/4 rtl:translate-x-2/4 -translate-x-2/4 -translate-y-2/4',
          settings.layouts.demo1.sidebarCollapse
            ? 'ltr:rotate-180'
            : 'rtl:rotate-180',
        )}
      >
        <ChevronFirst className="size-4!" />
      </Button>
    </div>
  );
}
