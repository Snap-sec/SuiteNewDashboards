import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, ExternalLink, Ticket, Info, ChevronDown } from 'lucide-react';
import { useGetAsmAssetSignalsDataQuery } from '@/services/asm/attackSurfaceApi';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { timeAgo } from '@/lib/helpers';
import { EmptyScreen } from '@/components/common/empty-screen';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { Link2 as LinkIcon, RefreshCcw, Loader2, ShieldAlert } from 'lucide-react';
import { useRaiseAsmExposureMutation } from '@/services/asm/exposureApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';

const VMTicketButton = ({ signal, actualId }) => {
  const [raiseExposure, { isLoading: isRaisingExposure }] =
    useRaiseAsmExposureMutation();

  const assetId = actualId;
  const ruleId = signal?.rule_id || signal?._id;

  if (signal?.has_ticket || (signal?.is_exposed && signal?.sentToVm)) {
    return (
      <Badge className="text-[11px]" variant="secondary" appearance="outline">
        {signal?.universalVulnId && signal?.assessmentId ? (
          <Link
            className="w-full flex gap-2 items-center"
            target="_blank"
            to={`/vm/vulnerability-report?id=${signal?.universalVulnId}&assessmentId=${signal?.assessmentId}`}
          >
            Marked as Exposure
            <LinkIcon size={12} />
          </Link>
        ) : (
          'Marked as Exposure'
        )}
      </Badge>
    );
  }

  return (
    <AuthorityGuard forbidRoles={['Auditor']}>
      <Button
        variant="secondary"
        className="flex gap-1.5 items-center "
        disabled={isRaisingExposure}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toast.promise(raiseExposure({ assetId, ruleId }).unwrap(), {
            loading: 'Marking as exposure...',
            success: 'Marked as exposure successfully',
            error: 'Failed to mark as exposure',
          });
        }}
      >
        {isRaisingExposure ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <ShieldAlert size={12} />
        )}
        Mark as Exposure
      </Button>
    </AuthorityGuard>
  );
};

function AssetSignalsTab() {
  const params = useParams();
  const actualId = params.id || params.assetId;

  const { data, isLoading, isError } = useGetAsmAssetSignalsDataQuery(actualId, {
    skip: !actualId,
  });

  const [searchQuery, setSearchQuery] = useState('');

  const signals = data?.data || data?.signals || data || [];

  const filteredSignals = signals.filter(
    (signal) =>
      signal.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      signal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      signal.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-600';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getSeverityCounts = () => {
    const counts = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    signals.forEach((s) => {
      const sev = (s.severity || s.risk || 'info').toLowerCase();
      if (counts[sev] !== undefined) counts[sev]++;
    });
    return counts;
  };

  const counts = getSeverityCounts();

  if (isLoading) {
    return (
      <div className="px-6 py-4 animate-pulse space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-destructive text-sm">
        Failed to load signals.
      </div>
    );
  }

  return (
    <div className="space-y-6">


      {/* Signals List */}
      <div className="space-y-3">
        {signals.length === 0 ? (
          <div className="py-8 bg-card rounded-xl">
            <EmptyScreen
              title="No Risk Signals"
              subTitle="There are currently no active risk signals affecting this asset."
            />
          </div>
        ) : filteredSignals.length === 0 ? (
          <div className="py-8 bg-card rounded-xl border border-border/50">
            <EmptyScreen
              title="No Matches Found"
              subTitle="No signals matched your search criteria."
            />
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-3">
            {filteredSignals.map((signal, idx) => {
              const title = signal.title || signal.name || 'Unknown Signal';
              const time = signal.createdAt ? timeAgo(signal.createdAt) : 'Just now';

              const severity = signal.severity || signal.risk || 'info';

              const formatConditionValue = (val) => {
                if (Array.isArray(val)) return `[${val.join(', ')}]`;
                return String(val);
              };

              const matchedOn = signal.match?.conditions
                ? signal.match.conditions
                  .map((c) => `${c.field} ${c.operator} ${formatConditionValue(c.value)}`)
                  .join(' AND ')
                : signal.matched_on || 'Unknown condition';

              return (
                <AccordionItem
                  key={signal._id || idx}
                  value={`item-${idx}`}
                  className="border border-border rounded-lg bg-card overflow-hidden px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-4 flex items-center justify-between [&[data-state=open]>div>div>.chevron]:rotate-180">
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <div
                        className={`size-2 rounded-full shrink-0 ${getSeverityColor(severity)}`}
                      />
                      <span className="text-sm font-semibold text-foreground">
                        {title}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs shrink-0 mr-2">
                      <span className="text-muted-foreground flex items-center gap-1">
                        {time}
                      </span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pt-1">
                    <div className="pl-5 space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {signal.description || 'No description provided.'}
                      </p>

                      {signal.remediation && (
                        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                          <strong className="font-medium text-foreground">Remediation:</strong> {signal.remediation}
                        </p>
                      )}

                      <div className="flex justify-end mt-4">
                        <VMTicketButton signal={signal} actualId={actualId} />
                      </div>

                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
}

export default AssetSignalsTab;
