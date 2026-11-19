import { Fragment, useEffect, useRef, useState } from 'react';
import { Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsSeenMutation,
  useMarkNotificationAsSeenMutation,
} from '@/services/notify/activityApi';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApiErrorHandler from '../../components/common/api-error-handler';
import AsmRuleNotification from './notifications/asm/asm-rule-notification';
import AsmScanNotification from './notifications/asm/asm-scan-notification';
import GeneralNotificationCard from './notifications/general/general-notification';
import MentionNotification from './notifications/general/mention-notification-card';
import BlockerNotification from './notifications/vm/blocker-notification';
import ChangeRequestNotification from './notifications/vm/change-req-notification';
import ScoringMethodologyNotification from './notifications/vm/scoring-methodology-notification';
import AssessmentUpdate from './notifications/vm/update-assessment-notification';
import VendorNotification from './notifications/vm/vendor-notification';
import VmReportNotification from './notifications/vm/vm-report-notification';
import VulnerabilityAssigned from './notifications/vm/vulnerability-assigned-notification';
import VulnerabilityComment from './notifications/vm/vulnerability-comment-notification';
import VmVulnerability from './notifications/vm/vulnerability-notification';
import VulnerabilitySourceNotification from './notifications/vm/vulnerability-source-notification';
import VsScan from './notifications/vs/vs-scan';
import WasScanNotification from './notifications/was/was-scan-notification';
import StrikeProjectNotification from './notifications/strike/strike-project-notification';
import StrikeScanNotification from './notifications/strike/strike-scan-notification';
import StrikeIntegrationNotification from './notifications/strike/strike-integration-notification';

const NotificationCardSkeleton = () => (
  <div className="flex grow gap-2.5 px-5 py-2 w-full animate-pulse">
    {/* Left Status dot + Avatar */}
    <div className="flex items-start gap-1.5 shrink-0 mt-0.5">
      <div className="flex items-center justify-center w-1.5 mt-2.5">
        <Skeleton className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20 shrink-0" />
      </div>
      <Skeleton className="size-10 rounded-full shrink-0 bg-muted-foreground/20" />
    </div>

    {/* Right Card Content */}
    <div className="flex flex-col gap-2 grow min-w-0">
      {/* Title / Action line */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Skeleton className="h-3.5 w-20 rounded bg-muted-foreground/20" />
          <Skeleton className="h-3.5 w-28 rounded bg-muted-foreground/15" />
          <Skeleton className="h-3.5 w-16 rounded bg-muted-foreground/20" />
        </div>
        {/* Context / target subtitle */}
        <Skeleton className="h-3 w-3/4 rounded bg-muted-foreground/15" />
      </div>

      {/* Date & Origin Tag */}
      <div className="flex items-center gap-2 mt-0.5">
        <Skeleton className="h-2.5 w-24 rounded bg-muted-foreground/15" />
        <span className="size-1 rounded-full bg-muted-foreground/25 shrink-0" />
        <Skeleton className="h-2.5 w-10 rounded bg-muted-foreground/15" />
      </div>
    </div>
  </div>
);

const NotificationsSkeleton = () => (
  <div className="flex flex-col gap-3 pb-4 w-full">
    {Array.from({ length: 8 }).map((_, i) => (
      <Fragment key={i}>
        {i > 0 && <div className="border-b border-b-border my-1"></div>}
        <NotificationCardSkeleton />
      </Fragment>
    ))}
  </div>
);

const formatToLocalTime = (dateStr) => {
  if (!dateStr) return undefined;
  try {
    let d = new Date(dateStr);

    // Check if it's already a formatted string that isn't a date (e.g. "Recent")
    if (isNaN(d.getTime())) {
      // Try to check if it's in a date-like format that needs timezone conversion.
      // E.g., if the backend returned "2026-06-19 09:07:36" (UTC)
      if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        // Normalize space to 'T' and add 'Z' for UTC parsing
        const utcStr = dateStr.includes('T')
          ? `${dateStr}Z`
          : `${dateStr.trim().replace(' ', 'T')}Z`;
        const testD = new Date(utcStr);
        if (!isNaN(testD.getTime())) {
          d = testD;
        } else {
          return dateStr;
        }
      } else {
        return dateStr;
      }
    } else {
      // If it parsed successfully, but the dateStr has no timezone offset/Z,
      // it might have been parsed as local time by the browser. E.g., Date("2026-06-19 09:07:36")
      // is treated as local time. If the backend sent it representing UTC, we must convert it.
      if (
        typeof dateStr === 'string' &&
        !dateStr.includes('Z') &&
        !dateStr.includes('+') &&
        !dateStr.includes('GMT')
      ) {
        if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
          const utcStr = dateStr.includes('T')
            ? `${dateStr}Z`
            : `${dateStr.trim().replace(' ', 'T')}Z`;
          const testD = new Date(utcStr);
          if (!isNaN(testD.getTime())) {
            d = testD;
          }
        }
      }
    }

    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return dateStr;
  }
};

function NotificationItem({ notification: rawNotification }) {
  const notification = rawNotification
    ? {
        ...rawNotification,
        context: rawNotification.context
          ? {
              ...rawNotification.context,
              timestamp: formatToLocalTime(rawNotification.context.timestamp),
            }
          : undefined,
      }
    : null;

  if (!notification) return null;

  if (!notification.event_key) return null;

  if (notification.event_key?.startsWith?.('vm.report.')) {
    return <VmReportNotification notification={notification} />;
  }

  if (notification.event_key?.startsWith?.('vm.vulnerability.create')) {
    return <VmVulnerability notification={notification} />;
  }
  if (notification.event_key?.startsWith?.('vm.vulnerability.update')) {
    return <VmVulnerability notification={notification} />;
  }
  if (notification.event_key?.startsWith?.('vm.vulnerability.archive')) {
    return <VmVulnerability notification={notification} />;
  }

  // Check if this event key is a vs.scan event
  if (notification.event_key?.startsWith?.('vs.scan.')) {
    return <VsScan notification={notification} />;
  }

  // Check if this event key is an asm.scan event
  if (notification.event_key?.startsWith?.('asm.scan.')) {
    return <AsmScanNotification notification={notification} />;
  }

  // Check if this event key is an asm.rule/signal event
  if (
    notification.event_key?.startsWith?.('asm.rule.') ||
    notification.event_key?.startsWith?.('asm.signal.') ||
    notification.event_key?.startsWith?.('casm.rule.')
  ) {
    return <AsmRuleNotification notification={notification} />;
  }

  // Check if this event key is a was.scan event
  if (notification.event_key?.startsWith?.('was.scan.')) {
    return <WasScanNotification notification={notification} />;
  }

  // Check if this event key is a Strike (Auto Pentest) event
  if (
    notification.event_key?.startsWith?.('strike.project.') ||
    (notification.origin === 'strike' && notification.context?.resource === 'project')
  ) {
    return <StrikeProjectNotification notification={notification} />;
  }

  if (
    notification.event_key?.startsWith?.('strike.scan.') ||
    (notification.origin === 'strike' && notification.context?.resource === 'scan')
  ) {
    return <StrikeScanNotification notification={notification} />;
  }

  if (
    notification.event_key?.startsWith?.('strike.integration.') ||
    (notification.origin === 'strike' && notification.context?.resource === 'integration')
  ) {
    return <StrikeIntegrationNotification notification={notification} />;
  }

  if (notification.event_key === 'vm.truerisk.update') {
    return <ScoringMethodologyNotification notification={notification} />;
  }

  if (notification.event_key?.startsWith?.('vm.vulnerability.blocker.')) {
    return <BlockerNotification notification={notification} />;
  }

  if (notification.event_key.startsWith?.('vm.vulnerability.mention')) {
    return <MentionNotification notification={notification} />;
  }

  if (notification.event_key.startsWith?.('vm.assessment.update')) {
    return <AssessmentUpdate notification={notification} />;
  }

  if (notification.event_key.startsWith?.('vm.change_request.create')) {
    return <ChangeRequestNotification notification={notification} />;
  }
  if (notification.event_key.startsWith?.('vm.change_request.update')) {
    return <ChangeRequestNotification notification={notification} />;
  }

  if (notification.event_key.startsWith?.('vm.vulnerability.comment')) {
    return <VulnerabilityComment notification={notification} />;
  }

  if (notification.event_key.startsWith?.('vm.vulnerability.assign')) {
    return <VulnerabilityAssigned notification={notification} />;
  }

  if (notification.event_key.startsWith?.('vm.vendor.create')) {
    return <VendorNotification notification={notification} />;
  }

  if (notification.event_key.startsWith?.('vm.vendor.update')) {
    return <VendorNotification notification={notification} />;
  }

  if (notification.event_key.startsWith?.('vm.vendor.delete')) {
    return <VendorNotification notification={notification} />;
  }

  if (notification.event_key?.startsWith?.('vm.vuln_source.')) {
    return <VulnerabilitySourceNotification notification={notification} />;
  }

  // Check if this event key is a vm.vulnerability event
  // if (notification.event_key?.startsWith?.('vm.vulnerability.')) {
  //   return <VmVulnerability notification={notification} />;
  // }

  // Fallback / other notifications render via Item1
  const userName =
    notification.actor?.name || notification.context?.name || 'System';
  const avatar = '300-4.png'; // standard avatar file fallback

  const adapterName = notification.context?.adapterName;

  let description = 'updated details for';
  if (notification.event_key === 'aim.policy.alert') {
    description = 'triggered policy alert';
  } else if (notification.event_key === 'asm.scan.completed') {
    description = 'completed attack surface scan';
  } else if (notification.event_key === 'vm.vulnerability.create') {
    description = 'added new vulnerability';
  } else if (notification.event_key === 'vm.assessment.create') {
    description = 'created new assessment';
  } else if (notification.event_key === 'vm.vulnerability.escalation.create') {
    description = 'created new escalation on';
  } else if (notification.event_key === 'vm.vulnerability.comment') {
    description = 'commented on vulnerability';
  } else if (notification.event_key === 'vm.vulnerability.assign') {
    description = 'assigned vulnerability';
  }
  if (notification.event_key.startsWith?.('vm.vendor.create')) {
    description = 'created the vendor';
  } else if (notification.event_key.startsWith?.('vm.vendor.delete')) {
    description = 'deleted vendor';
  } else if (
    notification.event_key.startsWith?.('vm.vulnerability.escalation.accepted')
  ) {
    description = 'accepted escalation';
  } else if (
    notification.event_key.startsWith?.('vm.vulnerability.escalation.rejected')
  ) {
    description = 'rejected escalation';
  } else if (notification.event_key.startsWith?.('was.rule.create')) {
    description = 'created new rule';
  } else if (notification.event_key.startsWith?.('was.rule.update')) {
    description = 'updated rule';
  } else if (notification.event_key.startsWith?.('was.rule.delete')) {
    description = 'deleted rule';
  } else if (notification.event_key.startsWith?.('was.project.create')) {
    description = 'created project';
  } else if (notification.event_key.startsWith?.('was.project.update')) {
    description = 'updated project';
  } else if (notification.event_key.startsWith?.('was.project.delete')) {
    description = 'deleted project';
  } else if (notification.event_key === 'vs.adapter.create') {
    description = adapterName ? 'installed adapter' : 'installed an adapter';
  } else if (notification.event_key === 'vs.adapter.update') {
    description = adapterName ? 'updated adapter' : 'updated an adapter';
  } else if (notification.event_key === 'vs.adapter.delete') {
    description = adapterName ? 'deleted adapter' : 'deleted an adapter';
  // SCA events
  } else if (notification.event_key === 'sca.report.queued') {
    description = 'requested a report';
  } else if (notification.event_key === 'sca.report.generated') {
    description = 'generated report successfully';
  } else if (notification.event_key === 'sca.report.failed') {
    description = 'report generation failed';
  } else if (notification.event_key === 'sca.adapter.configure') {
    description = adapterName ? 'configured adapter' : 'configured an adapter';
  } else if (notification.event_key === 'sca.scan.started') {
    description = 'started a scan';
  } else if (notification.event_key === 'sca.scan.completed') {
    description = 'completed a scan';
  } else if (notification.event_key === 'sca.scan.failed') {
    description = 'scan failed';
  // CSPM events
  } else if (notification.event_key === 'cspm.adapter.configure') {
    description = adapterName ? 'configured adapter' : 'configured an adapter';
  } else if (notification.event_key === 'cspm.scan.started') {
    description = 'started a cloud scan';
  } else if (notification.event_key === 'cspm.scan.completed') {
    description = 'completed a cloud scan';
  } else if (notification.event_key === 'cspm.scan.failed') {
    description = 'cloud scan failed';
  // VM Adapter events
  } else if (notification.event_key === 'vm.adapter.integrate') {
    description = adapterName ? 'integrated adapter' : 'integrated an adapter';
  } else if (notification.event_key === 'vm.adapter.configure') {
    description = adapterName ? 'configured adapter' : 'configured an adapter';
  } else if (notification.event_key === 'vm.adapter.refresh') {
    description = adapterName ? 'refreshed adapter' : 'refreshed an adapter';
  } else if (notification.event_key === 'vm.adapter.remove') {
    description = adapterName ? 'removed adapter' : 'removed an adapter';
  // WAS Integration events
  } else if (notification.event_key === 'was.integration.created') {
    description = adapterName ? 'created integration' : 'created an integration';
  } else if (notification.event_key === 'was.integration.updated') {
    description = adapterName ? 'updated integration' : 'updated an integration';
  } else if (notification.event_key === 'was.integration.deleted') {
    description = adapterName ? 'deleted integration' : 'deleted an integration';
  } else if (
    notification.event_key?.includes('.adapter.') ||
    notification.event_key?.includes('.integration.')
  ) {
    const isIntegration = notification.event_key?.includes('.integration.');
    const noun = isIntegration ? 'integration' : 'adapter';
    if (
      notification.event_key?.endsWith('.create') ||
      notification.event_key?.endsWith('.created')
    ) {
      description = adapterName ? `installed ${noun}` : `installed an ${noun}`;
    } else if (
      notification.event_key?.endsWith('.update') ||
      notification.event_key?.endsWith('.updated')
    ) {
      description = adapterName ? `updated ${noun}` : `updated an ${noun}`;
    } else if (
      notification.event_key?.endsWith('.delete') ||
      notification.event_key?.endsWith('.deleted') ||
      notification.event_key?.endsWith('.remove')
    ) {
      description = adapterName ? `deleted ${noun}` : `deleted an ${noun}`;
    } else if (notification.event_key?.endsWith('.configure')) {
      description = adapterName ? `configured ${noun}` : `configured an ${noun}`;
    } else if (notification.event_key?.endsWith('.refresh')) {
      description = adapterName ? `refreshed ${noun}` : `refreshed an ${noun}`;
    } else if (notification.event_key?.endsWith('.integrate')) {
      description = adapterName ? `integrated ${noun}` : `integrated an ${noun}`;
    } else {
      description = adapterName ? `updated ${noun}` : `updated an ${noun}`;
    }
  }

  let link = adapterName || notification.target?.title || notification.context?.title || 'Details';
  if (notification.event_key?.startsWith('vs.adapter.')) {
    link = adapterName || 'Details';
  }
  if (notification.event_key?.startsWith('sca.')) {
    link = adapterName || notification.target?.title || notification.context?.title || 'Details';
  }
  if (notification.event_key?.startsWith('cspm.')) {
    link = adapterName || notification.target?.title || notification.context?.title || 'Details';
  }
  if (notification.event_key?.startsWith('vm.adapter.')) {
    link = adapterName || notification.target?.title || notification.context?.title || 'Details';
  }
  if (notification.event_key?.startsWith('was.integration.')) {
    link = adapterName || notification.target?.title || notification.context?.title || 'Details';
  }
  const label = '';

  const time =
    notification.context?.timestamp ||
    (() => {
      if (!notification.createdAt) return 'Recent';
      try {
        return new Date(notification.createdAt).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
      } catch (e) {
        return 'Recent';
      }
    })();

  const specialist = (notification.origin || 'System').toUpperCase();
  const text =
    notification.context?.description ||
    notification.notification?.description ||
    'Review the details for more information.';

  return (
    <GeneralNotificationCard
      seen={notification.seen}
      userName={userName}
      avatar={avatar}
      description={description}
      link={link}
      label={label}
      time={time}
      specialist={specialist}
      text={text}
      notification={notification}
    />
  );
}

export function NotificationsSheet({ trigger }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [origins, setOrigins] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [allNotifications, setAllNotifications] = useState([]);
  const scrollRef = useRef(null);

  // Calculate dynamic limit adaptively based on viewport screen height
  const getAdaptiveLimit = () => {
    if (typeof window === 'undefined') return 10;
    const h = window.innerHeight;
    // Estimate ~65px per item, offset by header/footer padding (~180px)
    const itemsNeeded = Math.ceil((h - 180) / 65) + 3;
    return Math.max(10, Math.min(50, itemsNeeded));
  };

  const [limit, setLimit] = useState(getAdaptiveLimit);

  useEffect(() => {
    const handleResize = () => {
      const newLimit = getAdaptiveLimit();
      setLimit((prev) => (prev !== newLimit ? newLimit : prev));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ORIGIN_OPTIONS = [
    { value: 'vm', label: 'VM' },
    { value: 'asm', label: 'ASM' },
    { value: 'vs', label: 'VS' },
    { value: 'aim', label: 'AIM' },
    { value: 'apisec', label: 'WAS' },
    { value: 'sca', label: 'SCA' },
    { value: 'cspm', label: 'CSPM' },
    { value: 'strike', label: 'Strike' },
  ];

  const toggleOrigin = (value) => {
    setOrigins((prev) =>
      prev.includes(value) ? prev.filter((o) => o !== value) : [...prev, value],
    );
  };

  // Construct query parameters conditionally based on selected tab and filters
  const queryParams = {
    limit,
    page,
    origin: origins.length === 0 ? 'all' : origins.join(','),
  };
  if (activeTab === 'mentions') {
    queryParams.notificationType = 'mention';
  }

  // Fetch notifications
  const {
    data,
    isLoading,
    isFetching: isFetchingMore,
    isError,
    error,
  } = useGetNotificationsQuery(queryParams);

  const [markAllNotificationsAsSeen, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsAsSeenMutation();

  const [markNotificationSeen] = useMarkNotificationAsSeenMutation();

  const handleNotificationClick = async (e, n) => {
    const isLinkClick = e.target.closest('a');
    if (isLinkClick) {
      setOpen(false);
      if (!n.seen) {
        try {
          await markNotificationSeen({ notificationId: n._id }).unwrap();
        } catch (err) {
          console.error('Failed to mark notification as seen:', err);
        }
      }
    }
  };

  // Reset page, list and origin when sheet is closed
  // useEffect(() => {
  //   if (!open) {
  //     setPage(1);
  //     setAllNotifications([]);
  //     setOrigin('all');
  //   }
  // }, [open]);

  // Reset page and list when origins or activeTab changes
  useEffect(() => {
    setPage(1);
    setAllNotifications([]);
  }, [origins, activeTab]);

  // Sync data to allNotifications state
  useEffect(() => {
    if (data?.notifications && !isFetchingMore) {
      if (page === 1) {
        setAllNotifications(data.notifications);
      } else {
        setAllNotifications((prev) => {
          const prevIds = new Set(prev.map((n) => n._id));
          const newNotifications = data.notifications.filter(
            (n) => !prevIds.has(n._id),
          );
          return [...prev, ...newNotifications];
        });
      }
    }
  }, [data, page, isFetchingMore]);

  // Auto-fetch next page if current list doesn't fill the scroll container on larger screens
  useEffect(() => {
    if (!open || isFetchingMore || isLoading) return;
    const el = scrollRef.current;
    if (!el) return;

    const total = data?.total || 0;
    if (allNotifications.length > 0 && allNotifications.length < total) {
      if (el.scrollHeight <= el.clientHeight + 50) {
        setPage((prev) => prev + 1);
      }
    }
  }, [allNotifications, open, isFetchingMore, isLoading, data?.total]);

  // Filter out notifications without an event_key and sort them by date descending
  const sortedNotifications = allNotifications
    .filter((n) => n && n.event_key)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleScroll = () => {
    const el = scrollRef.current;
    if (
      !el ||
      isFetchingMore ||
      isLoading ||
      allNotifications.length >= (data?.total || 0)
    )
      return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="p-0 gap-0 sm:w-[500px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 sm:max-w-none [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="mb-0">
          <SheetTitle className="p-3">Notifications</SheetTitle>
        </SheetHeader>
        <SheetBody className="grow p-0 flex flex-col h-[calc(100vh-11rem)] overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full flex flex-col h-full"
          >
            <TabsList variant="line" className="w-full px-5 mb-3 shrink-0">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="mentions">Mentions</TabsTrigger>
              <div className="grow flex items-center justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={origins.length > 0 ? 'secondary' : 'ghost'}
                      size="sm"
                      mode="icon"
                      className="mb-1"
                    >
                      <Filter className="size-4.5!" />
                      {origins.length > 0 && (
                        <span className="absolute -top-1 -end-1 flex size-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                          {origins.length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-44"
                    side="bottom"
                    align="end"
                  >
                    {ORIGIN_OPTIONS.map((opt) => (
                      <DropdownMenuCheckboxItem
                        key={opt.value}
                        checked={origins.includes(opt.value)}
                        onCheckedChange={() => toggleOrigin(opt.value)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {opt.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TabsList>

            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="grow overflow-y-auto px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {/* All Tab */}
              <TabsContent value="all" className="mt-0">
                <div className="flex flex-col gap-3 pb-4">
                  {(isLoading || isFetchingMore) && page === 1 ? (
                    <NotificationsSkeleton />
                  ) : isError ? (
                    <ApiErrorHandler error={error} />
                  ) : sortedNotifications.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No notifications
                    </div>
                  ) : (
                    sortedNotifications?.map((n, idx) => (
                      <Fragment key={n._id}>
                        {idx > 0 && (
                          <div className="border-b border-b-border my-1"></div>
                        )}
                        <div className="break-words min-w-0 w-full" onClick={(e) => handleNotificationClick(e, n)}>
                          <NotificationItem notification={n} />
                        </div>
                      </Fragment>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Mentions Tab */}
              <TabsContent value="mentions" className="mt-0">
                <div className="flex flex-col gap-3 pb-4">
                  {(isLoading || isFetchingMore) && page === 1 ? (
                    <NotificationsSkeleton />
                  ) : isError ? (
                    <ApiErrorHandler error={error} />
                  ) : sortedNotifications.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No mentions
                    </div>
                  ) : (
                    sortedNotifications?.map((n, idx) => (
                      <Fragment key={n._id}>
                        {idx > 0 && (
                          <div className="border-b border-b-border my-1"></div>
                        )}
                        <div className="break-words min-w-0 w-full" onClick={(e) => handleNotificationClick(e, n)}>
                          <NotificationItem notification={n} />
                        </div>
                      </Fragment>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Loading indicator at bottom */}
              {isFetchingMore && page > 1 && (
                <div className="flex flex-col gap-3 pb-4 w-full">
                  <div className="border-b border-b-border my-1"></div>
                  <NotificationCardSkeleton />
                  <div className="border-b border-b-border my-1"></div>
                  <NotificationCardSkeleton />
                </div>
              )}
            </div>
          </Tabs>
        </SheetBody>
        <SheetFooter className="border-t border-border p-5 grid grid-cols-1 gap-2.5">
          {/* <Button variant="outline">Archive all</Button> */}
          <Button
            variant="outline"
            onClick={() =>
              toast.promise(
                markAllNotificationsAsSeen({
                  origin: origins.length === 0 ? 'all' : origins.join(','),
                }).unwrap(),
                {
                  loading: 'Marking all as read...',
                  success: 'All notifications marked as read!',
                  error: 'Failed to mark all as read',
                },
              )
            }
            disabled={isMarkingAll}
          >
            Mark all as read
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
