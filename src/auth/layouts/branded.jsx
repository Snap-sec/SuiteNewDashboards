import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';

export function BrandedLayout() {
  const [pageTitle, setPageTitle] = useState('');

  const [params, setParams] = useSearchParams();

  const location = useLocation();

  useEffect(() => {
    const pathAfterAuth = location.pathname.split('auth/')[1];
    if (pathAfterAuth) setPageTitle(pathAfterAuth || 'Auth');
  }, [location]);

  return (
    <>
      <style>
        {`
          .branded-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/1.png')}');
          }
          .dark .branded-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/1-dark.png')}');
          }
        `}
      </style>

      <Helmet>
        <title>Auth | {pageTitle}</title>
      </Helmet>

      <div className="grid lg:grid-cols-2 grow">
        <div className="flex flex-col justify-center items-center p-8 lg:p-10 order-2 lg:order-1 gap-3">
          {params.get('showReason') == 'true' && (
            <div className="px-5 py-2 rounded-md max-w-[400px] text-[14px] bg-orange-400/20">
              Please ask your organization admin for invitation link.
            </div>
          )}

          <Card className="w-full max-w-[460px]">
            <CardContent className="p-6">
              <Outlet />
            </CardContent>
          </Card>
        </div>

        <div className="lg:rounded-xl lg:border lg:border-border lg:m-5 order-1 lg:order-2 bg-top xxl:bg-center xl:bg-cover bg-no-repeat branded-bg">
          <div className="flex flex-col p-8 lg:p-16 gap-4">
            <Link to="/">
              <img
                src={toAbsoluteUrl('/media/logos/snapsec.svg')}
                className="h-[28px] max-w-none"
                alt=""
              />
            </Link>

            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-semibold text-mono">
                Snapsec Suite
              </h3>
              <div className="text-base font-medium text-secondary-foreground">
                All your cybersecurity needs centralized in one place.
                <br /> secure&nbsp;
                <span className="text-mono font-semibold">
                  Detect, Manage, Remediate,
                </span>
                &nbsp;Continuously from Single Dashboard.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
