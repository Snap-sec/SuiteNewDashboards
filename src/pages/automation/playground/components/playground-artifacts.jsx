import React, { useState } from 'react';
import { Download, FileText, FileCode, FileSpreadsheet, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import appConfig from '@/config/appConfig';

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(fileName = '') {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['json', 'yaml', 'yml', 'xml', 'js', 'jsx', 'ts', 'tsx'].includes(ext)) {
    return <FileCode className="w-4 h-4 text-amber-500 shrink-0" />;
  }
  if (['csv', 'xlsx', 'xls'].includes(ext)) {
    return <FileSpreadsheet className="w-4 h-4 text-emerald-500 shrink-0" />;
  }
  return <FileText className="w-4 h-4 text-primary shrink-0" />;
}

export async function downloadArtifactFile({ url, fileName }) {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    let errMsg = 'Failed to download artifact';
    try {
      const errJson = await response.json();
      errMsg = errJson.message || errMsg;
    } catch {
      // ignore
    }
    throw new Error(errMsg);
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(blobUrl);
}

export async function downloadPlaygroundArtifactFile(fileName) {
  return downloadArtifactFile({
    url: `${appConfig.BASE_URL}/automations/api/v1/playground/artifacts/download/${encodeURIComponent(fileName)}`,
    fileName,
  });
}

export default function PlaygroundArtifacts({
  artifacts = [],
  runId,
  agentId,
  onDownload,
  title = 'Generated Artifacts',
  description = 'Files and outputs produced during this execution run.',
}) {
  const [downloadingFile, setDownloadingFile] = useState(null);

  if (!artifacts || artifacts.length === 0) {
    return null;
  }

  const handleDownload = async (artifact) => {
    const fileName = artifact?.fileName || artifact?.name;
    if (!fileName) {
      toast.error('File name not found for this artifact');
      return;
    }

    const d = toast.loading(`Downloading ${fileName}`);

    try {
      setDownloadingFile(fileName);
      if (onDownload) {
        await onDownload(artifact);
      } else {
        let downloadUrl;
        if (agentId && runId) {
          downloadUrl = `${appConfig.BASE_URL}/automations/api/v1/agents/${agentId}/runs/${runId}/artifacts/${encodeURIComponent(fileName)}`;
        } else if (runId) {
          downloadUrl = `${appConfig.BASE_URL}/automations/api/v1/playground/runs/${runId}/artifacts/${encodeURIComponent(fileName)}`;
        } else {
          downloadUrl = `${appConfig.BASE_URL}/automations/api/v1/playground/artifacts/download/${encodeURIComponent(fileName)}`;
        }
        await downloadArtifactFile({ url: downloadUrl, fileName });
      }
      toast.success(`Downloaded ${fileName}`, { id: d });
    } catch (err) {
      toast.error(err.message || `Failed to download ${fileName}`, { id: d });
    } finally {
      setDownloadingFile(null);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary shrink-0" />
          <h4 className="text-xs font-semibold text-foreground">{title}</h4>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {artifacts.length}
          </span>
        </div>
        {description && (
          <p className="text-[11px] text-muted-foreground hidden sm:block">
            {description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {artifacts.map((artifact, index) => {
          const fileName = artifact?.fileName || artifact?.name || `artifact-${index + 1}`;
          const fileSize = artifact?.sizeBytes ?? artifact?.size ?? 0;
          const mimeType = artifact?.mimeType || '';
          const isCurrentDownloading = downloadingFile === fileName;

          return (
            <div
              key={`${fileName}-${index}`}
              className={`flex items-center justify-between p-2.5 rounded-lg border border-border bg-background hover:bg-muted/40 transition-colors text-xs gap-2.5 min-w-0 ${isCurrentDownloading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              onClick={(e) => {
                if (isCurrentDownloading) return;
                e.stopPropagation();
                handleDownload(artifact)
              }}
              title='Click to Download'
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-md bg-muted/50 flex items-center justify-center shrink-0">
                  {getFileIcon(fileName)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate font-medium text-foreground text-xs" title={fileName}>
                    {fileName}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span>{formatFileSize(fileSize)}</span>
                    {mimeType && <span className="truncate">• {mimeType}</span>}
                  </div>
                </div>
              </div>

              {/* <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs gap-1 shrink-0"
                onClick={() => handleDownload(artifact)}
                disabled={isCurrentDownloading}
              >
                {isCurrentDownloading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Download className="size-3.5" />
                )}
                <span className="hidden sm:inline">Download</span>
              </Button> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
