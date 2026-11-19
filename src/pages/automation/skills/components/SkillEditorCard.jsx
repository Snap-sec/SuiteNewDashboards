import React, { useState, useMemo } from 'react';
import { X, FileCode, Eye, Columns, Code2, Copy, Check } from 'lucide-react';
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
}) {
  const [viewMode, setViewMode] = useState('code'); // 'code' | 'split' | 'preview'
  const [isCopied, setIsCopied] = useState(false);

  const activeFile = useMemo(() => {
    return openFiles.find((f) => f.id === activeFileId) || openFiles[0] || null;
  }, [openFiles, activeFileId]);

  const content = activeFile?.content || '';

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
    <div className="bg-card border border-border rounded-xl flex flex-col flex-1 min-h-[620px] shadow-xs overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-muted/20">
        {/* Open Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[60%]">
          {openFiles.map((file) => {
            const isActive = file.id === activeFile?.id;
            return (
              <div
                key={file.id}
                onClick={() => onSelectTab(file.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-2sm select-none cursor-pointer border transition-colors',
                  isActive
                    ? 'bg-background text-foreground border-border shadow-xs font-medium'
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50'
                )}
              >
                <span>{file.name}</span>
                {openFiles.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(file.id);
                    }}
                    className="size-3.5 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* View Switcher: Code | Split view | Preview */}
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
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
            onClick={handleCopy}
            title="Copy content"
          >
            {isCopied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
          </Button>
        </div>
      </div>

      {/* Editor & Preview Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor (shown in 'code' or 'split') */}
        {(viewMode === 'code' || viewMode === 'split') && (
          <div
            className={cn(
              'flex flex-1 min-w-0 font-mono text-sm overflow-auto bg-background',
              viewMode === 'split' && 'border-r border-border'
            )}
          >
            {/* Line Numbers Gutter */}
            <div className="py-4 px-3 select-none text-right text-muted-foreground/50 border-r border-border/40 bg-muted/10 shrink-0 font-mono leading-6">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editable Text Area */}
            <div className="relative flex-1 min-w-0">
              <textarea
                value={content}
                onChange={(e) => {
                  if (activeFile) {
                    onContentChange(activeFile.id, e.target.value);
                  }
                }}
                spellCheck={false}
                className="w-full h-full p-4 font-mono text-sm text-foreground bg-transparent resize-none leading-relaxed outline-none border-none focus:ring-0 focus:outline-none whitespace-pre"
              />
            </div>
          </div>
        )}

        {/* Live Preview (shown in 'preview' or 'split') */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="flex-1 min-w-0 p-6 overflow-y-auto bg-background">
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
                <pre className="text-sm font-mono text-foreground overflow-x-auto whitespace-pre">
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
    </div>
  );
}
