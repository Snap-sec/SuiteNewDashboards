
import ReportEditor from "./components/editor";
import { useGetVmPublicVulnDetailsByTokenQuery } from "../../../../services/vm/vulnerabilityApi";

import { useLocation } from "react-router-dom";
import { ContentLoader } from "../../../../components/common/content-loader";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import Component from "../vulnerability-report/components/graph";
import State from './components/report-details/state';
import Owner from './components/report-details/owner';
import Assessment from './components/report-details/assessment';
import CWE from './components/report-details/cwe';
import AffectedAsset from "./components/report-details/affectedAsset";
import { useGetVmAssessmentsQuery } from "@/services/vm/assessmentsApi"
import { Skeleton } from "@/components/ui/skeleton";


function ShareReport() {

    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const vulnToken = urlParams.get('id');

    const { data, error, isLoading } = useGetVmPublicVulnDetailsByTokenQuery(vulnToken);

    const ReportDetail = data?.data;

    // if (isLoading || AssessmentLoading) return <ContentLoader />

    if (error) return (
        <div className="flex justify-center items-center h-screen w-full text-center font-bold">
            <p>THE REPORT IS NOT PUBLIC. PLEASE CONTACT THE MANAGER</p>
        </div>
    );


    return (
        <div className="flex justify-center w-full py-6 px-[15%]">


            <div className="flex justify-between gap-4 w-full">
                <div className="w-[70%] flex flex-col gap-4 border rounded-lg">
                    <ReportEditor ReportDetail={data?.data} isLoading={isLoading} />
                </div>

                <div className="flex flex-col gap-4 w-[30%]">
                    <Card className="min-w-full">
                        <CardHeader className="flex justify-between gap-4 items-center">
                            <CardTitle>Report Details</CardTitle>
                        </CardHeader>

                        <div className='flex justify-center p-2 border-b'>
                            <Component value={parseFloat(ReportDetail?.cvssScore) || 0} isLoading={isLoading} />
                        </div>

                        <CardContent className="kt-scrollable-x-auto pb-3 p-0">
                            <Table className="align-middle text-sm text-muted-foreground">
                                <TableBody>

                                    <Owner ReportDetail={ReportDetail} isLoading={isLoading} />

                                    <State ReportDetail={ReportDetail} isLoading={isLoading} />

                                    <Assessment ReportDetail={ReportDetail} isLoading={isLoading} />

                                    <CWE ReportDetail={ReportDetail} isLoading={isLoading} />

                                    <AffectedAsset ReportDetail={ReportDetail} isLoading={isLoading} />


                                    <TableRow>
                                        <TableCell className="py-3 text-secondary-foreground font-normal">
                                            CVSS Vector
                                        </TableCell>
                                        {isLoading ?
                                            <TableCell className="py-2 text-foreground font-normaltext-sm">
                                                <Skeleton className="h-6 w-full" />
                                            </TableCell>
                                            :
                                            <TableCell className="py-2 text-foreground font-normaltext-sm">
                                                <p className='max-w-45 break-words'>
                                                    {ReportDetail?.cvssString}
                                                </p>
                                            </TableCell>
                                        }
                                    </TableRow>


                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    )
}


export default ShareReport;