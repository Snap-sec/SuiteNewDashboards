import { baseApi } from "@/services/baseApi";


export const authApi = baseApi.enhanceEndpoints({ addTagTypes: ['Auth', "ProductsOverview", "Profile"] }).injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => {
                let reqbody = credentials;
                if (import.meta.env.VITE_TESTING === 'true') {

                    reqbody = { ...credentials, bypass: true };
                }
                console.log('REQ', reqbody)

                console.log('Vit', import.meta.env.VITE_TESTING)
                console.log('CRED', credentials)
                return ({
                    url: '/auth/api/auth/login',
                    method: 'POST',
                    body: reqbody,
                })
            },
        }),

        checkAuth: builder.query({
            query: () => ({
                url: "/auth/api/auth/check-auth",
                method: "GET",
            }),
        }),

        register: builder.mutation({
            query: ({ inviteId, ...payload }) => ({
                url: inviteId ? `/auth/api/auth/register/${inviteId}` : "/auth/api/auth/register",
                method: "POST",
                body: payload
            }),
        }),

        verifyOtp: builder.mutation({
            query: (payload) => ({
                url: "/auth/api/auth/verify-otp",
                method: "POST",
                body: payload
            }),
        }),

        removeProfilePic: builder.mutation({
            query: () => ({
                url: "/auth/api/auth/profile-picture",
                method: "DELETE",
            }),
            invalidatesTags: ["Profile", "Auth"]
        }),

        // Resend otp when verifying email at signup
        resendAuthEmailVerifyOtp: builder.mutation({
            query: (payload) => ({
                url: "/auth/api/auth/resend-verify-otp",
                method: "POST",
                body: payload
            }),
        }),

        confirmOtp: builder.mutation({
            query: (payload) => ({
                url: "/auth/api/auth/confirm-login",
                method: "POST",
                body: payload
            }),
        }),

        changePassword: builder.mutation({
            query: (payload) => ({
                url: "/auth/api/auth/change-password",
                method: "POST",
                body: payload
            })
        }),


        changeEmail: builder.mutation({
            query: (payload) => ({
                url: "/auth/api/auth/change-email",
                method: "POST",
                body: payload
            })
        }),


        deactivateAccount: builder.mutation({
            query: () => ({
                url: "/auth/api/auth/deactivate",
                method: "POST",
            })
        }),


        deleteAccount: builder.mutation({
            query: () => ({
                url: "/auth/api/auth/account",
                method: "DELETE"
            })
        }),

        resetPassword: builder.mutation({
            query: (emailobject) => ({
                url: '/auth/api/auth/reset',
                method: 'POST',
                body: emailobject,
            }),
        }),


        resetPasswordWithToken: builder.mutation({
            query: (emailobject) => ({
                url: '/auth/api/auth/reset-password',
                method: 'POST',
                body: emailobject,
            }),
        }),

        getProfilePicture: builder.query({
            query: (params) => ({
                url: '/auth/api/auth/profile-picture',
                method: 'GET',
                params,
                responseHandler: (response) => response.blob(), // <== tell it to treat as blob!
            }),
            providesTags: ['Profile'],
        }),

        getProductsOverview: builder.query({
            query: () => ({
                url: '/auth/api/auth/products-overview',
                method: 'GET',
            }),
            providesTags: (result) => ["ProductsOverview"],
        }),

        updateProfilePicture: builder.mutation({
            query: (file) => ({
                url: "/auth/api/auth/profile-picture",
                method: "POST",
                body: file
            }),
            invalidatesTags: ["Profile"]
        }),

        updateRole: builder.mutation({
            query: ({ userId, ...payload }) => ({
                url: `/auth/api/auth/update-role/${userId}`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["Profile", "Member"]
        }),

        updateTwoFactor: builder.mutation({
            query: ({ userId, ...payload }) => ({
                url: `/auth/api/auth/2fa/${userId}`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["Profile", "Member"]
        }),

        updateTeam: builder.mutation({
            query: ({ userId, ...payload }) => ({
                url: `/auth/api/auth/update-team/${userId}`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["Profile", "Member"]
        }),

        createUser: builder.mutation({
            query: (payload) => ({
                url: "/auth/api/auth/create-user",
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["Members"]
        }),

        refreshToken: builder.mutation({
            query: (payload) => ({
                url: "/auth/api/auth/refresh-token",
                method: "POST",
                body: payload
            })
        }),

        updateLicenceDate: builder.mutation({
            query: (payload) => ({
                url: "/auth/api/org/license-expiry",
                method: "PUT",
                body: payload
            })
        }),

        getMemberInviteDetails: builder.query({
            query: ({ inviteId }) => ({
                url: `/auth/api/auth/checkInvite/${inviteId}`,
                method: "GET"
            }),
            // providesTags: (result) => ["SecurityPreferences"]
        }),

        crateLead: builder.mutation({
            query: (payload) => ({
                url: "/auth/api/auth/register-lead",
                method: "POST",
                body: payload
            })
        }),

        verifyLead: builder.mutation({
            query: (payload) => ({
                url: "/auth/api/auth/verify-lead",
                method: "POST",
                body: payload
            })
        }),

        magicLoginLead: builder.mutation({
            query: (payload) => ({
                url: "/auth/api/auth/lead-login/magic-token",
                method: "POST",
                body: payload
            })
        }),

        regeneratePassword: builder.mutation({
            query: ({ userId }) => ({
                url: `/auth/api/auth/regenerate-password/${userId}`,
                method: "POST",
            }),
        }),

        supportedRoles: builder.query({
            query: () => ({
                url: "/auth/api/auth/supported-roles",
                method: "GET",
            }),
        }),

        listOrgs: builder.query({
            query: (params) => ({
                url: "/auth/api/auth/orgs",
                method: "GET",
                params,
            }),
        }),

        loginIntoOrg: builder.mutation({
            query: (payload) => ({
                url: "/auth/api/auth/select-org",
                method: "POST",
                body: payload,
            }),
        }),

        switchOrg: builder.mutation({
            query: (payload) => ({
                url: "/auth/api/auth/switch-org",
                method: "POST",
                body: payload,
            }),
        }),

    }),
});

export const {
    useMagicLoginLeadMutation,
    useCrateLeadMutation,
    useUpdateTeamMutation,
    useRefreshTokenMutation,
    useUpdateLicenceDateMutation,
    useResetPasswordWithTokenMutation,
    useDeactivateAccountMutation,
    useDeleteAccountMutation,
    useChangePasswordMutation,
    useChangeEmailMutation,
    useConfirmOtpMutation,
    useVerifyOtpMutation,
    useRegisterMutation,
    useCreateUserMutation,
    useLoginMutation,
    useGetProfilePictureQuery,
    useGetProductsOverviewQuery,
    useResetPasswordMutation,
    useUpdateRoleMutation,
    useUpdateTwoFactorMutation,
    useUpdateProfilePictureMutation,
    useGetMemberInviteDetailsQuery,
    useVerifyLeadMutation,
    useRegeneratePasswordMutation,
    useResendAuthEmailVerifyOtpMutation,
    useCheckAuthQuery,
    useSupportedRolesQuery,
    useLazySupportedRolesQuery,
    useListOrgsQuery,
    useLoginIntoOrgMutation,
    useSwitchOrgMutation,
    useRemoveProfilePicMutation,
} = authApi;