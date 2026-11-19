import { ChevronFirst } from 'lucide-react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import appConfig from '@/config/appConfig.js';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';

function useSegment(index) {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const segments = pathname.split('/').filter(Boolean);

  let seg = segments[index];
  if (pathname.includes('/notifications')) {
    const origin = searchParams.get('origin');
    seg = origin || seg;
  }

  if (seg === 'sca-ui' || seg?.startsWith('sca')) {
    return 'sca';
  }
  if (seg === 'ui-sast' || seg?.startsWith('sast')) {
    return 'sast';
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



  const ProductName = {
    "vm": "VM",
    "caim": "AIM",
    "casm": "ASM",
    "vdp": "VDP",
    "admin": "Admin",
    "rr": "RR",
    "demo": "Demo",
    "assetinventory": "AIM",
    "agent": "Agent",
    "automation": "Automation",
    "ai-agent-builder": "Agent Builder",
    "apt": "APT",
  }



  const dashboardLinks = {
    vm: '/vm',
    caim: '/caim',
    casm: '/casm',
    vdp: '/vdp',
    admin: '/admin',
    rr: '/rr',
    apt: '/apt',
    demo: '/demo',
    assetinventory: '/assetinventory',
    "ai-agent-builder": '/ai-agent-builder',
  };

  const logoMap = {
    "ai-agent-builder": 'workflow',
    apt: 'autopt',
    assetinventory: 'aim',
    caim: 'aim',
    aim: 'aim',
    casm: 'asm',
    asm: 'asm',
    vm: 'vm',
  };

  const logoSlug = logoMap[segment] || segment;

  const brandedTitles = {
    vm: 'UniRisk',
    caim: 'AssetIQ',
    assetinventory: 'AssetIQ',
    aim: 'AssetIQ',
    casm: 'Xpose',
    asm: 'Xpose',
    apt: 'Strike',
  };

  const product = appConfig.PRODUCT_LIST.find(
    (product) => product.id === ProductName[segment],
  );

  const productNameDisplay =
    brandedTitles[segment] ||
    product?.name ||
    (segment === 'ai-agent-builder'
      ? 'AI Agent Builder'
      : segment === 'agent'
      ? 'Agent Fleet'
      : '');

  return (
    <div className="sidebar-header hidden lg:flex items-center relative justify-between px-3 lg:px-6 shrink-0">
      <Link to={dashboardLinks[segment]}>
        <div className="dark:hidden">
          <div className="flex items-center gap-2">
            <img
              src={`/media/logos/${logoSlug}.svg`}
              className="default-logo h-[24px] max-w-none"
              alt="Default Logo"
            />
            <p className='default-logo font-bold text-[14px]'>
              {/* {product?.name || (segment === 'automation' ? 'Automation Agents' : segment === 'agent' ? 'Agent Fleet' : '')} */}
              {productNameDisplay}
            </p>
          </div>

          <img
            src={`/media/logos/${logoSlug}.svg`}
            className="small-logo h-[24px] max-w-none"
            alt="Mini Logo"
          />
        </div>


        <div className="hidden dark:block">
          <div className="flex items-center gap-2">
            <img
              src={`/media/logos/${logoSlug}.svg`}
              className="default-logo h-[24px] max-w-none"
              alt="Default Dark Logo"
            />
            <p className='default-logo font-bold text-[14px]'>
              {productNameDisplay}
            </p>
          </div>

          <img
            src={`/media/logos/${logoSlug}.svg`}
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
