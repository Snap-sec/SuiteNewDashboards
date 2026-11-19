import React from 'react';
import { Badge } from '@/components/ui/badge';

export const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success';
    case 'outdated':
      return 'warning';
    case 'offline':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export function AgentStatusBadge({ status }) {
  return (
    <Badge
      variant={getStatusVariant(status)}
      appearance="light"
      className="capitalize"
    >
      {status || 'Unknown'}
    </Badge>
  );
}

export default AgentStatusBadge;
