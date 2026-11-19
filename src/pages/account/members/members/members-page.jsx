import { Fragment, useEffect, useState } from 'react';
import { PageNavbar } from '@/pages/account';
import { Help2 } from '@/partials/common/help2';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Clock, MailPlus, User } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router';
import { useSettings } from '@/providers/settings-provider';
import {
  useGetJoinLinkQuery,
  useGetOrgMembersQuery,
  useGetPendingRegisterationsQuery,
} from '@/services/auth/orgApi';
import { useGetTeamsQuery } from '@/services/auth/teamsApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Container } from '@/components/common/container';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import PageHeading from '@/components/custom/page-heading';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import RolesSelector from '../../../../components/common/roles-selector';
import { PendingMembers } from './components/';
import {
  InvitePeople,
  InviteWithLink,
  Members,
  Question,
  QuickAccountSetup,
} from './components/index';
import useStore from './store';

export function MembersPage() {
  const { settings } = useSettings();

  const searchQuery = useStore((state) => state.searchQuery);
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const sorting = useStore((state) => state.sorting);
  const setFilters = useStore((state) => state.setFilters);
  const rawFilters = useStore((state) => state.filters);

  const searchParams = new URLSearchParams(window.location.search);
  const teams = searchParams.get('teamId');

  const filters = {
    ...rawFilters,
    ...(teams ? { teams } : {}), // Set teamId as filter parameter
  };

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [searchQuery, rawFilters, setPagination]);

  const {
    data: org,
    isLoading: orgLoading,
    isFetching,
    isError: isOrgMembersError,
    error: orgMembersError,
  } = useGetOrgMembersQuery({
    search: searchQuery,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    filter: 'isSignedUp=true',
    ...filters,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, sort: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
  });

  const {
    data: pending,
    isLoading: pendingRegLoading,
    isError: isPendingRegError,
    error: pendingRegError,
  } = useGetPendingRegisterationsQuery({ search: searchQuery });
  const { data: teamsData, isLoading: teamsLoading } = useGetTeamsQuery();

  const {
    data: joinlink,
    isLoading: joinLinkLoading,
    isError: isJoinLinkError,
    error: joinLinkError,
  } = useGetJoinLinkQuery();

  const questions = [
    {
      question: 'How does quick account setup work?',
      answer:
        "Quick account setup is a simple and fast way to get started. Just fill in your first name, last name, email, role, and team — and we’ll create your account instantly. No complicated forms, no extra steps — you're in and ready to go in seconds.",
    },

    {
      question: 'How does inviting people work?',
      answer:
        ' Inviting people makes it easy to bring your team into the workspace. Add their name, email, and role — and we’ll send them an invitation right away. Once they accept, they can start collaborating with you immediately.',
    },

    {
      question: 'How does invite with link work?',
      answer:
        'Invite with link gives you a fast way to bring people into your team. Just copy your unique join link and share it with anyone you want to add. When they open the link, they can join instantly — no manual invites needed.',
    },
  ];

  const [activeTab, setActiveTab] = useState('members');

  const headingConfig = {
    members: {
      title: 'Members',
      description: 'Manage and organize members within your organization.',
    },
    invited: {
      title: 'Invited Members',
      description: 'Manage and track member invitations within your organization.',
    },
    pending_registerations: {
      title: 'Pending Registrations',
      description: 'Review and manage pending member registration requests for your organization.',
    },
  };

  const currentHeading = headingConfig[activeTab] || headingConfig.members;

  return (
    <Fragment>
      <PageNavbar />
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                Overview of all team members and roles.
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline">
                <Link to="#">Import Members</Link>
              </Button>
              <Button>
                <Link to="#">Add Member</Link>
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <Helmet>
          <title>Auth | {currentHeading.title}</title>
        </Helmet>
        <PageHeading
          title={currentHeading.title}
          description={currentHeading.description}
        />

        <div className="grid gap-5 lg:gap-7.5">
          <Tabs
            value={activeTab}
            defaultValue="members"
            onValueChange={(value) => {
              setActiveTab(value);
              setFilters((state) => ({
                ...state.filters,
                hasSignedUp: value === 'invited' ? 'false' : 'true',
              }));
            }}
          >
            <TabsList variant="line">
              <TabsTrigger value="members">
                <User />
                Members
              </TabsTrigger>

              <AuthorityGuard roles={['Admin']}>
                <TabsTrigger value="invited">
                  <MailPlus />
                  Invited
                </TabsTrigger>
              </AuthorityGuard>

              <AuthorityGuard roles={['Admin']}>
                <TabsTrigger value="pending_registerations">
                  <Clock />
                  Pending Registerations
                  {pending?.data?.length > 0 && (
                    <Badge
                      variant="destructive"
                      appearance="outline"
                      shape="circle"
                    >
                      {pending?.data?.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </AuthorityGuard>
            </TabsList>

            <TabsContent value="members">
              {isOrgMembersError ? (
                <ApiErrorHandler error={orgMembersError} />
              ) : (
                <Members
                  members={org?.data?.members}
                  advancedFilters={org?.data?.advanced_filters}
                  loading={orgLoading}
                  isFetching={isFetching}
                  totalCount={org?.data?.total}
                  totalPages={Math.ceil(org?.data?.total / pagination.pageSize)}
                />
              )}
            </TabsContent>

            <AuthorityGuard roles={['Admin']}>
              <TabsContent value="invited">
                {isOrgMembersError ? (
                  <ApiErrorHandler error={orgMembersError} />
                ) : (
                  <Members
                    members={org?.data?.members}
                    filters={org?.data?.filters}
                    loading={orgLoading}
                    isFetching={isFetching}
                    totalCount={org?.data?.total}
                    totalPages={Math.ceil(
                      org?.data?.total / pagination.pageSize,
                    )}
                  />
                )}
              </TabsContent>
            </AuthorityGuard>

            <AuthorityGuard roles={['Admin']}>
              <TabsContent value="pending_registerations">
                {isPendingRegError ? (
                  <ApiErrorHandler error={pendingRegError} />
                ) : (
                  <PendingMembers
                    members={pending?.data}
                    loading={pendingRegLoading}
                    totalCount={pending?.data?.length}
                    totalPages={Math.ceil(
                      pending?.data?.length / pagination.pageSize,
                    )}
                  />
                )}
              </TabsContent>
            </AuthorityGuard>
          </Tabs>

          <AuthorityGuard roles={['Admin']}>
            <div className="grid  gap-5 lg:gap-7.5">
              <div className="flex flex-col gap-4">
                <div className=" flex w-full gap-4">
                  <QuickAccountSetup teams={teamsData} loading={teamsLoading} />
                  <Question
                    question={questions[0]?.question}
                    answer={questions[0]?.answer}
                  />
                </div>

                <div className=" flex w-full gap-4">
                  <InvitePeople teams={teamsData} loading={teamsLoading} />
                  <Question
                    question={questions[1]?.question}
                    answer={questions[1]?.answer}
                  />
                </div>

                <div className=" flex w-full gap-4">
                  <InviteWithLink
                    joinlink={joinlink}
                    loading={joinLinkLoading}
                  />
                  <Question
                    question={questions[2]?.question}
                    answer={questions?.[2]?.answer}
                  />
                </div>
              </div>
            </div>
          </AuthorityGuard>
          {/* <Faq /> */}
          <Help2 />
        </div>
      </Container>
    </Fragment>
  );
}
