import { Badge } from '@/components/ui/badge';

export function StatusCodeBadge({ status }) {
  if (!status) return '-';
  let variant = 'primary';

  if (status >= 200 && status < 300) variant = 'success';
  else if (status >= 300 && status < 400) variant = 'info';
  else if (status >= 400 && status < 500) variant = 'warning';
  else if (status >= 500) variant = 'destructive';

  return (
    <Badge variant={variant} appearance="outline" shape="circle">
      {status}
    </Badge>
  );
}
