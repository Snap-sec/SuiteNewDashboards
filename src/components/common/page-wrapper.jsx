import { ContentLoader } from '@/components/common/content-loader';
import { CrashError } from '@/errors/crash-error';

/**
 * PageWrapper - A reusable component that handles loading and error states for pages
 * 
 * @param {boolean} isLoading - Whether the page is loading data
 * @param {any} error - Error object from API request (if any error occurred)
 * @param {React.ReactNode} children - Page content to render when not loading and no error
 * @param {string} loaderClassName - Optional className for the ContentLoader
 * 
 * Usage:
 * <PageWrapper isLoading={isLoading} error={error}>
 *   <YourPageContent />
 * </PageWrapper>
 */
export function PageWrapper({
    isLoading,
    error,
    children,
    loaderClassName = "h-[calc(100vh-64px)]"
}) {
    if (isLoading) {
        return <ContentLoader className={loaderClassName} />;
    }

    if (error) {
        return <CrashError />;
    }

    return children;
}
