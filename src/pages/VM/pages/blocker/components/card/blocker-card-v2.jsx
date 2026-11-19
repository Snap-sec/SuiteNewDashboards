import _ from 'lodash';
import { Calendar, Check, ExternalLink, Hourglass, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CustomAvatarGroup } from '@/components/custom/avatar-group';
import { DateFormatter } from '@/components/custom/date-formatter';
import { Profile } from '@/components/custom/profile';
import SeverityLabel from '@/components/custom/severity-label';
import { useUpdateVmBlockerStatusMutation } from '../../../../../../services/vm/blockersApi';

export default function BlockerCardV2({ item }) {
  const [updateBlockerStatus, { isLoading }] = useUpdateVmBlockerStatusMutation();

  const handleToggleStatus = () => {
    const next = item?.status === 'resolved' ? 'pending' : 'resolved';
    toast.promise(updateBlockerStatus({ id: item._id, status: next }).unwrap(), {
      loading: 'Updating status…',
      success: next === 'resolved' ? 'Blocker resolved' : 'Blocker reopened',
      error: 'Failed to update status',
    });
  };

  const reportHref = `/vm/vulnerability-report?id=${item?.vulnId}&assessmentId=${item?.assessmentId}#${item?._id}`;
  const isResolved = item?.status === 'resolved';

  return (
    <Card className="group">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">

          {/* Priority icon box */}
          <div className="shrink-0 flex items-center justify-center size-10 rounded-lg bg-muted border border-border">
            <ShieldAlert className={`size-5 ${isResolved ? 'text-foreground-muted' : 'text-foreground-muted'}`} />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <Link
                  to={reportHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                >
                  {item?.title}
                </Link>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {item?.description || 'No description provided'}
                </p>
              </div>

              {/* Right-side metadata */}
              <div className="flex items-center gap-10 shrink-0">

                {/* Priority */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] mb-1 text-muted-foreground font-medium uppercase tracking-wider">
                    Priority
                  </span>
                  <SeverityLabel severity={item?.priority} size="sm" />
                </div>

                {/* Status */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] mb-1 text-muted-foreground font-medium uppercase tracking-wider">
                    Status
                  </span>
                  <Badge
                    appearance="outline"
                    variant={isResolved ? 'success' : 'warning'}
                    className="text-[10px]"
                  >
                    {/* {isResolved ? <Check className="size-3" /> : <Hourglass className="size-3" />} */}
                    {_.capitalize(item?.status)}
                  </Badge>
                </div>



                {/* Date */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    Created
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3" />
                    <DateFormatter date={item?.createdAt} />
                  </span>
                </div>

                {/* View Report button */}
                {/* <Link
                  to={reportHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7">
                    <ExternalLink className="size-3" />
                    View Report
                  </Button>
                </Link> */}
              </div>
            </div>

            {/* Created by row */}
            {/* <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">Created by:</span>
              <Profile
                name={item?.createdBy?.firstName || item?.createdBy?.name}
                email={item?.createdBy?.email}
                size="20px"
              />
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
