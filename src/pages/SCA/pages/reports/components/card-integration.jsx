import React from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useGenerateScaReportMutation } from '@/services/sca/reportsApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';


const CardIntegration = ({
  id,
  logo,
  format = 'pdf',
  name,
  type,
  reportId,
  isGeneratedAt,
  status,
  description,
}) => {
  const [generateReport, { isLoading: isGenerating }] = useGenerateScaReportMutation();

  const handleGenerateReport = async () => {
    const reportName = `${name} - ${new Date().toISOString().split('T')[0]}`;
    try {
      await generateReport({ reportType: type, name: reportName }).unwrap();
      toast.success(`${name} Generated Successfully`);
      if (type === 'executive') {
        window.open('/sca-reports/executive', '_blank');
      }
    } catch (err) {
      toast.error('Failed to generate report');
    }
  };

  const getReportLogo = () => {
    const fmt = (format || 'pdf').toLowerCase();
    if (fmt === 'json' || type === 'sbom-cyclonedx') return 'json.svg';
    if (fmt === 'csv' || type === 'license-compliance' || type === 'vulnerability-audit') return 'csv.svg';
    return 'pdf.svg';
  };

  return (
    <Card className="flex flex-col justify-between hover:border-border transition-colors shadow-sm">
      <CardContent className="p-5 flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center justify-center p-2 rounded-lg bg-muted/50 border border-border/60">
            <img
              src={toAbsoluteUrl(`/media/file-types/${getReportLogo()}`)}
              className="h-10 w-10 shrink-0 object-contain"
              alt={`${format} report`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </div>
          <Badge variant="secondary">{(format || 'pdf').toUpperCase()}</Badge>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-foreground">{name}</span>
          <span className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-2 py-3 px-5 border-t border-border/50 bg-muted/20">
        <AuthorityGuard forbidRoles={'Auditor'}>
          <Button
            variant="outline"
            onClick={handleGenerateReport}
            disabled={
              isGenerating || status === 'pending' || status === 'processing'
            }
          >
            {isGenerating && (
              <Loader2 className="animate-spin size-3.5 mr-1.5" />
            )}
            <span>Generate</span>
          </Button>
        </AuthorityGuard>

        {type === 'executive' && (
          <Button
            variant="outline"
            onClick={() => window.open('/sca-reports/executive', '_blank')}
          >
            <span>PDF View</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export { CardIntegration };