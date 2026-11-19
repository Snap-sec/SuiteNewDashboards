import React, { useState, useEffect, useRef } from 'react';
import {
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  File,
  FileCode,
  FileText,
  Braces,
  Palette,
  FileSliders,
  FileSpreadsheet,
  FilePlus,
  FolderPlus,
  Plus,
  X,
  Check,
  Pencil,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';

function getFileIcon(fileName = '') {
  const lower = fileName.toLowerCase();

  // JSON / Data files
  if (lower.endsWith('.json')) {
    return <Braces className="size-3.5 text-yellow-500 shrink-0" />;
  }

  // Markdown / Documentation
  if (lower.endsWith('.md') || lower.endsWith('.mdx') || lower.endsWith('.txt')) {
    return <FileText className="size-3.5 text-slate-300 dark:text-slate-300 shrink-0" />;
  }

  // TypeScript / JavaScript / Python / Code
  if (
    lower.endsWith('.tsx') ||
    lower.endsWith('.ts') ||
    lower.endsWith('.jsx') ||
    lower.endsWith('.js') ||
    lower.endsWith('.py') ||
    lower.endsWith('.sh') ||
    lower.endsWith('.bash')
  ) {
    return <FileCode className="size-3.5 text-blue-500 shrink-0" />;
  }

  // Styles
  if (lower.endsWith('.css') || lower.endsWith('.scss') || lower.endsWith('.sass') || lower.endsWith('.less')) {
    return <Palette className="size-3.5 text-purple-500 shrink-0" />;
  }

  // Config / YAML / Settings
  if (
    lower.endsWith('.yaml') ||
    lower.endsWith('.yml') ||
    lower.endsWith('.config') ||
    lower.endsWith('.env') ||
    lower.endsWith('.ini') ||
    lower.endsWith('.toml') ||
    lower.endsWith('.ico')
  ) {
    return <FileSliders className="size-3.5 text-orange-400 shrink-0" />;
  }

  // CSV / Tables
  if (lower.endsWith('.csv') || lower.endsWith('.xlsx')) {
    return <FileSpreadsheet className="size-3.5 text-emerald-500 shrink-0" />;
  }

  return <File className="size-3.5 text-muted-foreground shrink-0" />;
}

export default function SkillPackageFilesCard({
  rootFolder,
  activeFileId,
  onSelectFile,
  onToggleFolder,
  onAddFile,
  onAddFolder,
  onRenameNode,
  onDeleteNode,
  isLoading = false,
}) {
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Inline node creation state
  const [creatingNode, setCreatingNode] = useState(null); // { type: 'file' | 'folder', parentFolderId: string }
  const [creatingName, setCreatingName] = useState('');
  const inputRef = useRef(null);

  // Inline node renaming state
  const [renamingNode, setRenamingNode] = useState(null); // node being renamed
  const [renamingName, setRenamingName] = useState('');
  const renameInputRef = useRef(null);

  // Focus and select input text whenever inline creation opens
  useEffect(() => {
    if (creatingNode && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [creatingNode]);

  // Focus and select text when inline renaming opens
  useEffect(() => {
    if (renamingNode && renameInputRef.current) {
      renameInputRef.current.focus();
      const dotIndex = renamingName.lastIndexOf('.');
      if (renamingNode.type === 'file' && dotIndex > 0) {
        renameInputRef.current.setSelectionRange(0, dotIndex);
      } else {
        renameInputRef.current.select();
      }
    }
  }, [renamingNode]);

  // Trigger inline creation for file or folder
  const startCreating = (type, targetFolderId) => {
    const folderId = targetFolderId || rootFolder?.id || 'root';

    // If target folder is closed, expand it open
    const findFolder = (node) => {
      if (!node) return null;
      if (node.id === folderId) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findFolder(child);
          if (found) return found;
        }
      }
      return null;
    };

    const targetNode = rootFolder ? findFolder(rootFolder) : null;
    if (targetNode && targetNode.isOpen === false) {
      onToggleFolder(folderId);
    }

    setCreatingName(type === 'folder' ? 'new_folder' : 'untitled.md');
    setCreatingNode({ type, parentFolderId: folderId });
  };

  const submitCreation = () => {
    if (!creatingNode) return;
    const trimmed = creatingName.trim();
    if (!trimmed) {
      cancelCreation();
      return;
    }

    if (creatingNode.type === 'folder') {
      const folderName = trimmed.replace(/[^a-zA-Z0-9_.-]/g, '_');
      onAddFolder({
        name: folderName,
        folderId: creatingNode.parentFolderId,
      });
    } else {
      const isJson = trimmed.endsWith('.json');
      const isMd = trimmed.endsWith('.md');
      const language = isJson ? 'json' : isMd ? 'markdown' : 'text';
      const defaultContent = isJson ? '{\n  \n}' : isMd ? `# ${trimmed.replace(/\.md$/, '')}\n\n` : '';

      onAddFile({
        name: trimmed,
        folderId: creatingNode.parentFolderId,
        content: defaultContent,
        language,
        size: `${Math.max(12, defaultContent.length)} B`,
      });
    }

    setCreatingNode(null);
    setCreatingName('');
  };

  const cancelCreation = () => {
    setCreatingNode(null);
    setCreatingName('');
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitCreation();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelCreation();
    }
  };

  const handleInputBlur = () => {
    if (creatingName.trim()) {
      submitCreation();
    } else {
      cancelCreation();
    }
  };

  const handleDeleteClick = (e, item) => {
    e.stopPropagation();
    setNodeToDelete(item);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (nodeToDelete && onDeleteNode) {
      await onDeleteNode(nodeToDelete);
    }
    setIsDeleteOpen(false);
    setNodeToDelete(null);
  };

  const startRenaming = (item) => {
    if (!item || item.id === rootFolder?.id) return;
    setRenamingNode(item);
    setRenamingName(item.name);
  };

  const submitRename = async () => {
    if (!renamingNode) return;
    const trimmed = renamingName.trim();
    if (!trimmed || trimmed === renamingNode.name) {
      cancelRename();
      return;
    }

    const targetNode = renamingNode;
    setRenamingNode(null);
    setRenamingName('');

    if (onRenameNode) {
      await onRenameNode(targetNode, trimmed);
    }
  };

  const cancelRename = () => {
    setRenamingNode(null);
    setRenamingName('');
  };

  const handleRenameKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitRename();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelRename();
    }
  };

  const handleRenameBlur = () => {
    if (renamingName.trim() && renamingName.trim() !== renamingNode?.name) {
      submitRename();
    } else {
      cancelRename();
    }
  };

  const renderInlineInput = (depth) => {
    if (!creatingNode) return null;
    const isFolder = creatingNode.type === 'folder';

    return (
      <div
        style={{ paddingLeft: `${depth * 14 + (isFolder ? 0 : 18)}px` }}
        className="flex items-center gap-1.5 py-1 px-1.5 rounded-md bg-primary/10 border border-primary/30 my-0.5 shadow-2xs"
      >
        {isFolder ? (
          <Folder className="size-3.5 text-amber-500 shrink-0" />
        ) : (
          getFileIcon(creatingName || 'untitled.md')
        )}
        <input
          ref={inputRef}
          type="text"
          value={creatingName}
          onChange={(e) => setCreatingName(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          className="flex-1 h-6 px-1.5 text-2sm font-mono bg-background text-foreground border border-primary rounded shadow-xs outline-none focus:ring-1 focus:ring-primary min-w-0"
        />
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={submitCreation}
            className="p-1 rounded text-primary hover:bg-primary/20 transition-colors"
            title="Create (Enter)"
          >
            <Check className="size-3" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={cancelCreation}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Cancel (Esc)"
          >
            <X className="size-3" />
          </button>
        </div>
      </div>
    );
  };

  const renderItem = (item, depth = 0) => {
    const isRenamingThis = renamingNode && renamingNode.id === item.id;

    if (isRenamingThis) {
      const isFolder = item.type === 'folder';
      return (
        <div
          key={`renaming-${item.id}`}
          style={{ paddingLeft: `${depth * 14 + (isFolder ? 0 : 18)}px` }}
          className="flex items-center gap-1.5 py-1 px-1.5 rounded-md bg-primary/10 border border-primary/30 my-0.5 shadow-2xs"
          onClick={(e) => e.stopPropagation()}
        >
          {isFolder ? (
            <Folder className="size-3.5 text-amber-500 shrink-0" />
          ) : (
            getFileIcon(renamingName || item.name)
          )}
          <input
            ref={renameInputRef}
            type="text"
            value={renamingName}
            onChange={(e) => setRenamingName(e.target.value)}
            onKeyDown={handleRenameKeyDown}
            onBlur={handleRenameBlur}
            className="flex-1 h-6 px-1.5 text-2sm font-mono bg-background text-foreground border border-primary rounded shadow-xs outline-none focus:ring-1 focus:ring-primary min-w-0"
          />
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={submitRename}
              className="p-1 rounded text-primary hover:bg-primary/20 transition-colors"
              title="Save (Enter)"
            >
              <Check className="size-3" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={cancelRename}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Cancel (Esc)"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      );
    }

    if (item.type === 'folder') {
      const isOpen = item.isOpen !== false;
      const isCreatingHere = creatingNode && creatingNode.parentFolderId === item.id;

      return (
        <div key={item.id} className="flex flex-col">
          <div
            role="button"
            tabIndex={0}
            style={{ paddingLeft: `${depth * 14}px` }}
            className="w-full text-left flex items-center justify-between py-1 px-1.5 rounded-md hover:bg-muted/50 text-foreground border border-transparent transition-colors select-none group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            onClick={() => {
              onToggleFolder(item.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              startRenaming(item);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onToggleFolder(item.id);
              } else if (e.key === 'F2') {
                e.preventDefault();
                startRenaming(item);
              }
            }}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="shrink-0 p-0.5 rounded hover:bg-muted/80 text-muted-foreground group-hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFolder(item.id);
                }}
              >
                {isOpen ? (
                  <ChevronDown className="size-3.5" />
                ) : (
                  <ChevronRight className="size-3.5" />
                )}
              </span>
              {isOpen ? (
                <FolderOpen className="size-3.5 shrink-0 text-amber-500" />
              ) : (
                <Folder className="size-3.5 shrink-0 text-amber-500" />
              )}
              <span className="text-2sm font-medium truncate">{item.name}</span>
            </div>

            {/* Quick action buttons on hover */}
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 shrink-0 ml-1 transition-opacity">
              <span
                role="button"
                title={`New file in ${item.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  startCreating('file', item.id);
                }}
                className="p-1 rounded hover:bg-background/80 text-muted-foreground hover:text-foreground"
              >
                <FilePlus className="size-3" />
              </span>
              <span
                role="button"
                title={`New folder in ${item.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  startCreating('folder', item.id);
                }}
                className="p-1 rounded hover:bg-background/80 text-muted-foreground hover:text-foreground"
              >
                <FolderPlus className="size-3" />
              </span>
              {depth > 0 && item.id !== rootFolder?.id && (
                <span
                  role="button"
                  title={`Rename ${item.name} (F2)`}
                  onClick={(e) => {
                    e.stopPropagation();
                    startRenaming(item);
                  }}
                  className="p-1 rounded hover:bg-background/80 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Pencil className="size-3" />
                </span>
              )}
              {depth > 0 && item.id !== rootFolder?.id && (
                <span
                  role="button"
                  title={`Delete ${item.name}`}
                  onClick={(e) => handleDeleteClick(e, item)}
                  className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="size-3" />
                </span>
              )}
            </div>
          </div>

          {(isOpen || isCreatingHere) && (
            <div className="flex flex-col gap-0.5">
              {isCreatingHere && renderInlineInput(depth + 1)}
              {item.children && item.children.map((child) => renderItem(child, depth + 1))}
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
        onDoubleClick={(e) => {
          e.stopPropagation();
          startRenaming(item);
        }}
        onKeyDown={(e) => {
          if (e.key === 'F2') {
            e.preventDefault();
            startRenaming(item);
          }
        }}
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
          <span
            role="button"
            title={`Rename ${item.name} (F2)`}
            onClick={(e) => {
              e.stopPropagation();
              startRenaming(item);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-background/80 text-muted-foreground hover:text-foreground transition-all"
          >
            <Pencil className="size-3" />
          </span>
          <span
            role="button"
            title={`Delete ${item.name}`}
            onClick={(e) => handleDeleteClick(e, item)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
          >
            <X className="size-3" />
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 shadow-xs flex-1 min-h-0">
      {/* Card Header */}
      <div className="shrink-0">
        <h2 className="text-sm font-medium text-foreground leading-tight">
          Skill package files
        </h2>
        <p className="text-2xs font-mono text-muted-foreground mt-0.5">
          root: {rootFolder?.name || 'skill_package'}/
        </p>
      </div>

      {/* File Tree */}
      <div className="flex flex-col gap-0.5 py-1 flex-1 overflow-y-auto min-h-0 pr-1 thin-scrollbar">
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
        onClick={() => startCreating('file', rootFolder?.id)}
        className="w-full mt-auto shrink-0 border border-dashed border-border rounded-lg py-2 flex items-center justify-center gap-1.5 text-2sm text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-muted/40 transition-colors"
      >
        <Plus className="size-3.5" />
        Add payload file
      </button>

      {/* Delete Confirmation Modal using ConfirmDialog */}
      <ConfirmDialog
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        variant="destructive"
        title={
          nodeToDelete?.id === rootFolder?.id
            ? `Delete Skill "${nodeToDelete?.name}"?`
            : nodeToDelete?.type === 'folder'
            ? `Delete Folder "${nodeToDelete?.name}"?`
            : `Delete File "${nodeToDelete?.name}"?`
        }
        dialog={
          nodeToDelete?.id === rootFolder?.id
            ? `Are you sure you want to delete this entire skill and all internal files and folders? This action cannot be undone.`
            : nodeToDelete?.type === 'folder'
            ? `Are you sure you want to delete the folder "${nodeToDelete?.name}" and all contained files? This action cannot be undone.`
            : `Are you sure you want to delete the file "${nodeToDelete?.name}"? This action cannot be undone.`
        }
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
