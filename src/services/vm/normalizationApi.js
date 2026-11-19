

import { baseApi } from '@/services/baseApi';

export const normalizationApi = baseApi.enhanceEndpoints({ addTagTypes: ['VMnormalization'] }).injectEndpoints({
    endpoints: (builder) => ({

        getNormalization: builder.query({
          query: (params) => ({
            url: `/csm/api/normalization/rules`,
            params
          }),
          providesTags: (result) => ['VMnormalization'],
        }),

        getNormalizationFields: builder.query({
          query: () => ({
            url: `/csm/api/normalization/fields`,
          }),
          invalidatesTags: (result) => ['VMnormalization'],
        }),

        postNormalization: builder.mutation({
          query: (payload) => ({
            url: '/csm/api/normalization/rules',
            method: 'POST',
            body: payload,
          }),
          invalidatesTags: ['VMnormalization'],
        }),

        deleteNormalization: builder.mutation({
            query: (ruleId) => ({
                url: `/csm/api/normalization/rules/${ruleId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['VMnormalization']
        }),


        updateNormalization: builder.mutation({
          query: ({ ruleId, ...updates }) => ({
            url: `/csm/api/normalization/rules/${ruleId}`,
            method: 'PUT',
            body: updates,
          }),
          invalidatesTags: ['VMnormalization'],
        }),


        executeNormalization: builder.mutation({
          query: (ruleId) => ({
            url: `/csm/api/normalization/rules/${ruleId}/execute`,
            method: "POST"
          }),
          invalidatesTags: ['VMnormalization']
        }),

        executeNormalizationAll: builder.mutation({
          query: () => ({
            url: `/csm/api/normalization/normalize`,
            method: "POST"
          }),
          invalidatesTags: ['VMnormalization']
        }),

        getNormalizationMatches: builder.query({
          query: ({ ruleId, ...params }) => ({
            url: `/csm/api/normalization/rules/${ruleId}/matches`,
            params,
          }),
          providesTags: (result) => ['VMnormalization'],
        }),


    }),
});


export const {
    useGetNormalizationQuery,
    usePostNormalizationMutation,
    useGetNormalizationFieldsQuery,
    useDeleteNormalizationMutation,
    useUpdateNormalizationMutation,
    useExecuteNormalizationMutation,
    useExecuteNormalizationAllMutation,
    useGetNormalizationMatchesQuery
} = normalizationApi;
