import { baseApi } from "@/services/baseApi";


export const adapterApi = baseApi.enhanceEndpoints({ addTagTypes: ['auth_adapters'] }).injectEndpoints({
    endpoints: (builder) => ({

        authListAdapters: builder.query({
            query: (params) => ({
                url: '/auth/api/adapters',
                params
            }),
            providesTags: (result) => ["auth_adapters"]
        }),

        authCreateAdapter: builder.mutation({
            query: (payload) => ({
                url: "/auth/api/adapters",
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["auth_adapters"]
        }),


        authDeleteAdapter: builder.mutation({
            query: (adapterId) => ({
                url: `/auth/api/adapters/${adapterId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["auth_adapters"]
        }),
    })
});


export const { useAuthListAdaptersQuery, useAuthCreateAdapterMutation, useAuthDeleteAdapterMutation } = adapterApi;