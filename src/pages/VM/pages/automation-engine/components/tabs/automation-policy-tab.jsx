import { Zap, Clock } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const TRIGGER_EVENT_OPTIONS = [
  { label: 'Vuln Created', value: 'vuln.created' },
  { label: 'Vuln Updated', value: 'vuln.updated' },
];

function AutomationPolicyTab({
  isEventBased,
  setIsEventBased,
  isScheduled,
  setIsScheduled,
  triggerEvents,
  setTriggerEvents,
  frequency,
  setFrequency,
}) {
  const toggleEvent = (eventValue) => {
    setTriggerEvents((prev) =>
      prev.includes(eventValue)
        ? prev.filter((e) => e !== eventValue)
        : [...prev, eventValue]
    );
  };

  return (
    <div className="space-y-6 mt-2">
      {/* Execution Type Selector */}
      <div>
        <p className="text-sm font-medium mb-1">
          Execution Type <span className="text-destructive">*</span>
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Select how this rule triggers. This rule can run on events or on a recurring schedule.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Event-based Card */}
          <div
            onClick={() => {
              setIsEventBased(true);
              setIsScheduled(false);
            }}
            className={`flex items-start justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200 select-none ${isEventBased
              ? 'border-primary/60 bg-primary/5 shadow-sm'
              : 'border-border hover:border-border/80 bg-background'
              }`}
          >
            <div className="flex gap-3">
              <Zap className={`size-5 mt-0.5 ${isEventBased ? 'text-primary' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm font-medium leading-none mb-1">Event-based</p>
                <p className="text-xs text-muted-foreground">Run when selected events occur</p>
              </div>
            </div>
            <Checkbox
              checked={isEventBased}
              onCheckedChange={() => {
                setIsEventBased(true);
                setIsScheduled(false);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Scheduled Card */}
          <div
            onClick={() => {
              setIsScheduled(true);
              setIsEventBased(false);
            }}
            className={`flex items-start justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200 select-none ${isScheduled
              ? 'border-primary/60 bg-primary/5 shadow-sm'
              : 'border-border hover:border-border/80 bg-background'
              }`}
          >
            <div className="flex gap-3">
              <Clock className={`size-5 mt-0.5 ${isScheduled ? 'text-primary' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm font-medium leading-none mb-1">Scheduled</p>
                <p className="text-xs text-muted-foreground">Run on a recurring schedule</p>
              </div>
            </div>
            <Checkbox
              checked={isScheduled}
              onCheckedChange={() => {
                setIsScheduled(true);
                setIsEventBased(false);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>

      {/* Conditional Sub-panels */}

      {/* Events Panel */}
      {isEventBased && (
        <div className="space-y-2 border-t pt-4">
          <div>
            <p className="text-sm font-medium mb-1">
              Events <span className="text-destructive">*</span>
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Select which events trigger this rule's execution.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TRIGGER_EVENT_OPTIONS.map((ev) => {
              const active = triggerEvents.includes(ev.value);
              return (
                <Badge
                  key={ev.value}
                  variant={active ? 'primary' : 'outline'}
                  appearance="outline"
                  className={`cursor-pointer select-none py-1.5 px-3 transition-all ${active ? '' : 'text-muted-foreground'
                    }`}
                  onClick={() => toggleEvent(ev.value)}
                >
                  {ev.label}
                </Badge>
              );
            })}
          </div>
          {triggerEvents.length === 0 && (
            <p className="text-xs text-destructive mt-1">Select at least one trigger event</p>
          )}
        </div>
      )}

      {/* Scheduled Frequency Panel */}
      {isScheduled && (
        <div className="space-y-2 border-t pt-4">
          <div>
            <p className="text-sm font-medium mb-1">
              Frequency <span className="text-destructive">*</span>
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              How often should this rule run.
            </p>
          </div>
          <div className="flex gap-2">
            {['daily', 'weekly', 'monthly'].map((freq) => {
              const active = frequency === freq;
              return (
                <Button
                  key={freq}
                  variant={active ? 'default' : 'outline'}
                  className="flex-1 capitalize py-2 h-9"
                  onClick={() => setFrequency(freq)}
                >
                  {freq}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default AutomationPolicyTab;
