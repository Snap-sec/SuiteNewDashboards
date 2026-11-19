import { Fragment } from 'react';
import { PageNavbar } from '@/pages/account';
import { useParams } from 'react-router-dom';
import { useGetTeamDetailsQuery } from '@/services/auth/teamsApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Container } from '@/components/common/container';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeading from '@/components/custom/page-heading';
import { TeamInfo } from './components/cards/team-info-card';
import MembersTable from './components/tables/team-members-table';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

function TeamDetailsSkeleton() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        {/* Heading Skeleton */}
        <div className="mb-6 space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6">
          <div className="col-span-3 space-y-6">
            {/* Team Info Card Skeleton */}
            <Card className="min-w-full">
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </CardHeader>

              <CardContent className="card-table pb-3 p-0">
                <Table className="align-middle text-sm">
                  <TableBody>
                    <TableRow>
                      <TableCell className="py-6 min-w-32 font-medium">
                        Team Name
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-5 w-48" />
                      </TableCell>
                      <TableCell className="text-center w-16">
                        <Skeleton className="h-8 w-8 rounded-md mx-auto" />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="py-6 min-w-32 font-medium">
                        Description
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-5 w-3/4" />
                      </TableCell>
                      <TableCell className="text-center w-16">
                        <Skeleton className="h-8 w-8 rounded-md mx-auto" />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="py-6 min-w-32 font-medium">
                        Department
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-5 w-40" />
                      </TableCell>
                      <TableCell className="text-center w-16">
                        <Skeleton className="h-8 w-8 rounded-md mx-auto" />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="py-6 min-w-32 font-medium">
                        Team Leads
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-3.5 w-28" />
                            <Skeleton className="h-3 w-36" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center w-16">
                        <Skeleton className="h-8 w-8 rounded-md mx-auto" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Members Table Skeleton */}
            <Card className="min-w-full">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <Skeleton className="h-9 w-60 rounded-md" />
                <Skeleton className="h-9 w-32 rounded-md" />
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2.5">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-1">
                              <Skeleton className="h-3.5 w-28" />
                              <Skeleton className="h-3 w-36" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <Skeleton className="h-5 w-10 rounded-full" />
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <Skeleton className="h-7 w-7 rounded-md ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Fragment>
  );
}

export function TeamDetailsPage() {
  const { teamId } = useParams();

  const { data, isLoading, isError, error } = useGetTeamDetailsQuery(teamId);

  if (isLoading) return <TeamDetailsSkeleton />;

  if (isError) return <ApiErrorHandler error={error} />;

  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <div className="mb-6">
          <PageHeading title={data?.name} description={data?.description} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6">
          <div className="col-span-3">
            <TeamInfo team={data} teamId={teamId} />

            <MembersTable members={data?.members?.filter((m) => m)} />
          </div>
        </div>
      </Container>
    </Fragment>
  );
}

export default TeamDetailsPage;
