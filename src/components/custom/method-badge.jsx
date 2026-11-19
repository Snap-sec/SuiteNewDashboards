import React from 'react';
import { Badge } from '@/components/ui/badge';

function MethodBadge({ method }) {
  // Decide variant based on method
  const variant = method === "GET" ? "primary" :
                  method === "POST" ? "success" :
                  method === "PUT" ? "warning" :
                  method === "PATCH" ? "secondary" :
                  method === "DELETE" ? "destructive" :
                  ""; // default empty string

  return (
    <Badge variant={variant} appearance="outline" shape="circle">
      {method}
    </Badge>
  );
}

export { MethodBadge };
