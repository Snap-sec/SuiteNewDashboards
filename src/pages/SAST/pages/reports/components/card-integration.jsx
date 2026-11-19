import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toAbsoluteUrl } from '@/lib/helpers';
import appConfig from '@/config/appConfig';

const CardIntegration = ({
  id,
  logo,
  format = 'csv',
  supportedFormats,
  name,
  type = 'all',
  types,
  reportId,
  isGeneratedAt,
  status,
  description,
}) => {
  const formatsList =
    supportedFormats && supportedFormats.length > 0
      ? supportedFormats
      : format
        ? [format]
        : ['csv', 'xlsx', 'json'];

  const typesList =
    types && types.length > 0 ? types : type ? [type] : ['all'];

  const [selectedFormat, setSelectedFormat] = useState(formatsList[0] || 'csv');
  const [selectedType, setSelectedType] = useState(typesList[0] || 'all');
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadReport = async (typeToDownload, formatToDownload) => {
    setIsDownloading(true);
    toast.info('Downloading report, please wait...');

    try {
      let token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found. Please log in.');
        return;
      }

      let res = await fetch(
        `${appConfig.BASE_URL}/sast/api/v1/reports/download?type=${typeToDownload}&format=${formatToDownload}&token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        }
      );

      const contentType = res.headers.get('content-type') || '';
      let isJson = contentType.includes('application/json');

      // Check if response indicates token expiration
      if (res.status === 401) {
        // Attempt silent token refresh
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const refreshToken =
          user?.refreshToken || localStorage.getItem('refreshToken');

        if (refreshToken) {
          const refreshRes = await fetch(
            `${appConfig.BASE_URL}/auth/api/auth/refresh-token`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
            }
          );

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newToken =
              refreshData?.data?.token || refreshData?.token;
            if (newToken) {
              localStorage.setItem('token', newToken);
              token = newToken;

              // Retry download with refreshed token
              res = await fetch(
                `${appConfig.BASE_URL}/sast/api/v1/reports/download?type=${typeToDownload}&format=${formatToDownload}&token=${token}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  credentials: 'include',
                }
              );
              isJson = (res.headers.get('content-type') || '').includes('application/json');
            }
          }
        }
      }

      if (isJson) {
        const json = await res.json();
        if (json.error === 'jwt expired' || json.message === 'jwt expired') {
          toast.error('Session expired. Please log in again.');
          setTimeout(() => {
            window.location.href = '/auth/signin';
          }, 1500);
          return;
        }

        if (json.success === false || (json.error && formatToDownload !== 'json')) {
          throw new Error(json.error || 'Failed to download report');
        }

        if (formatToDownload === 'json') {
          const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
          downloadBlob(blob, `sast-${typeToDownload}-report.json`);
          toast.success('Report downloaded successfully');
          return;
        }
      }

      if (!res.ok) {
        throw new Error('Report download failed');
      }

      const blob = await res.blob();
      downloadBlob(blob, `sast-${typeToDownload}-report.${formatToDownload}`);
      toast.success('Report downloaded successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to download report');
    } finally {
      setIsDownloading(false);
    }
  };

  const getReportLogo = (fmt) => {
    const f = (fmt || selectedFormat || 'csv').toLowerCase();
    if (f === 'xlsx' || f === 'xls') return 'xlsx.svg';
    if (f === 'csv') return 'csv.svg';
    if (f === 'json') return 'js.svg';
    return 'doc.svg';
  };

  const currentDownloadType =
    typesList.length > 1 ? selectedType : typesList[0] || 'all';

  return (
    <Card className="flex flex-col justify-between hover:border-border transition-colors shadow-sm">
      <CardContent className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center p-2 rounded-lg bg-muted/50 border border-border/60">
            <img
              src={toAbsoluteUrl(`/media/file-types/${getReportLogo(selectedFormat)}`)}
              className="h-10 w-10 shrink-0 object-contain"
              alt={`${selectedFormat} report`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Formats Selection */}
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {formatsList.map((fmt) => {
              const isSelected = selectedFormat.toLowerCase() === fmt.toLowerCase();
              return (
                <Badge
                  key={fmt}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer transition-all text-xs uppercase px-2.5 py-0.5 ${
                    isSelected
                      ? 'shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  onClick={() => setSelectedFormat(fmt)}
                >
                  {fmt}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-foreground">
            {name}
          </span>
          <span className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3 py-3 px-5 border-t border-border/50 bg-muted/20">
        <div className="flex items-center gap-2">
          <Select
            value={selectedType}
            onValueChange={setSelectedType}
            disabled={typesList.length <= 1}
          >
            <SelectTrigger className="w-[140px] sm:w-[155px] h-8 text-xs capitalize bg-background">
              <SelectValue placeholder="Download type" />
            </SelectTrigger>
            <SelectContent>
              {typesList.map((t) => (
                <SelectItem key={t} value={t} className="capitalize text-xs">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownloadReport(currentDownloadType, selectedFormat)}
          disabled={isDownloading}
          className="gap-2 shrink-0 h-8 text-xs"
        >
          {isDownloading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Download className="size-3.5" />
          )}
          <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export { CardIntegration };
