import { Building2, ChevronRight, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import appConfig from '@/config/appConfig.js';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { Card2 } from './cards';

export function AppCards({ access }) {
  const navigate = useNavigate();

  const items = appConfig.PRODUCT_LIST.map((product) => ({
    ...product,
    lock: !access?.includes(product.id),
  }));

  const renderItem = (item, index) => (
    <div
      key={index}
      className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
    >
      <Card2
        logo={item.logo}
        title={item.title}
        name={item.name}
        link={item.link}
        lock={item.lock}
      />
    </div>
  );

  return (
    <div className="space-y-4 w-full max-w-7xl mx-auto">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">
        Product Workspace
      </p>
      <div className="flex flex-wrap justify-center gap-5 mb-5">
        {items.map((item, index) => renderItem(item, index))}
      </div>

      <div className="mt-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">
          Infrastructure & Settings
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <AuthorityGuard roles={['Admin']}>
            <div
              className="flex flex-col justify-between gap-4 rounded-xl border bg-card px-5 py-4 cursor-pointer hover:border-primary transition-colors group"
              onClick={() => navigate('/agent')}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
                  <img
                    src="/media/logos/agent.svg"
                    alt="Agent Logo"
                    className="w-5 h-5"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    Agent Fleet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Manage deployment and health of your agent fleet.
                  </p>
                </div>
              </div>
              <div className="text-start">
                <span className="cursor-pointer group focus-visible:outline-hidden inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 gap-1.5 text-[0.8125rem] h-auto p-0 bg-transparent rounded-none hover:bg-transparent font-medium text-primary hover:text-primary/90 underline underline-offset-4 decoration-dashed decoration-1">
                  Manage Agents
                </span>
              </div>
            </div>
          </AuthorityGuard>

          <div
            className="flex flex-col justify-between gap-4 rounded-xl border bg-card px-5 py-4 cursor-pointer hover:border-primary transition-colors group"
            onClick={() => navigate('/profile/account/user-info')}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                  User Settings
                </p>
                <p className="text-xs text-muted-foreground">
                  Manage your account details, profile, and preferences.
                </p>
              </div>
            </div>
            <div className="text-start">
              <span className="cursor-pointer group focus-visible:outline-hidden inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 gap-1.5 text-[0.8125rem] h-auto p-0 bg-transparent rounded-none hover:bg-transparent font-medium text-primary hover:text-primary/90 underline underline-offset-4 decoration-dashed decoration-1">
                Go to User Settings
              </span>
            </div>
          </div>

          <AuthorityGuard roles={['Admin']}>
            <div
              className="flex flex-col justify-between gap-4 rounded-xl border bg-card px-5 py-4 cursor-pointer hover:border-primary transition-colors group"
              onClick={() => navigate('/profile/account/company-profile')}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    Company Settings
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Manage company profile, organization details, and branding.
                  </p>
                </div>
              </div>
              <div className="text-start">
                <span className="cursor-pointer group focus-visible:outline-hidden inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 gap-1.5 text-[0.8125rem] h-auto p-0 bg-transparent rounded-none hover:bg-transparent font-medium text-primary hover:text-primary/90 underline underline-offset-4 decoration-dashed decoration-1">
                  Go to Company Settings
                </span>
              </div>
            </div>
          </AuthorityGuard>
        </div>
      </div>
    </div>
  );
}
