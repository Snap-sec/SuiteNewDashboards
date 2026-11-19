import { Fragment, useEffect } from 'react';
import { PageNavbar } from '@/pages/account';
import { Faq } from '@/partials/common/faq';
import { Help2 } from '@/partials/common/help2';
import { Helmet } from 'react-helmet';
import { useGetTeamsQuery } from '@/services/auth/teamsApi';
import { Container } from '@/components/common/container';
import { AccountTeamsStarterContent } from '../team-starter/index.js';
import { Teams } from './components/index.js';
import AddTeam from './components/modals/add-team-modal.jsx';
import useStore from './store.js';
import useDebounce from '@/hooks/use-debounce';
import ApiErrorHandler from '../../../../components/common/api-error-handler.jsx';


export function TeamsPage() {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const sorting = useStore((state) => state.sorting);
  const searchQuery = useStore((state) => state.searchQuery);

  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    setPagination(() => ({ pageIndex: 0, pageSize: 10 }));
  }, [debouncedSearch, setPagination]);

  const { data: teams, isLoading: teamsLoading, isFetching, isError, error } = useGetTeamsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, sort: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
  });

  const faqs = [
    {
      title: 'What is a team?',
      text: 'A team is a smaller group within a department focused on specific tasks or workflows.',
    },
    {
      title: 'How do I create a new team?',
      text: "Navigate to 'Organization Settings > Teams' and select 'Add Team'.",
    },
    {
      title: 'Can a team belong to multiple departments?',
      text: 'Usually no; teams typically have one parent department.',
    },
    {
      title: 'How do I add users to a team?',
      text: "Search for a user under the team profile and add them via 'Manage Members'.",
    },
    {
      title: 'Can teams be renamed?',
      text: 'Yes, team names can be edited from the team settings.',
    },
    {
      title: 'Who can manage teams?',
      text: 'Team leads, department admins, or system administrators.',
    },
    {
      title: 'What happens if I delete a team?',
      text: 'Users assigned to it may lose access to team-specific resources and permissions.',
    },
    {
      title: 'Can a team have a team lead?',
      text: 'Yes, you may assign one or more leads to manage the team.',
    },
    {
      title: 'Can a user belong to multiple teams?',
      text: 'Yes, users can be members of several teams simultaneously.',
    },
    {
      title: 'Is there a limit to how many users a team can have?',
      text: 'No strict limit; depends on system configuration and performance.',
    },
  ];

  if (!isError && !teams?.length && !teamsLoading && !debouncedSearch)
    return (
      <>
        <AccountTeamsStarterContent />;
        <AddTeam />
      </>
    );

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <Fragment>
      <PageNavbar />

      <Container>
        <div className="grid gap-5 lg:gap-7.5">
          <Helmet>
            <title>Auth | Teams</title>
          </Helmet>

          <Teams data={teams} loading={teamsLoading || isFetching} />

          <Faq accordonTitle="Teams – FAQs" items={faqs} />

          <Help2 />
        </div>

        <AddTeam />
      </Container>
    </Fragment>
  );
}