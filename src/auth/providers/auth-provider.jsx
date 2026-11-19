import { useEffect, useState } from 'react';
import { AuthContext } from '@/auth/context/auth-context';
import * as authHelper from '@/auth/lib/helpers';
import {
  useLoginMutation,
  useRegisterMutation,
  useConfirmOtpMutation,
  useCrateLeadMutation,
  useVerifyLeadMutation,
  useMagicLoginLeadMutation,
  useLoginIntoOrgMutation,
  useSwitchOrgMutation,
  useRefreshTokenMutation
} from "@/services/auth/authApi";
import { useDispatch } from 'react-redux';
import { useLoginIntoOwnedOrgMutation } from "@/services/auth/serviceProviderApi";
import { baseApi } from "@/services/baseApi";

// Define the Supabase Auth Provider
export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(() => {
    const token = authHelper.getAuth();
    const user = authHelper.getUser();
    return token ? { ...(user || {}), token } : null;
  });
  const [currentUser, setCurrentUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const dispatch = useDispatch();


  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [leadMutation, { isLoading: isleadLoading }] = useCrateLeadMutation();
  const [verifyLeadMutation] = useVerifyLeadMutation();
  const [registerMutation, { isLoading: registering }] = useRegisterMutation();
  const [confirmOTP] = useConfirmOtpMutation();
  const [magicTokenLogin] = useMagicLoginLeadMutation();
  const [loginIntoOrgMutation] = useLoginIntoOrgMutation();
  const [switchOrgMutation] = useSwitchOrgMutation();
  const [loginIntoOwnedOrgMutation] = useLoginIntoOwnedOrgMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  // Check if user is admin and identify user for telemetry
  useEffect(() => {
    setIsAdmin(currentUser?.is_admin === true);

    if (currentUser?.email && window.umami) {
      window.umami.identify({ email: currentUser.email });
    }
  }, [currentUser]);

  // Proactive token refresh every 2.5 minutes using recursive setTimeout.
  useEffect(() => {
    const token = typeof auth === 'string' ? auth : auth?.token;
    if (!token) return;

    const REFRESH_DELAY_MS = 2.5 * 60 * 1000; // 2.5 minutes
    let timeoutId;

    const scheduleRefresh = async () => {
      timeoutId = setTimeout(async () => {
        const user = authHelper.getUser();
        const storedRefreshToken = user?.refreshToken;

        if (storedRefreshToken) {
          try {
            await refreshToken(storedRefreshToken);
          } catch (err) {
            console.warn('[TokenRefresh] Scheduled refresh failed:', err);
          }
        }
        scheduleRefresh(); // reschedule only after current one finishes
      }, REFRESH_DELAY_MS);
    };

    scheduleRefresh();
    return () => clearTimeout(timeoutId);
  }, [auth]);

  useEffect(() => {
    // Initial user load
    const user = authHelper.getUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const verify = async () => {
    if (auth) {
      try {
        const storedUser = authHelper.getUser();

        // Prevent infinite re-render loop by only updating state if data has actually changed
        if (storedUser && JSON.stringify(storedUser) !== JSON.stringify(currentUser)) {
          setCurrentUser(storedUser);
        }
      } catch (error) {
        console.log(error);
        saveAuth(undefined);
        setCurrentUser(undefined);
      }
    }
  };

  const saveAuth = (authData) => {
    if (authData) {
      // Logic for saving both token and user data correctly
      const token = authData.token || (typeof authData === 'string' ? authData : (authData?.token || authHelper.getAuth()));

      if (typeof authData === 'object' && !Array.isArray(authData)) {
        const mergedAuth = { ...authData, token };
        setAuth(mergedAuth);
        authHelper.setAuth(token);
        authHelper.setUser(authData);
        authHelper.setAccountType(authData);
        setCurrentUser(authData);
      } else if (typeof authData === 'string') {
        const storedUser = authHelper.getUser() || {};
        setAuth({ ...storedUser, token: authData });
        authHelper.setAuth(authData);
      }
    } else {
      setAuth(null);
      authHelper.removeAuth();
      setCurrentUser(undefined);
    }
  };

  const login = async (email, password, recaptcha, bypass, remember_me) => {
    try {
      const response = await loginMutation({ email, password, recaptcha, bypass, remember_me }).unwrap();

      if (response.tfa) return { tfa: true };

      // Handle Org Selection Required (Intermediary State)
      const data = response.data || {};
      if (data.requiresOrgSelection === true && data.intermediaryToken) {
        authHelper.setAuth(data.intermediaryToken);

        // Store flags in local storage to persist the state
        const userWithSelection = {
          ...data,
          requiresOrgSelection: true,
          membershipsCount: response.membershipsCount || data.membershipsCount
        };

        // Important: Update local auth state with the intermediary token and user data
        setAuth({ ...userWithSelection, token: data.intermediaryToken });

        authHelper.setUser(userWithSelection);
        setCurrentUser(userWithSelection);

        // Return flattened object for compatibility with SignInPage and other callers
        return {
          ...response,
          ...data,
          requiresOrgSelection: true,
          data: userWithSelection
        };
      }

      const userData = {
        ...(response.data || {}),
        membershipsCount: response.membershipsCount
      };

      saveAuth(userData);
      setCurrentUser(userData || undefined);

      return { ...response, ...userData };
    } catch (err) {
      saveAuth(undefined);
      throw err;
    }
  };


  const loginIntoOrg = async (orgId) => {
    try {
      const { data, status, message } = await loginIntoOrgMutation({ orgId }).unwrap();

      saveAuth(data);
      setCurrentUser(data || undefined);

      return data;
    } catch (error) {
      saveAuth(undefined);
      throw error;
    }
  }

  const switchOrg = async (orgId) => {
    try {
      const { data, status, message } = await switchOrgMutation({ orgId }).unwrap();

      saveAuth(data);
      setCurrentUser(data || undefined);

      return data;
    } catch (error) {
      saveAuth(undefined);
      throw error;
    }
  }

  // service account org login
  const serviceAccountOrgLogin = async (orgId) => {
    try {
      const { data, status, message } = await loginIntoOwnedOrgMutation({ payload: { orgId } }).unwrap();

      // new token: 
      // console.log("NEW TOKEN : ", data?.token);

      saveAuth(data);
      setCurrentUser(data || undefined);

      return data;
    } catch (error) {
      saveAuth(undefined);
      throw error;
    }
  }


  const demoLogin = async ({ firstName, lastName, mobileNumber, companyEmail, companyName, referrer, recaptcha }) => {
    try {
      const { data, status, message } = await leadMutation({ firstName, lastName, mobileNumber, companyEmail, companyName, referrer, recaptcha }).unwrap();

      return { tfa: false };
    } catch (error) {
      throw error;
    }
  };

  const verifyDemoOTP = async ({ otp, email }) => {
    try {
      const { data, status, message } = await verifyLeadMutation({ otp, email }).unwrap();

      if (data) {
        saveAuth(data);
        setCurrentUser(data);
      }

      return data;
    } catch (error) {
      saveAuth(undefined);
      throw error;
    }
  };


  const magicLoginLead = async ({ magic_token }) => {
    try {
      const { data, status, message } = await magicTokenLogin({ magic_token }).unwrap();

      if (data) {
        saveAuth(data);
        setCurrentUser(data);
      }

      return data;
    } catch (error) {
      saveAuth(undefined);
      throw error;
    }
  };

  const confirmOtp = async (email, otp, recaptcha, remember_me) => {
    try {
      const response = await confirmOTP({ email, otp, recaptcha, remember_me }).unwrap();

      // Handle Org Selection Required (Intermediary State)
      const data = response.data || {};
      if (data.requiresOrgSelection === true && data.intermediaryToken) {
        authHelper.setAuth(data.intermediaryToken);

        const userWithSelection = {
          ...data,
          requiresOrgSelection: true,
          membershipsCount: response.membershipsCount || data.membershipsCount
        };

        // Important: Update local auth state with the intermediary token and user data
        setAuth({ ...userWithSelection, token: data.intermediaryToken });

        authHelper.setUser(userWithSelection);
        setCurrentUser(userWithSelection);

        // Return flattened object for compatibility with components
        return {
          ...response,
          ...data,
          requiresOrgSelection: true,
          data: userWithSelection
        };
      }

      const userData = {
        ...(response.data || {}),
        membershipsCount: response.membershipsCount
      };

      saveAuth(userData);
      setCurrentUser(userData || undefined);

      return { ...response, ...userData };
    } catch (error) {
      saveAuth(undefined);
      throw error;
    }
  }

  const register = async (payload) => {
    try {
      const data = await registerMutation(payload);
      saveAuth(data?.data);
      setCurrentUser(data || undefined);
      return data;
    } catch (error) {
      saveAuth(undefined);
      throw error;
    }
  };

  const refreshToken = async (token) => {
    try {
      const rToken = token;

      if (!rToken) {
        console.warn('No refresh token found in storage or state');
        return null;
      }

      const response = await refreshTokenMutation({ refreshToken: rToken }).unwrap();

      if (response?.data) {
        // Store user object and tokens consistently with baseApi.js
        saveAuth(response.data);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Refresh token failed:', error);
      throw error;
    }
  };


  const getUser = async () => {
    return authHelper.getUser();
  };

  const logout = () => {
    authHelper.removeAuth();
    saveAuth(undefined);
    setCurrentUser(undefined);
    dispatch(baseApi.util.resetApiState());
    localStorage.removeItem('vm_assessment_view');
    localStorage.removeItem('accountType');
  };


  const resetApi = () => {
    dispatch(baseApi.util.resetApiState());
  }

  // Update localStorage after profile update.
  const updateUserInLocalstorage = (res) => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser || !res?.data) return;

      const userObj = JSON.parse(storedUser);
      if (!userObj) return;

      // Update profile fields
      if (res.data.firstName !== undefined) userObj.firstName = res.data.firstName;
      if (res.data.lastName !== undefined) userObj.lastName = res.data.lastName;
      if (res.data.twoFactorAuth !== undefined) userObj.twoFactorAuth = res.data.twoFactorAuth;

      // Update auth tokens if backend returned new ones
      if (res.data.token) {
        userObj.token = res.data.token;
        localStorage.setItem("token", res.data.token);
      }
      if (res.data.refreshToken) {
        userObj.refreshToken = res.data.refreshToken;
      }
      if (res.data.expiry) {
        userObj.expiry = res.data.expiry;
      }

      // Save updated user object
      localStorage.setItem("user", JSON.stringify(userObj));
    } catch (err) {
      console.error('Failed to update user in localStorage:', err);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth,
        user: currentUser,
        setUser: setCurrentUser,
        login,
        register,
        getUser,
        logout,
        verify,
        isAdmin,
        confirmOtp,
        demoLogin,
        verifyDemoOTP,
        magicLoginLead,
        loginIntoOrg,
        switchOrg,
        serviceAccountOrgLogin,
        refreshToken,
        resetApi,
        updateUserInLocalstorage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
