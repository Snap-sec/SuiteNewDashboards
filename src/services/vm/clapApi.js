import { baseApi } from "@/services/baseApi";

export const clapApi = baseApi.enhanceEndpoints({ addTagTypes: [''] }).injectEndpoints({
    endpoints: (builder) => ({

        clapForUser: builder.mutation({
            query: (data) => ({
                url: '/csm/api/assessments/clap',
                method: "POST",
                body: data
            }),
        }),

    }),
});

export const { useClapForUserMutation } = clapApi;