import { useState } from 'react';
import { Helmet } from 'react-helmet';
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
import { Switch } from '@/components/ui/switch';
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import PageHeading from '@/components/custom/page-heading';
import { CodeBlock } from './components/code-block';
import { useGetAgentSettingsQuery } from '@/services/agent/agentApi';
import { Skeleton } from '@/components/ui/skeleton';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

// ─── Page ─────────────────────────────────────────────────────────────────────

function AgentSettingsPage({ hideHeading = false }) {
  const [selectedOS, setSelectedOS] = useState('linux');
  const [copiedField, setCopiedField] = useState(null);

  const { data: settingsResponse, isLoading, isError, error } = useGetAgentSettingsQuery();
  const installCommands = settingsResponse?.data || {};

  const currentOS = installCommands[selectedOS] || {
    prerequisites: [],
    commands: {}
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isError && !isLoading) {
    return <ApiErrorHandler error={error} />;
  }

  return (
    <div className={hideHeading ? "flex flex-col gap-5" : "p-4 flex flex-col gap-5"}>
      {!hideHeading && (
        <>
          <Helmet>
            <title>AssetIQ | Settings</title>
          </Helmet>

          <PageHeading
            title="Agent Deployment"
            description="Manage agent deployment, installation, and service commands."
          />
        </>
      )}

      {isLoading ? (
        <>
          <Card>
            <CardHeader className="border-b">
              <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
              <CardDescription><Skeleton className="h-4 w-72" /></CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex gap-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
              <Skeleton className="h-[100px] w-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-[72px] w-full" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-[72px] w-full" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
              <CardDescription><Skeleton className="h-4 w-80" /></CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-[72px] w-full" />
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-[72px] w-full" />
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* ── Installation ── */}
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
                <Tabs value={selectedOS} onValueChange={setSelectedOS}>
                  <TabsList>
                    {Object.entries(installCommands).map(([key, os]) => (
                      <TabsTrigger
                        key={key}
                        value={key}
                        className="min-w-[120px]"
                      >
                        {os.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {/* Prerequisites */}
              <Alert size="md" className="bg-accent text-foreground border-none">
                <AlertContent>
                  <AlertTitle className="font-semibold">Prerequisites</AlertTitle>
                  <AlertDescription>
                    <ul className="mt-1 space-y-1">
                      {currentOS.prerequisites.map((req, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-normal mt-0.5 shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </AlertContent>
              </Alert>

              {/* Install command */}
              <div className="space-y-1">
                <Label className="text-sm font-medium">1. Run Installation Command</Label>
                <CodeBlock
                  code={currentOS.install}
                  label="install-cmd"
                  copiedField={copiedField}
                  onCopy={handleCopy}
                />
              </div>

              {/* Verify */}
              <div className="space-y-1">
                <Label className="text-sm font-medium">2. Verify Installation</Label>
                <CodeBlock
                  code={currentOS.postInstall}
                  label="post-install-cmd"
                  copiedField={copiedField}
                  onCopy={handleCopy}
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Agent Management ── */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Agent Management</CardTitle>
              <CardDescription>
                Common commands for managing the agent service on your hosts.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'status', title: 'Check Status' },
                  { key: 'logs', title: 'View Logs' },
                  { key: 'restart', title: 'Restart Agent' },
                  { key: 'stop', title: 'Stop Agent' },
                ].map(({ key, title }) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                      {title}
                    </Label>
                    <CodeBlock
                      code={currentOS.commands[key]}
                      label={`${key}-cmd`}
                      copiedField={copiedField}
                      onCopy={handleCopy}
                    />
                  </div>
                ))}
              </div>

              {/* Uninstall */}
              <div className="pt-6 border-t">
                <p className="text-sm font-bold uppercase tracking-wider text-destructive mb-3">
                  Uninstall Agent
                </p>
                <CodeBlock
                  code={currentOS.commands.uninstall}
                  label="uninstall-cmd"
                  copiedField={copiedField}
                  onCopy={handleCopy}
                  variant="destructive"
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default AgentSettingsPage;
