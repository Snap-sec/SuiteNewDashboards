import { Fragment, useState } from 'react';
import { PageNavbar } from '@/pages/account';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useGetDepartmentDetailsQuery } from '@/services/auth/departmentsApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Container } from '@/components/common/container';
import PageHeading from '@/components/custom/page-heading';
import { DepartmentDetailsCard } from './components/cards/department-details-card';
import MembersTable from './components/tables/department-members-table';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

export function DepartmentsDetailsPage() {
  const { departmentId } = useParams();
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, error } =
    useGetDepartmentDetailsQuery({ departmentId, search });

  if (isError) return <ApiErrorHandler error={error} />

  return (
    <Fragment>
      <Helmet>
        <title>Department details</title>
      </Helmet>

      <PageNavbar />

      <Container>
        <div className="mb-6">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
          ) : (
            <PageHeading
              title={data?.data?.name}
              description={data?.data?.description}
            />
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6">
          <div className="col-span-3 space-y-6">
            <DepartmentDetailsCard data={data?.data} isLoading={isLoading} />
            <MembersTable
              members={data?.data?.teamIds}
              search={search}
              setSearch={setSearch}
              isLoading={isLoading}
            />
          </div>
        </div>
      </Container>
    </Fragment>
  );
}

export default DepartmentsDetailsPage;
