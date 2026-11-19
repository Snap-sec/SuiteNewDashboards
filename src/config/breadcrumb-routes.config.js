import {
  getAptProjectsPath,
  STRIKE_BREADCRUMB_ROUTES,
} from '@/routing/breadcrumb-routing/strike.breadcrumb.routes';

export { getAptProjectsPath, STRIKE_BREADCRUMB_ROUTES };

/**
 * Configuration registry for header breadcrumbs on details and sidebar pages.
 * Sourced directly from strike.breadcrumb.routes.js
 */
export const BREADCRUMB_ROUTES = STRIKE_BREADCRUMB_ROUTES;

/**
 * Matches a given location or pathname against registered breadcrumb route patterns.
 * Supports path parameters like ':id', ':projectId' as well as query string matching like '?type=pentest'.
 *
 * @param {string | object} locationOrPathname - React Router location object or pathname string
 * @param {object} [context={}] - Context containing dynamic entityType, etc.
 * @param {Array} [routesConfig=BREADCRUMB_ROUTES] - Registry of routes
 * @returns {{ route: object, params: object } | null}
 */
export function matchBreadcrumbRoute(
  locationOrPathname,
  context = {},
  routesConfig = BREADCRUMB_ROUTES,
) {
  if (!locationOrPathname) return null;

  // Allow routesConfig to be passed as second parameter if context was omitted
  const actualRoutes = Array.isArray(context) ? context : routesConfig;
  const ctx = Array.isArray(context) ? {} : context || {};

  let pathname = '/';
  let search = '';
  let state = {};

  if (typeof locationOrPathname === 'object' && locationOrPathname !== null) {
    pathname = locationOrPathname.pathname || '/';
    search = locationOrPathname.search || '';
    state = locationOrPathname.state || {};
  } else if (typeof locationOrPathname === 'string') {
    const [p, s] = locationOrPathname.split('?');
    pathname = p || '/';
    search = s ? `?${s}` : '';
  }

  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/';
  const searchParams = new URLSearchParams(search);

  for (const route of actualRoutes) {
    const [patternPathRaw, patternQueryRaw] = route.pattern.split('?');
    const routePattern = patternPathRaw.replace(/\/+$/, '') || '/';

    const paramNames = [];
    const regexSource = routePattern.replace(
      /:([a-zA-Z0-9_]+)/g,
      (_, paramName) => {
        paramNames.push(paramName);
        return '([^/]+)';
      },
    );

    const regex = new RegExp(`^${regexSource}$`, 'i');
    const match = cleanPath.match(regex);

    if (match) {
      // If the route pattern specifies query parameters (e.g. ?type=pentest), ensure they match URL query, state, or context
      if (patternQueryRaw) {
        const expectedQueryParams = new URLSearchParams(patternQueryRaw);
        let queryMatches = true;

        for (const [key, expectedVal] of expectedQueryParams.entries()) {
          const actualVal =
            searchParams.get(key) ||
            state?.[key] ||
            state?.projectType ||
            state?.scanType ||
            (key === 'type' ? ctx.entityType : null);

          if (actualVal !== expectedVal) {
            queryMatches = false;
            break;
          }
        }

        if (!queryMatches) {
          continue;
        }
      }

      const params = {};
      paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });

      return { route, params };
    }
  }

  return null;
}
