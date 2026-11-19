import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSearchParams } from 'react-router-dom';
import { useUpdateVmAssessmentMutation } from '../../../../../services/vm/assessmentsApi';
import { toast } from 'sonner';



const PermissionsCheck = ({ assessment }) => {
  const [params] = useSearchParams();

  const enrichedCollaborators = assessment?.collaborators?.map(person => {
    const pref = assessment?.stakeholders?.find(p => p.email == person.email);

    return { ...person, notificationPreferences: pref?.notificationPreferences || {} };
  })

  const assessmentId = params.get("assessmentId");

  const [updateAssessment, {isLoading}] = useUpdateVmAssessmentMutation();

  const handleUpdateNotificationPref = (user, key, value) => {
    // let stakeholders = assessment.stakeholders?.filter(u => u.userId != user.userId);
    let targetUser = { ...user, notificationPreferences: { ...user.notificationPreferences, [key]: value }};


    toast.promise(updateAssessment({ assessmentId, stakeholders: [targetUser]}).unwrap(), {
      loading: "Updating Notification Preferences",
      success: "Notification preferences updated",
      error: "Failed to update notification preferences"
    });
  }

  const renderItem = (each, index) => {
    return (
      <TableRow key={index}>
        <TableCell className="py-5.5!">
          {each.name}
          <p className='text-[11px]'>{each.email}</p>
        </TableCell>
        <TableCell className="py-5.5! text-center">
          <Checkbox disabled={isLoading} defaultChecked={each.notificationPreferences.critical} onClick={() => handleUpdateNotificationPref(each, "critical", !each.notificationPreferences.critical)} />
        </TableCell>
        <TableCell className="py-5.5! text-center">
          <Checkbox disabled={isLoading} defaultChecked={each.notificationPreferences.high}  onClick={() => handleUpdateNotificationPref(each, "high", !each.notificationPreferences.high)} />
        </TableCell>
        <TableCell className="py-5.5! text-center">
          <Checkbox disabled={isLoading} defaultChecked={each.notificationPreferences.medium}  onClick={() => handleUpdateNotificationPref(each, "medium", !each.notificationPreferences.medium)} />
        </TableCell>
        <TableCell className="py-5.5! text-center">
          <Checkbox disabled={isLoading} defaultChecked={each.notificationPreferences.low}  onClick={() => handleUpdateNotificationPref(each, "low", !each.notificationPreferences.low)} />
        </TableCell>
        <TableCell className="py-5.5! text-center">
          <Checkbox disabled={isLoading} defaultChecked={each.notificationPreferences.statusUpdates}  onClick={() => handleUpdateNotificationPref(each, "statusUpdates", !each.notificationPreferences.statusUpdates)} />
        </TableCell>
        <TableCell className="py-5.5! text-center">
          <Checkbox disabled={isLoading} defaultChecked={each.notificationPreferences.remediationUpdates}  onClick={() => handleUpdateNotificationPref(each, "remediationUpdates", !each.notificationPreferences.remediationUpdates)} />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card>
      <CardHeader className="gap-2">
        <CardTitle>
          Notification Permissions
        </CardTitle>
        <div className="flex gap-5">
          {/* <Button variant="outline">
            <Link to="#">New Permission</Link>
          </Button> */}
        </div>
      </CardHeader>
      <CardContent className="kt-scrollable-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-accent/60">
              <TableHead className="text-start text-secondary-foreground font-normal min-w-[300px] h-10">
                User
              </TableHead>
              <TableHead className="min-w-24 text-secondary-foreground font-normal text-center h-10">
                Critical Severity
              </TableHead>
              <TableHead className="min-w-24 text-secondary-foreground font-normal text-center h-10">
                High Severity
              </TableHead>
              <TableHead className="min-w-24 text-secondary-foreground font-normal text-center h-10">
                Medium Severity
              </TableHead>
              <TableHead className="min-w-24 text-secondary-foreground font-normal text-center h-10">
                Low Severity
              </TableHead>
                <TableHead className="min-w-24 text-secondary-foreground font-normal text-center h-10">
               Status Updates	
              </TableHead>
              <TableHead className="min-w-24 text-secondary-foreground font-normal text-center h-10">
                Remediation Updates
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-mono font-medium">
            {
              enrichedCollaborators?.map((each, index) => {
                return renderItem(each, index);
              })
            }
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-end py-7.5 gap-2.5">
        {/* <Button variant="outline">
          <Link to="#">Restore Defaults</Link>
        </Button>
        <Button>
          <Link to="#">Save Changes</Link>
        </Button> */}
      </CardFooter>
    </Card>
  );
};

export { PermissionsCheck };
