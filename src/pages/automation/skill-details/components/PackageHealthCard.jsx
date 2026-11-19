import React from 'react';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PackageHealthCard({ checks = [], passRate = '100% pass' }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 shadow-xs shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground leading-tight">
          Package health
        </h2>
        <Badge
          variant="success"
          appearance="outline"
          size="sm"
          className="text-2xs font-medium px-2 h-5 font-mono"
        >
          {passRate}
        </Badge>
      </div>

      {/* Validation Checklist Items */}
      <div className="flex flex-col gap-2.5 pt-1">
        {checks.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-2 text-2sm"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex items-center justify-center size-3.5 rounded-full bg-emerald-500/10 text-emerald-500 shrink-0">
                <Check className="size-2.5 stroke-[2.5]" />
              </span>
              <span className="text-muted-foreground truncate font-normal">
                {item.title}
              </span>
            </div>

            <span className="font-mono text-2xs text-primary bg-primary/10 px-2 py-0.5 rounded-sm shrink-0 border border-primary/20">
              {item.statusText}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
