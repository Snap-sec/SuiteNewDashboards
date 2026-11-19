import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CodeBlock } from './code-block';

const MANAGEMENT_ACTIONS = [
  { key: 'status', title: 'Check Status' },
  { key: 'logs', title: 'View Logs' },
  { key: 'restart', title: 'Restart Agent' },
  { key: 'stop', title: 'Stop Agent' },
];

export function AgentManagementCard({
  installCommands,
  selectedOS,
  copiedField,
  onCopy,
}) {
  const currentOS = installCommands[selectedOS] || {
    commands: {},
  };
  const commands = currentOS.commands || {};

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Agent Management</CardTitle>
        <CardDescription>
          Common commands for managing the agent service on your hosts.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MANAGEMENT_ACTIONS.map(({ key, title }) => (
            <div key={key} className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                {title}
              </Label>
              <CodeBlock
                code={commands[key]}
                label={`${key}-cmd`}
                copiedField={copiedField}
                onCopy={onCopy}
              />
            </div>
          ))}
        </div>

        {/* Uninstall */}
        {commands.uninstall && (
          <div className="pt-6 border-t">
            <p className="text-sm font-bold uppercase tracking-wider text-destructive mb-3">
              Uninstall Agent
            </p>
            <CodeBlock
              code={commands.uninstall}
              label="uninstall-cmd"
              copiedField={copiedField}
              onCopy={onCopy}
              variant="destructive"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AgentManagementCard;
