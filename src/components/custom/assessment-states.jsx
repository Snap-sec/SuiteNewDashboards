import { Badge } from "@/components/ui/badge";
import DetailedHoverPopover from "./detailed-popover";

export function AssessmentBadges({ state, resolved }) {

  const map = {
    Scheduled: {
      label: "Scheduled",
      variant: "secondary",
      description: "The assessment has been created and is waiting to start."
    },
    New: {
      label: "New",
      variant: "secondary",
      description: "The assessment has been created and is waiting to start."
    },
    "Not Configured": {
      label: "Not Configured",
      variant: "secondary",
      description: "The assessment has not been fully configured yet."
    },
    Paused: {
      label: "Paused",
      variant: "warning",
    },
    Running: {
      label: "Running",
      variant: "primary",
      description: "The assessment is currently in progress."
    },
    "Testing Ongoing": {
      label: "Testing Ongoing",
      variant: "primary",
      description: "The assessment is currently in progress and testing activities are being performed."
    },
    Remediation: {
      label: "Remediation",
      variant: "success",
      description: "The team is currently fixing the identified vulnerabilities."
    },
    Completed: {
      label: "Completed",
      variant: "success",
      description: "The assessment is completed."
    },
    "Closed": {
      label: "Closed",
      variant: "success",
      description: "The assessment is completed and has been closed."
    },
  };

  const active = map[state];
  if (!active) return null;

  const content = (
    <Badge
      variant={active.variant || "secondary"}
      appearance="outline"
      className="inline-flex w-auto gap-2 items-center whitespace-nowrap cursor-pointer"
      size="md"
    >
      {active.label}
    </Badge>
  );

  if (active.description) {
    return (
      <DetailedHoverPopover
        buttonText={content}
        showBadge={false}
        popoverTitle={active.label}
        popoverContent={
          <p className="text-muted-foreground">
            {active.description}
          </p>
        }
      />
    );
  }

  return content;
}
