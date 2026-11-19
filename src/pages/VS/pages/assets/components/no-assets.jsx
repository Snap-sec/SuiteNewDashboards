import { Starter } from '@/partials/custom/starter';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

function NoAssets() {

    const navigate = useNavigate();

    return (
      <div className="w-full h-full p-4">
        <Starter
          image={
            <>
              <img
                src={toAbsoluteUrl('/media/illustrations/29.svg')}
                className="dark:hidden max-h-[230px]"
              />

              <img
                src={toAbsoluteUrl('/media/illustrations/29-dark.svg')}
                className="light:hidden max-h-[230px]"
              />
            </>
          }
          title="No Assets Found"
          subTitle="Your asset list is currently empty."
          engage={
            <Button variant="primary" onClick={() => navigate("/vs/integration")}>
              <Plus /> Integrate AIM
            </Button>
          }
        />
      </div>
    );
}

export default NoAssets;
