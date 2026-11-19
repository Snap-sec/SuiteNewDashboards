import { Fragment } from 'react';
import { Engage } from '@/partials/common/engage';
import { Faq } from '@/partials/common/faq';
import { HighlightedPosts } from '@/partials/common/highlighted-posts';
import { MonitorStop, Settings2, ShieldCheck, Unplug } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useGetOrgQuery } from '@/services/auth/orgApi';
import {
  useGenerateApikeyMutation,
  useGetApiKeyQuery,
  useRatateApikeyMutation,
} from '../../../services/auth/apiKeyApi';
import { DoNotDistrub } from '../notifications';
import { ApiIntegrations, ApiKeysTable, Webhooks } from './components';
import ApiErrorHandler from '../../../components/common/api-error-handler';

export function AccountApiKeysContent() {
  const { data, isLoading, isError, error } = useGetApiKeyQuery();
  const [generateApiKey] = useGenerateApikeyMutation();
  const [rotateApiKey] = useRatateApikeyMutation();

  const handleRotate = async () => {
    try {
      await rotateApiKey().unwrap();
      toast.success('API key rotated successfully');
    } catch (error) {
      toast.error('Failed to rotate API key');
    }
  };

  const posts = [
    {
      icon: Unplug,
      title: 'Connect Adapters',
      summary:
        'Easily link adapters across your applications using your API key. This allows seamless data exchange and communication between different modules or environments without manual configuration.',
      path: 'https://docs.snapsec.co',
    },
    {
      icon: ShieldCheck,
      title: 'Access Secure Routes',
      summary:
        'Use your API key to authenticate and securely access protected routes. Every request made with this key is verified to ensure your integrations and services remain private and secure.',
      path: 'https://docs.snapsec.co',
    },
    {
      icon: Settings2,
      title: 'Automate Integrations',
      summary:
        'Empower your workflows by using the API key to automate interactions between adapters. Trigger events, share data, and manage processes across connected systems effortlessly.',
      path: 'https://docs.snapsec.co',
    },
    {
      icon: MonitorStop,
      title: 'Monitor Usage',
      summary:
        'Track your API key’s activity in real time. View request counts, connected adapters, and integration performance metrics to optimize usage and maintain security.',
      path: 'https://docs.snapsec.co',
    },
  ];

  if (isError) return <ApiErrorHandler error={error} />

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5">
      <Helmet>
        <title>Auth | Api Keys</title>
      </Helmet>
      <ApiKeysTable
        data={data?.data}
        isLoading={isLoading}
        onRotate={handleRotate}
      />
      {/* <Faq /> */}
      {/* <Engage
        title="Contact Support"
        description="Need assistance? Contact our support team for prompt, personalized help your queries & concerns."
        image={
          <Fragment>
            <img
              src={toAbsoluteUrl('/media/illustrations/31.svg')}
              className="dark:hidden max-h-[150px]"
              alt="image"
            />

            <img
              src={toAbsoluteUrl('/media/illustrations/31-dark.svg')}
              className="light:hidden max-h-[150px]"
              alt="image"
            />
          </Fragment>
        }
        more={{
          title: 'Contact Support',
          url: 'mailto:support@snapsec.co',
        }}
      /> */}
    </div>
  );
}
