import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X, Copy, Check, FileCode, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MarkdownViewer from '@/components/custom/markdown-viewer';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function SkillEditorCard({
  openFiles = [],
  activeFileId,
  onSelectTab,
  onCloseTab,
  onContentChange,
  onSave,
  isSaving = false,
}) {
  const [viewMode, setViewMode] = useState('code'); // 'code' | 'split' | 'preview'
  const [isCopied, setIsCopied] = useState(false);
  const lineNumbersRef = useRef(null);
  const textareaRef = useRef(null);

  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const activeFile = useMemo(() => {
    return openFiles.find((f) => f.id === activeFileId) || openFiles[0] || null;
  }, [openFiles, activeFileId]);

  const content = activeFile?.content || '';

  // Listen for Ctrl+S or Cmd+S globally
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (onSave) {
          onSave(activeFile?.id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave, activeFile?.id]);

  // Parse frontmatter and markdown body if markdown/yaml
  const { frontmatter, body } = useMemo(() => {
    if (!content.startsWith('---')) {
      return { frontmatter: null, body: content };
    }
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) {
      return { frontmatter: null, body: content };
    }
    return { frontmatter: match[1], body: match[2] };
  }, [content]);

  const lines = useMemo(() => {
    return content.split('\n');
  }, [content]);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-xl flex flex-col flex-1 h-full min-h-[480px] lg:min-h-0 shadow-xs overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2 bg-muted/20 shrink-0">
        {/* Open Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[60%] thin-scrollbar">
          {openFiles.length === 0 ? (
            <span className="text-2sm text-muted-foreground italic px-2 py-1">No files open</span>
          ) : (
            openFiles.map((file) => {
              const isActive = file.id === activeFile?.id;
              const isDirty = !!file.isDirty;
              return (
                <div
                  key={file.id}
                  onClick={() => onSelectTab(file.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-2sm select-none cursor-pointer border transition-colors group',
                    isActive
                      ? 'bg-background text-foreground border-border shadow-xs font-medium'
                      : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <span className="truncate max-w-[140px]">{file.name}</span>
                  {isDirty && (
                    <span
                      className="size-1.5 rounded-full bg-foreground shrink-0"
                      title="Unsaved changes"
                    />
                  )}
                  {openFiles.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(file.id);
                      }}
                      className="size-3.5 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* View Switcher & Actions */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center bg-muted/70 p-0.5 rounded-lg border border-border/50 text-2sm font-medium">
            <button
              type="button"
              onClick={() => setViewMode('code')}
              className={cn(
                'px-3 py-1 rounded-md transition-all select-none',
                viewMode === 'code'
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Code
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={cn(
                'px-3 py-1 rounded-md transition-all select-none',
                viewMode === 'split'
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Split view
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={cn(
                'px-3 py-1 rounded-md transition-all select-none',
                viewMode === 'preview'
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Preview
            </button>
          </div>

          <Button
            size="sm"
            variant={activeFile?.isDirty ? 'primary' : 'outline'}
            onClick={() => onSave?.(activeFile?.id)}
            disabled={isSaving || !activeFile}
            className={cn(
              'h-7 px-2.5 gap-1.5 text-2sm font-medium transition-all',
              activeFile?.isDirty
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title="Save file (Ctrl+S)"
          >
            {isSaving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            <span>Save</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
            onClick={handleCopy}
            title="Copy content"
            disabled={!content}
          >
            {isCopied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
          </Button>
        </div>
      </div>

      {/* Editor & Preview Area */}
      {!activeFile ? (
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-8 text-center bg-background">
          <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
            <FileCode className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground">No file selected</h3>
          <p className="text-2sm text-muted-foreground mt-1 max-w-xs">
            Select a file from the package tree on the left to start editing.
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Code Editor (shown in 'code' or 'split') */}
          {(viewMode === 'code' || viewMode === 'split') && (
            <div
              className={cn(
                'flex flex-1 min-w-0 font-mono text-sm overflow-hidden bg-background h-full',
                viewMode === 'split' && 'border-r border-border'
              )}
            >
              {/* Line Numbers Gutter */}
              <div
                ref={lineNumbersRef}
                className="py-4 px-3 select-none text-right text-muted-foreground/50 border-r border-border/40 bg-muted/10 shrink-0 font-mono leading-6 overflow-hidden"
              >
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Editable Text Area */}
              <div className="relative flex-1 min-w-0 h-full">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => {
                    if (activeFile) {
                      onContentChange(activeFile.id, e.target.value);
                    }
                  }}
                  onScroll={handleScroll}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                      e.preventDefault();
                      if (onSave) {
                        onSave(activeFile?.id);
                      }
                    }
                  }}
                  spellCheck={false}
                  className="w-full h-full p-4 font-mono text-sm text-foreground bg-transparent resize-none leading-6 outline-none border-none focus:ring-0 focus:outline-none whitespace-pre-wrap break-words overflow-x-hidden overflow-y-auto thin-scrollbar"
                />
              </div>
            </div>
          )}

          {/* Live Preview (shown in 'preview' or 'split') */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className="flex-1 min-w-0 p-6 overflow-y-auto bg-background h-full thin-scrollbar">
              {frontmatter && (
                <div className="mb-6 p-4 rounded-xl border border-border bg-muted/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" appearance="outline" size="sm" className="text-2xs font-mono">
                      YAML Frontmatter
                    </Badge>
                  </div>
                  <pre className="text-2xs font-mono text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {frontmatter}
                  </pre>
                </div>
              )}

              {activeFile?.language === 'json' ? (
                <div className="p-4 rounded-xl border border-border bg-muted/20">
                  <pre className="text-sm font-mono text-foreground overflow-x-auto whitespace-pre thin-scrollbar">
                    {content}
                  </pre>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                  <MarkdownViewer markdown={body} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
