import { useAuth } from '@/auth/context/auth-context';
import AccessDenied from './access-denied';



function CustomAuthorityGuard({ allowedUsers=[], roles=[] showAccessDenied = false, children }) {
    const { user } = useAuth();

    if (!allowedUsers?.length) return null;

    let hasAccess = false;

    for (let tenant of allowedUsers) {

        if (tenant?.userId == user._id) { hasAccess = true; break; }
    }

    if (hasAccess) {

        if (showAccessDenied) {
            return <AccessDenied />
        }

        return null;
    }

    return children;
}

export default CustomAuthorityGuard;