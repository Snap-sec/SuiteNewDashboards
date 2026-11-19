import { useState } from 'react';
import { Delete, Trash2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import SelectWithAvatar from '@/components/custom/select-with-avatar';
import { Profile as ShowProfilePic } from '../../../../../components/custom/profile';
import { CustomTooltip } from '../../../../../components/custom/tooltip';
import {
  useAddVmAssessmentCollaboratorMutation,
  useRemoveVmAssessmentCollaboratorMutation,
} from '../../../../../services/vm/assessmentsApi';

const user = JSON.parse(localStorage.getItem('user'));

const Collabrators = ({
  assessment,
  members,
  text,
  limit,
  className,
  onSearchChange,
  isLoadingMembers,
}) => {
  const [params] = useSearchParams();

  const assessmentId = params.get('assessmentId');

  const [selectedUser, setSelectedUser] = useState(null);

  const [addCollaborator, { isLoading: isAddingCollabrator }] =
    useAddVmAssessmentCollaboratorMutation();
  const [removeCollaborator, { isLoading: isRemovingCollabrator }] =
    useRemoveVmAssessmentCollaboratorMutation();

  const handleRemoveCollaborator = (email) => {
    toast.promise(removeCollaborator({ assessmentId, email }).unwrap(), {
      loading: 'Removing Collaborator',
      success: 'Collaborator Removed',
      error: 'Failed to remove collaborator',
    });
  };

  const handleAddCollaborator = () => {
    if (!selectedUser?.user?.email)
      return toast.error('Please Select Collaborator');

    toast.promise(
      addCollaborator({
        assessmentId,
        ...{
          name: selectedUser.user.name,
          email: selectedUser.user.email,
          userId: selectedUser.user.userId,
        },
      }).unwrap(),
      {
        loading: 'Adding Collaborator',
        success: 'Collaborator Added Successfully',
        error: (err) => err?.data?.message || 'Failed to add collaborator',
      },
    );
  };

  const renderItem = (item, index) => {
    // Look up the full member record so we can read department / role
    const memberRecord = members?.find(
      (m) => m.email === item?.email || m.userId === item?.userId,
    );
    const subtitle =
      memberRecord?.department?.name ||
      memberRecord?.role ||
      '';

    return (
      <div key={index} className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <ShowProfilePic
            email={item?.email}
            userId={item?.userId}
            size="30px"
          />
          <div className="flex flex-col gap-0.5">
            <Link
              to={`/profile/account/members/permissions-toggle?memberId=${item?.userId}&memberEmail=${item?.email}`}
              className="flex items-center gap-1.5 leading-none font-medium text-sm text-mono hover:text-primary"
            >
              {item.name}
            </Link>
            <span className="text-sm text-secondary-foreground">
              {subtitle}
            </span>
          </div>
        </div>
        <AuthorityGuard forbidRoles={['Auditor']}>
          <div className="flex items-center gap-2.5">
            {user?._id !== item?.userId && (
              <CustomTooltip text={'Remove Collaborator'}>
                <ButtonWithConfirm
                  variant="ghost"
                  confirm={true}
                  onConfirm={() => handleRemoveCollaborator(item.email)}
                  disabled={isAddingCollabrator || isRemovingCollabrator}
                  className="w-full text-destructive hover:bg-red-200/20 hover:text-destructive"
                >
                  <Delete className=' text-red-500'/>
                </ButtonWithConfirm>
              </CustomTooltip>
            )}
          </div>
        </AuthorityGuard>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Collaborators</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 px-3 py-0 pb-3">
        <div className="text-sm text-foreground">{text}</div>
        <AuthorityGuard roles={'Admin'}>
          <div className="flex items-center">
            <SelectWithAvatar
              searchPlaceholder="Search by Name"
              placeholder="Add New Member"
              searchFields={['name', 'email']}
              valueKey="email"
              users={members?.filter(
                (m) =>
                  !assessment?.collaborators?.some((c) => c.email === m.email),
              )}
              onChange={(email) => {
                const user = members.find((m) => m.email === email);
                setSelectedUser({ user: user });
              }}
              onSearchChange={onSearchChange}
              value={selectedUser?.user?.email || ''}
            />

            <Button
              disabled={isAddingCollabrator}
              className="rounded-l-none border-l-0"
              onClick={handleAddCollaborator}
            >
              Add
            </Button>
          </div>
        </AuthorityGuard>
        <div
          className={`flex flex-col gap-5 ${assessment?.state === 'Paused' ? 'max-h-[400px]' : 'max-h-[630px]'}  kt-scrollable-y-auto`}
        >
          {assessment?.collaborators?.map?.((item, index) => {
            if (limit === undefined || index < limit) {
              return renderItem(item, index);
            }
            return null;
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export { Collabrators };
