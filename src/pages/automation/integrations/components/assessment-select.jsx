import { useState } from 'react';
import Select from '@/components/custom/select';
import { useGetVmAssessmentsQuery } from '@/services/vm/assessmentsApi';
import CreateAssessmentModel from '@/pages/VM/pages/assessment/components/Modal/create-assessment-model';
import { useAuth } from '@/auth/context/auth-context';

const CREATE_ASSESSMENT_VALUE = '__create_assessment__';

export default function AssessmentSelect({
  value,
  onChange,
  placeholder = "Select assessment",
  searchPlaceholder = "Search assessments...",
  error,
  disabled,
  className,
  allowNone = false,
}) {
  const [search, setSearch] = useState('');
  const [createAssessmentOpen, setCreateAssessmentOpen] = useState(false);
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';

  const { data: assessments, isLoading, isFetching } = useGetVmAssessmentsQuery({ search });

  const sortedAssessments = [...(assessments?.data?.assessments || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const assessmentOptions = [
    ...(!isAuditor ? [{ label: '+ Create Assessment', value: CREATE_ASSESSMENT_VALUE, className: 'text-primary font-medium', noNavigate: true }] : []),
    ...(allowNone ? [{ label: 'None', value: 'none', noNavigate: true }] : []),
    ...sortedAssessments.map((a) => ({
      value: a._id,
      label: a.name || a.title,
      id: a._id,
    })),
  ];

  const handleChange = (option) => {
    if (option?.value === CREATE_ASSESSMENT_VALUE) {
      setCreateAssessmentOpen(true);
    } else {
      onChange?.(option);
    }
  };

  return (
    <>
      <Select
        value={value}
        options={assessmentOptions}
        placeholder={placeholder}
        onChange={handleChange}
        onSearchChange={setSearch}
        searchPlaceholder={searchPlaceholder}
        isLoading={isLoading || isFetching}
        error={error}
        disabled={disabled}
        className={className}
      />
      <CreateAssessmentModel
        open={createAssessmentOpen}
        setOpen={setCreateAssessmentOpen}
      />
    </>
  );
}
