import { baseApi } from '@/services/baseApi';

export const asmAdapterApi = baseApi.enhanceEndpoints({ addTagTypes: ['AsmAdapters'] }).injectEndpoints({
    endpoints: (builder) => ({
        
        getAsmAdapters: builder.query({
            query: (params) => ({
                url: `/op/api/v1/adapters`,
                params
            }),
            providesTags: (result) => ['AsmAdapters'],
        }),

        installAsmAdapters: builder.mutation({
            query: (payload) => ({
                url: `/op/api/v1/adapters`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: (result) => ['AsmAdapters'],
        }),


        deleteAsmAdapter: builder.mutation({
            query: (adapterID) => ({
                url: `/op/api/v1/adapters/${adapterID}`,
                method: "DELETE"
            }),
            invalidatesTags: ["AsmAdapters"]
        }),

        syncAsmAdapters: builder.mutation({
            query: (adapterID) => ({
                url: `/op/api/v1/adapters/sync/${adapterID}`,
                method: "POST",
            }),
            invalidatesTags: (result) => ['AsmAdapters'],
        }),


        syncAllAsmAdapters: builder.mutation({
            query: (adapterID) => ({
                url: `/op/api/v1/adapters/sync`,
                method: "POST",
            }),
            invalidatesTags: (result) => ['AsmAdapters'],
        }),
    }),
});

export const { 
     useGetAsmAdaptersQuery, 
     useInstallAsmAdaptersMutation, 
     useDeleteAsmAdapterMutation, 
     useSyncAsmAdaptersMutation, 
     useSyncAllAsmAdaptersMutation 
} = asmAdapterApi;
