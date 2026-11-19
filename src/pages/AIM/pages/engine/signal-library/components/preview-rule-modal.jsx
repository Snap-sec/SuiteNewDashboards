import { useState } from 'react';
import { Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/custom/modal';
import SeverityLabel from '@/components/custom/severity-label';

function formatConditions(conditions) {
  if (!Array.isArray(conditions) || conditions.length === 0) return 'No match rule defined.';
  return conditions
    .map((c) => {
      const value = Array.isArray(c.value)
        ? `[${c.value.map((v) => `"${v}"`).join(', ')}]`
        : `"${c.value}"`;
      return `${c.field} ${c.operator} ${value}`;
    })
    .join('\nAND ');
}

export default function PreviewRuleModal({ template }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const title = template.name || template.title;
  const conditions = template?.match?.and?.conditions || [];
  const matchRuleString = formatConditions(conditions);

  return (
    <Modal
      open={isModalOpen}
      setOpen={setIsModalOpen}
      title={
        <div className="text-left text-lg font-semibold w-full flex items-center gap-2 border-l-4 border-primary pl-3 ml-1">
          {title}
        </div>
      }
      description={
        <div className="flex flex-row items-center gap-3 mt-3 mb-1 text-left w-full pl-4">
          <SeverityLabel severity={template?.severity || 'none'} />
        </div>
      }
      trigger={
        <Button variant="outline" className="text-xs font-medium gap-1.5">
          <Eye className="size-3.5" /> Preview
        </Button>
      }
      className="w-full sm:max-w-xl md:max-w-2xl bg-card"
    >
      <div className="flex flex-col gap-7 text-left mt-4 pl-4 pr-2">
        <div className="flex flex-col gap-3">
          <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Description</h4>
          <p className="text-[15px] text-foreground/90 leading-relaxed">
            {template.description || 'No description available.'}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Match Rule</h4>
          <div className="bg-secondary/40 rounded-lg p-4 overflow-x-auto border border-border/50">
            <pre className="text-[13px] font-mono text-foreground whitespace-pre">{matchRuleString}</pre>
          </div>
        </div>
      </div>
    </Modal>
  );
}
