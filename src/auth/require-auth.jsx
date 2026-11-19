import { useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { ScreenLoader } from '@/components/common/screen-loader';
import { useAuth } from './context/auth-context';

/**
 * Component to protect routes that require authentication.
 * If user is not authenticated, redirects to the login page.
 */
export const RequireAuth = () => {
  const { auth, user, verify, loading: globalLoading } = useAuth();

  const [params, setParams] = useSearchParams();

  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const verificationStarted = useRef(false);

  // Robustly extract the token from auth state
  const token = typeof auth === 'string' ? auth : auth?.token;

  useEffect(() => {
    const checkAuth = async () => {
      if (!token || !verificationStarted.current) {
        verificationStarted.current = true;
        try {
          await verify();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [auth, verify, token]);

  // Show screen loader while checking authentication
  // console.log("loader: ", loading, globalLoading);
  if (loading || globalLoading) {
    return <ScreenLoader />;
  }

  // If not authenticated, redirect to login
  if (!token) {

    // handle demo redirections
    if (params.get("fromDemo") == true || params.get("fromDemo") == "true") {

      return (<Navigate
        to={`/demo?next=${encodeURIComponent(location.pathname)}`}
        replace
      />)
    }

    return (
      <Navigate
        to={`/auth/signin?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // If a password change is required, redirect to the mandatory page
  if (user?.forcePasswordChange) {
    return (
      <Navigate
        to={`/auth/force-password-change?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // If authenticated, render child routes
  return <Outlet />;
};
