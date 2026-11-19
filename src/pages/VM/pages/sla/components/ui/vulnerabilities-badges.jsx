import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';


const VulnerabilitiesBadges = ({ vulnerabilities, assetName }) => {
  const vulns = Array.isArray(vulnerabilities) ? vulnerabilities[0] : vulnerabilities;
  
  if (vulns.length === 0) {
    return (
      <span className="text-muted-foreground text-sm">
        No vulnerabilities found
      </span>
    );
  }

  const { low, high, critical, medium, info } = vulns;
  const total = critical + high + medium + low + info;

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
          <Link to={`/vm/vulnerabilities?search=${assetName}&severity=critical`}>
            {critical} C
          </Link>
        </Badge>
      )}
      {high > 0 && (
        <Badge variant="secondary" className="text-xs font-medium whitespace-nowrap">
          <Link to={`/vm/vulnerabilities?search=${assetName}&severity=high`}>
            {high} H
          </Link>
        </Badge>
      )}
      {medium > 0 && (
        <Badge variant="secondary" className="text-xs font-medium whitespace-nowrap">
          <Link to={`/vm/vulnerabilities?search=${assetName}&severity=medium`}>
            {medium} M
          </Link>
        </Badge>
      )}
      {low > 0 && (
        <Badge variant="secondary" className="text-xs font-medium whitespace-nowrap">
          <Link to={`/vm/vulnerabilities?search=${assetName}&severity=low`}>
            {low} L
          </Link>
        </Badge>
      )}
      {info > 0 && (
        <Badge variant="secondary" className="text-xs font-medium whitespace-nowrap">
          <Link to={`/vm/vulnerabilities?search=${assetName}&severity=info`}>
            {info} N
          </Link>
        </Badge>
      )}
    </div>
  );
};

export default VulnerabilitiesBadges;