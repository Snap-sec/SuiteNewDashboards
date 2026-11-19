import { baseApi } from "@/services/baseApi";

export const vsScannerApi = baseApi.enhanceEndpoints({ addTagTypes: ['VsScanners'] }).injectEndpoints({
    endpoints: (builder) => ({

        vsDeleteVsScanner: builder.mutation({
            query: (scannerId) => ({
                url: `/vs/api/scanners/${scannerId}`,
                method: "DELETE",
            }),
            invalidateTags: ['VsScanners']
        }),

    }),
});


export const { useVsDeleteVsScannerMutation } = vsScannerApi;
