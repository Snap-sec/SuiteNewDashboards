import { saveAs } from 'file-saver';

export const generateCsv = (vulnerabilities) => {
    // Create headers
    const headers = ["Title,Owner,Assessment Name,State,Severity,Reported On"];
    
    // Transform data to CSV rows
    const rows = vulnerabilities.map(vuln => 
        `"${vuln.title}","${vuln.owner}","${vuln.assessmentName}","${vuln.state}","${vuln.severity}","${vuln.reportedOn}"`
    );
    
    // Combine headers and rows
    const csvContent = [headers, ...rows].join("\n");
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'vulnerability_report.csv');
};
