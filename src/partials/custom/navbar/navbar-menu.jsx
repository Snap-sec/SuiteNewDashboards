import { ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useMenu } from '@/hooks/use-menu';
import { useAuth } from "@/auth/context/auth-context";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';
import AuthorityGuard from '../../../components/custom/authority-guard/AuthorityGuard';
const NavbarMenu = ({ items }) => {

  const { user } = useAuth();
  const { pathname } = useLocation();
  const { isActive, hasActiveChild } = useMenu(pathname);

  const buildMenu = (items) => {
    return items.map((item, index) => {
      const content = item.children ? (
        <MenubarMenu key={item.title || index}>
          <MenubarTrigger
            className={cn(
              'flex items-center gap-1.5 px-3 py-3.5 text-sm text-secondary-foreground',
              'rounded-none border-b-2 border-transparent bg-transparent!',
              'hover:text-primary hover:bg-transparent',
              'focus:text-primary focus:bg-transparent',
              'data-[state=open]:bg-transparent data-[state=open]:text-primary',
              'data-[here=true]:text-primary data-[here=true]:border-primary',
            )}
            data-active={isActive(item.path) || undefined}
            data-here={hasActiveChild(item.children) || undefined}
          >
            {item.title}
            <ChevronDown className="ms-auto size-3.5" />
          </MenubarTrigger>
          <MenubarContent className="min-w-[175px]">
            {buildSubMenu(item.children)}
          </MenubarContent>
        </MenubarMenu>
      ) : (
        <MenubarMenu key={item.title || index}>
          <MenubarTrigger
            asChild
            className={cn(
              'flex items-center px-2 py-3.5 text-sm text-secondary-foreground px-3',
              'rounded-none border-b-2 border-transparent bg-transparent!',
              'hover:text-primary hover:bg-transparent',
              'focus:text-primary focus:bg-transparent',
              'data-[active=true]:text-primary data-[active=true]:border-primary',
            )}
          >
            <Link
              to={item.path || ''}
              data-active={isActive(item.path) || undefined}
              data-here={hasActiveChild(item.children) || undefined}
            >
              {item.title}
            </Link>
          </MenubarTrigger>
        </MenubarMenu>
      );

      // WRAP with AuthorityGuard only if roles or forbid are required
      if (item.roles || item.forbid) {
        return (
          <AuthorityGuard
            roles={item.roles}
            forbidRoles={item.forbid}
            key={item.title || index}
          >
            {content}
          </AuthorityGuard>
        );
      }
      return content;
    });
  };

  const buildSubMenu = (items) => {
    return items.map((item, index) => {
      const content = item.children ? (
        <MenubarSub key={item.title || index}>
          <MenubarSubTrigger
            data-active={isActive(item.path) || undefined}
            data-here={hasActiveChild(item.children) || undefined}
          >
            <span>{item.title}</span>
          </MenubarSubTrigger>
          <MenubarSubContent className="min-w-[175px]">
            {buildSubMenu(item.children)}
          </MenubarSubContent>
        </MenubarSub>
      ) : (
        <MenubarItem
          key={item.title || index}
          asChild
          data-active={isActive(item.path) || undefined}
          data-here={hasActiveChild(item.children) || undefined}
        >
          <Link to={item.path || ''}>{item.title}</Link>
        </MenubarItem>
      );

      if (item.roles || item.forbid) {
        return (
          <AuthorityGuard
            roles={item.roles}
            forbidRoles={item.forbid}
            key={item.title || index}
          >
            {content}
          </AuthorityGuard>
        );
      }
      return content;
    });
  };


  return (
    <div className="grid">
      <div className="scrollable-x-auto">
        <Menubar className="flex items-stretch gap-3 border-none bg-transparent p-0 h-auto">
          {buildMenu(items)}
        </Menubar>
      </div>
    </div>
  );
};

export { NavbarMenu };
