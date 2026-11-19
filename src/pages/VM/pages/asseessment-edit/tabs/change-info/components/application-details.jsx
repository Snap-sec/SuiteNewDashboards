import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Editor } from '@/components/custom/Editor/Editor';
import { Edit } from 'lucide-react';
import { Save } from 'lucide-react';

import { useSearchParams } from 'react-router-dom';

import { useUpdateVmAssessmentMutation } from '../../../../../../../services/vm/assessmentsApi';
import { toast } from 'sonner';
import AuthorityGuard from '../../../../../../../components/custom/authority-guard/AuthorityGuard';
import { CustomTooltip } from '../../../../../../../components/custom/tooltip';


const ApplicationDetails = ({ changeRequestData, loading }) => {

  const [params, setParams] = useSearchParams();

  const [updateAssessment] = useUpdateVmAssessmentMutation();

  const [readOnly, setReadOnly] = useState(true);
  const [changeSummary, setChangeSummary] = useState(changeRequestData?.changeSummary || "");

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </CardHeader>
        <CardContent className="pt-3.5 pb-3.5 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </CardContent>
      </Card>
    );
  }

  const handleUpdateAssessment = () => {
    toast.promise(updateAssessment({ assessmentId: params.get("assessmentId"), 'changeRequestData.changeSummary': changeSummary }).unwrap(), {
      laoding: "Updating Change Request",
      error: "Failed to update change request",
      success: "Updated change request"
    });[]
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Change Summary</CardTitle>
          <AuthorityGuard forbidRoles={['Auditor']}>
          {
            readOnly ?
            <Button variant="ghost" onClick={() => setReadOnly(false)}>
              <CustomTooltip text={"Edit"}>
              <Edit />
              </CustomTooltip>
            </Button>
            :
            <Button variant="ghost" onClick={() => { setReadOnly(true); handleUpdateAssessment(); }}>
              <CustomTooltip text={"Save"}>
              <Save />
              </CustomTooltip>
            </Button>
          }
          </AuthorityGuard>
        </CardHeader>
        <CardContent className="pt-3.5 pb-3.5">
          <Table>
            <TableBody>
              <Editor
                className="w-full"
                defaultValue={changeSummary}
                onChange={(md) => setChangeSummary(md)}
                readOnly={readOnly}
              />
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export { ApplicationDetails };
