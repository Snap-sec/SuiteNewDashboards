import { Badge } from "@/components/reui/badge"
import { getSeverityMeta } from "../lib/severity"
import { cn } from "@/lib/utils"

export function SeverityBadge({ severity, className }) {
  const meta = getSeverityMeta(severity)

  return (
    <Badge variant={meta.badge} className={cn("shrink-0", className)}>
      {meta.label}
    </Badge>
  )
}
