import { baseApi } from '@/services/baseApi';

export const adapterApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['mcp_sessions'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getMcpSessions: builder.query({
        query: (params) => ({
          url: '/mcp/v1/sessions',
          params,
        }),

        providesTags: (result) => ['mcp_sessions'],
      }),
    }),
  });

export const { useGetMcpSessionsQuery } = adapterApi;
