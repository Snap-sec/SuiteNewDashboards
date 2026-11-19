import { useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { I18N_LANGUAGES } from '@/i18n/config';
import {
  Bell,
  Bot,
  Check,
  CircleUserRound,
  Coffee,
  Copy,
  CreditCard,
  FileText,
  Globe,
  IdCard,
  Key,
  LogOut,
  Moon,
  Network,
  Settings,
  Shield,
  SquareCode,
  UserCircle,
  Users,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useLanguage } from '@/providers/i18n-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Profile } from '@/components/custom/profile';

export function UserDropdownMenu({ trigger }) {
  const { logout, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopyOrgId = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user?.orgId) {
      navigator.clipboard.writeText(user.orgId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayName =
    user?.fullname ||
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username || 'User');

  const displayEmail = user?.email || '';  

  const handleThemeToggle = (checked) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const accountSubMenuItems = [
    {
      key: 'security',
      label: 'Security',
      icon: <Shield size={16} />,
      path: '/profile/account/security/current-sessions',
      shown: true,
    },
    {
      key: 'members',
      label: 'Members & Teams',
      icon: <Users size={16} />,
      path: '/profile/account/members/teams',
      shown: true,
    },
    {
      key: 'api-keys',
      label: 'Api Keys',
      icon: <Key size={16} />,
      path: '/profile/account/api-keys',
      shown: true,
    },
    {
      key: 'integrations',
      label: 'Integrations',
      icon: <Network size={16} />,
      path: '/profile/account/integrations',
      shown: true,
    },

    {
      key: 'ai-integrations',
      label: 'AI Integrations',
      icon: <Bot size={16} />,
      path: '/profile/account/ai-config',
      shown: user?.role === 'Admin' || user?.role == "Platform Admin"
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-0" side="bottom" align="end">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-1 bg-muted/30">
          <Profile email={displayEmail} className="shrink-0" />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-semibold truncate">
                {displayName}
              </span>
              <Badge
                variant="secondary"
                className="shrink-0 text-[10px] h-4 px-1.5 bg-primary/10 text-primary border-none capitalize font-medium"
              >
                {user?.role}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {displayEmail}
            </p>
          </div>
        </div>

        {/* show org id with copy btn */}
        {/* <div className="px-3 pb-1.5 flex justify-center gap-2  bg-muted/30">
          <p className="text-[8px] text-muted-foreground">Org Id: {user?.orgId}</p>
          <Button
            variant="ghost"
            mode="icon"
            size="xs"
            shape="circle"
            onClick={handleCopyOrgId}
          >
            {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
          </Button>
        </div> */}

        <DropdownMenuSeparator className="m-0" />

        {/* Menu Items */}
        <div className="p-1.5">
          <DropdownMenuItem asChild>
            <Link
              to={`/profile/account/user-info`}
              className="flex items-center gap-2 cursor-pointer"
            >
              <CircleUserRound size={16} />
              My Account
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
              <Settings size={16} />
              Settings
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent className="w-52">
              {accountSubMenuItems?.map(({ key, label, icon, path, shown }) =>
                shown ? (
                  <DropdownMenuItem key={key} asChild>
                    <Link
                      to={path}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      {icon}
                      {label}
                    </Link>
                  </DropdownMenuItem>
                ) : null,
              )}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator className="my-1.5" />

          {/* Theme Toggle */}
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onSelect={(event) => event.preventDefault()}
          >
            <Moon size={16} />
            <div className="flex items-center gap-2 justify-between grow">
              <span>Dark Mode</span>
              <Switch
                size="sm"
                checked={theme === 'dark'}
                onCheckedChange={handleThemeToggle}
              />
            </div>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="m-0" />

        {/* Logout Section */}
        <div className="p-1.5">
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={logout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
