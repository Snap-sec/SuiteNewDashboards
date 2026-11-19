import AssessmentTable from "../tables/assessment-table"

const AssessmentsList = ({ assessments, isLoading, isFetching }) => {
  return (
    <div className="flex flex-col items-stretch gap-5 lg:gap-4">
      <AssessmentTable data={assessments?.data} isLoading={isLoading} isFetching={isFetching} />
    </div>
  );
};

export default AssessmentsList;
