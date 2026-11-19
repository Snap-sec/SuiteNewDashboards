import { Fragment } from 'react';
import { FeaturesHighlight } from '@/pages/public-profile/profiles/creator/components';
import { HighlightedPosts } from '@/partials/common/highlighted-posts';
import { ShieldCheck, ShieldOff, ShieldQuestion } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import {
  Authentification,
  GeneralSettings,
  LoginSessions,
  ProductInsight,
  QuickSettings,
  TrustedDevices,
} from './components';
import { Helmet } from 'react-helmet';

export function AccountOverviewContent() {
  const posts =[
    {
      icon: ShieldOff,
      title: 'Enforce 2FA for All Users',
      summary: 'Strengthen account security by requiring two-factor authentication for all users, reducing the risk of unauthorized access even if credentials are compromised.',
      path: '#',
    },
    {
      icon: ShieldCheck,
      title: 'Limit Access Based on Roles',
      summary: 'Protect sensitive vulnerability data by assigning access rights based on user roles, ensuring members only see what they need to perform their tasks.',
      path: '#',
    },
    {
      icon: ShieldQuestion,
      title: 'Monitor Activity Logs Regularly',
      summary: 'Stay informed by regularly reviewing activity logs to detect unusual behavior, trace changes, and ensure accountability across your organization.',
      path: '#',
    }
  ];
  

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-7.5">
      <Helmet><title>Auth | Security Overview</title></Helmet>
      <div className="col-span-2">
        <div className="flex flex-col gap-5 lg:gap-7.5">
          <FeaturesHighlight
            image={
              <Fragment>
                <img
                  src={toAbsoluteUrl('/media/illustrations/5.svg')}
                  className="dark:hidden max-h-36"
                  alt="image"
                />

                <img
                  src={toAbsoluteUrl('/media/illustrations/5-dark.svg')}
                  className="light:hidden max-h-36"
                  alt="image"
                />
              </Fragment>
            }
            title={<>Control how team members access and manage vulnerability data.</>}
            description="Define permissions and security policies for managing vulnerabilities across your organization."
            more={{ title: 'Review Security Tips', url: '#' }}
            features={[
              ['Report sharing control', 'Member invite permissions'],
              ['Public report restrictions', 'Vulnerability data access'],
            ]}
          />

          <GeneralSettings />
          {/* <Authentification /> */}
          {/* <QuickSettings /> */}
          {/* <LoginSessions /> */}
          {/* <TrustedDevices /> */}
        </div>
      </div>
      <div className="col-span-1">
        <div className="flex flex-col gap-5 lg:gap-7.5">
          {/* <ProductInsight
            image={
              <Fragment>
                <img
                  src={toAbsoluteUrl('/media/brand-logos/apple-black.svg')}
                  className="dark:hidden h-5"
                  alt="image"
                />

                <img
                  src={toAbsoluteUrl('/media/brand-logos/apple-white.svg')}
                  className="light:hidden h-5"
                  alt="image"
                />
              </Fragment>
            }
            title="iOS"
            description="Active Sessions"
            number={24}
          /> */}

          {/* <ProductInsight
            image={
              <img
                src={toAbsoluteUrl('/media/brand-logos/android.svg')}
                className="h-5"
                alt="image"
              />
            }
            title="Android"
            description="Active Sessions"
            number={35}
          /> */}

          <HighlightedPosts posts={posts} />
        </div>
      </div>
    </div>
  );
}
