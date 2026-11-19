import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { CodeBlock } from './code-block';

export function InstallationCard({
  installCommands,
  selectedOS,
  onSelectOS,
  copiedField,
  onCopy,
}) {
  const currentOS = installCommands[selectedOS] || {
    prerequisites: [],
    commands: {},
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Installation</CardTitle>
        <CardDescription>
          Select your operating system to get the installation command.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* OS tabs */}
        <div className="w-full flex items-center justify-between flex-wrap gap-3">
          <Tabs value={selectedOS} onValueChange={onSelectOS}>
            <TabsList>
              {Object.entries(installCommands).map(([key, os]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="min-w-[120px]"
                >
                  {os.name || key.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Prerequisites */}
        {currentOS.prerequisites && currentOS.prerequisites.length > 0 && (
          <Alert size="md" className="bg-accent text-foreground border-none">
            <AlertContent>
              <AlertTitle className="font-semibold">Prerequisites</AlertTitle>
              <AlertDescription>
                <ul className="mt-1 space-y-1">
                  {currentOS.prerequisites.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={13} className="text-normal mt-0.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </AlertContent>
          </Alert>
        )}

        {/* Install command */}
        <div className="space-y-1">
          <Label className="text-sm font-medium">1. Run Installation Command</Label>
          <CodeBlock
            code={currentOS.install}
            label="install-cmd"
            copiedField={copiedField}
            onCopy={onCopy}
          />
        </div>

        {/* Verify */}
        <div className="space-y-1">
          <Label className="text-sm font-medium">2. Verify Installation</Label>
          <CodeBlock
            code={currentOS.postInstall}
            label="post-install-cmd"
            copiedField={copiedField}
            onCopy={onCopy}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default InstallationCard;
