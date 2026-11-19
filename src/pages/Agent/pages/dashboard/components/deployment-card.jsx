import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { CodeBlock } from './code-block';
import { Skeleton } from '@/components/ui/skeleton';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';

export function DeploymentCard({ setupCommands, agentSettings, isLoading }) {
  const [platform, setPlatform] = useState('linux');
  const [agentIngestion, setAgentIngestion] = useState(true);

  useEffect(() => {
    if (agentSettings?.active_ingestion !== undefined) {
      setAgentIngestion(agentSettings.active_ingestion);
    }
  }, [agentSettings]);

  const platforms = setupCommands ? Object.keys(setupCommands) : ['linux', 'windows', 'mac'];
  const currentData = setupCommands?.[platform];

  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Deployment &amp; Installation</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Select your platform to generate the automated installation sequence.
            </p>
          </div>
          {isLoading ? (
            <Skeleton className="h-9" />
          ) : (
            <Tabs value={platform} onValueChange={setPlatform}>
              <TabsList variant="default" size="sm">
                {platforms.map((p) => (
                  <TabsTrigger key={p} value={p}>
                    {setupCommands?.[p]?.name || p}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Prerequisites */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-4 flex flex-col justify-between">
            <div>
              <p className="font-semibold text-sm mb-4">
                Prerequisites
              </p>
              {isLoading ? (
                <div className="space-y-2.5">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {currentData?.prerequisites?.map((req) => (
                    <li key={req} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 size={13} className="text-normal mt-0.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <AuthorityGuard forbidRoles={['Auditor']}>
              <div className="flex items-center justify-between pt-4 border-t mt-4">
                <span className="text-sm font-medium text-foreground">Agent Ingestion</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-9 rounded-full" />
                ) : (
                  <Switch checked={agentIngestion} onCheckedChange={setAgentIngestion} size="sm" />
                )}
              </div>
            </AuthorityGuard>
          </div>

          {/* Commands */}
          <div className="space-y-4">
            {isLoading ? (
              <>
                <Skeleton className="h-[88px] w-full" />
                <Skeleton className="h-[88px] w-full" />
              </>
            ) : (
              <>
                <CodeBlock label="Run Installation Command" code={currentData?.install || ''} />
                <CodeBlock label="Verify Service Status" code={currentData?.postInstall || ''} />
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
