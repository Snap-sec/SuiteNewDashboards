import { Faq } from '@/partials/common/faq';
import { Help } from '@/partials/common/help';
import { CurrentSessions } from './components/current-sessions';
import { Helmet } from 'react-helmet';

export function AccountCurrentSessionsContent() {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <Helmet><title>Auth | Currrent Sessions</title></Helmet>
      <CurrentSessions />
      <Faq />
      {/* <Help /> */}
    </div>
  );
}
