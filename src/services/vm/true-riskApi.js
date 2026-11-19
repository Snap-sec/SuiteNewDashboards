import { baseApi } from '@/services/baseApi';

export const trueRiskApi = baseApi
    .enhanceEndpoints({ addTagTypes: ['TrueRisk'] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getTrueRiskPolicy: builder.query({
                query: () => ({
                    url: '/csm/api/truerisk/policy',
                }),
                providesTags: ['TrueRisk'],
            }),

            createTrueRiskPolicy: builder.mutation({
                query: (body) => ({
                    url: '/csm/api/truerisk/policy',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: ['TrueRisk'],
            }),

            updateTrueRiskPolicy: builder.mutation({
                query: (body) => ({
                    url: '/csm/api/truerisk/policy',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: ['TrueRisk'],
            }),

            deleteTrueRiskPolicy: builder.mutation({
                query: () => ({
                    url: '/csm/api/truerisk/policy',
                    method: 'DELETE',
                }),
                invalidatesTags: ['TrueRisk'],
            }),

            toggleTrueRiskEnabled: builder.mutation({
                query: (status) => ({
                    url: '/csm/api/truerisk/view',
                    method: 'POST',
                    body: { enabled: status },
                }),
                invalidatesTags: ['TrueRisk'],
            }),

            getTrueRiskDefaultPolicy: builder.query({
                query: () => ({
                    url: '/csm/api/truerisk/policy/defaults',
                }),
                providesTags: ['TrueRisk'],
            }),

            switchTrueRiskScoringMode: builder.mutation({
                query: (body) => ({
                    url: '/csm/api/truerisk/switch',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: ['TrueRisk'],
            }),

            recalculateTrueRiskScores: builder.mutation({
                query: () => ({
                    url: '/csm/api/truerisk/recalculate',
                    method: 'POST',
                }),
            }),
        }),
    });

export const {
    useGetTrueRiskPolicyQuery,
    useCreateTrueRiskPolicyMutation,
    useUpdateTrueRiskPolicyMutation,
    useDeleteTrueRiskPolicyMutation,
    useGetTrueRiskDefaultPolicyQuery,
    useSwitchTrueRiskScoringModeMutation,
    useRecalculateTrueRiskScoresMutation,
    useToggleTrueRiskEnabledMutation,
} = trueRiskApi;
