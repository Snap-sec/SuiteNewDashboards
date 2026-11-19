import { Badge } from '@/components/ui/badge';

function formatLabel(str) {
  return (str || 'Unknown')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function PriorityBadge({ priority }) {
  const p = (priority || '').toLowerCase().trim();

  const variants = {
    critical: 'destructive',
    high: 'warning',
    medium: 'primary',
    low: 'secondary',
  };

  const variant = variants[p] || 'secondary';

  return (
    <Badge variant={variant} appearance="light" shape="circle">
      {formatLabel(priority)}
    </Badge>
  );
}

export { PriorityBadge };
