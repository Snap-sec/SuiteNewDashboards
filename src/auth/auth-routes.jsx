import { BrandedLayout } from './layouts/branded';
import { ClassicLayout } from './layouts/classic';
import { CallbackPage } from './pages/callback-page';
import { ChangePasswordPage } from './pages/change-password-page';
import { CheckEmail } from './pages/extended/check-email';
import { ResetPasswordChanged } from './pages/extended/reset-password-changed';
import { ResetPasswordCheckEmail } from './pages/extended/reset-password-check-email';
import { TwoFactorAuth } from './pages/extended/tfa';
import { ResetPasswordPage } from './pages/reset-password-page';
import { SignInPage } from './pages/signin-page';
import { SignUpPage } from './pages/signup-page';
import { RegisterTwoFactorAuth } from './pages/extended/register-tfa';
import { LoginTwoFactorAuth } from './pages/extended/login-tfa';
import { ForcePasswordChangePage } from './pages/force-password-change-page';
import Onboarding from "./pages/onboarding";
import { Join } from './pages/join';
import { JoinTwoFA } from './pages/extended/join-tfa';
import { JoinSuccess } from './pages/extended/join-success';
import { RequireAuth } from './require-auth';
import SelectOrgPage from './pages/select-org';

// Define the auth routes
export const authRoutes = [
  {
    path: '',
    element: <BrandedLayout />,
    children: [
      {
        path: 'signin',
        element: <SignInPage />,
      },
      {
        path: 'signup',
        element: <SignUpPage />,
      },
      {
        path: 'join',
        element: <Join />,
      },
      {
        path: 'change-password',
        element: <ChangePasswordPage />,
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: 'force-password-change',
        element: <ForcePasswordChangePage />,
      },
      {
        path: 'onboarding',
        element: <Onboarding />,
      },
      /* Extended examples */
      {
        path: 'register-2fa',
        element: <RegisterTwoFactorAuth />,
      },
      {
        path: 'join-2fa',
        element: <JoinTwoFA />,
      },
      {
        path: 'join-success',
        element: <JoinSuccess />,
      },
      {
        path: 'login-2fa',
        element: <LoginTwoFactorAuth />
      },
      {
        path: 'check-email',
        element: <CheckEmail />,
      },
      {
        path: 'reset-password/check-email',
        element: <ResetPasswordCheckEmail />,
      },
      {
        path: 'reset-password/changed',
        element: <ResetPasswordChanged />,
      },
      {
        path: "callback",
        element: <CallbackPage />
      },
    ],
  },

  {
    path: "orgs",
    element: <RequireAuth />,
    children: [
      {
        path: "",
        element: <SelectOrgPage />
      }
    ]
  }
  // {
  //   path: '',
  //   element: <ClassicLayout />,
  //   children: [
  //     {
  //       path: 'classic/signin',
  //       element: <SignInPage />,
  //     },
  //     {
  //       path: 'classic/signup',
  //       element: <SignUpPage />,
  //     },
  //     {
  //       path: 'classic/change-password',
  //       element: <ChangePasswordPage />,
  //     },
  //     {
  //       path: 'classic/reset-password',
  //       element: <ResetPasswordPage />,
  //     },
  //     /* Extended examples */
  //     {
  //       path: 'classic/2fa',
  //       element: <TwoFactorAuth />,
  //     },
  //     {
  //       path: 'classic/check-email',
  //       element: <CheckEmail />,
  //     },
  //     {
  //       path: 'classic/reset-password/check-email',
  //       element: <ResetPasswordCheckEmail />,
  //     },
  //     {
  //       path: 'classic/reset-password/changed',
  //       element: <ResetPasswordChanged />,
  //     },
  //   ],
  // },
];
