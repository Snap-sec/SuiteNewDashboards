import { Fragment } from 'react';
import { Faq } from '@/partials/common/faq';
import { Help2 } from '@/partials/common/help2';
import { Starter } from '@/partials/custom/starter';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from "@/components/ui/button";
import { Users } from 'lucide-react';
import useStore from '../teams/store';


export function AccountTeamsStarterContent() {
  const setShowAddTeamModal = useStore((state) => state.setShowAddTeamModal);

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <Starter
        image={
          <Fragment>
            <img
              src={toAbsoluteUrl('/media/illustrations/32.svg')}
              className="dark:hidden max-h-[230px]"
              alt="image"
            />

            <img
              src={toAbsoluteUrl('/media/illustrations/32-dark.svg')}
              className="light:hidden max-h-[230px]"
              alt="image"
            />
          </Fragment>
        }
        title="No Teams Found"
        subTitle={
          <Fragment>
            You haven't created any teams yet. Create one team to get started
          </Fragment>
        }
        engage={<Button onClick={() => setShowAddTeamModal(true)}><Users /> Add New Team</Button>}
      />

      <Faq />
      <Help2 />
    </div>
  );
}
