import { Help } from '@/partials/common/help';
import { SecurityLog } from './components';
import { Helmet } from 'react-helmet';
import PageHeading from '../../../../components/custom/page-heading';

export function AccountSecurityLogContent() {
  return (
    <div className="grid mb-4">
      <Helmet><title>Auth | Security Log</title></Helmet>
      <PageHeading
        title="Security Log"
        description="View and manage authorized devices and active sessions with access to your security reports and account."
      />
      <SecurityLog />
      {/* <Help /> */}
    </div>
  );
}
