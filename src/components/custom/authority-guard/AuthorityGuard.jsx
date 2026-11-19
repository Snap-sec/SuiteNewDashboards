import { useAuth } from '@/auth/context/auth-context';
import AccessDenied from './access-denied';


function AuthorityGuard({ roles = [], forbidRoles = [], allowedUsers = [], children, showAccessDenied = false }) {
    const { user } = useAuth();

    let hasAccess = false;

    // if current suer is allowed
    for (let tenant of allowedUsers) {
        if (tenant.userId == user._id) { hasAccess = true; break; }
    }

    const currentRole = user?.role;

    // platform admin can access all pages
    if (currentRole === 'Platform Admin') {
        return children;
    }

    if (!hasAccess) {
        if (roles.length === 0 && forbidRoles.length > 0) {
            hasAccess = true;
        } else {
            hasAccess = roles?.includes(currentRole);
        }
    }

    if (forbidRoles?.includes(currentRole)) {
        hasAccess = false;
    }

    if (!hasAccess) {

        if (showAccessDenied) {
            return <AccessDenied />
        }

        return null;
    }

    return children;
}

export default AuthorityGuard;
