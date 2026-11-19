import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Cards = ({ data, customItems, isLoading }) => {



  const defaultItems = [
    {
      info: data?.total || 0,
      desc: 'Total Assets',
    },
    {
      info: data?.subdomain || 0,
      desc: 'Subdomains',
      path: '/assetinventory/assets/subdomains',
    },
    {
      info: data?.api || 0,
      desc: 'APIs',
      path: '/assetinventory/assets/apis',
    },
    {
      info: data?.ip || 0,
      desc: 'IP Addresses',
      path: '/assetinventory/assets/ips',
    },
    {
      info: data?.repository || 0,
      desc: 'Repositories',
      path: '/assetinventory/assets/repositories',
    },
    {
      info: data?.certificate || 0,
      desc: 'Certificates',
      path: '/assetinventory/assets/certificates',
    },
    {
      info: data?.employee || 0,
      desc: 'Employees',
      path: '/assetinventory/assets/employees',
    },
    {
      info: data?.application || 0,
      desc: 'Applications',
      path: '/assetinventory/assets/applications',
    },
    // {
    //   info: data?.dns || 0,
    //   desc: 'DNS',
    //   path: '/assetinventory/assets/dns-records',
    // },
    // {
    //   info: data?.other || 0,
    //   desc: 'Others',
    // },
  ];

  const items = customItems || defaultItems;

  if (isLoading) {
    return (
      <Card className="col-span-4 animate-pulse">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-center">
            {items.map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center flex-1 gap-2.5 border-e border-input last:border-e-0 py-1"
              >
                <Skeleton className="h-6 w-10 rounded" />
                <Skeleton className="h-4.5 w-18 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4">
      <CardContent className="p-6">
        <div className="flex items-center justify-between text-center">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.path || '#'}
              className="flex flex-col items-center justify-center flex-1 gap-1 text-center border-e border-input last:border-e-0 transition-colors rounded-sm py-1 cursor-pointer"
            >
              <span className="text-mono text-2xl leading-none font-semibold">
                {item.info}
              </span>
              <span className="text-secondary-foreground text-sm font-medium">
                {item.desc}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Cards;
