import { useState } from 'react';
import { CircleMinus, CirclePlus, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  useSuppressApiSecVulnMutation,
  useUnsuppressApiSecVulnMutation,
} from '@/services/apisec/vulnerabilityApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinners';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Modal } from '@/components/custom/modal';
import SeverityLabel from '@/components/custom/severity-label';
import { DateFormatter } from '../../../../components/custom/date-formatter';
import { CustomTooltip } from '../../../../components/custom/tooltip';
import SendToVM from './actions/send-to-vm';



import { useAuth } from '@/auth/context/auth-context';
import Response from './vuln-info-components/response';

function VulnInfo({ title, data }) {
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';
  const [open, setOpen] = useState(false);

  const [suppressVuln, { isLoading: isSuppressing }] =
    useSuppressApiSecVulnMutation();
  const [unsuppressVuln, { isLoading: isUnsuppressing }] =
    useUnsuppressApiSecVulnMutation();

  const handleActions = {
    suppress: async () => {
      if (isAuditor) return;
      toast.promise(suppressVuln({ vulnId: data?._id }).unwrap(), {
        loading: 'Suppressing vulnerability',
        success: () => {
          setOpen(false);
          return 'Vulnerability suppressed successfully';
        },
        error: 'Failed to suppress vulnerability',
      });
    },

    unsuppress: async () => {
      if (isAuditor) return;
      toast.promise(unsuppressVuln({ vulnId: data?._id }).unwrap(), {
        loading: 'Un Suppressing vulnerability',
        success: () => {
          setOpen(false);
          return 'Vulnerability Un suppressed successfully';
        },
        error: 'Failed to unsuppress vulnerability',
      });
    },
  };

  return (
    <Modal
      className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] max-w-7xl flex flex-col"
      open={open}
      setOpen={setOpen}
      trigger={
        <p className="font-medium text-sm cursor-pointer">
          {title.length > 70 ? `${title.substring(0, 70)}...` : title}
        </p>
      }
      title={
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 -mt-3 pr-0 sm:pr-8">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            {data.title}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 w-full sm:w-auto">
            {!data?.sentToVm ? (
              <SendToVM row={data} />
            ) : (
              <Badge
                variant="secondary"
                className="cursor-pointer px-3 py-2 text-xs sm:text-sm"
                onClick={() =>
                  window.open(
                    `/vm/vulnerability-report?id=${data._id}&assessmentId=${data.assessmentId}`,
                    '_blank',
                  )
                }
              >
                <Link2 className="w-3 h-3 sm:w-4 sm:h-4" /> View Ticket
              </Badge>
            )}

            {!isAuditor &&
              (!data?.isSuppressed ? (
                <CustomTooltip
                  text={`Suppress selected vulnerability to hide them from dashboards and reports without deleting their records.`}
                >
                  <ButtonWithConfirm
                    confirm={true}
                    variant="outline"
                    // size="sm"
                    className="text-xs sm:text-sm"
                    dialog="Suppressing this vulnerability will remove it from the dashboard and exclude it from future scans. Are you sure you want to proceed?"
                    onConfirm={handleActions.suppress}
                    disabled={isSuppressing}
                  >
                    {isSuppressing ? (
                      <>
                        <Spinner className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                        <span className="hidden sm:inline">Suppressing...</span>
                        <span className="sm:hidden">Suppressing</span>
                      </>
                    ) : (
                      <>
                        <CircleMinus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </>
                    )}
                  </ButtonWithConfirm>
                </CustomTooltip>
              ) : (
                <CustomTooltip
                  text={`Restore previously hidden vulnerability to active view and reporting, making them visible in dashboards and assessments.`}
                >
                  <Button
                    disabled={isUnsuppressing}
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm"
                    onClick={handleActions.unsuppress}
                  >
                    {isUnsuppressing ? (
                      <>
                        <Spinner className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                        <span className="hidden sm:inline">Unsuppressing...</span>
                        <span className="sm:hidden">Unsuppressing</span>
                      </>
                    ) : (
                      <>
                        <CirclePlus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </>
                    )}
                  </Button>
                </CustomTooltip>
              ))}
          </div>
        </div>
      }
    >
      <div className="max-h-[90vh] overflow-hidden">
        <Tabs defaultValue="Dashboard">
          <TabsContent value="Dashboard">
            <div className="py-0">
              <div className="w-full">
                <Response data={data} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  );
}

export default VulnInfo;
