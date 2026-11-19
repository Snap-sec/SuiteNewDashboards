'use client';

import {
  formatBytes,
  useFileUpload,
} from '@/hooks/use-file-upload';
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FileIcon, PlusIcon, TriangleAlert, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CloudUpload } from 'lucide-react';

export default function CompactFileUpload({
  maxFiles = 3,
  maxSize = 2 * 1024 * 1024,
  accept = 'image/*',
  multiple = true,
  className,
  onFilesChange,
}) {
  const [
    { files, isDragging, errors },
    { removeFile, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    onFilesChange,
  });

  const isImage = (file) => {
    const type = file instanceof File ? file.type : file.type;
    return type.startsWith('image/');
  };

  return (
  <div className={cn("w-full", className)}>
    <div
      className={cn(
        "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all",
        isDragging
          ? "border-primary bg-primary/10"
          : "border-muted-foreground/40 hover:border-muted-foreground"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <input {...getInputProps()} className="hidden" />

      <CloudUpload />

      <p className="text-medium text-muted-foreground mt-1">Drag & Drop files here</p>
      <p className="text-sm mt-1 text-muted-foreground/80">or</p>

      <Button
        size=""
        variant="outline"
        className="mt-3 px-6"
        onClick={(e) => {
          e.stopPropagation();
          openFileDialog();
        }}
      >
        Browse Files
      </Button>

      <p className="text-xs mt-3 text-muted-foreground/70">
        Max {maxFiles} files, up to {formatBytes(maxSize)} each
      </p>
    </div>

    {files.length > 0 && (
      <div className="mt-4 grid grid-cols-3 gap-4">
        {files.map((fileItem) => (
          <div key={fileItem.id} className="group relative">
            {isImage(fileItem.file) && fileItem.preview ? (
              <img
                src={fileItem.preview}
                alt={fileItem.file.name}
                className="h-20 w-full rounded-lg border object-cover"
              />
            ) : (
              <div className="flex h-10 w-full items-center justify-center rounded-lg border bg-muted">
                <FileIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            )}

            <Button
              onClick={() => removeFile(fileItem.id)}
              variant="destructive"
              size="icon"
              className="size-6 border-2 border-background absolute -right-2 -top-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            >
              <XIcon className="size-3" />
            </Button>
          </div>
        ))}
      </div>
    )}

    {errors.length > 0 && (
      <Alert variant="destructive" appearance="light" className="mt-5">
        <AlertIcon>
          <TriangleAlert />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>File upload error(s)</AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </AlertDescription>
        </AlertContent>
      </Alert>
    )}
  </div>
);

}
