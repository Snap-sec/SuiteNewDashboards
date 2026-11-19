import { baseApi } from "@/services/baseApi";


export const orgApi = baseApi.enhanceEndpoints({ addTagTypes: ['Members', 'JoinLink', 'company-profile', 'McpAccess'] }).injectEndpoints({
    endpoints: (builder) => ({

        getOrgMembers: builder.query({
            query: (params) => ({
                url: '/auth/api/org/members',
                params
            }),
            providesTags: (result) => ["Members"]
        }),

        getOrgMember: builder.query({
            query: (memberId) => ({
                url: `/auth/api/auth/user/${memberId}`,
            }),
            providesTags: (result) => ["Member"]
        }),

        updateMemberAccess: builder.mutation({
            query: (data) => ({
                url: `/auth/api/org/members/access`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Member", "ProductsOverview"]
        }),

        deleteMember: builder.mutation({
            query: (memberId) => ({
                url: `/auth/api/org/members/${memberId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Members"]
        }),

        getOrg: builder.query({
            query: (params) => ({
                url: "/auth/api/org",
                params
            }),
            providesTags: (result) => ["OrgDetails"]
        }),

        createOrg: builder.mutation({
            query: (payload) => ({
                url: "/auth/api/auth/onboard",
                method: "POST",
                body: payload
            })
        }),

        getProfile: builder.query({
            query: () => ({
                url: "/auth/api/auth/profile"
            }),
            providesTags: (result) => ["Profile"]
        }),

        updateProfile: builder.mutation({
            query: (payload) => ({
                url: "/auth/api/auth/profile",
                method: "PUT",
                body: payload
            }),
            invalidatesTags: ["Profile", "OrgDetails"]
        }),

        getPendingRegisterations: builder.query({
            query: (params) => ({
                url: "/auth/api/org/pending-registrations",
                params
            }),
            providesTags: (result) => ["PendingRegisterations"]
        }),

        inviteMember: builder.mutation({
            query: (data) => ({
                url: "/auth/api/org/members/invite",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Members"]
        }),

        activateMember: builder.mutation({
            query: (payload) => ({
                url: "/auth/api/auth/unlock-inactive",
                method: "POST",
                body: payload
            })
        }),

        getJoinLink: builder.query({
            query: () => ({
                url: "/auth/api/org/join-link"
            }),
            providesTags: (result) => ["JoinLink"]
        }),

        refreshJoinLink: builder.mutation({
            query: () => ({
                url: "/auth/api/org/join-link/refresh",
                method: "POST"
            }),
            invalidatesTags: ["JoinLink"]
        }),

        processRegisteration: builder.mutation({
            query: (payload) => ({
                url: `/auth/api/org/process-registration`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["PendingRegisterations"]
        }),

        getMemberActivity: builder.query({
            query: (params) => ({
                url: "/auth/api/org/members/latest-logins",
                params
            }),
            providesTags: (result) => ["UserActivity"]
        }),


        getOrgSecurityPreferences: builder.query({
            query: () => ({
                url: "/auth/api/org/security-preferences",
                method: "GET"
            }),
            providesTags: (result) => ["SecurityPreferences"]
        }),

        updateOrgSecurityPreferences: builder.mutation({
            query: (payload) => ({
                url: '/auth/api/org/security-preferences',
                method: "PUT",
                body: payload
            }),
            invalidatesTags: ["SecurityPreferences"]
        }),


        // lock unlock account
        lockAccount: builder.mutation({
            query: ({ userId }) => ({
                url: `/auth/api/auth/lock/${userId}`,
                method: "POST"
            }),
            invalidatesTags: ["Members", "Member"]
        }),

        unlockAccount: builder.mutation({
            query: ({ userId }) => ({
                url: `/auth/api/auth/unlock/${userId}`,
                method: "POST"
            }),
            invalidatesTags: ["Members", "Member"]
        }),

        // Company profile
        getComapnyProfile: builder.query({
            query: (params) => ({
                url: '/auth/api/org/company-profile',
                params
            }),
            providesTags: (result) => ["company-profile"]
        }),

        setCompanyProfile: builder.mutation({
            query: (payload) => ({
                url: '/auth/api/org/company-profile',
                method: "PUT",
                body: payload
            }),
            invalidatesTags: ["company-profile"]
        }),


        getOrgMcpAccess: builder.query({
            query: () => ({
                url: "/auth/api/org/mcp-access",
                method: "GET"
            }),
            providesTags: (result) => ["McpAccess"]
        }),

        updateOrgMcpAccess: builder.mutation({
            query: (payload) => ({
                url: '/auth/api/org/mcp-access',
                method: "PUT",
                body: payload
            }),
            invalidatesTags: ["McpAccess"]
        }),

    }),
});


export const { useLockAccountMutation, useUnlockAccountMutation, useCreateOrgMutation, useActivateMemberMutation, useLazyGetOrgQuery, useGetOrgSecurityPreferencesQuery, useUpdateOrgSecurityPreferencesMutation, useProcessRegisterationMutation, useGetOrgMembersQuery, useLazyGetOrgMembersQuery, useGetOrgQuery, useGetProfileQuery, useGetPendingRegisterationsQuery, useInviteMemberMutation, useGetJoinLinkQuery, useRefreshJoinLinkMutation, useDeleteMemberMutation, useGetOrgMemberQuery, useUpdateMemberAccessMutation, useUpdateProfileMutation, useGetMemberActivityQuery, useGetComapnyProfileQuery, useSetCompanyProfileMutation, useGetOrgMcpAccessQuery, useUpdateOrgMcpAccessMutation } = orgApi;