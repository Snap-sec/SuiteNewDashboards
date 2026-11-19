'use client';

import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { PRODUCT_TO_MENU, VM_SIDEBAR } from '@/config/menu.config';
import { cn } from '@/lib/utils';
import { AccordionMenu, AccordionMenuGroup, AccordionMenuItem, AccordionMenuLabel, AccordionMenuSub, AccordionMenuSubContent, AccordionMenuSubTrigger } from '@/components/ui/accordion-menu';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileSymlink } from 'lucide-react';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import AIGuard from '@/components/custom/ai-guard/AIGuard';


export function SidebarMenu({ origin }) {
  const { pathname, search } = useLocation();
  const currentPath = pathname + search;
  const [selectedPath, setSelectedPath] = useState(currentPath);

  const [openItem, setOpenItem] = useState(null);

  // Update selectedPath when pathname changes
  useEffect(() => {
    setSelectedPath(currentPath);
  }, [currentPath]);


  // Match path based on pathname or include search for specific checks
  const matchPath = useCallback(
    (itemPath) => {
      if (!itemPath) return false;

      const [itemBase, itemSearch] = itemPath.split('?');

      // If paths don't match, return early
      if (itemBase !== pathname) return false;

      // If item has a search (query params), it must be present in the current search string
      if (itemSearch) {
        return search.includes(itemSearch);
      }

      // If item has no search, only highlight it if current search DOES NOT contain status, filters, owner, pentest_type, project_types, type, or vuln_type
      // This prevents "All" from being highlighted when "Active", "Closed" or "My Vulnerabilities" is selected
      if (!itemSearch && (search.includes('status=') || search.includes('filters=') || search.includes('owner=') || search.includes('pentest_type=') || search.includes('project_types=') || search.includes('type=') || search.includes('vuln_type='))) {
        return false;
      }

      return true;
    },
    [pathname, search],
  );

  // Global classNames for consistent styling
  const classNames = {
    root: 'lg:ps-1 space-y-3',
    group: 'gap-px',
    label:
      'px-2 py-1.5 uppercase text-xs font-medium text-muted-foreground/70 pt-2.25 pb-px',
    separator: '',
    item: 'h-8 hover:bg-transparent text-accent-foreground hover:text-primary data-[selected=true]:text-primary data-[selected=true]:bg-muted data-[selected=true]:font-medium',
    sub: '',
    subTrigger:
      'h-8 hover:bg-transparent text-accent-foreground hover:text-primary data-[selected=true]:text-primary data-[selected=true]:bg-muted data-[selected=true]:font-medium',
    subContent: 'py-0',
    indicator: '',
  };

  const buildMenu = (items) => {
    return items.map((item, index) => {
      if (item.heading) {
        return buildMenuHeading(item, index);
      } else if (item.disabled) {
        return buildMenuItemRootDisabled(item, index);
      } else {
        return buildMenuItemRoot(item, index);
      }
    });
  };

  const buildMenuItemRoot = (item, index) => {
    if (item.children) {
      const content = (
        <AccordionMenuSub value={item.path || `root-${index}`}>
          <AccordionMenuSubTrigger className="text-sm font-medium">
            {item.icon && <item.icon data-slot="accordion-menu-icon" />}
            <span data-slot="accordion-menu-title">{item.title}</span>
          </AccordionMenuSubTrigger>
          <AccordionMenuSubContent
            type="single"
            collapsible
            parentValue={item.path || `root-${index}`}
            className="ps-6"
          >
            <AccordionMenuGroup>
              {buildMenuItemChildren(item.children, 1)}
            </AccordionMenuGroup>
          </AccordionMenuSubContent>
        </AccordionMenuSub>
      );

      let finalContent = content;
      if (item.requireAI) {
        finalContent = <AIGuard key={`ai-${index}`}>{finalContent}</AIGuard>;
      }

      // If the parent group has roles/allowedUsers/forbid, guard the whole group
      if (item.roles || item.allowedUsers || item.forbid) {
        return (
          <AuthorityGuard
            key={index}
            roles={item.roles}
            allowedUsers={item.allowedUsers}
            forbidRoles={item.forbid}
          >
            {finalContent}
          </AuthorityGuard>
        );
      }

      return (
        <div key={index}>
          {finalContent}
        </div>
      );
    } else {
      const content = (
        <AccordionMenuItem
          value={item.path || ''}
          className="text-sm font-medium"
        >
          <Link
            to={item.path || '#'}
            className="flex items-center justify-between grow gap-2"
            onClick={() => {
              setSelectedPath(item.path);
              setOpenItem(null); // 🔥 collapse accordion
            }}
          >
            <div className="flex items-center gap-2">
              <item.icon data-slot="accordion-menu-icon" />
              <span data-slot="accordion-menu-title">{item.title}</span>
              {item?.customComponent}
            </div>
          </Link>
        </AccordionMenuItem>
      );

      let finalContent = content;
      if (item.requireAI) {
        finalContent = <AIGuard key={`ai-${index}`}>{finalContent}</AIGuard>;
      }

      // Only apply role-based guard when roles or allowedUsers are defined
      if (item.roles || item.allowedUsers || item.forbid) {
        return (
          <AuthorityGuard
            key={index}
            roles={item.roles}
            allowedUsers={item.allowedUsers}
            forbidRoles={item.forbid}
          >
            {finalContent}
          </AuthorityGuard>
        );
      }

      return (
        <div key={index}>
          {finalContent}
        </div>
      );
    }
  };

  const buildMenuItemRootDisabled = (item, index) => {
    return (
      <AccordionMenuItem
        key={index}
        value={`disabled-${index}`}
        className="text-sm font-medium"
      >
        {item.icon && <item.icon data-slot="accordion-menu-icon" />}
        <span data-slot="accordion-menu-title">{item.title}</span>
        {item.disabled && (
          <Badge variant="secondary" size="sm" className="ms-auto me-[-10px]">
            Soon
          </Badge>
        )}
      </AccordionMenuItem>
    );
  };

  const buildMenuItemChildren = (items, level = 0) => {
    return items.map((item, index) => {
      if (item.disabled) {
        return buildMenuItemChildDisabled(item, index, level);
      } else {
        return buildMenuItemChild(item, index, level);
      }
    });
  };

  const buildMenuItemChild = (item, index, level = 0) => {
    if (item.children) {
      return (
        <AccordionMenuSub
          key={index}
          value={item.path || `child-${level}-${index}`}
          className="relative"
        >
          {/* Sleek connection line */}
          <span className="absolute left-0 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" />

          <AccordionMenuSubTrigger className="text-[13px] ms-3 px-2.5 h-8 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground">
            {item.collapse ? (
              <span className="text-muted-foreground">
                <span className="hidden [[data-state=open]>span>&]:inline">
                  {item.collapseTitle}
                </span>
                <span className="inline [[data-state=open]>span>&]:hidden">
                  {item.expandTitle}
                </span>
              </span>
            ) : (
              item.title
            )}
          </AccordionMenuSubTrigger>
          <AccordionMenuSubContent
            type="single"
            collapsible
            parentValue={item.path || `child-${level}-${index}`}
            className={cn('ps-4', !item.collapse && 'relative')}
          >
            <AccordionMenuGroup>
              {buildMenuItemChildren(
                item.children,
                item.collapse ? level : level + 1,
              )}
            </AccordionMenuGroup>
          </AccordionMenuSubContent>
        </AccordionMenuSub>
      );
    } else {
      const isSelected = selectedPath === item.path || matchPath(item.path);

      const content = (
        <AccordionMenuItem
          value={item.path || ''}
          className="relative h-8 p-0 hover:bg-transparent data-[selected=true]:bg-transparent"
        >
          {/* Sleek connection line */}
          <span className="absolute left-0 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Active indicator dot */}
          {isSelected && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 size-1.5 rounded-full bg-primary z-10" />
          )}

          <Link
            className={cn(
              'flex items-center w-full h-full ms-3 px-2.5 rounded-md text-[13px] transition-colors',
              isSelected
                ? 'bg-muted text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
            )}
            to={item.path || '#'}
            onClick={() => {
              setSelectedPath(item.path);
              // setOpenItem(null); // 🔥 collapse accordion
            }}
          >
            {item.title}
          </Link>
        </AccordionMenuItem>
      );

      let finalContent = content;
      if (item.requireAI) {
        finalContent = <AIGuard key={`ai-${index}`}>{finalContent}</AIGuard>;
      }

      // Only apply role-based guard when roles or allowedUsers are defined
      if (item.roles || item.allowedUsers || item.forbid) {
        return (
          <AuthorityGuard
            key={index}
            roles={item.roles}
            allowedUsers={item.allowedUsers}
            forbidRoles={item.forbid}
          >
            {finalContent}
          </AuthorityGuard>
        );
      }

      return (
        <div key={index}>
          {finalContent}
        </div>
      );
    }
  };

  const buildMenuItemChildDisabled = (item, index, level = 0) => {
    return (
      <AccordionMenuItem
        key={index}
        value={`disabled-child-${level}-${index}`}
        className="text-[13px]"
      >
        <span data-slot="accordion-menu-title">{item.title}</span>
        {item.disabled && (
          <Badge variant="secondary" size="sm" className="ms-auto me-[-10px]">
            Soon
          </Badge>
        )}
      </AccordionMenuItem>
    );
  };

  const buildMenuHeading = (item, index) => {
    const content = (
      <AccordionMenuLabel
        key={index}
        className={cn(index === 0 ? 'mt-0' : 'mt-6')}
      >
        {item.heading}
      </AccordionMenuLabel>
    );

    let finalContent = content;
    if (item.requireAI) {
      finalContent = <AIGuard key={`ai-heading-${index}`}>{finalContent}</AIGuard>;
    }

    if (item.roles || item.allowedUsers || item.forbid) {
      return (
        <AuthorityGuard
          key={`heading-${index}`}
          roles={item.roles}
          allowedUsers={item.allowedUsers}
          forbidRoles={item.forbid}
        >
          {finalContent}
        </AuthorityGuard>
      );
    }

    return finalContent;
  };

  const fallback = pathname.split('/')[1];
  const activeKey = origin || fallback;

  const activeMenu = PRODUCT_TO_MENU[activeKey] || VM_SIDEBAR;


  return (
    <div className="kt-scrollable-y-hover flex flex-col justify-between h-screen grow shrink-0 py-5 px-5 lg:max-h-[calc(100vh-5.5rem)]">
      <AccordionMenu
        selectedValue={currentPath}
        matchPath={matchPath}
        type="single"
        collapsible
        classNames={classNames}
        value={openItem}
        onValueChange={(v) => setOpenItem(v)}
      >
        {buildMenu(activeMenu)}
      </AccordionMenu>

      {/* Documentation Link */}
      {/* <a
        href={productDocsLinks[activeKey]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm cursor-pointer font-medium hover:underline inline-flex ml-3 mb-4 items-center gap-1 group"
      >
        <FileSymlink size={14} data-slot="accordion-menu-icon" className="group-hover:translate-x-0.5 transition-transform light:text-black/50" />

        <span data-slot="accordion-menu-title">Documentation</span>
      </a> */}
    </div>
  );
}
