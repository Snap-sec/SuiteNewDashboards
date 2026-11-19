import { baseApi } from "@/services/baseApi";


export const apiKeyApi = baseApi.enhanceEndpoints({ addTagTypes: ['apiKey'] }).injectEndpoints({
    endpoints: (builder) => ({

        getApiKey: builder.query({
            query: (params) => ({
                url: '/auth/api/api-keys',
                params
            }),
            providesTags: (result) => ["apiKey"]
        }),

        generateApikey: builder.mutation({
            query: () => ({
                url: "/auth/api/auth/api-key/generate",
                method: "POST",
            }),
            invalidatesTags: ["apiKey"]
        }),

        ratateApikey: builder.mutation({
            query: () => ({
                url: "/auth/api/auth/user/api-key/ratate",
                method: "POST",
            }),
            invalidatesTags: ["apiKey"]
        }),
        createApiKey: builder.mutation({
            query: (data) => ({
                url: "/auth/api/api-keys",
                method: "POST",
                body: data
            }),
            providesTags: ["apiKey"],
            invalidatesTags: ["apiKey"]
        }),
        deleteApiKey: builder.mutation({
            query: (id) => ({
                url: `/auth/api/api-keys/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["apiKey"]
        }),

    })
});


export const { useGetApiKeyQuery, useGenerateApikeyMutation, useRatateApikeyMutation, useCreateApiKeyMutation, useDeleteApiKeyMutation } = apiKeyApi;