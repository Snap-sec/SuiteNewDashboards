import { CircleMinus, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Modal } from '@/components/custom/modal';
import useStore from '../../vulnerabilities/store';
import { Timeline } from '../../vulnerabilities/components/ui/timeline';
import { useSendVsToVmMutation } from '@/services/vs/vsApi';
import { toast } from "sonner";
import { Link2 } from "lucide-react";
import { useSuppressVsVulnMutation, useUnSuppressVsVulnMutation } from '@/services/vs/vsApi';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';


function VulnInfo({ showInfo, setShowInfo }) {
  const vuln = useStore((state) => state.selectedVuln);
  const [sendToVm] = useSendVsToVmMutation();
  const [suppressVuln] = useSuppressVsVulnMutation();
  const [unsuppressVuln] = useUnSuppressVsVulnMutation();

  const handleActions = {
    suppress: async () => {
      const payload = {
        vulnId: vuln._id,
        matcher_name: vuln.matcher_name,
        template_id: vuln.template_id,
        matched_at: vuln.matched_at,
        host: vuln.host,
      };

      toast.promise(suppressVuln(payload).unwrap(), {
        loading: 'Suppressing vulnerability',
        success: 'Vulnerability suppressed successfully',
        error: 'Failed to suppress vulnerability',
      });
    },

    unsuppress: async () => {
      const payload = {
        vulnId: vuln._id,
        matcher_name: vuln.matcher_name,
        template_id: vuln.template_id,
        matched_at: vuln.matched_at,
        host: vuln.host,
      };

      toast.promise(unsuppressVuln(payload).unwrap(), {
        loading: 'Un Suppressing vulnerability',
        success: 'Vulnerability Un suppressed successfully',
        error: 'Failed to unsuppress vulnerability',
      });
    },
  };

  const handleSendToVm = () => {
        toast.promise(sendToVm({ vulnIds: [vuln?._id] }).unwrap(), {
            loading: "Sending to VM",
            error: "Failed to send to VM",
            success: "Ticket created in VM"
        });
  }

  const reverseTimeline = [...(vuln?.timeline || [])]?.reverse?.()


  return (
    <Modal
      className="w-3/5"
      open={showInfo}
      setOpen={setShowInfo}
      title={
        <div className=" flex justify-between items-center -mt-3 pr-8">
          <div className="flex items-center gap-2">
            {vuln?.title}
            <Badge className="w-fit capitalize">{vuln?.severity}</Badge>
          </div>

          <AuthorityGuard forbidRoles={['Auditor']}>
          <div className=" flex justify-between items-center gap-2">
            {vuln && (
                !vuln.sentToVm ? (
                  <ButtonWithConfirm
                    confirm={true}
                    variant="outline"
                    onConfirm={() => handleSendToVm()}
                  >
                    Send To VM
                  </ButtonWithConfirm>
                ) : (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() =>
                      window.open(
                        `/vm/vulnerability-report?id=${vuln?.universalVulnId}&assessmentId=${vuln?.assessmentId}`,
                        "_blank"
                      )
                    }
                  >
                    <Link2 /> View Ticket
                  </Badge>
                )
              )}

            
            {
              !vuln?.is_suppressed ?
              <Button variant="outline" className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30" onClick={handleActions.suppress}>
                <CircleMinus className="h-4 w-4 mr-2" /> Suppress
              </Button>
              :
              <Button variant="outline" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30" onClick={handleActions.unsuppress}>
                <PlusCircle className="h-4 w-4 mr-2" /> Un-Suppress
              </Button>
            }
          </div>
          </AuthorityGuard>
        </div>
      }
      description={
        <div className="text-sm text-muted-foreground w-3/5">{vuln?.description}</div>
      }
    >
      <div className="flex gap-4 mt-2 relative">
        <Card className="w-[60%]">
          <ScrollArea className=" pr-2">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-md font-semibold">Host Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Host:</strong>{' '}
                    <a href={vuln?.host} target="_blank" rel="noreferrer">
                      {vuln?.host}
                    </a>
                  </div>
                  <div>
                    <strong>IP:</strong> {vuln?.ip}
                  </div>
                  <div>
                    <strong>Matched At:</strong> {vuln?.matched_at}
                  </div>
                  <div>
                    <strong>Matcher Name:</strong> {vuln?.matcher_name}
                  </div>
                  <div>
                    <strong>Scan Found On:</strong>{' '}
                    {new Date(vuln?.latestFoundOn).toLocaleString()}
                  </div>
                </div>
              </div>

              <Separator />

              {/* <div className="space-y-2">
                    <h4 className="text-md font-semibold">Template Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Template ID:</strong> {vuln?.template_id}</div>
                    <div><strong>Template Path:</strong> {vuln?._raw?.template}</div>
                    <div className="col-span-2">
                        <strong>Template URL:</strong>{" "}
                        <a href={vuln?._raw?.["template-url"]} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                        {vuln?._raw?.["template-url"]}
                        </a>
                    </div>
                    </div>
                </div> */}

              <Separator />

              <div className="space-y-2">
                <h4 className="text-md font-semibold">Scanner Info</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Scanner Name:</strong> {vuln?.scannerId?.name}
                  </div>
                  <div>
                    <strong>Scanner IP:</strong> {vuln?.scannerId?.ip}
                  </div>
                  <div>
                    <strong>Active:</strong>{' '}
                    {vuln?.scannerId?.active ? 'Yes' : 'No'}
                  </div>
                  <div>
                    <strong>Last Heartbeat:</strong>{' '}
                    {new Date(vuln?.scannerId?.last_heartbeat).toLocaleString()}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-md font-semibold">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {vuln?.tags?.map((tag) => (
                    <Badge variant="secondary" key={tag}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {
                vuln?.curl ?
                <>
                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-md font-semibold">Curl Command</h4>
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto whitespace-pre-wrap">
                      {vuln?.curl}
                    </pre>
                  </div>
                </>
                :
                ''
              }
            </CardContent>
          </ScrollArea>
        </Card>

        <div className="w-[40%]">
          <Timeline timeline={reverseTimeline} />
        </div>
      </div>
    </Modal>
  );
}

export default VulnInfo;
