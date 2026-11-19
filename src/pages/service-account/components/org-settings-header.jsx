import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AvatarSingle } from './avatar';

const getInitials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

export function OrgSettingsHeader({ org }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-1">
      {/* Back link */}
      <div className="pt-4">
        <button
          onClick={() => navigate('/service-provider/orgs')}
          className="inline-flex items-center gap-1.5 text-sm cursor-pointer text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to organizations
        </button>
      </div>

      {/* Header bar */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <AvatarSingle
            className="h-10 w-10 rounded-lg border border-primary/20 bg-primary/10"
            imageClass="h-10 w-10 rounded-lg text-xs"
            image={typeof org?.logo === 'string' ? org.logo : org?.logo?.image}
            name={org?.name || ''}
          />
          <div>
            <h1 className="text-base font-semibold text-foreground leading-none">
              {org?.name || 'Organization Settings'}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">{org?.website || ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
