import AccessDenied from './access-denied';

function ServiceGuard({ children, showAccessDenied = false }) {
    const accountType = localStorage.getItem('accountType');

    const hasAccess = accountType === 'service-provider';

    if (!hasAccess) {
        if (showAccessDenied) {
            return <AccessDenied />;
        }
        return null;
    }

    return children;
}

export default ServiceGuard;
