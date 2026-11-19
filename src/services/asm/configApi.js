import { baseApi } from '@/services/baseApi';

export const asmConfigApi = baseApi.enhanceEndpoints({ addTagTypes: ['AsmConfig', "AsmSettings"] }).injectEndpoints({
    endpoints: (builder) => ({

        getAsmConfig: builder.query({
            query: (params) => ({
                url: `/op/config`,
                params
            }),
            providesTags: (result) => ['AsmConfig'],
        }),

        updateAsmConfig: builder.mutation({
            query: (payload) => ({
                url: `/op/config`,
                method: "PUT",
                body: payload
            }),
            invalidatesTags: ['AsmConfig'],
        }),

        enableDisableAsmConfig: builder.mutation({
            query: (payload) => ({
                url: `/op/api/v1/settings/enable-or-disable-scanning`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: ['AsmSettings'],
        }),

        getAsmSettings: builder.query({
            query: (params) => ({
                url: `/op/api/v1/settings`,
                params
            }),
            providesTags: (result) => ['AsmSettings'],
        }),

        addAsmSettings: builder.mutation({
            query: (payload) => ({
                url: `/op/api/v1/settings`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: (result) => ['AsmSettings'],
        }),

        updateAsmSettings: builder.mutation({
            query: (payload) => ({
                url: `/op/api/v1/settings`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: (result) => ['AsmSettings'],
        }),
    }),
});

export const {
    useGetAsmConfigQuery,
    useUpdateAsmConfigMutation,
    useGetAsmSettingsQuery,
    useAddAsmSettingsMutation,
    useUpdateAsmSettingsMutation,
    useEnableDisableAsmConfigMutation
} = asmConfigApi;
