import React, { useEffect, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import {
  Box,
  CircleCheckBig,
  ExternalLink,
  MoreHorizontal,
  TriangleAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSetAsmExposureMutation } from '@/services/asm/attackSurfaceApi';
import { useGetAsmExposureReasonsQuery } from '@/services/asm/exposureApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Modal } from '@/components/custom/modal';
import Select from '@/components/custom/select';
import SeverityLabel from '@/components/custom/severity-label';
import { CustomTooltip } from '@/components/custom/tooltip';

const TechnologyCard = ({ technology }) => {  
  const [open, setOpen] = useState(false);
  // Action modal state for marking Safe/Exposed
  const [actionOpen, setActionOpen] = useState(false);
  const [actionType, setActionType] = useState(''); // 'safe' | 'exposed'
  const [actionNote, setActionNote] = useState('');
  const [actionSeverity, setActionSeverity] = useState('');

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
  } = useGetAsmExposureReasonsQuery(
    actionOpen && technology?.type
      ? { assetType: technology.type, status: actionType }
      : skipToken,
  );

  useEffect(() => {
    if (actionOpen && technology?.type) {
      // small log for debugging
      console.log(
        'Requesting exposure reasons for assetType:',
        technology.type,
      );
    }
  }, [actionOpen, technology?.type]);

  useEffect(() => {
    if (exposureReasonsData)
      console.log('Exposure reasons:', exposureReasonsData);
    if (exposureReasonsError) console.error(exposureReasonsError);
  }, [exposureReasonsData, exposureReasonsError]);

  const handleMarkSafe = () => {
    setActionType('safe');
    setActionNote('');
    setActionSeverity('');
    setActionOpen(true);
  };

  const handleMarkExposed = () => {
    setActionType('exposed');
    setActionNote('');
    setActionSeverity('');
    setActionOpen(true);
  };

  const handleActionSubmit = async () => {
    if (!technology?._id) return;

    try {
      await toast.promise(
        setExposure({
          assetType: technology.type,
          assetId: technology._id,
          risk: actionType === 'safe' ? 'none' : actionSeverity || 'info', // Use risk key
          reason: actionNote,
        }).unwrap(),
        {
          loading: `Marking technology ${actionType === 'safe' ? 'Safe' : 'Exposed'}`,
          success: () => {
            setActionOpen(false);
            return `Technology marked ${actionType === 'safe' ? 'Safe' : 'Exposed'} successfully`;
          },
          error: `Error marking technology ${actionType === 'safe' ? 'Safe' : 'Exposed'}`,
        },
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Card
        className="w-full cursor-pointer hover:border-primary/50 transition-colors group"
        onClick={() => setOpen(true)}
      >
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{technology.value}</h3>
                {technology?.isNew && <Badge className="ml-2" size="sm">New</Badge>}
              </div>
              <div className="flex items-center gap-1">
                {technology?.properties?.technology_categories
                  ?.slice(0, 2)
                  .map((category, index) => (
                    <Badge key={index} className="py-3.5" variant="secondary">
                      {category}
                    </Badge>
                  ))}
              </div>
            </div>


            <div className="cursor-pointer">
              <CustomTooltip
                text={`${technology?.associatedSubdomains?.length || 0} Assets`}
              >
                <Badge variant="default" appearance="outline">
                  {technology?.associatedSubdomains?.length || 0} Assets 
                </Badge>
              </CustomTooltip>
            </div>


            {/* 
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {technology?.risk !== 'none' && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkSafe();
                        }}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <CircleCheckBig className="h-4 w-4 text-green-500" />
                        Mark as Safe
                      </DropdownMenuItem>
                    )}
                    {technology?.risk === 'none' && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkExposed();
                        }}
                        className="flex items-center gap-2 cursor-pointer text-destructive"
                      >
                        <TriangleAlert className="h-4 w-4" />
                        Mark as Exposed
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div> */}
          </div>
        </CardContent>
      </Card>

      <Modal
        title="Technology Details"
        open={open}
        setOpen={setOpen}
        className="sm:max-w-xl"
      >
        <div className="flex flex-col gap-6">
          {/* Header with icon and name */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-secondary">
                <Box className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold">{technology.value}</h2>
            </div>
            {technology?.properties?.technology_website && (
              <a
                href={technology?.properties?.technology_website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                Official Website
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          {/* Description */}
          {technology?.properties?.technology_description && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm">
                {technology?.properties?.technology_description}
              </p>
            </div>
          )}

          {/* Total assets count */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Assets</p>
            <p className="text-lg font-medium">
              {technology?.associatedSubdomains?.length || 0}
            </p>
          </div>

          {/* Assets list */}
          {technology?.associatedSubdomains?.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-3">Assets</p>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                {technology?.associatedSubdomains?.map((asset, index) => (
                  <div
                    key={index}
                    className="p-2 bg-secondary/50 rounded-md text-sm"
                  >
                    {asset.value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal for marking Safe/Exposed */}
      <Modal
        title={actionType === 'safe' ? 'Mark as Safe' : 'Mark as Exposed'}
        open={actionOpen}
        setOpen={setActionOpen}
        className="sm:max-w-3xl"
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-muted-foreground">
            *Please provide a brief justification (optional)
          </p>
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
                      className={`text-xs cursor-pointer rounded-lg border p-2 ${actionNote === reason
                          ? 'bg-accent/20 font-medium'
                          : 'hover:bg-accent'
                        }`}
                      onClick={() => setActionNote(reason)}
                    >
                      {reason}
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <textarea
                className="w-full border rounded p-2 text-sm"
                rows={8}
                placeholder={`Why are you marking this as ${actionType == 'safe' ? 'safe' : 'exposed'
                  }? `}
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                disabled={isSubmitting}
              />

              <div className="flex flex-col gap-1.5 mt-2">
                <p className="text-xs text-muted-foreground">Select Severity</p>
                <Select
                  placeholder="Select severity"
                  options={severityOptions}
                  value={actionSeverity}
                  onChange={(val) => setActionSeverity(val?.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setActionOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleActionSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export const TechnologyCardSkeleton = () => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
          <div>
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnologyCard;
