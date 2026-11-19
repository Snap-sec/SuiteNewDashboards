import { ArrowRight } from 'lucide-react';

const DEFAULT_KEY_MAPPING = [
  { left: 'severity', right: '' },
  { left: 'title', right: '' },
  { left: 'description', right: '' },
  { left: 'cvss_score', right: '' },
  { left: 'cve_id', right: '' },
  { left: 'asset', right: '' },
];

function KeyMappingRow({ leftKey, rightKey, onChange, index }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 group">
      <div className="flex items-center h-9 px-3 rounded-md border border-border bg-muted/40 text-sm font-mono text-foreground truncate">
        {leftKey}
      </div>

      <div className="flex items-center justify-center">
        <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      <input
        type="text"
        value={rightKey}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder="Jira field name"
        className="h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-[color,box-shadow] w-full"
      />
    </div>
  );
}

function StepKeyMapping({ mappings, onChange }) {
  const rows = mappings?.length ? mappings : DEFAULT_KEY_MAPPING;

  const handleChange = (index, value) => {
    const updated = rows.map((row, i) =>
      i === index ? { ...row, right: value } : row
    );
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 px-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          SnapSec Field
        </span>
        <span className="w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Jira Field
        </span>
      </div>

      <div className="border-t border-border" />

      <div className="flex flex-col gap-2.5">
        {rows.map((row, index) => (
          <KeyMappingRow
            key={index}
            index={index}
            leftKey={row.left}
            rightKey={row.right}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
}

export default StepKeyMapping;
