import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileCheck } from 'lucide-react';

export function DependencyMetadataTab({ dependency }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Card className="border border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-mono flex items-center gap-2">
            <Package className="size-4 text-blue-500" />
            Package Architecture & Tree
          </CardTitle>
          <CardDescription className="text-xs">
            Manifest dependency type and parent package hierarchy.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-xs font-mono">
          <div className="flex justify-between py-1.5 border-b border-border/60">
            <span className="text-muted-foreground">Package Name:</span>
            <span className="font-semibold text-foreground">{dependency?.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border/60">
            <span className="text-muted-foreground">Installed Version:</span>
            <span className="font-semibold text-foreground">v{dependency?.installedVersion || '1.0.0'}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border/60">
            <span className="text-muted-foreground">Dependency Type:</span>
            <span className="font-semibold text-foreground">{dependency?.type || 'Direct'}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-muted-foreground">Parent Package (Transitive):</span>
            <span className="font-semibold text-foreground">
              {dependency?.parentPackage || 'Top-level direct dependency'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-mono flex items-center gap-2">
            <FileCheck className="size-4 text-emerald-500" />
            Open Source License Rights
          </CardTitle>
          <CardDescription className="text-xs">
            Legal obligations and compliance terms for {dependency?.license || 'MIT'}.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-xs font-mono">
          <div className="flex justify-between py-1.5 border-b border-border/60">
            <span className="text-muted-foreground">License SPDX ID:</span>
            <span className="font-semibold text-foreground">{dependency?.license || 'MIT'}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border/60">
            <span className="text-muted-foreground">Category:</span>
            <span className="font-semibold text-foreground">Permissive Open Source</span>
          </div>
          <div className="flex flex-col gap-1 py-1.5">
            <span className="text-muted-foreground">Obligations Notice:</span>
            <span className="text-secondary-foreground leading-relaxed font-sans">
              Must retain original copyright notice and permission disclaimer in distributions.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
