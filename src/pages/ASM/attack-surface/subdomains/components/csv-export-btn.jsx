import ExportToCSV from "@/components/custom/export-to-csv";

function CsvExportBtn({ type }) {
    return (
        <div className="flex gap-2 items-center">
            <ExportToCSV type={type} />
        </div>
    )
}

export default CsvExportBtn;
