import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function GuardrailsCard() {
  return (
    <div className="rounded-xl p-4 bg-primary/5 border border-primary/20 space-y-1.5">
      <div className="flex items-center gap-2">
        <ShieldCheck className="size-4 text-primary shrink-0" />
        <span className="text-2sm font-semibold text-foreground">
          Guardrails Active
        </span>
      </div>
      <p className="text-2sm text-muted-foreground leading-relaxed">
        This agent is bounded by VPC Peering security policies. All outbound tool
        HTTP requests route through the internal forward proxy.
      </p>
    </div>
  );
}
