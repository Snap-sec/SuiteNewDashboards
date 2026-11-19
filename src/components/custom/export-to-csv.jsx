import { Download, Loader2 } from 'lucide-react';
import { useLazyExportAsmAssetsToCSVQuery } from '@/services/asm/attackSurfaceApi';
import { Button } from '@/components/ui/button';
import { CustomTooltip } from './tooltip';
import { ButtonWithConfirm } from './button-with-confirmation';

export function ExportToCSV({ type, filters = {}, search = '' }) {
  const [triggerExport, { isFetching }] = useLazyExportAsmAssetsToCSVQuery();

  const handleExport = async () => {
    try {
      const params = {
        type,
        ...filters,
        ...(search ? { search } : {}),
      };

      const result = await triggerExport(params).unwrap();

      // Create and download the CSV file
      const blob = new Blob([result], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type || 'assets'}-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <CustomTooltip text="Export all data to CSV">
      <ButtonWithConfirm
        variant="outline"
        disabled={isFetching}
        className="gap-2"
        confirm={true}
        confirmVariant="info"
        confirmTitle="Export to CSV"
        dialog="Are you sure you want to export all data to CSV?"
        onConfirm={handleExport}
      >
        {isFetching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Export to CSV
      </ButtonWithConfirm>
    </CustomTooltip>
  );
}

export default ExportToCSV;
