import { useEffect, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { BrainCircuit, CircleCheckBig, CircleEllipsis, CircleSlash2, CircleUser, TriangleAlert, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useSetAsmExposureMutation } from '@/services/asm/attackSurfaceApi';
import { useGetAsmExposureReasonsQuery } from '@/services/asm/exposureApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomTooltip } from '@/components/custom/tooltip';

import Select from '@/components/custom/select';
import DetailedHoverPopover from '../../../../../components/custom/detailed-popover';
import TimelineModel from '../../subdomains/components/modals/asset-timeline-model/timeline-model';
import SubdomainsInfoDrawerModal from '../../subdomains/components/modals/subdomain-info-modal/subdomains-info-drawer-modal';
import ImageWithPlaceholder from './image-with-placeholder';
import appConfig from "@/config/appConfig";
import { getStatusInfo } from '@/lib/status-codes';
import SeverityLabel from '@/components/custom/severity-label';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';




export function WebserverCard({
  data,
  isLoading = false
}) {
  // Skeleton loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center flex-wrap justify-between p-0 pe-5 gap-4.5">
          <div className="flex items-center gap-3.5 w-full p-1">
            <Card className="flex items-center justify-center bg-accent/50 w-[140px] h-[100px] shadow-none rounded-lg overflow-hidden">
              <Skeleton className="w-full h-full" />
            </Card>

            <div className="flex justify-between gap-6 w-full p-3">
              <div className="flex gap-2.5 mt-2 w-[300px]">
                <div className="flex flex-col max-w-[260px] gap-2 flex-wrap">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>

              <div className="flex flex-col gap-3 w-[300px]">
                <Skeleton className="h-4 w-12" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-14" />
                  <Skeleton className="h-6 w-14" />
                  <Skeleton className="h-6 w-14" />
                </div>
              </div>

              <div className="flex flex-col gap-3 w-[300px]">
                <Skeleton className="h-4 w-20" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>

              <div className="flex flex-col gap-3 w-[100px]">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>

              <div className="flex flex-col gap-3 w-[160px]">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 w-[100px] justify-end">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'safe' or 'exposed'
  const [modalNote, setModalNote] = useState('');
  const [modalSeverity, setModalSeverity] = useState('');
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const severityOptions = [
    { label: 'Critical', value: 'critical' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
    { label: 'Info', value: 'info' },
  ];

  const [setExposure, { isLoading: isSubmitting }] = useSetAsmExposureMutation();

  const {
    data: exposureReasonsData,
    isLoading: isFetchingExposureReasons,
    error: exposureReasonsError,
  } = useGetAsmExposureReasonsQuery(modalOpen && data?.type ? { assetType: data.type, status: modalType } : skipToken);

  useEffect(() => {
    if (modalOpen && data?.type) {
      console.log('Requesting exposure reasons for assetType:', data.type);
    }
  }, [modalOpen, data?.type]);

  useEffect(() => {
    if (exposureReasonsData) console.log('Exposure reasons:', exposureReasonsData);
    if (exposureReasonsError) console.error(exposureReasonsError);
  }, [exposureReasonsData, exposureReasonsError]);

  // Update handlers to open modal
  const handleSafe = () => {
    setModalType('safe');
    setModalNote('');
    setModalSeverity('');
    setModalOpen(true);
  };

  const handleExposed = () => {
    setModalType('exposed');
    setModalNote('');
    setModalSeverity('');
    setModalOpen(true);
  };

  // Submit handler using mutation with toast (matches technology-card behavior)
  const handleModalSubmit = async () => {
    if (!data?._id) return;

    try {
      await toast.promise(
        setExposure({
          assetType: data?.type,
          assetId: data._id,
          risk: modalType === 'safe' ? 'none' : modalSeverity || 'info', // Use risk key
          reason: modalNote,
        }).unwrap(),
        {
          loading: `Marking webserver ${modalType === 'safe' ? 'Safe' : 'Exposed'}`,
          success: () => {
            setModalOpen(false);
            return `Webserver marked ${modalType === 'safe' ? 'Safe' : 'Exposed'} successfully`;
          },
          error: `Error marking webserver ${modalType === 'safe' ? 'Safe' : 'Exposed'}`,
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleModalCancel = () => {
    setModalOpen(false);
  };

  const domain = data?.value?.replace(/^(http|https)?:\/\//, '')?.replace(/\:(\d+)$/, '');  
  return (
    <>
      <Card className="group">
        <CardContent className="flex items-center flex-wrap justify-between p-0 pe-5 gap-4.5">
          <div className="flex items-center gap-3.5 w-full p-1">
            <Card className="flex items-center justify-center bg-accent/50 w-[140px] h-[100px] shadow-none rounded-lg overflow-hidden">
              <ImageWithPlaceholder
                value={data?.properties?.subdomain_full_url}
                setImageModalOpen={setImageModalOpen}
              />
            </Card>

            <div className="flex justify-between gap-6 w-full p-3">
              <div className="flex gap-2.5 mt-2 w-[300px]">
                <div className="flex flex-col max-w-[260px] gap-1 flex-wrap">
                  <Link
                    to={`/casm/asset-details/${data?._id}`}
                    className="font-medium text-base truncate max-w-[400px] hover:text-primary cursor-pointer transition-colors"
                  >
                    {data?.value || '-'}
                    {data?.isNew && <Badge className="ml-2" size="sm">New</Badge>}
                  </Link>
                  <p className="text-sm text-secondary-foreground">
                    {data?.properties?.subdomain_title}
                  </p>
                  <div className="flex items-center gap-2">
                    {data?.properties?.subdomain_status_code && <span className=' text-2sm'>Status code:</span>} {" "}
                    {data?.properties?.subdomain_status_code && (() => {
                      const { name, variant } = getStatusInfo(data.properties.subdomain_status_code);
                      return (
                        <Badge
                          appearance="outline"
                          size="sm"
                          variant={variant}
                        >
                          {data.properties.subdomain_status_code} {name}
                        </Badge>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-[300px]">
                <span className="text-sm font-normal text-secondary-foreground">
                  Ports:
                </span>
                {data?.associated_ports?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {data?.associated_ports?.slice(0, 4).map((tech) => (
                      <Badge
                        key={tech?._id}
                        variant="secondary"
                        className="rounded-md"
                      >
                        {tech?.value}
                      </Badge>
                    ))}
                    {data?.associated_ports?.length > 4 && (
                      <div className="flex flex-wrap gap-2">
                        <DetailedHoverPopover
                          popoverTitle="Ports"
                          buttonText={`+${data?.associated_ports?.length - 4} more`}
                          popoverContent={data?.associated_ports
                            ?.slice(4)
                            .map((tech) => (
                              <Badge
                                key={tech?._id}
                                className="m-0.5 rounded-md"
                                variant="secondary"
                              >
                                {tech?.value}
                              </Badge>
                            ))}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs font-normal text-secondary-foreground">
                    No Ports detected
                  </p>
                )}
              </div>

              {/* <div className="flex flex-col gap-3 w-[300px]">
                <span className="text-sm font-normal text-secondary-foreground">
                  Technologies:
                </span>
                {data?.associated_technologies?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {data?.associated_technologies?.slice(0, 4).map((tech) => (
                      <Badge
                        key={tech?._id}
                        variant="default"
                        appearance="outline"
                      >
                        {tech?.value}
                      </Badge>
                    ))}
                    {data?.associated_technologies?.length > 4 && (
                      <div className="flex flex-wrap gap-2">
                        <DetailedHoverPopover
                          popoverTitle="Technologies"
                          buttonText={`+${data?.associated_technologies?.length - 4} more`}
                          popoverContent={data?.associated_technologies
                            ?.slice(4)
                            .map((tech) => (
                              <Badge
                                key={tech?._id}
                                className="m-0.5"
                                variant="default"
                                appearance="outline"
                              >
                                {tech?.value}
                              </Badge>
                            ))}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs font-normal text-secondary-foreground">
                    No technologies detected
                  </p>
                )}
              </div> */}

              <div className="flex flex-col gap-3 w-[100px]">
                <span className="text-sm font-normal text-secondary-foreground">
                  Network Scope:
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  {data?.is_internal ?
                    <Badge variant="success"
                      appearance="outline">
                      Internal
                    </Badge>
                    :
                    <Badge variant="destructive"
                      appearance="outline">
                      External
                    </Badge>
                  }
                </div>
              </div>



              <div className="flex flex-col gap-3 w-[160px]">
                <span className="text-sm font-normal text-secondary-foreground">
                  Total Signals:
                </span>
                <div className="cursor-pointer">
                  <CustomTooltip
                    text={`${data?.total_signals || 0} Signals`}
                  >
                    <Badge variant="default" appearance="outline">
                      {data?.total_signals || 0} Signals
                    </Badge>
                  </CustomTooltip>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal for Image */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="max-w-[70%] p-0">
          <img
            src={`${appConfig.BASE_URL}/util/screenshot?url=${data?.properties?.subdomain_full_url}`}
            className="w-full h-auto rounded-lg"
            alt="Web-server screenshot"
          />
        </DialogContent>
      </Dialog>

      {/* Modal for Safe/Exposed */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className="max-w-3xl mx-auto p-4 rounded-lg" // Small, centered modal
        >
          <DialogHeader>
            <DialogTitle>
              {modalType === 'safe' ? 'Mark as Safe' : 'Mark as Exposed'}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              *Please provide a brief justification for your Input (optional)
            </p>
          </DialogHeader>
          <div className="flex gap-2">
            <div className="h-60 kt-scrollable-x-auto">
              <ul className="list-none flex flex-col gap-2">
                {isFetchingExposureReasons ? (
                  <>
                    <Skeleton className="h-10 w-50" />
                    <Skeleton className="h-10 w-50" />
                    <Skeleton className="h-10 w-50" />
                    <Skeleton className="h-10 w-50" />
                    <Skeleton className="h-10 w-50" />
                    <Skeleton className="h-10 w-50" />
                  </>
                ) : (
                  exposureReasonsData?.data?.map((reason, index) => (
                    <li
                      key={index}
                      className={`text-xs cursor-pointer rounded-lg border p-2 ${modalNote === reason
                        ? 'bg-accent/20 font-medium'
                        : 'hover:bg-accent'
                        }`}
                      onClick={() => setModalNote(reason)}
                    >
                      {reason}
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <textarea
                className="w-full border rounded p-2 mt-0 text-sm"
                rows={8}
                placeholder={`Why are you marking this as ${modalType == 'safe' ? 'safe' : 'exposed'
                  }? `}
                value={modalNote}
                onChange={(e) => setModalNote(e.target.value)}
                disabled={isSubmitting}
              />

              <div className="flex flex-col gap-1.5 mt-2">
                <p className="text-xs text-muted-foreground">Select Severity</p>
                <Select
                  placeholder="Select severity"
                  options={severityOptions}
                  value={modalSeverity}
                  onChange={(val) => setModalSeverity(val?.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleModalCancel}
              disabled={isSubmitting}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleModalSubmit}
              disabled={isSubmitting}
              size="sm"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}