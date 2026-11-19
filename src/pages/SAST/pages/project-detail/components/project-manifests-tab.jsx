import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCode, FileJson, Layers } from 'lucide-react';

export function ProjectManifestsTab({ projectData = {}, isImage }) {
  const manifestFiles = projectData.manifestFiles || ['package-lock.json', 'yarn.lock'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Card className="border border-border/80 shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileCode className="size-4 text-muted-foreground" />
            Package Lockfiles & Manifest Files
          </CardTitle>
          <CardDescription className="text-xs">
            Detected dependency source lockfiles for security parsing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {manifestFiles.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 border border-border/70 rounded-lg bg-muted/20 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <FileJson className="size-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{file}</span>
              </div>
              <Badge variant="secondary">
                Parsed OK
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-border/80 shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Layers className="size-4 text-muted-foreground" />
            Target Project Metadata
          </CardTitle>
          <CardDescription className="text-xs">
            Inventory details and engine parameters.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex justify-between py-1.5 border-b border-border/50">
            <span className="text-muted-foreground">Project Name:</span>
            <span className="font-semibold text-foreground">{projectData.name}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border/50">
            <span className="text-muted-foreground">Target Type:</span>
            <span className="font-semibold text-foreground">{isImage ? 'Container Image' : 'Code Repository'}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border/50">
            <span className="text-muted-foreground">Default Branch:</span>
            <span className="font-semibold text-foreground">{projectData.branch || 'main'}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-muted-foreground">Repository Owner:</span>
            <span className="font-semibold text-foreground">{projectData.owner || 'faizanalibhat'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
