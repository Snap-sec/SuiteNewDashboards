import { CalendarClock, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function severityVariant(severity) {
  if (severity === "Critical") return "destructive";
  if (severity === "High") return "high";
  if (severity === "Medium") return "warning";
  return "secondary";
}

function Fact({ label, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="truncate text-sm">{children}</dd>
    </div>
  );
}

export function FindingSheet({ finding, onClose }) {
  const handleCreateTask = () => {
    if (!finding) return;

    toast.success("Remediation task created", {
      description: `${finding.id} assigned to ${finding.owner.name}.`,
    });
    onClose();
  };

  const handleSnooze = () => {
    if (!finding) return;

    toast("Finding snoozed for 7 days", {
      description: `${finding.id} will return to the queue on Nov 26.`,
    });
    onClose();
  };

  return (
    <Sheet open={Boolean(finding)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-lg">
        {finding && (
          <>
            <SheetHeader className="gap-2">
              <div className="flex flex-col gap-2 pe-8">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={severityVariant(finding.severity)}
                    appearance={
                      finding.severity === "Low" ? "outline" : "light"
                    }
                  >
                    {finding.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {finding.id} · {finding.confidence} confidence
                  </span>
                </div>
                <SheetTitle className="text-lg tracking-tight">
                  {finding.title}
                </SheetTitle>
                <SheetDescription className="break-all">
                  {finding.asset} · CVSS {finding.cvss.toFixed(1)}
                </SheetDescription>
              </div>
            </SheetHeader>

            <Separator />

            <SheetBody className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto">
              <dl className="grid grid-cols-2 gap-4">
                <Fact label="Asset">{finding.asset}</Fact>
                <Fact label="Address">{finding.address}</Fact>
                <Fact label="Business unit">{finding.businessUnit}</Fact>
                <Fact label="Surface">{finding.surface}</Fact>
                <Fact label="Owner">
                  {finding.owner.name} · {finding.owner.team}
                </Fact>
                <Fact label="First seen">{finding.firstSeen}</Fact>
                <Fact label="SLA">
                  <span
                    className={
                      finding.sla.overdue ? "text-destructive" : undefined
                    }
                  >
                    {finding.sla.label}
                  </span>
                </Fact>
                <Fact label="Status">{finding.status}</Fact>
              </dl>

              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">What we found</h3>
                <p className="text-sm leading-relaxed text-secondary-foreground">
                  {finding.description}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">Evidence</h3>
                <div className="border-s-2 border-border ps-3 font-mono text-xs leading-relaxed break-all whitespace-pre-wrap text-muted-foreground">
                  {finding.evidence}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                  <ShieldCheck
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  Recommended remediation
                </h3>
                <p className="text-sm leading-relaxed text-secondary-foreground">
                  {finding.remediation}
                </p>
              </div>
            </SheetBody>

            <SheetFooter className="flex-col gap-2 border-t border-border sm:flex-row sm:justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarClock className="size-3.5" aria-hidden="true" />
                SLA clock is running
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSnooze}
                >
                  Snooze 7 days
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleCreateTask}
                >
                  <CheckCircle2 aria-hidden="true" />
                  Create remediation task
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
