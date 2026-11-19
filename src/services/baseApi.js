import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import appConfig from '../config/appConfig';

// Define base query with common configuration
const baseQuery = fetchBaseQuery({
  baseUrl: appConfig.BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('token');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

// Mutex-like logic for refreshing token
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
};

// Base query with error handling and 401 logout logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const url = new URL(window.location.href);
  if (!args.method || args.method.toLowerCase() == 'get') {
    const filterParam = url.searchParams.get('filters');

    if (filterParam) {
      const currentParams =
        typeof args.params === 'object' && args.params !== null
          ? { ...args.params }
          : {};

      args.params = { ...currentParams, filters: filterParam };

      // console.log('new params: ', { ...currentParams, filters: filterParam });
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  const excludedPaths = [
    '/auth/register-2fa',
    '/auth/login-2fa',
    '/auth/signup',
    '/auth/signin',
    // '/profile/account/members/team-members',
    // '/profile/account/security/overview',
    // '/profile/account/members/teams',
  ];

  // Handle 401 unauthorized responses
  const endpointUrl = typeof args === 'string' ? args : args?.url;
  const isOrgsEndpoint = endpointUrl?.includes('/auth/orgs');
  const isRefreshEndpoint = endpointUrl?.includes(
    '/auth/api/auth/refresh-token',
  );

  if (
    result?.error?.status === 401 &&
    !excludedPaths.includes(window.location.pathname) &&
    !isOrgsEndpoint &&
    !isRefreshEndpoint
  ) {
    // Attempt to refresh the token using the refreshToken from the user object
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const refreshToken =
      user?.refreshToken || localStorage.getItem('refreshToken');

    if (refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;

        const refreshResult = await baseQuery(
          {
            url: '/auth/api/auth/refresh-token',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions,
        );

        console.log('REFRESH TOKEN RESPONSE : ', refreshResult);

        if (refreshResult.data) {
          const newToken =
            refreshResult.data?.data?.token || refreshResult.data?.token;
          const newRefreshToken =
            refreshResult.data?.data?.refreshToken ||
            refreshResult.data?.refreshToken;

          if (newToken) {
            localStorage.setItem('token', newToken);
            // Update the stored user object with the new token
            if (user) {
              // user.token = newToken;
              // if (newRefreshToken) user.refreshToken = newRefreshToken;
              localStorage.setItem('user', JSON.stringify(refreshResult?.data?.data));
            }
          }
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }

          isRefreshing = false;
          onTokenRefreshed(newToken);
          refreshSubscribers = [];

          // Retry the initial query with the new token
          return await baseQuery(args, api, extraOptions);
        } else {
          isRefreshing = false;
          refreshSubscribers = [];
          // Refresh failed, fall through to logout logic
        }
      } else {
        // If already refreshing, wait for the new token
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            resolve(baseQuery(args, api, extraOptions));
          });
        });
      }
    }

    // Logout logic if refresh failed or no refreshToken available
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // Invalidate all cached data
    api.dispatch(baseApi.util.resetApiState());

    const fromDemo = url.searchParams.get('fromDemo');

    if (fromDemo == true || fromDemo == 'true') window.location.href = '/demo';
    else window.location.href = '/auth/signin';
  }

  return result;
};

// Create the base API
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,

  // Define tag types for cache invalidation
  tagTypes: [
    'User',
    'VmChangeManagementDashboard',
    'VmChangeManagementPentestRequests',
    'VmSpecificAssessmentReports',
    'VmVulnReport',
    'AssetInventoryAssets',
    'AssetInventoryAssetStats',
    'AssetInventoryGlobalAssets',
    'AimRuleJobs',
    'getPolicies',
    'getPolicy',
    'getPolicyProperties',
    'AsmRules',
    'ProductsOverview',
    'Pentests',
    'AutoPtDashboard',
    'APT_Scans',
    'autoPtVulns',
    'AutoPtConfig',
    // Add more tag types as needed
  ],

  // Keep unused data for 60 seconds
  keepUnusedDataFor: 60,

  // Refetch on mount or arg change
  refetchOnMountOrArgChange: 30,

  // Refetch on reconnect
  refetchOnReconnect: true,

  // Empty endpoints object - will be injected later
  endpoints: () => ({}),
});

// Export hooks (will be populated when endpoints are injected)
export const {} = baseApi;
