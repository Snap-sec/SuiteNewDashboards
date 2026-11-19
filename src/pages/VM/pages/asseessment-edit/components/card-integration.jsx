import { useAuth } from '@/auth/context/auth-context';
import { Download, Eye, LogOut, SquareDashedMousePointer } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';
import { DateFormatter } from '../../../../../components/custom/date-formatter';
import { CustomTooltip } from '../../../../../components/custom/tooltip';
import DownloadReport from '../../report/components/actions/download-report';
import GenerateAssessmentReport from './actions/generate-assessment-report';
import CreateCustomReportModal from './create-custom-report-modal';

// Maps report type to its corresponding public route
const REPORT_VIEW_ROUTES = {
  vulnerability: '/pages/public/vm-reports/vulnerability',
  executive: '/pages/public/vm-reports/executive',
  revalidation: '/pages/public/vm-reports/revalidation',
  certificate: '/pages/public/vm-reports/certificate',
  sla: '/pages/public/vm-reports/fullexec',
  fullrevalidation: '/pages/public/vm-reports/fullrevalidation',
};

const CardIntegration = ({
  id,
  logo,
  path,
  format = 'pdf',
  name,
  type,
  reportId,
  isGeneratedAt,
}) => {
  const { user } = useAuth();

  const [params] = useSearchParams();
  const assessmentId = params.get('assessmentId');

  const viewRoute = REPORT_VIEW_ROUTES[type];
  const viewUrl =
    viewRoute && format !== 'csv' && format !== 'xlsx'
      ? `${viewRoute}?assessmentId=${assessmentId}&view_mode=web`
      : null;

  function AssetType() {
    if (type === 'vulnerability') {
      return (
        <p>
          Provides detailed information on identified vulnerabilities, severity
          levels, and associated security risks.
        </p>
      );
    } else if (type === 'executive') {
      return (
        <p>
          Summarizes the overall security posture, key risks, and high-level
          insights for leadership and stakeholders.
        </p>
      );
    } else if (type === 'revalidation') {
      return (
        <p>
          Confirms whether previously identified vulnerabilities have been
          successfully fixed or remain unresolved.
        </p>
      );
    } else if (type === 'certificate') {
      return (
        <p>
          Official certificate confirming the successful completion of this
          security assessment.
        </p>
      );
    } else if (type === 'sla') {
      return (
        <p>
          Provides a detailed breakdown of SLA compliance, including breached,
          at-risk, and within-SLA vulnerabilities.
        </p>
      );
    } else if (type === 'allvulns') {
      return (
        <p>
          Exports a complete list of all identified vulnerabilities in CSV
          format for offline analysis and reporting.
        </p>
      );
    }
  }

  return (
    <Card>
      <CardContent className="p-5 lg:p-7.5">
        <div className="flex items-center justify-between mb-3 lg:mb-5">
          <div className="flex items-center justify-center">
            <img
              src={toAbsoluteUrl(`/media/file-types/${logo}`)}
              className="h-11 shrink-0"
              alt="image"
            />
          </div>

          {type === 'vulnerability' && (
            <div>
              <CreateCustomReportModal />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 lg:gap-2.5">
          <Link
            to={'#'}
            className="text-base font-medium text-mono hover:text-primary-active"
          >
            {name}
          </Link>
          <span className="text-sm text-secondary-foreground">
            {AssetType(type)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="justify-between items-center py-3.5">
        {/* <div className="flex items-center gap-2.5">{actions}</div> */}
        <div className=" flex flex-row gap-3">
          {reportId ? (
            <div className=" flex gap-3">
              <DownloadReport
                status={'completed'}
                reportId={reportId}
                showDownloadText={false}
                disabled={user?.role?.toLowerCase() === 'auditor'}
              />

              {/* <AuthorityGuard forbidRoles={["Auditor"]}> */}
              <GenerateAssessmentReport
                reportType={type}
                format={format}
                assessmentId={assessmentId}
                showText={false}
                disabled={user?.role?.toLowerCase() === 'auditor'}
              />
              {/* </AuthorityGuard> */}
            </div>
          ) : (
            <GenerateAssessmentReport
              reportType={type}
              format={format}
              assessmentId={params.get('assessmentId')}
              showText={false}
              disabled={user?.role?.toLowerCase() === 'auditor'}
            />
          )}

          {viewUrl && (
            <CustomTooltip text="Preview Report">
              <Button
                variant="outline"
                disabled={user?.role?.toLowerCase() === 'auditor'}
                onClick={() => window.open(viewUrl, "_blank", "noopener,noreferrer")}
              >
                <Eye className="size-4" />
              </Button>
            </CustomTooltip>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isGeneratedAt && (
            <span className="text-xs text-muted-foreground">
              <DateFormatter date={isGeneratedAt} />
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export { CardIntegration };

