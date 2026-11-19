import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Plus, Check } from 'lucide-react';
import PreviewRuleModal from './preview-rule-modal';
import SeverityLabel from '@/components/custom/severity-label';
import { useImportAimPolicyFromLibraryMutation } from '@/services/asset-inventory/policyApi';
import { toast } from 'sonner';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';

export default function TemplateCard({ template }) {
  const [importRule, { isLoading }] = useImportAimPolicyFromLibraryMutation();

  const id = template._id || template.id;
  const title = template.name || template.title;

  const handleImport = () => {
    toast.promise(importRule(id).unwrap(), {
      loading: 'Importing rule...',
      success: 'Rule imported successfully',
      error: (err) => err?.data?.message || 'Failed to import rule'
    });
  };

  return (
    <Card className="flex flex-col p-5 hover:border-primary/50 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-secondary/50 rounded-md">
          <Globe className="size-5 text-muted-foreground" />
        </div>
        <SeverityLabel severity={template.severity || 'none'} />
      </div>

      <h3 className="font-semibold text-base mb-2 line-clamp-2 min-h-[48px] text-foreground">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground line-clamp-3 mb-6 min-h-[60px]">
        {template.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <AuthorityGuard forbidRoles={["Auditor"]}>
          <Button
            variant="outline"
            onClick={handleImport}
            disabled={isLoading || template.imported}
          >
            {template.imported ? (
              <><Check /> Imported</>
            ) : (
              <><Plus /> {isLoading ? 'Importing...' : 'Import rule'}</>
            )}
          </Button>
          </AuthorityGuard>
          <PreviewRuleModal template={template} />
        </div>
      </div>
    </Card>
  );
}
