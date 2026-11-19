import { Badge } from "@/components/ui/badge";
import { CircleUser, BrainCircuit, CircleSlash2, Settings, CheckCircle } from "lucide-react";

export function ExposureBadge({ severity, status, markedBy }) {
  const isSafe = status === "safe";
  const displaySeverity = isSafe ? "none" : (severity ?? "none");

  return (
    <Badge
      appearance="outline"
      shape="circle"
      className="flex items-center gap-1.5"
      variant={
        isSafe
          ? "default"
          : ['high', 'critical'].includes(displaySeverity)
          ? "destructive"
          : ['medium', 'low'].includes(displaySeverity)
          ? "warning"
          : "default"
      }
    >
      {isSafe && <CheckCircle className="h-3 w-3" />}
      {!isSafe && (markedBy === "human" ? (
        <CircleUser className="h-3 w-3" />
      ) : markedBy === "rule" ? (
        <BrainCircuit className="h-3 w-3" />
      ) : (
        <CircleSlash2 className="h-3 w-3" />
      ))}

      <span>
        {isSafe ? "None" : displaySeverity.charAt(0).toUpperCase() + displaySeverity.slice(1)}
      </span>
    </Badge>
  );
}
