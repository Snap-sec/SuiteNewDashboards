import React from 'react';
import ExportToCSV from '@/components/custom/export-to-csv';

function CsvExportBtn({ type = 'technology', filters, search }) {
  return (
    <div className="flex gap-2 items-center">
      <ExportToCSV type={type} filters={filters} search={search} />
    </div>
  );
}

export default CsvExportBtn;
