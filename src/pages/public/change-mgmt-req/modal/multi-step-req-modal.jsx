import { useEffect, useRef, useState } from 'react';
import { isAfter, isBefore, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useViewport } from '@/hooks/use-viewport';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Scrollspy } from '@/components/ui/scrollspy';
import { useCreateNewVmChangeRequestMutation } from '../../../../services/vm/changeManagementApi';
import { RequestSummary } from '../sidebar/components/forms/change-req-summary-form';
import { ChangeRequestTimeline } from '../sidebar/components/forms/change-req-timeline';
import { TechnicalApiDocs } from '../sidebar/components/forms/techinical-api-docs-form';
import { TechnicalAppInfo } from '../sidebar/components/forms/techinical-application-info-form';
import { TechnicalAuthAccess } from '../sidebar/components/forms/techinical-auth-access-form';
import { TechnicalTestEnv } from '../sidebar/components/forms/technical-test-env';
import { PentestReqModalSidebar } from '../sidebar/modal-sidebar';
import Success from '../success-component';
import { usePentestFormStore } from '../useStore';
import { Plus } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeRequestSchema } from "../sidebar/components/forms/schemas/change-req-schema";
import { Form } from "@/components/ui/form";


export function ChangeMgmtPentestReqPage() {
  const { formData, setFormData } = usePentestFormStore();

  const mobileMode = useIsMobile();
  const parentRef = useRef(null);
  const [sidebarHeight, setSidebarHeight] = useState(0);
  const [viewportHeight] = useViewport();
  const offset = 260;

  const [createPentestRequest, { isLoading, isSuccess }] =
    useCreateNewVmChangeRequestMutation();

  const form = useForm({
    resolver: zodResolver(changeRequestSchema),
    mode: "onChange",
    defaultValues: formData?.changeRequestData || {},
  });

  // Sync Form values back to the store for other components that might need them
  // and for the final submission payload which uses the store.
  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData({
        changeRequestData: {
          ...formData.changeRequestData,
          ...value
        }
      });
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setFormData, formData.changeRequestData]);

  useEffect(() => {
    setSidebarHeight(viewportHeight - offset);
  }, [viewportHeight]);

  const handleCreatePentestRequest = (data) => {
    const requestDate = parseISO(data.dateOfRequest);
    const goLiveDate = parseISO(data.plannedGoLiveDate);
    const deadlineDate = parseISO(data.deadlineForReport);
    
    if (isBefore(goLiveDate, requestDate)) {
      return toast.error(
        'Planned Go-Live Date cannot be before Date of Request.',
      );
    }
    if (isAfter(goLiveDate, deadlineDate)) {
      return toast.error(
        'Planned Go-Live Date cannot be after Deadline for Report.',
      );
    }

    toast.promise(createPentestRequest({ ...formData, changeRequestData: data }).unwrap(), {
      loading: 'Creating Pentest Request',
      success: 'Pentest Request Created',
      error: 'Failed to create pentest request',
    });
  };

  return (
    <div className="flex flex-col grow min-h-screen bg-background">
      {isSuccess ? (
        <Success />
      ) : (
        <div className="mx-auto grow w-full max-w-[1320px] flex flex-col px-10 gap-0 py-10 overflow-hidden">
          <header className="p-0 border-0">
            <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
              <div className="flex flex-col justify-center gap-2">
                <h1 className="text-xl font-semibold leading-none text-mono uppercase tracking-wider">
                  Create new Pentest Request
                </h1>
                <div className="flex items-center gap-2 text-sm font-normal text-secondary-foreground">
                  Fill the form and Create a Pentest Request
                </div>
              </div>

              <Button 
                disabled={isLoading} 
                onClick={form.handleSubmit(handleCreatePentestRequest)}
              >
                <Plus /> Create Request
              </Button>
            </div>
          </header>
          <ScrollArea
            className="grow py-0 mb-5 ps-0 pe-3 -me-7"
            viewportRef={parentRef}
          >
            <Form {...form}>
              <div className="flex grow gap-5 lg:gap-7.5">
                {!mobileMode && (
                  <div
                    className="w-[300px] sticky top-[1px]"
                    style={{ maxHeight: `${sidebarHeight}px` }}
                  >
                    <ScrollArea className="h-full">
                      <Scrollspy offset={100} targetRef={parentRef}>
                        <PentestReqModalSidebar />
                      </Scrollspy>
                    </ScrollArea>
                  </div>
                )}

                <div className="flex flex-col items-stretch grow py-3 gap-5 lg:gap-7.5 ">
                  <RequestSummary />
                  <ChangeRequestTimeline />

                  <TechnicalAppInfo />
                  <TechnicalTestEnv />
                  <TechnicalAuthAccess />
                  <TechnicalApiDocs />
                </div>
              </div>
            </Form>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
