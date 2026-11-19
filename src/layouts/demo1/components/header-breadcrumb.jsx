import React from 'react';
import { Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { useBreadcrumb } from '@/context/breadcrumb-context';
import { matchBreadcrumbRoute } from '@/config/breadcrumb-routes.config';

export function HeaderBreadcrumb({ className = '' }) {
  const location = useLocation();
  const { dynamicTitle, entityType, customCrumbs } = useBreadcrumb();

  // If custom breadcrumbs were explicitly set by a page, use those
  if (Array.isArray(customCrumbs) && customCrumbs.length > 0) {
    return (
      <Breadcrumb className={className}>
        <BreadcrumbList className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium flex-nowrap">
          {customCrumbs.map((crumb, idx) => {
            const isLast = idx === customCrumbs.length - 1;
            const targetPath =
              typeof crumb.path === 'function'
                ? crumb.path(null, location, { dynamicTitle, entityType })
                : crumb.path;

            return (
              <React.Fragment key={idx}>
                <BreadcrumbItem>
                  {isLast || !targetPath ? (
                    <BreadcrumbPage
                      className="font-semibold text-foreground truncate max-w-[160px] sm:max-w-[280px] lg:max-w-[360px]"
                      title={crumb.label}
                    >
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        to={targetPath}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="[&>svg]:size-3.5 text-muted-foreground/60" />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Otherwise check if current route matches any configured details route (matches pathname + query)
  const matchResult = matchBreadcrumbRoute(location, { entityType });
  if (!matchResult) {
    return null;
  }

  const { route } = matchResult;
  const crumbs = route.crumbs || [];

  // Determine dynamic title:
  // 1. Context dynamicTitle (set by useBreadcrumbTitle in details page)
  // 2. Navigation state (e.g. location.state?.projectName from clicking a project card)
  // 3. Fallback
  const stateTitle =
    location.state?.projectName ||
    location.state?.name ||
    location.state?.title;

  const resolvedDynamicTitle = dynamicTitle || stateTitle;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium flex-nowrap">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          const rawLabel =
            typeof crumb.label === 'function'
              ? crumb.label(matchResult.params, location, { dynamicTitle, entityType })
              : crumb.label;
          const isHome =
            index === 0 &&
            typeof rawLabel === 'string' &&
            rawLabel.toLowerCase() === 'home';

          // Resolve label for dynamic crumb
          let label = rawLabel;
          let isDynamicLoading = false;

          if (crumb.dynamic) {
            if (resolvedDynamicTitle) {
              label = resolvedDynamicTitle;
            } else {
              isDynamicLoading = true;
              label = crumb.fallback || 'Details';
            }
          }

          const isClickable =
            !isLast && Boolean(crumb.path) && crumb.clickable !== false;
          const targetPath =
            isClickable && typeof crumb.path === 'function'
              ? crumb.path(matchResult.params, location, { dynamicTitle, entityType })
              : isClickable
                ? crumb.path
                : null;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem className="inline-flex items-center">
                {isLast ? (
                  isDynamicLoading ? (
                    <Skeleton className="h-4 w-28 rounded-md" />
                  ) : (
                    <BreadcrumbPage
                      className="font-semibold text-foreground truncate max-w-[160px] sm:max-w-[280px] lg:max-w-[360px]"
                      title={label}
                    >
                      {label}
                    </BreadcrumbPage>
                  )
                ) : targetPath ? (
                  <BreadcrumbLink asChild>
                    <Link
                      to={targetPath}
                      className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {isHome && <Home className="size-3.5 shrink-0" />}
                      <span>{label}</span>
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 text-muted-foreground font-medium truncate max-w-[160px] sm:max-w-[280px] lg:max-w-[360px]"
                    title={label}
                  >
                    {isHome && <Home className="size-3.5 shrink-0" />}
                    <span>{label}</span>
                  </span>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="[&>svg]:size-3.5 text-muted-foreground/60" />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default HeaderBreadcrumb;
