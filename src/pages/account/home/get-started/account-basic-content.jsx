import { Fragment } from 'react';
import {
  Bell,
  Bot,
  Boxes,
  FileText,
  IdCard,
  KeySquare,
  LineChart,
  MonitorSmartphone,
  MousePointerSquareDashed,
  Palette,
  ShieldCheck,
  Users,
  GitFork
} from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Options } from './components';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/auth/context/auth-context';

export function AccountGetStartedContent() {
  const { user } = useAuth();
  const items = [
    {
      icon: IdCard,
      title: 'Personal info',
      desc: "Manage your name, email, organization info, and other profile settings all in one place.",
      path: '/profile/account/user-info',
    },
    {
      icon: ShieldCheck,
      title: 'Login & Security',
      desc: 'Update your password, enable 2FA, and review login activity for enhanced security.',
      path: '/profile/account/user-info#auth_email',
    },
    // {
    //   icon: FileText,
    //   title: 'Billing & Payments',
    //   desc: 'Simplify payments today with secure, user-friendly transaction processes.',
    //   path: 'account/billing/basic',
    // },
    {
      icon: Bell,
      title: 'Notifications',
      desc: 'Customize your notification preferences, vulnerability alerts, and other notifications.',
      path: '/profile/account/user-info#advanced_settings_notifications',
    },
    // {
    //   icon: Boxes,
    //   title: 'Integrations',
    //   desc: 'Enhance Workflows with Advanced Integrations.',
    //   path: '/account/integrations',
    // },
    {
      icon: Users,
      title: 'Members, Teams & Departments',
      desc: 'Add or remove users, and manage access across Departments and Teams.',
      path: '/profile/account/members/team-members',
    },
    {
      icon: KeySquare,
      title: 'API Keys',
      desc: 'Secure and manage Your API Keys effectively and efficiently.',
      path: '/profile/account/api-keys',
    },
    {
      icon: MousePointerSquareDashed,
      title: 'Appearance',
      desc: 'Configure your workspace branding, theme, and logo to reflect your organization.',
      path: '/profile/account/user-info#advanced_settings_appearance',
    },
    {
      icon: MonitorSmartphone,
      title: 'Devices',
      desc: 'Review and manage people that have accessed your organization’s workspace.',
      path: '/profile/account/security/current-sessions',
    },
    // {
    //   icon: Palette,
    //   title: 'Brand',
    //   desc: 'Trending brand designs, identities, and logos.',
    //   path: '/account/invite-a-friend',
    // },
    {
      icon: LineChart,
      title: 'Activity',
      desc: 'View detailed logs of user actions within your organization.',
      path: '/profile/account/security/security-log',
    },
    ...(user?.role === 'Admin' ? [{
      icon: GitFork,
      title: 'Integrations',
      desc: 'Connect and manage third-party service integrations.',
      path: '/profile/account/integrations',
    }] : []),
    // ...(user?.role === 'Admin' || user?.role === 'Platform Admin' ? [{
    //   icon: Bot,
    //   title: 'AI Integrations',
    //   desc: 'Configure AI models, API keys, and settings for automated workflows.',
    //   path: '/profile/account/ai-config',
    // }] : []),
  ];

  return (
    <Fragment>
      <Helmet><title>Auth | Get Started</title></Helmet>
      <Options items={items} dropdown={true} />
      {/* <div className="flex grow justify-center pt-5 lg:pt-7.5">
        <Button mode="link" underlined="dashed" asChild>
          <Link to="/account/members/team-info">More Account Options</Link>
        </Button>
      </div> */}
    </Fragment>
  );
}
