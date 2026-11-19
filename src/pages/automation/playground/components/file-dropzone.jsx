import React, { useRef, useState } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function FileDropzone({
  files = [],
  onAddFiles,
  onRemoveFile,
  isUploading = false,
  className,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      onAddFiles(droppedFiles);
    }
  };

  const handleFileChange = (e) => {
    if (e.target?.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      onAddFiles(selectedFiles);
      e.target.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn('flex flex-col gap-3 w-full', className)}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={cn(
          'flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-8 px-6 text-center cursor-pointer transition-all duration-200 select-none',
          isDragging
            ? 'border-primary bg-primary/5 scale-[0.99]'
            : 'border-border/70 hover:border-primary/50 hover:bg-muted/10 bg-transparent'
        )}
      >
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
        </div>

        <p className="text-sm font-medium text-foreground">
          {isUploading ? (
            <span>Uploading file...</span>
          ) : (
            <>
              Drop files here or{' '}
              <span className="text-primary hover:underline font-medium">browse</span>
            </>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Multiple files supported
        </p>
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          {files.map((file, index) => {
            const fileName = file.originalName || file.name || file.filename || 'Context File';
            const fileSize = file.sizeBytes ?? file.size ?? 0;
            return (
              <div
                key={`${fileName}-${index}`}
                className="flex items-center justify-between py-2 px-3 rounded-lg border border-border bg-card/60 text-xs gap-3"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="truncate font-medium text-foreground">
                    {fileName}
                  </span>
                  <span className="text-muted-foreground shrink-0">
                    ({formatFileSize(fileSize)})
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(index);
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
