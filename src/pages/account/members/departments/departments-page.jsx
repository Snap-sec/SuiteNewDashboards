import { Fragment } from 'react';
import { Faq } from '@/partials/common/faq';
import { Help2 } from '@/partials/common/help2';
import { Helmet } from 'react-helmet';
import { Container } from '@/components/common/container';
import { useGetDepartmentsQuery } from '../../../../services/auth/departmentsApi';
import { DepartmentCards } from './components/cards/department-cards';
import AddDepartment from './components/modals/post-department-modal';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

export function DepartmentsPage() {
  const { data: departments, isLoading, isError, error } = useGetDepartmentsQuery({});

  const faqs = [
    {
      title: 'What is a department in the system?',
      text: 'A department represents a high-level organizational unit grouping related teams.',
    },
    {
      title: 'How do I create a new department?',
      text: "You can create one from the admin panel under 'Organization Settings > Departments'.",
    },
    {
      title: 'Can I delete a department?',
      text: 'Yes, but only if no teams or users are currently assigned to it.',
    },
    {
      title: 'Can a department have multiple teams?',
      text: 'Yes, a department can contain any number of teams.',
    },
    {
      title: 'How do I update department details?',
      text: "Edit options are available from the department's profile page.",
    },
    {
      title: 'Who can manage departments?',
      text: 'Only administrators or users with department-level privileges.',
    },
    {
      title: 'Can departments be reordered?',
      text: 'Some systems allow custom sorting; check your settings for this option.',
    },
    {
      title: 'Is there a limit on the number of departments?',
      text: 'No strict limit, but performance considerations may apply.',
    },
    {
      title: 'Can a department exist without teams?',
      text: 'Yes, departments can be created even before teams are added.',
    },
    {
      title: 'How do I assign a user directly to a department?',
      text: 'Assignments typically happen through teams, but direct assignment may be allowed depending on configuration.',
    },
  ];

  if (isError) return <ApiErrorHandler error={error} />

  return (
    <Fragment>
      <Container>
        <div className="grid gap-5 lg:gap-7.5">
          <Helmet>
            <title>Auth | Departments</title>
          </Helmet>

          <DepartmentCards data={departments?.data} loading={isLoading} />

          <Faq accordonTitle="Departments – FAQs" items={faqs} />
          <Help2 />
        </div>

        <AddDepartment />
      </Container>
    </Fragment>
  );
}
