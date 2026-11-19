import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const VulnerabilitiesBadges = ({ vulnerabilities, assetName }) => {
  const vulns = Array.isArray(vulnerabilities)
    ? vulnerabilities?.[0]
    : vulnerabilities;

  if (vulns?.length === 0) {
    return <span className="text-muted-foreground text-sm">-</span>;
  }

  const { low, high, critical, medium, info } = vulns || {};
  const total = critical + high + medium + low + info;

  if (total === 0) {
    return <span className="text-muted-foreground text-sm">-</span>;
  }

  return (
    <div className="flex items-center justify-center flex-wrap gap-1">
      {critical ? (
        <Badge variant="secondary" className="text-xs font-medium whitespace-nowrap">
          <Link to={`/vm/vulnerabilities?search=${assetName}&severity=critical`}>
            {critical} C
          </Link>
        </Badge>
      ) : ''}
      {high ? (
        <Badge variant="secondary" className="text-xs font-medium whitespace-nowrap">
          <Link to={`/vm/vulnerabilities?search=${assetName}&severity=high`}>
            {high} H
          </Link>
        </Badge>
      ) : ''}
      {medium ? (
        <Badge variant="secondary" className="text-xs font-medium whitespace-nowrap">
          <Link to={`/vm/vulnerabilities?search=${assetName}&severity=medium`}>
            {medium} M
          </Link>
        </Badge>
      ) : ''}
      {low ? (
        <Badge variant="secondary" className="text-xs font-medium whitespace-nowrap">
          <Link to={`/vm/vulnerabilities?search=${assetName}&severity=low`}>
            {low} L
          </Link>
        </Badge>
      ) : ''}
      {info ? (
        <Badge
          variant="secondary"
          className="text-xs font-medium whitespace-nowrap"
        >
          <Link
            to={`/vm/vulnerabilities?search=${assetName}&filters=severity:none`}
          >
            {info} N
          </Link>
        </Badge>
      ) : ''}
    </div>
  );
};

export default VulnerabilitiesBadges;
