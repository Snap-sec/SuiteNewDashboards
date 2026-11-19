import { Helmet } from 'react-helmet';
import AssessmentTabs from './tabs/tabs';


function AssessmentEdit() {
  return (
    <div className="p-4">

      <Helmet>
        <title>UniRisk | Assessment Edit</title>
      </Helmet>

      <AssessmentTabs />
    </div>
  );
}


export default AssessmentEdit;