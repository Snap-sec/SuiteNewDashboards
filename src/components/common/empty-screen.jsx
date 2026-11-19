import { Starter } from '@/partials/custom/starter';
import { useLocation } from 'react-router-dom'; // or whatever router you're using
import { toAbsoluteUrl } from '@/lib/helpers';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

function EmptyScreen({
  title = 'Nothing to Display',
  subTitle = 'Theres currently no data available. Please take an action to get started.',
  darkImgUrl = '/media/illustrations/36-dark.svg',
  lightImgUrl = '/media/illustrations/36-light.svg',
  engage = null,
  showTitle = false,
}) {
  const location = useLocation();

  const getPageTitle = () => {
    const pathname = location.pathname;
    const pathSegments = pathname.replace(/^\//, '').split('/');

    if (pathSegments.includes('vulnerabilities')) {
      return 'Vulnerabilities';
    } else if (pathSegments.includes('vulnerability-report')) {
      return 'Vulnerability Report';
    } else if (pathSegments.includes('assets')) {
      // Check if last segment is numeric ID
      const lastSegment = pathSegments[pathSegments.length - 1];
      if (/^\d+$/.test(lastSegment)) {
        // Last segment is numeric ID, show 'Assets'
        return 'Assets';
      } else {
        // Last segment is not numeric, show last segment capitalized
        return lastSegment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    } else if (pathSegments.includes('reports')) {
      return 'Reports';
    } else {
      // Generic approach - capitalize the last meaningful segment
      const lastSegment = pathSegments[pathSegments.length - 1];
      if (lastSegment && lastSegment !== '') {
        return lastSegment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
      return 'Dashboard'; // fallback
    }
  };

  const pageTitle = getPageTitle();

  return (
    <div className="w-full h-full p-4">
      {showTitle && pageTitle && (
        <div className="text-xl font-medium leading-none text-mono mb-4">
          {pageTitle}
        </div>
      )}
      <Starter
        image={
          <>
            <img
              src={toAbsoluteUrl(lightImgUrl)}
              className="dark:hidden max-h-[230px] w-auto"
              alt="Light illustration"
            />

            <img
              src={toAbsoluteUrl(darkImgUrl)}
              className="hidden dark:block light:hidden max-h-[230px] w-auto"
              alt="Dark illustration"
            />
          </>
        }
        title={title}
        subTitle={subTitle}
        engage={
          engage || (
            <Button
              mode="link"
              underlined="dashed"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw /> Try Refresh
            </Button>
          )
        }
      />
    </div>
  );
}

export { EmptyScreen };
