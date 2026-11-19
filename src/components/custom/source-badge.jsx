import { User } from 'lucide-react';
import { Badge } from '../ui/badge';

export const SourceBadge = ({ source }) => {
  if (source === 'postman') {
    return (
      <Badge
        variant="destructive"
        appearance="outline"
        shape="circle"
        className={'h-fit py-1'}
      >
        <img src="/public/media/brand-logos/postman.svg" className="h-5 w-5" />
        {source?.toUpperCase?.()}
      </Badge>
    );
  }

  if (source === 'swagger') {
    return (
      <Badge
        variant="success"
        appearance="outline"
        shape="circle"
        className="h-fit py-1"
      >
        <img src="/public/media/brand-logos/swagger.svg" className="h-5 w-5" />
        {source?.toUpperCase?.()}
      </Badge>
    );
  }

  if (!source || source === 'manual') {
    return (
      <Badge
        variant="mono"
        appearance="outline"
        shape="circle"
        className="h-fit py-1 gap-1"
      >
        <User className="h-4 w-4" />
        MANUAL
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      appearance="outline"
      shape="circle"
      className="h-fit py-1 gap-1"
    >
      <img src="/public/media/brand-logos/defaultlogo.webp" className="h-4 w-4" />
      {source?.toUpperCase?.() || source}
    </Badge>
  );
};
