import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  History,
  Save,
  Search,
  Settings,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import useDebounce from '@/hooks/use-debounce';
import {
  useGetAimDecommissionPolicyQuery,
  useUpdateAimDecommissionPolicyMutation,
} from '@/services/asset-inventory/settingsApi';
import { useGetOrgMembersQuery } from '@/services/auth/orgApi';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input, InputWrapper } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentLoader } from '@/components/common/content-loader';
import PaginationView from '@/components/custom/pagination';
import { Profile } from '@/components/custom/profile';
import Select from '@/components/custom/select';
import { SearchInput } from '@/components/custom/search';
import { NoSearchResultsFound } from '@/components/common/no-search-found';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';

const LifecycleSettings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const {
    data: policy,
    isLoading: isLoadingPolicy,
    isError,
    error,
  } = useGetAimDecommissionPolicyQuery();

  const includeIds =
    policy?.required_approvers?.map((a) => a.userId).join(',') || undefined;

  const { data: membersData, isLoading: isLoadingMembers } =
    useGetOrgMembersQuery({
      search: debouncedSearch,
      page: currentPage,
      limit: 10,
      ...(includeIds ? { includeIds } : {}),
    });

  const [updatePolicy, { isLoading: isUpdating }] =
    useUpdateAimDecommissionPolicyMutation();

  const members = membersData?.data?.members || [];
  const total = membersData?.data?.total || 0;
  const limit = membersData?.data?.limit || 10;
  const totalPages = Math.ceil(total / limit);

  const [requiredCount, setRequiredCount] = useState('2');
  const [selectedApprovers, setSelectedApprovers] = useState([]);

  useEffect(() => {
    if (policy?.required_approvers) {
      setSelectedApprovers(policy.required_approvers);
    }
    if (policy?.required_approvals_count) {
      setRequiredCount(String(policy.required_approvals_count));
    }
  }, [policy]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const handleToggleUser = (user) => {
    setSelectedApprovers((prev) => {
      const isSelected = prev.some((a) => a.userId === user._id);
      if (isSelected) {
        return prev.filter((a) => a.userId !== user._id);
      } else {
        return [
          ...prev,
          {
            userId: user._id,
            email: user.email,
            name: memberName(user),
            role: user.role || 'Manager',
          },
        ];
      }
    });
  };

  const memberName = (user) => user.name || user.email?.split('@')[0];

  const handleSave = async () => {
    try {
      await updatePolicy({
        required_approvers: selectedApprovers,
        required_approvals_count: parseInt(requiredCount),
      }).unwrap();
      toast.success('Decommission policy updated successfully');
    } catch (error) {
      toast.error('Failed to update policy');
    }
  };

  const approvalOptions = React.useMemo(() => {
    const options = [];
    const maxOptions = Math.min(total, 10);
    for (let i = 1; i <= maxOptions; i++) {
      options.push({
        label: `${i} Approval${i > 1 ? 's' : ''}`,
        value: String(i),
      });
    }
    if (total > 0) {
      options.push({ label: 'All Authorized Admins', value: 'all' });
    }
    return options.length > 0 ? options : [{ label: '1 Approval', value: '1' }];
  }, [total]);

  if (isLoadingPolicy) {
    return (
      <div className="mt-6 flex flex-col gap-6 w-full pb-10 animate-pulse">
        <Card className="bg-card/50 border-border/60 shadow-sm overflow-hidden">
          <CardContent className="p-6 flex flex-col gap-8">
            {/* Section: Workflow Preview */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-28 rounded" />
              </div>

              <div className="flex items-center justify-center gap-4 py-2">
                {[1, 2, 3].map((i) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center gap-2">
                      <Skeleton className="size-10 rounded-full" />
                      <div className="flex flex-col items-center gap-1">
                        <Skeleton className="h-3 w-16 rounded" />
                        <Skeleton className="h-2.5 w-12 rounded" />
                      </div>
                    </div>
                    {i < 3 && (
                      <Skeleton className="h-4 w-4 rounded-full mt-[-20px]" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="h-px bg-border/40" />

            {/* Section: Eligible Approvers */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-5 w-36 rounded" />
                  <Skeleton className="h-3.5 w-96 rounded" />
                </div>
                <Skeleton className="h-9 w-36 rounded-md" />
              </div>

              <div className="border border-border/60 rounded-xl bg-background/30 overflow-hidden flex flex-col">
                {/* Inner Search */}
                <div className="p-3 border-b border-border/40">
                  <Skeleton className="h-8 w-64 rounded-md" />
                </div>

                {/* User List */}
                <div className="divide-y divide-border/30">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Skeleton className="size-9 rounded-full shrink-0" />
                        <div className="flex flex-col gap-1.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-32 rounded" />
                            <Skeleton className="h-4 w-12 rounded-full" />
                          </div>
                          <Skeleton className="h-3 w-48 rounded" />
                        </div>
                      </div>
                      <Skeleton className="rounded-md h-5 w-5" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Skeleton className="h-9 w-60 rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) return <ApiErrorHandler error={error} />;

  return (
    <div>
      <div>
        <div className="mt-4 flex flex-col gap-8">

          {/* Section: Eligible Approvers */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold text-foreground">
                  Eligible Approvers
                </h2>
                <p className="text-xs text-muted-foreground">
                  Select the users from the system who are authorized to approve
                  decommission requests.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button onClick={handleSave} disabled={isUpdating}>
                  {isUpdating ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  {isUpdating ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </div>

            <div className="border border-border/60 rounded-xl bg-background/30 overflow-hidden flex flex-col">
              {/* Inner Search */}
              <div className="p-3 border-b border-border/40">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full max-w-xs"
                  inputClass="bg-background/80 h-9 text-sm"
                  isSearching={isLoadingMembers && searchQuery.length > 0}
                />
              </div>

              <ScrollArea className="h-[450px] relative">
                <div className="divide-y divide-border/30">
                  {isLoadingMembers
                    ? Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Skeleton className="size-9 rounded-full shrink-0" />
                          <div className="flex flex-col gap-1.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-4 w-32 rounded" />
                              <Skeleton className="h-4 w-12 rounded-full" />
                            </div>
                            <Skeleton className="h-3 w-48 rounded" />
                          </div>
                        </div>
                        <Skeleton className="rounded-md h-5 w-5" />
                      </div>
                    ))
                    : members.length > 0
                      ? members.map((member) => {
                        const isSelected = selectedApprovers.some(
                          (a) => a.userId === member._id,
                        );
                        return (
                          <div
                            key={member._id}
                            onClick={() => handleToggleUser(member)}
                            className={cn(
                              'flex items-center justify-between px-4 py-3 cursor-pointer transition-colors group',
                              isSelected
                                ? 'bg-primary/5'
                                : 'hover:bg-muted/30',
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Profile
                                email={member.email}
                                name={memberName(member)}
                                size={36}
                                showName={false}
                              />
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold truncate text-foreground">
                                    {memberName(member)}
                                  </span>
                                  {member.role && (
                                    <Badge
                                      variant="secondary"
                                      appearance="outline"
                                      size="xs"
                                      className="uppercase tracking-widest font-bold text-[8px] px-1.5 py-0 h-4 bg-muted/50 border-border/60"
                                    >
                                      {member.role}
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-[11px] text-muted-foreground truncate leading-tight">
                                  {member.email}
                                </span>
                              </div>
                            </div>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => { }} // Handled by div onClick
                              className="rounded-md h-5 w-5 border-border/80"
                            />
                          </div>
                        );
                      })
                      : !isLoadingMembers && (
                        <div className="py-10">
                          <NoSearchResultsFound title="No Users Found" />
                        </div>
                      )}
                </div>
              </ScrollArea>
            </div>

            <div className="flex justify-end">
              {isLoadingMembers ? (
                <Skeleton className="h-9 w-60 rounded-md" />
              ) : (
                <PaginationView
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="pt-0"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default LifecycleSettings;
