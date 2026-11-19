import { Badge } from '@/components/ui/badge';

const VulnerabilitiesBadges = ({ vulnerabilities }) => {
  const vulns = vulnerabilities || [];
  
  if (vulns.length === 0) {
    return (
      <span className="text-muted-foreground text-sm">
        No vulnerabilities found
      </span>
    );
  }

  const { low, high, critical, medium } = vulns[0] || {};
  const total = critical + high + medium + low;

  if (total === 0) {
    return (
      <span className="text-muted-foreground text-sm">
        No vulnerabilities found
      </span>
    );
  }

  return (
    <div className="flex items-center flex-wrap gap-2">
      {critical > 0 && (
        <Badge variant="secondary" className="text-xs font-medium whitespace-nowrap">
          {critical} C
        </Badge>
      )}
      {high > 0 && (
        <Badge variant="secondary" className="text-xs font-medium whitespace-nowrap">
          {high} H
        </Badge>
      )}
      {medium > 0 && (
        <Badge variant="secondary" className="text-xs font-medium whitespace-nowrap">
          {medium} M
        </Badge>
      )}
      {low > 0 && (
        <Badge variant="secondary" className="text-xs font-medium whitespace-nowrap">
          {low} L
        </Badge>
      )}
    </div>
  );
};

export default VulnerabilitiesBadges;