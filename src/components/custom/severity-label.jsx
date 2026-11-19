import { Badge } from '@/components/ui/badge';

const severityConfig = {
  critical: {
    label: "Critical",
    variant: "destructive",
    level: 4,
  },
  high: {
    label: "High",
    variant: "high",
    level: 3,
  },
  medium: {
    label: "Medium",
    variant: "warning",
    level: 2,
  },
  low: {
    label: "Low",
    variant: "primary",
    level: 1,
  },
  info: {
    label: "Info",
    variant: "secondary",
    level: 0,
  },
  none: {
    label: "None",
    variant: "secondary",
    level: 0,
  },
};

const scoreToSeverity = (score) => {
  let n = score;

  if (n > 9) return "critical";
  else if (n > 7) return "high";
  else if (n > 4) return "medium";
  else if (n > 0) return "low";
  return "info";
};

function SeverityLabel({ severity, score, size, showIconOnly, pill, className }) {
  let providedSeverity = severity || scoreToSeverity(score);
  providedSeverity = providedSeverity?.toLowerCase();

  const original = severityConfig[providedSeverity] || severityConfig.none;

  if (showIconOnly) {
    return null;
  }

  return (
    <Badge
      variant={original.variant}
      appearance="outline"
      size={size}
      className={className}
    >
      {original.label}
    </Badge>
  );
}

export default SeverityLabel;

