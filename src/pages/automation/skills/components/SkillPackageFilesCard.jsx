import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  FileCode,
  FileText,
  FileJson,
  FilePlus,
  FolderPlus,
  Plus,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

function getFileIcon(fileName) {
  if (fileName.endsWith('.json')) {
    return <FileJson className="size-3.5 text-amber-500 shrink-0" />;
  }
  if (fileName.endsWith('.md')) {
    return <FileText className="size-3.5 text-sky-500 shrink-0" />;
  }
  return <FileCode className="size-3.5 text-muted-foreground shrink-0" />;
}

export default function SkillPackageFilesCard({
  rootFolder,
  activeFileId,
  onSelectFile,
  onToggleFolder,
  onOpenAddFile,
  onOpenAddFolder,
  isLoading = false,
}) {
  const renderItem = (item, depth = 0) => {
    if (item.type === 'folder') {
      const isOpen = item.isOpen !== false;
      return (
        <div key={item.id} className="flex flex-col">
          <button
            type="button"
            onClick={() => onToggleFolder(item.id)}
            style={{ paddingLeft: `${depth * 14}px` }}
            className="w-full text-left flex items-center gap-1.5 py-1 px-1.5 rounded-md hover:bg-muted/50 select-none text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <span className="text-muted-foreground group-hover:text-foreground shrink-0">
              {isOpen ? (
                <ChevronDown className="size-3.5" />
              ) : (
                <ChevronRight className="size-3.5" />
              )}
            </span>
            {isOpen ? (
              <FolderOpen className="size-3.5 text-muted-foreground group-hover:text-foreground shrink-0" />
            ) : (
              <Folder className="size-3.5 text-muted-foreground group-hover:text-foreground shrink-0" />
            )}
            <span className="text-2sm font-medium truncate">
              {item.name}
            </span>
          </button>

          {isOpen && item.children && (
            <div className="flex flex-col gap-0.5">
              {item.children.map((child) => renderItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // File Item
    const isActive = activeFileId === item.id;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onSelectFile(item)}
        style={{ paddingLeft: `${depth * 14 + 18}px` }}
        className={cn(
          'w-full text-left flex items-center justify-between py-1 px-2 rounded-md transition-colors select-none group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          isActive
            ? 'bg-primary/10 text-primary border border-primary/20 font-medium'
            : 'hover:bg-muted/50 text-foreground border border-transparent'
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {getFileIcon(item.name)}
          <span className="text-2sm font-medium truncate">{item.name}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {item.badge && (
            <Badge
              variant="primary"
              appearance="outline"
              size="xs"
              className="text-[10px] uppercase tracking-wider px-1.5 h-4"
            >
              {item.badge}
            </Badge>
          )}
          {item.size && (
            <span className="text-2xs font-mono text-muted-foreground">
              {item.size}
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 shadow-xs">
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-medium text-foreground leading-tight">
            Skill package files
          </h2>
          <p className="text-2xs font-mono text-muted-foreground mt-0.5">
            root: {rootFolder?.name || 'skill_package'}/
          </p>
        </div>

        <div className="flex items-center gap-1">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-foreground"
                  onClick={onOpenAddFile}
                >
                  <FilePlus className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <span className="text-2xs">New File</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-foreground"
                  onClick={onOpenAddFolder}
                >
                  <FolderPlus className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <span className="text-2xs">New Folder</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex flex-col gap-0.5 py-1">
        {isLoading && (!rootFolder?.children || rootFolder.children.length === 0) ? (
          <div className="space-y-2 py-1">
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-5 w-1/2 rounded-md ml-3" />
            <Skeleton className="h-5 w-2/3 rounded-md ml-3" />
            <Skeleton className="h-5 w-4/5 rounded-md ml-6" />
          </div>
        ) : (
          rootFolder && renderItem(rootFolder, 0)
        )}
      </div>

      {/* Add Payload File Button */}
      <button
        type="button"
        onClick={onOpenAddFile}
        className="w-full mt-1 border border-dashed border-border rounded-lg py-2 flex items-center justify-center gap-1.5 text-2sm text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-muted/40 transition-colors"
      >
        <Plus className="size-3.5" />
        Add payload file
      </button>
    </div>
  );
}
