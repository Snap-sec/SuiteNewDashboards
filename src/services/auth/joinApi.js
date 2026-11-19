import { baseApi } from "@/services/baseApi";


export const joinApi = baseApi.enhanceEndpoints({ addTagTypes: ['JoinLink'] }).injectEndpoints({
    endpoints: (builder) => ({

        // Get deployment info (public - no auth)
        getDeploymentInfo: builder.query({
            query: () => ({
                url: "/auth/api/auth/deployment-info",
                method: "GET"
            })
        }),

        createRegisteration: builder.mutation({
            query: (data) => ({
                url: "/auth/api/auth/join",
                method: "POST",
                body: data
            })
        }),

        verifyJoinToken: builder.query({
            query: (params) => ({
                url: "/auth/api/auth/join",
                params
            }),
            // Transform response to include teams and departments
            transformResponse: (response) => {
                return {
                    ...response,
                    availableTeams: response?.data?.availableTeams || [],
                    availableDepartments: response?.data?.availableDepartments || []
                };
            }
        })

    })
});


export const { 
    useGetDeploymentInfoQuery,
    useVerifyJoinTokenQuery, 
    useCreateRegisterationMutation 
} = joinApi;