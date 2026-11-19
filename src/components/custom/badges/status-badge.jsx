// StatusBadge.jsx
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  RotateCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  PauseCircle,
} from "lucide-react";

const statusVariantMap = {
  preparing: "secondary",
  pending: "primary",
  running: "warning",
  completed: "success",
  failed: "destructive",
  cancelled: "destructive",
  halted: "warning",
  paused: "default",
};

const statusIconMap = {
  preparing: Loader2,
  pending: Loader2,
  running: RotateCw,
  completed: CheckCircle,
  failed: XCircle,
  cancelled: XCircle,
  halted: AlertTriangle,
  paused: PauseCircle,
};

function StatusBadge({ status, progress }) {
  const variant = statusVariantMap[status] || "secondary";
  const IconComponent = statusIconMap[status] || Loader2;

  return (
    <Badge variant={variant} appearance="outline" shape="circle" className="capitalize flex items-center gap-1">
      <IconComponent size={16} />
      {status == "running" & progress && progress}
      {status}
    </Badge>
  );
}

export default StatusBadge;