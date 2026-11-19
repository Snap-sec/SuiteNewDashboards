import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { HexagonBadge } from '@/partials/common/hexagon-badge';
import { id } from 'date-fns/locale/id';
import {
  CalendarClock,
  Check,
  Clock,
  Copy,
  CreditCard,
  EllipsisVertical,
  KeyRound,
  Loader2,
  LogIn,
  LogOut,
  Luggage,
  Mail,
  Map,
  MapPin,
  MessageSquareText,
  MousePointerClick,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Store,
  Trash,
  UserCheck,
  Users,
} from 'lucide-react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { formatDate } from '@/lib/helpers';
import {
  useRegeneratePasswordMutation,
  useUpdateRoleMutation,
  useUpdateTeamMutation,
} from '@/services/auth/authApi';
import {
  useActivateMemberMutation,
  useGetOrgMemberQuery,
  useUpdateMemberAccessMutation,
} from '@/services/auth/orgApi';
import { useGetTeamsQuery } from '@/services/auth/teamsApi';
import {
  useAddVmAssessmentsCollaboratorBulkMutation,
  useGetVmCollaboratorAssessmentsQuery,
  useGetVmAssessmentsQuery,
} from '@/services/vm/assessmentsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input, InputWrapper } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MultiSelect from '@/components/custom/multi-select';
import { Profile } from '@/components/custom/profile';
import Select from '@/components/custom/select';
import SelectWithDescription from '@/components/custom/select-with-description';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';
import {
  ButtonWithConfirm,
  ConfirmDialog,
} from '../../../../../components/custom/button-with-confirmation';
import { CustomTooltip } from '../../../../../components/custom/tooltip';
import { toAbsoluteUrl } from '../../../../../lib/helpers';
import DeleteMember from './actions/delete-member';
import TwoFactorToggle from './actions/two-factor-toggle';
import PermissionsToggleSkeleton from './skeletons/permissions-toggle-skeleton';

const PermissionsToggle = () => {
  const { user, refreshToken } = useAuth();
  const isMember =
    user?.role?.toLowerCase() === 'member' ||
    user?.role?.toLowerCase() === 'developer';

  const [params] = useSearchParams();
  const memberId = params.get('memberId');
  const {
    data: member,
    isLoading: loadingMember,
    isError,
    error,
  } = useGetOrgMemberQuery(memberId);

  const currentUserId = user?._id || user?.id || user?.userId;
  const targetMemberId = member?.data?._id || member?.data?.id || memberId;
  const isSelf = Boolean(
    (currentUserId &&
      targetMemberId &&
      String(currentUserId) === String(targetMemberId)) ||
      (user?.email &&
        member?.data?.email &&
        user.email.toLowerCase() === member.data.email.toLowerCase()),
  );

  // const member = location.state;

  const [accessTo, setAccessTo] = useState([]);
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [assessmentSearch, setAssessmentSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');

  // Password regeneration state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordCopied, setPasswordCopied] = useState(false);

  // Product access toggle confirmation state
  const [productToToggle, setProductToToggle] = useState(null);

  const [isMemberActive, setIsMemberActive] = useState(
    location.state?.lockedDueToInactivity,
  );

  const [updateMemberAccess] = useUpdateMemberAccessMutation();
  const [addBulkCollaborators, { isLoading: isAddingBulkCollaborators }] =
    useAddVmAssessmentsCollaboratorBulkMutation();
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateRoleMutation();
  const [updateTeam, { isLoading: isUpdatingTeam }] = useUpdateTeamMutation();
  const [regeneratePassword, { isLoading: isRegeneratingPassword }] =
    useRegeneratePasswordMutation();

  const [activateMember, { isLoading: isActivatingMember }] =
    useActivateMemberMutation();

  const { data: assessments, isLoading: assessmentsLoading } =
    useGetVmAssessmentsQuery({
      search: assessmentSearch,
      is_in_selector: true,
    });
  const {
    data: collaboratorAssessments,
    isLoading: collaboratorAssessmentsLoading,
  } = useGetVmCollaboratorAssessmentsQuery(params.get('memberId'));
  const { data: teams, isLoading: teamsLoading } = useGetTeamsQuery({
    search: teamSearch,
  });

  const roleOptions =
    member?.data?.supported_roles?.map((r) => ({
      label: r.name,
      value: r.role,
      description: r.description,
    })) || [];

  // Sync collaborator assessments with selectedAssessments on load
  useEffect(() => {
    if (collaboratorAssessments?.data) {
      const initialSelected = collaboratorAssessments.data.map((a) => ({
        id: a._id,
        label: a.title,
        value: a._id,
      }));
      setSelectedAssessments(initialSelected);
    }
  }, [collaboratorAssessments]);

  // Sync member teams and product access on load
  useEffect(() => {
    if (member?.data?.teams && Array.isArray(member?.data?.teams)) {
      const initialSelected = member?.data?.teams.map((team) => ({
        id: team._id,
        label: team.name,
        value: team._id,
      }));
      setSelectedTeams(initialSelected);
    }

    if (member?.data?.products && Array.isArray(member.data.products)) {
      const activeProductIds = member.data.products
        .filter((p) => p.access)
        .map((p) => p.id || p.slug || p.title);
      setAccessTo(activeProductIds);
    } else if (member?.data?.accessTo) {
      setAccessTo(member.data.accessTo);
    }

    if (member?.data?.role) {
      setSelectedRole(member.data.role);
    }
  }, [member]);

  if (loadingMember) {
    return <PermissionsToggleSkeleton />;
  }

  if (isError) return <ApiErrorHandler error={error} />;

  const handleUpdateMemberAccess = (product) => {
    setAccessTo((prevAccess) => {
      const isAlreadyIncluded = prevAccess.includes(product);
      const newAccessTo = isAlreadyIncluded
        ? prevAccess.filter((a) => a !== product)
        : [...prevAccess, product];

      const toastId = toast.loading('Updating Access');

      updateMemberAccess({
        accessTo: newAccessTo,
        userId: params.get('memberId'),
      })
        .unwrap()
        .then((response) => {
          toast.success('Access updated!', { id: toastId });
          refreshToken();
          // Ensure the state matches exactly what the server returned
          if (
            response?.data?.products &&
            Array.isArray(response.data.products)
          ) {
            setAccessTo(
              response.data.products
                .filter((p) => p.access)
                .map((p) => p.id || p.slug || p.title),
            );
          } else if (response?.data?.accessTo) {
            setAccessTo(response.data.accessTo);
          }
        })
        .catch((error) => {
          toast.error(error?.data?.message || 'Failed to update access', {
            id: toastId,
          });
        });

      return newAccessTo; // Optimistic update
    });
  };

  const handleAssessmentsChange = (selectedValues) => {
    setSelectedAssessments(selectedValues);
  };

  const handleUpdateAssessmentAccess = () => {
    const collaborator = {
      email: member?.data?.email,
      name: `${member?.data?.firstName} ${member?.data?.lastName}`,
      userId: member?.data?._id,
    };

    const assessmentIds = selectedAssessments.map((a) => a.value);

    toast.promise(
      addBulkCollaborators({ collaborator, assessmentIds }).unwrap(),
      {
        loading: 'Updating Assessments access',
        success: 'Assessments updated',
        error: 'Failed to change assessment access',
      },
    );
  };

  const handleUpdateRoleMutation = () => {
    toast.promise(
      updateRole({ userId: member?.data?._id, role: selectedRole }).unwrap(),
      {
        loading: 'Updating Role',
        error: (error) => error?.data?.message || 'Failed to update the role',
        success: 'Role updated',
      },
    );
  };

  const handleTeamsChange = (selectedValues) => {
    setSelectedTeams(selectedValues);
  };

  const handleUpdateTeamMutation = () => {
    const teamIds = selectedTeams.map((team) => team.value);
    toast.promise(
      updateTeam({ userId: member?.data?._id, teamIds: teamIds }).unwrap(),
      {
        loading: 'Updating Teams',
        error: 'Failed to update the teams',
        success: 'Teams updated',
      },
    );
  };

  // Handle password regeneration
  const handleRegeneratePassword = async () => {
    try {
      const result = await regeneratePassword({
        userId: params.get('memberId'),
      }).unwrap();
      if (result?.data?.password) {
        setGeneratedPassword(result.data.password);
        setShowPasswordModal(true);
        setPasswordCopied(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to regenerate password');
    }
  };

  // Handle copy password to clipboard
  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setPasswordCopied(true);
      toast.success('Password copied to clipboard');
      setTimeout(() => setPasswordCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy password');
    }
  };

  // Close password modal
  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setGeneratedPassword('');
    setPasswordCopied(false);
  };

  const getProductLogo = (item) => {
    if (item.logo) {
      if (item.logo.startsWith('http://') || item.logo.startsWith('https://')) {
        return item.logo;
      }
      if (item.logo.startsWith('/public/')) {
        return toAbsoluteUrl(item.logo.replace('/public', ''));
      }
      if (item.logo.startsWith('/')) {
        return toAbsoluteUrl(item.logo);
      }
      return toAbsoluteUrl(`/media/logos/${item.logo}`);
    }
    if (item.icon) {
      if (typeof item.icon === 'string') {
        if (item.icon.startsWith('/public/')) {
          return toAbsoluteUrl(item.icon.replace('/public', ''));
        }
        return toAbsoluteUrl(item.icon);
      }
    }
    return toAbsoluteUrl('/media/logos/vm.svg');
  };

  const handleToggleProductClick = (item) => {
    const productId = item.id || item.slug || item.title;
    const productName = item.name || item.title;
    const isEnabling = !accessTo?.includes?.(productId);
    setProductToToggle({
      id: productId,
      name: productName,
      isEnabling,
    });
  };

  const renderItem = (item, index) => {
    const productId = item.id || item.slug || item.title;
    const productName = item.title || item.name;
    const logoUrl = getProductLogo(item);

    return (
      <div
        key={productId || index}
        className="rounded-xl border p-4 flex items-center justify-between gap-2.5"
      >
        <div className="flex items-center gap-3.5">
          <HexagonBadge
            stroke="stroke-input"
            fill="fill-muted/30"
            size="size-[45px]"
            badge={
              <img
                src={logoUrl}
                alt={productName}
                className="size-5 object-contain"
              />
            }
          />

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 leading-none font-medium text-sm text-mono">
              {productName}
            </span>
            <span className="text-sm text-secondary-foreground">
              {item.name}
            </span>
          </div>
        </div>
        <Switch
          id={productId}
          size="sm"
          onCheckedChange={() => handleToggleProductClick(item)}
          checked={accessTo?.includes?.(productId)}
          disabled={isMember}
        />
      </div>
    );
  };

  // Activate member disabled by Inactivity
  const handleActivateMember = () => {
    toast.promise(
      activateMember(
        location.state.userId
          ? { userId: location.state.userId }
          : { email: location.state.email },
      ).unwrap(),
      {
        loading: 'Restoring Member Access',
        success: () => {
          setIsMemberActive(true);
          return 'Member Access Restored';
        },
        error: 'Error Restoring Member Access',
      },
    );
  };

  const productsList = member?.data?.products || [];

  return (
    <div className="w-full flex flex-col items-center justify-between gap-5">
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex">
          <div className="w-full flex flex-col items-center">
            <div
              className="w-full flex flex-col items-center bg-cover bg-center bg-no-repeat rounded-t-lg"
              style={{
                backgroundImage:
                  localStorage.getItem('theme') === 'dark'
                    ? `url('${toAbsoluteUrl('/media/images/2600x1200/bg-1-dark.png')}')`
                    : `url('${toAbsoluteUrl('/media/images/2600x1200/bg-1.png')}')`,
              }}
            >
              <div className="relative w-full h-[120px]">
                <div className="flex justify-center items-center h-full">
                  <Profile
                    email={member?.data?.email}
                    avatarSize="99"
                    size="94px"
                    className={
                      member?.data?.isActive
                        ? 'rounded-full border-3 border-green-500 size-[100px] shrink-0'
                        : ''
                    }
                  />
                </div>

                <div className="flex justify-end items-center gap-2 -mt-30">
                  {/* <AuthorityGuard roles={['Admin']}>
                    <CustomTooltip text="Generate New Password">
                      <ButtonWithConfirm
                        variant="outline"
                        onConfirm={handleRegeneratePassword}
                        confirm={true}
                        disabled={isRegeneratingPassword}
                        dialog={
                          <p>Are you sure you want to reset the password?</p>
                        }
                      >
                        {isRegeneratingPassword ? (
                          <Loader2 className=" animate-spin" />
                        ) : (
                          <KeyRound className="w-4 h-4 mr-1" />
                        )}
                        <span className="text-sm">
                          {isRegeneratingPassword
                            ? 'Resetting Password'
                            : 'Reset Password'}
                        </span>
                      </ButtonWithConfirm>
                    </CustomTooltip>
                  </AuthorityGuard> */}

                  {/* <CustomTooltip text="Delete Member account">
                  <Button variant="outline">
                    <Trash />
                    Delete
                  </Button>
                </CustomTooltip> */}
                </div>
              </div>

              <div className="text-center">
                <p className="mt-2 font-bold">
                  {member?.data?.firstName} {member?.data?.lastName}
                </p>
                <p className="-mt-1 font-normal text-[12px]">
                  {member?.data?.email}
                </p>
              </div>

              <div className="flex items-center gap-6 mt-3">
                <CustomTooltip text={`Account Created On`}>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4" />
                    <p className="text-secondary-foreground font-medium text-sm">
                      {formatDate(
                        member?.data?.createdAt || member?.data?.updatedAt,
                      )}
                    </p>
                  </div>
                </CustomTooltip>

                {/* <CustomTooltip text={`2FA Status`}>
                  <div className="flex items-center gap-0.5">
                    <ShieldAlert className="w-4 h-4 mr-1" />
                    <p className="text-secondary-foreground font-medium text-sm">
                      2FA {member?.data?.twoFactorAuth ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </CustomTooltip> */}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="permissions" className="w-full text-sm mt-2">
          <TabsList
            variant="line"
            className="mb-5 w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <TabsTrigger value="permissions" className="gap-2">
                <UserCheck className="size-4" /> Role & Access
              </TabsTrigger>
              <TabsTrigger value="product-access" className="gap-2">
                <ShieldCheck className="size-4" /> Product Access
              </TabsTrigger>
            </div>

            <div className="flex items-center gap-3">
              <TwoFactorToggle
                userId={params.get('memberId')}
                initialTwoFactorAuth={member?.data?.twoFactorAuth}
              />
              {!isSelf && (
                <DeleteMember
                  memberId={memberId}
                  memberEmail={member?.data?.email}
                />
              )}
            </div>
          </TabsList>

          <TabsContent value="permissions">
            <div className="w-full py-4">
              <div className="w-full flex flex-col items-center">
                <div className="mt-2 w-full">
                  <p className="text-[12px]">Role</p>
                  <div className="flex items-center justify-between gap-2">
                    <SelectWithDescription
                      value={selectedRole}
                      options={roleOptions}
                      onChange={(option) => setSelectedRole(option.value)}
                    />
                    {!isMember && (
                      <Button
                        className="h-8"
                        variant="outline"
                        disabled={isUpdatingRole}
                        onClick={handleUpdateRoleMutation}
                      >
                        Update
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-2 w-full">
                  <p className="text-[12px]">Team</p>
                  <div className="flex items-center justify-between gap-2">
                    <MultiSelect
                      options={
                        teams?.map?.((team) => ({
                          id: team._id,
                          label: team.name,
                          value: team._id,
                        })) || []
                      }
                      values={selectedTeams}
                      onChange={handleTeamsChange}
                      onSearchChange={(search) => setTeamSearch(search)}
                      placeholder="Select teams"
                      showSelectedPreview={false}
                    />
                    {!isMember && (
                      <Button
                        className="h-10"
                        variant="outline"
                        disabled={isUpdatingTeam}
                        onClick={handleUpdateTeamMutation}
                      >
                        Update
                      </Button>
                    )}
                  </div>
                </div>
                {/* <div className="mt-2 w-full">
                                <p className="text-[12px]">Department</p>
                                <Select
                                    defaultValue={selectedRole}
                                    options={ROLES}
                                    enableSearch={false}
                                    onChange={(option) => setSelectedRole(option.value)}
                                />
                            </div> */}
                <div className="mt-2 w-full">
                  <p className="text-[12px]">Assessments</p>
                  <div className="flex items-center justify-between gap-2">
                    <MultiSelect
                      options={
                        assessments?.data?.assessments?.map((a) => ({
                          id: a._id,
                          label: a.title,
                          value: a._id,
                        })) || []
                      }
                      values={selectedAssessments}
                      onChange={handleAssessmentsChange}
                      onSearchChange={(search) => setAssessmentSearch(search)}
                      placeholder="Select assessments"
                      showSelectedPreview={false}
                    />
                    {!isMember && (
                      <Button
                        className="h-10"
                        variant="outline"
                        disabled={isAddingBulkCollaborators}
                        onClick={handleUpdateAssessmentAccess}
                      >
                        Update
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="product-access">
            <div className="w-full py-4 h-full">
              <p className="text-[13px] font-medium mb-4">Product Access</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {productsList.map((item, index) => {
                  return renderItem(item, index);
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Password Regeneration Modal */}
      <Dialog open={showPasswordModal} onOpenChange={handleClosePasswordModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <KeyRound className="w-5 h-5" />
              New Password Generated
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-secondary-foreground mb-4">
              A new password has been generated for{' '}
              <strong>
                {member?.data?.firstName} {member?.data?.lastName}
              </strong>
              . Please copy and share this password securely with the user. This
              password will not be shown again.
            </p>
            <div className="flex items-center gap-2">
              <InputWrapper className="flex-1">
                <Input
                  type="text"
                  value={generatedPassword}
                  readOnly
                  className="font-mono text-sm"
                />
              </InputWrapper>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyPassword}
                className="shrink-0"
              >
                {passwordCopied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClosePasswordModal}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Access Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(productToToggle)}
        setOpen={(open) => {
          if (!open) setProductToToggle(null);
        }}
        onConfirm={() => {
          if (productToToggle) {
            handleUpdateMemberAccess(productToToggle.id);
            setProductToToggle(null);
          }
        }}
        title={
          productToToggle?.isEnabling
            ? `Enable ${productToToggle?.name}`
            : `Disable ${productToToggle?.name}`
        }
        variant={productToToggle?.isEnabling ? 'info' : 'warning'}
        dialog={
          <span>
            Are you sure you want to{' '}
            {productToToggle?.isEnabling ? 'enable' : 'disable'}{' '}
            <strong className="text-foreground">{productToToggle?.name}</strong>{' '}
            access for{' '}
            <strong className="text-foreground">
              {member?.data
                ? `${member.data.firstName || ''} ${member.data.lastName || ''}`.trim() ||
                  member.data.email
                : 'this user'}
            </strong>
            ?
          </span>
        }
        confirmButton={
          <Button
            variant={productToToggle?.isEnabling ? 'primary' : 'destructive'}
          >
            {productToToggle?.isEnabling ? 'Enable' : 'Disable'}
          </Button>
        }
      />
    </div>
  );
};

export { PermissionsToggle };
