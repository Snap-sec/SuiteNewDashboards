import { useAuth } from '@/auth/context/auth-context';
import { ChevronRight, LockKeyhole } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import appConfig from "@/config/appConfig.js";


export function ProductSwitch({ trigger }) {
  const navigate = useNavigate();
  const { logout, auth } = useAuth();

  const productList = auth?.products?.length ? auth.products : appConfig.PRODUCT_LIST;
  const items = productList.map(product => ({
    ...product,
    title: product.name || product.title,
    lock: product.access !== undefined ? !product.access : !auth?.accessTo?.includes(product.id)
  }));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] p-0" side="bottom" align="end">
        <div className="flex items-center justify-between gap-2.5 text-xs text-secondary-foreground font-medium px-5 py-3 border-b border-b-gray-100 dark:border-b-gray-800">
          <span>Apps</span>
        </div>
        <div className="flex flex-col scrollable-y-auto max-h-[600px] divide-y divide-gray-100 dark:divide-gray-800">
          {items.map((item, index) => (
            <div
              // onClick={() => (item.lock ? null : navigate(item.link))}
              key={index}
              className={`flex items-center justify-between flex-wrap gap-2 ${item.lock ? 'cursor-not-allowed' : ''
                }`}
            >
              {!item.lock ? (
                <Link
                  to={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-full justify-between gap-2  px-5 py-3.5"
                >
                  <div className="flex items-center flex-wrap gap-2">
                    <div className="flex items-center justify-center shrink-0 rounded-full bg-accent/60 border border-border size-10">
                      <img
                        src={toAbsoluteUrl(`/media/logos/${item.logo}`)}
                        className="size-6"
                        alt={item.title}
                      />
                    </div>

                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-semibold text-mono hover:text-primary-active`}
                      >
                        {item?.title}
                      </span>
                      {item.description && (
                        <span className="text-xs font-medium text-secondary-foreground ">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-primary" />
                </Link>
              ) : (
                <>
                  <div className="flex items-center w-full justify-between gap-2 px-5 py-3.5">
                    <div className="flex items-center flex-wrap gap-2">
                      <div className="flex items-center justify-center shrink-0 rounded-full bg-accent/60 border border-border size-10">
                        <img
                          src={toAbsoluteUrl(`/media/logos/${item.logo}`)}
                          className="size-6"
                          alt={item.title}
                        />
                      </div>

                      <div className="flex flex-col">
                        <span
                          className={`text-sm font-semibold text-mono hover:text-primary-active`}
                        >
                          {item.title}
                        </span>
                        {item.description && (
                          <span className="text-xs font-medium text-secondary-foreground ">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <LockKeyhole className="text-primary" size={17} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="grid p-5 border-t border-t-border">
          <Button asChild variant="outline" size="sm">
            <Link to="/">Go to Home</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
