import { Link, useLocation } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';

const JoinSuccess = () => {
  const { settings } = useSettings();
  const location = useLocation();
  
  // Get contact info passed from OTP verification
  const { adminContact, teamLeadContact, orgName } = location.state || {};

  // Build the contact message
  const getContactMessage = () => {
    if (adminContact && teamLeadContact) {
      return (
        <>
          Please reach out to Admin <strong>{adminContact.name}</strong> ({adminContact.email}) or 
          Team Lead <strong>{teamLeadContact.name}</strong> ({teamLeadContact.email}) to proceed with your account approval.
        </>
      );
    } else if (adminContact) {
      return (
        <>
          Please reach out to Admin <strong>{adminContact.name}</strong> ({adminContact.email}) to proceed with your account approval.
        </>
      );
    } else if (teamLeadContact) {
      return (
        <>
          Please reach out to Team Lead <strong>{teamLeadContact.name}</strong> ({teamLeadContact.email}) to proceed with your account approval.
        </>
      );
    }
    return "Contact the admin of the organization for the approval of your joining request.";
  };

  return (
    <div className="px-4 py-8">
      <div className="flex justify-center mb-5">
        <img
          src={toAbsoluteUrl('/media/illustrations/32.svg')}
          className="dark:hidden max-h-[180px]"
          alt=""
        />

        <img
          src={toAbsoluteUrl('/media/illustrations/32-dark.svg')}
          className="light:hidden max-h-[180px]"
          alt=""
        />
      </div>

      <h3 className="text-lg font-medium text-mono text-center mb-4">
        Thank you for confirming your OTP
      </h3>
      <div className="text-sm text-center text-secondary-foreground mb-7.5">
        {getContactMessage()}
        <p className="mt-2 text-muted-foreground">
          Once approved, you will be able to access the dashboard.
        </p>
      </div>

      <Button asChild className="w-full">
        <Link
          to={
            settings?.layout === 'auth-branded'
              ? '/auth/signin'
              : '/auth/signin'
          }
        >
          Sign in
        </Link>
      </Button>
    </div>
  );
};

export { JoinSuccess };
