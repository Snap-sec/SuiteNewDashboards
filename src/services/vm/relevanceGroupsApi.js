import { baseApi } from '@/services/baseApi';

export const relevanceGroupsApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['RelevanceGroups'],
  })
  .injectEndpoints({
  endpoints: (builder) => ({
    getVmRelevanceGroups: builder.query({
      query: (params) => ({
        url: '/csm/api/relevance-groups',
        method: 'GET',
        params,
      }),
      providesTags: ['RelevanceGroups'],
    }),
    getVmRelevanceGroupById: builder.query({
      query: (id) => ({
        url: `/csm/api/relevance-groups/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'RelevanceGroups', id }],
    }),
    triggerVmRelevanceGroupsClassify: builder.mutation({
      query: () => ({
        url: '/csm/api/relevance-groups/classify',
        method: 'POST',
      }),
      invalidatesTags: ['RelevanceGroups'],
    }),
    getVmRelevanceGroupVulnsById: builder.query({
      query: ({ id, params }) => ({
        url: `/csm/api/relevance-groups/${id}/vulnerabilities`,
        method: 'GET',
        params,
      }),
      providesTags: (result, error, { id }) => [{ type: 'RelevanceGroups', id }],
    }),
    triggerVmRelevanceGroupsBulkAction: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/csm/api/relevance-groups/${id}/bulk-action`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'RelevanceGroups', id }],
    }),
    updateVmRelevanceGroup: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/csm/api/relevance-groups/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'RelevanceGroups', id }, 'RelevanceGroups'],
    }),
  }),
});

export const {
  useGetVmRelevanceGroupsQuery,
  useGetVmRelevanceGroupByIdQuery,
  useGetVmRelevanceGroupVulnsByIdQuery,
  useTriggerVmRelevanceGroupsClassifyMutation,
  useTriggerVmRelevanceGroupsBulkActionMutation,
  useUpdateVmRelevanceGroupMutation,
} = relevanceGroupsApi;
