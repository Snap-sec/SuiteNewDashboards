import { AvatarGroup } from '@/partials/common/avatar-group';
import { Calendar1Icon, CircleCheckBig, Clock, ExternalLink, Info, MoveRight } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomAvatarGroup } from '@/components/custom/avatar-group';
import { Profile } from '@/components/custom/profile';
import { CustomTooltip } from '../../../../../../components/custom/tooltip';
import { formatDate } from '../../../../../../lib/helpers';
import { useUpdateVmBlockerStatusMutation } from '../../../../../../services/vm/blockersApi';

export default function BlockerCard({ item }) {
  const [updateBlockerStatus, { isLoading, isSuccess, isError }] =
    useUpdateVmBlockerStatusMutation();

  const handleUpdateBlockerStatus = async (blockerId, blockerStatus) => {
    let toastId = toast.loading('Updating blocker status.');

    updateBlockerStatus({ id: blockerId, status: blockerStatus })
      .then((res) => {
        toast.success(
          blockerStatus == 'pending' ? 'Blocker Reopened' : 'Blocker Resolved',
        );
        toast.dismiss(toastId);
      })
      .catch((err) => {
        toast.error('Error updating blocker status');
        toast.dismiss(toastId);
      });
  };

  return (
    <Card>
      <CardHeader className="px-5 py-2 flex flex-col items-start">
        {item?.title.length > 300 ? (
          <CustomTooltip text={item?.title}>
            <CardTitle className="max-w-2/3 break-words truncate">
              {item?.title || ''}
            </CardTitle>
          </CustomTooltip>
        ) : (
          <CardTitle className="max-w-2/3 break-words">
            {item?.title || ''}
          </CardTitle>
        )}

        <span className="light:text-gray-800 font-normal flex items-center gap-2 text-sm">
          <Calendar1Icon size={12} className=' light:text-gray-500'/> {formatDate(item?.createdAt)}
        </span>
        {/* <div className=" flex gap-3 items-center justify-center">
          <Button
            disabled={isLoading}
            variant={item?.status == 'resolved' ? 'secondary' : 'primary'}
            onClick={() => {
              handleUpdateBlockerStatus(
                item?._id, // Blocker Id
                item?.status == 'resolved' ? 'pending' : 'resolved',
              );
            }}
          >
            {item?.status == 'resolved' ? (
              <>
                <Info /> Reopen Blocker
              </>
            ) : (
              <>
                <CircleCheckBig /> Mark Resolved
              </>
            )}
          </Button>
        </div> */}
      </CardHeader>

      <CardContent className="px-5 space-y-4">
        <div className="flex flex-col justify-between gap-4 h-full">
          <div className="flex flex-col gap-1">
            <p className="text-2sm text-secondary-foreground">
              {item?.description}
            </p>

            {/* Show createdAt, createdBy, createdFor here */}
            <div className=" hidden flex justify-between lg:mt-3 md:mt-1 mt-1 flex-wrap gap-2">
              <div className="flex flex-col text-sm">
                <span className="text-sm text-secondary-foreground">
                  Created At:
                </span>
                <span className="light:text-gray-800 font-medium">
                  {formatDate(item?.createdAt)}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm text-secondary-foreground">
                  {' '}
                  Created By:
                </p>
                {/* <div className="flex justify-start rtl:justify-start shrink-0">
                  <CustomAvatarGroup
                    emails={[item?.createdBy?.email]}
                    size={'size-[30px]'}
                    more={{
                      number: 10,
                      variant: 'text-white ring-background bg-green-500',
                    }}
                  />
                </div> */}
                <Profile
                  name={item?.createdBy?.name}
                  size="25px"
                  email={item?.createdBy?.email}
                />
              </div>
            </div>
          </div>

          <div className="flex items-baseline-last justify-between gap-4  py-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-secondary-foreground"> Members: </p>
              <div className="flex justify-start rtl:justify-start shrink-0">
                <CustomAvatarGroup
                  emails={item?.owners?.map((owner) => owner.email)}
                  size={'size-[30px]'}
                  more={{
                    number: 10,
                    variant: 'text-white ring-background bg-green-500',
                  }}
                />
              </div>
            </div>

            <div className=" hidden flex flex-col gap-1">
              <p className="text-sm text-secondary-foreground">
                {' '}
                Created for:{' '}
              </p>
              {/* <div className="flex justify-start rtl:justify-start shrink-0">
                <CustomAvatarGroup
                  emails={[item?.assignee?.email]}
                  size={'size-[30px]'}
                  more={{
                    number: 10,
                    variant: 'text-white ring-background bg-green-500',
                  }}
                />
              </div> */}
              <Profile
                name={item?.assignee?.name}
                size="25px"
                email={item?.assignee?.email}
              />
            </div>

            <Link
              to={`/vm/vulnerability-report?id=${item?.vulnId}&assessmentId=${item?.assessmentId}#${item?._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="leading-none text-sm text-mono hover:text-muted-foreground hover:underline flex items-center gap-1"
            >
              Goto report
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
