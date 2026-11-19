import { baseApi } from "@/services/baseApi";


export const apiSecRequestsApi = baseApi.enhanceEndpoints({ addTagTypes: ['apiSec'] }).injectEndpoints({
    endpoints: (builder) => ({

        getApiSecRequests: builder.query({
            query: (params) => ({
                url: '/apisec/api/v1/raw-request',
                params
            }),
            providesTags: (result) => ["apiSec"]
        }),

        getApiSecTransformedRequests: builder.query({
            query: (params) => ({
                url: `/apisec/api/v1/transformed_requests`,
                params
            }),
            providesTags: (result) => ["apiSec"]
        }),

    })
});


export const { useGetApiSecRequestsQuery, useGetApiSecTransformedRequestsQuery} = apiSecRequestsApi;