// /
// /scan/:scanId

import { baseApi } from '@/services/baseApi';

export const rulesApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ApisecRules', 'ApisecDashboard', "ApisecRuleCategories", "ApisecCategoryRules"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getApisecRules: builder.query({
        query: (params) => ({
          url: `/apisec/api/v1/rule`,
          params
        }),
        providesTags: ['ApisecRules'],
      }),

      // Rule categories
      getApisecRuleCategories: builder.query({
        query: (params) => ({
          url: `/apisec/api/v1/rule/categories`,
          params
        }),
        providesTags: ['ApisecRuleCategories'],
      }),

      // Get rules by category name
      getApisecCategoryRules: builder.query({
        query: (categoryName) => ({
          url: `/apisec/api/v1/rule?category=${categoryName}`,
        }),
        providesTags: ['ApisecCategoryRules'],
      }),


      createApisecRule: builder.mutation({
        query: (payload) => ({
          url: `/apisec/api/v1/rule`,
          headers: { 'Content-Type': 'application/x-yaml' },
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['ApisecRules', 'ApisecDashboard', 'ApisecCategoryRules', 'ApisecRuleCategories'],
      }),

      updateApisecRule: builder.mutation({
        query: ({ yaml, ruleId, isActive }) => ({
          url: `/apisec/api/v1/rule/${ruleId}`,
          headers: { 'Content-Type': 'application/x-yaml' },
          method: 'PUT',
          body: yaml || {active:isActive},
        }),
        invalidatesTags: ['ApisecRules', 'ApisecDashboard', 'ApisecCategoryRules', 'ApisecRuleCategories'],
      }),

      deleteApisecRule: builder.mutation({
        query: ({ ruleId }) => ({
          url: `/apisec/api/v1/rule/${ruleId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['ApisecRules', 'ApisecDashboard', 'ApisecCategoryRules', 'ApisecRuleCategories'],
      }),

      activeApisecRule: builder.mutation({
        query: ({ruleId, isActive}) => ({
          url: `/apisec/api/v1/rule/${ruleId}/status`,
          // headers: { 'Content-Type': 'application/x-yaml' },
          method: 'PATCH',
          body: {isActive}
        }),
        invalidatesTags: ['ApisecRules', 'ApisecDashboard', 'ApisecCategoryRules', 'ApisecRuleCategories'],
      }),

      syncDefaulApisecRules: builder.mutation({
        query: () => ({
          url: `/apisec/api/v1/rule/sync/default-rules`,
          method: 'POST',
        }),
        invalidatesTags: ['ApisecRules', 'ApisecDashboard', 'ApisecCategoryRules', 'ApisecRuleCategories'],
      }),
    }),
  });

export const {
  useGetApisecRulesQuery,
  useGetApisecRuleCategoriesQuery,
  useGetApisecCategoryRulesQuery,

  useCreateApisecRuleMutation,
  useUpdateApisecRuleMutation,
  useDeleteApisecRuleMutation,
  useActiveApisecRuleMutation,
  useSyncDefaulApisecRulesMutation
} = rulesApi;
