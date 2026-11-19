import { useState } from 'react';
import { Edit, LogIn, MoreHorizontal, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinners';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { AvatarSingle } from './avatar';
import EditOrgModal from './edit-org-modal';

const CardUserMini = ({
  avatar,
  name,
  email,
  url,
  handleLogin,
  orgDetails,
  isServiceProvider,
  disabled,
  isLoading,
}) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <Card
      className={`group relative flex flex-col justify-between p-4 rounded-xl border bg-card/60 transition-all duration-200 ${
        isLoading
          ? 'ring-2 ring-primary/50 opacity-90'
          : 'hover:border-primary/50 hover:bg-card hover:shadow-md'
      }`}
    >
      {/* Top Right 3-Dots Dropdown for Edit */}
      {isServiceProvider && orgDetails && (
        <div
          className="absolute top-2.5 right-2.5 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <EditOrgModal
                orgDetails={orgDetails}
                trigger={
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="cursor-pointer gap-2"
                  >
                    <span>Edit</span>
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onSelect={() => {
                  setDropdownOpen(false);
                  navigate(`/service-provider/orgs/${orgDetails._id}/settings`);
                }}
              >
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onSelect={() => {
                  setDropdownOpen(false);
                  navigator.clipboard.writeText(orgDetails._id);
                  toast.success('Org ID copied to clipboard');
                }}
              >
                <span>Copy Org ID</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Top Section: Avatar & Info */}
      <div className="flex items-center gap-3 min-w-0 pr-8">
        <div className="shrink-0">
          <AvatarSingle
            className="h-12 w-12 rounded-lg bg-primary/10"
            imageClass="h-12 w-12 rounded-lg text-xs"
            image={typeof avatar === 'string' ? avatar : avatar?.image}
            name={name}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <span className={`font-medium text-foreground truncate group-hover:text-primary transition-colors ${disabled
            ? 'opacity-60 pointer-events-none':''}`}>
            {name}
          </span>
          <span className="text-sm text-muted-foreground truncate mt-0.5">
            {url || email}
          </span>
        </div>
      </div>

      {/* Bottom Section: Active Status Dot & Dashed Login Link */}
      <div className="flex items-center justify-between mt-6 pt-2 border-t border-border/20">
        {(() => {
          const expiry = orgDetails?.licenceExpiry;
          const isExpired = expiry ? new Date(expiry) < new Date() : false;
          return isExpired ? (
            <Badge variant="destructive" appearance="outline">
              Expired
            </Badge>
          ) : disabled ? (
            <Badge variant="destructive" appearance="outline">
              Locked
            </Badge>
          ) : (
            <Badge variant="success" appearance="outline">
              Active
            </Badge>
          );
        })()}

        <div onClick={(e) => e.stopPropagation()}>
          <ButtonWithConfirm
            confirm={false}
            mode="link"
            onConfirm={handleLogin}
            disabled={disabled}
            className="text-xs text-primary hover:text-primary/80 p-0 h-auto"
          >
            {isLoading ? (
              <span className="flex items-center gap-1.5 text-primary text-xs">
                <Spinner className="size-3.5 animate-spin" /> Logging in...
              </span>
            ) : (
              <span className="flex items-center gap-1 text-primary text-xs">
                <LogIn className="size-3.5 text-primary" /> Login
              </span>
            )}
          </ButtonWithConfirm>
        </div>
      </div>
    </Card>
  );
};

export { CardUserMini };
