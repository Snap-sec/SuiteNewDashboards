import { baseApi } from '@/services/baseApi';

export const endpointApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['endpoint', 'endpoints'] })
  .injectEndpoints({
    endpoints: (builder) => ({
        
        getTmEndpoints: builder.query({
            query: (params) => ({
                url: '/tm/api/endpoints',
                params
            }),
            providesTags: ['endpoints']
        }),

        generateEndpointThreats: builder.mutation({
            query: (endpointId) => ({
                url: `/tm/api/endpoints/${endpointId}/threats/generate`,
                method: "POST"
            }),
        })

    }),
});

export const {
    useGetTmEndpointsQuery,
    useGenerateEndpointThreatsMutation
} = endpointApi
