export const SEVERITY_META = {
  critical: {
    label: "Critical",
    badge: "destructive-light",
    dot: "bg-destructive",
  },
  high: {
    label: "High",
    badge: "warning-light",
    dot: "bg-warning",
  },
  medium: {
    label: "Medium",
    badge: "info-light",
    dot: "bg-info",
  },
  low: {
    label: "Low",
    badge: "outline",
    dot: "bg-muted-foreground",
  },
}

export function getSeverityMeta(severity) {
  return SEVERITY_META[severity] ?? SEVERITY_META.low
}
