import { baseApi } from '@/services/baseApi';

const blacklistRulesListTag = { type: 'BlacklistRules', id: 'LIST' };

export const blacklistRulesApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['BlacklistRules'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAsmBlacklistRules: builder.query({
        query: (params) => ({
          url: `/op/api/v1/blacklist-rules`,
          params: params,
        }),
        providesTags: (result) => {
          const rules = result?.results || (Array.isArray(result) ? result : []);
          return [
            blacklistRulesListTag,
            ...rules.map((r) => ({ type: 'BlacklistRules', id: r._id || r.id })),
          ];
        },
        transformResponse: (response) => {
          if (Array.isArray(response)) {
            return {
              results: response,
              totalPages: 1,
              page: 1,
              totalResults: response.length,
            };
          }

          const results = response?.results || response?.data || [];
          const totalPages = response?.totalPages || response?.meta?.pages || 1;
          const page = response?.page || response?.meta?.page || 1;
          const totalResults =
            response?.totalResults ?? response?.meta?.total ?? results.length;
          const advancedFilters =
            response?.advanced_filters || response?.filters || [];

          return {
            results,
            totalPages,
            page,
            totalResults,
            advanced_filters: advancedFilters,
          };
        },
      }),

      getAsmBlacklistRuleProperties: builder.query({
        query: (params) => ({
          url: `/op/api/v1/blacklist-rules/schema`,
          params: params,
        }),
        transformResponse: (response) => response?.data || response,
        providesTags: ['BlacklistRules'],
      }),

      createAsmBlacklistRule: builder.mutation({
        query: (payload) => ({
          url: '/op/api/v1/blacklist-rules',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: [blacklistRulesListTag],
      }),

      updateAsmBlacklistRule: builder.mutation({
        query: ({ id, ...payload }) => ({
          url: `/op/api/v1/blacklist-rules/${id}`,
          method: 'PATCH',
          body: payload,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          blacklistRulesListTag,
          { type: 'BlacklistRules', id },
        ],
      }),

      deleteAsmBlacklistRule: builder.mutation({
        query: (id) => ({
          url: `/op/api/v1/blacklist-rules/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: (_result, _error, id) => [
          blacklistRulesListTag,
          { type: 'BlacklistRules', id },
        ],
      }),

      toggleAsmBlacklistRuleStatus: builder.mutation({
        query: ({ id, enabled }) => ({
          url: `/op/api/v1/blacklist-rules/${id}`,
          method: 'PATCH',
          body: { enabled },
        }),
        invalidatesTags: (_result, _error, { id }) => [
          blacklistRulesListTag,
          { type: 'BlacklistRules', id },
        ],
      }),
    }),
  });

export const {
  useGetAsmBlacklistRulesQuery,
  useGetAsmBlacklistRulePropertiesQuery,
  useCreateAsmBlacklistRuleMutation,
  useUpdateAsmBlacklistRuleMutation,
  useDeleteAsmBlacklistRuleMutation,
  useToggleAsmBlacklistRuleStatusMutation,
} = blacklistRulesApi;
