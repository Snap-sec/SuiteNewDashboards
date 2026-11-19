import { createContext, useContext } from 'react';

// Create AuthContext with types
export const AuthContext = createContext({
  loading: false,
  auth: null,
  setLoading: () => { },
  saveAuth: () => { },
  setUser: () => { },
  login: async () => { },
  register: async () => { },
  requestPasswordReset: async () => { },
  resetPassword: async () => { },
  resendVerificationEmail: async () => { },
  getUser: async () => null,
  updateProfile: async () => ({}),
  logout: () => { },
  verify: async () => { },
  refreshToken: async () => ({}),
  demoLogin: async () => ({}),
  demoRedirect: async () => { },
  verifyDemoOTP: async () => { },
  serviceAccountOrgLogin: async () => { },
});

// Hook definition
export function useAuth() {
  return useContext(AuthContext);
}
