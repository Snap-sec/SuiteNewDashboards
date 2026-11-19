// scan-report.jsx — VS Scan Report (Multi-page)
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReportReady } from "@/hooks/use-report-ready";
import appConfig from "@/config/appConfig";
import ColumnGraph from "@/components/custom/charts/column-graph";
import PieChart from "@/components/custom/charts/pie-chart";

const GlobalPrintStyles = () => (
    <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
            @page {
                size: A4;
                margin: 0;
            }
            body {
                margin: 0;
                padding: 0;
                background: white !important;
            }
            .report-page {
                page-break-after: always;
                page-break-inside: avoid;
                break-inside: avoid;
            }
            table {
                page-break-inside: auto;
            }
            tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }
            thead {
                display: table-header-group;
            }
            tfoot {
                display: table-footer-group;
            }
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    `}} />
);

import SeverityLabel from "@/components/custom/severity-label";
import { StateLabels } from "@/components/custom/state-labels";

const EXTERNAL_CONFIG = {};

const externalApiUrl = `${appConfig.BASE_URL}/vs/api/scans`;
const internalApiUrl = `http://vs/api/scans`;


// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const shortDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const formatDuration = (ms) => {
    if (!ms) return "N/A";
    const m = Math.floor(ms / 60000);
    const h = Math.floor(m / 60);
    return h > 0 ? `${h}h ${m % 60}m` : `${m}m`;
};

// ─── Shared Components ────────────────────────────────────────────────────────
const PageHeader = ({ staticPosition = false }) => (
    <div className={`${staticPosition ? 'w-full flex mb-4' : 'absolute top-0 left-0 m-6 flex'} justify-end items-center gap-4`}>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] whitespace-nowrap">Vulnerability Scanner Report</p>
    </div>
);

const PrintLayout = ({ children, pageBreak = true, className = "" }) => (
    <div className={`w-full bg-white font-sans relative report-page ${className}`} style={{
        pageBreakAfter: pageBreak ? 'always' : 'auto',
        minHeight: '297mm',
        width: '210mm'
    }}>
        <table className="w-full border-collapse">
            <thead className="table-header-group">
                <tr>
                    <td>
                        <div className="px-8 pt-12 pb-4">
                            <PageHeader staticPosition={true} />
                        </div>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="align-top">
                        <div className="px-8 pb-16 pt-4">
                            {children}
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot className="table-footer-group">
                <tr>
                    <td>
                        <div className="h-12 w-full"></div>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
);

// ─── Report Pages ─────────────────────────────────────────────────────────────

const CoverPage = ({ scan, org, custom }) => {
    let website_url = org?.website || "snapsec.co";
    try {
        website_url = new URL(website_url.startsWith("http") ? website_url : "https://" + website_url).hostname;
    } catch { }

    return (
        <div className="min-h-screen w-full bg-white p-8 font-sans relative report-page" style={{ pageBreakAfter: 'always', width: '210mm' }}>
            <PageHeader />

            <div className="absolute top-8 right-8 flex flex-col items-center">
                {org?.logo ? (
                    <img src={org.logo} className="h-16 object-contain" alt="logo" />
                ) : (
                    <img src={`https://img.logo.dev/${website_url}?token=pk_YDuXMfwrRe2kQtBuzc3Etg`} className="h-16 object-contain" alt="org logo" />
                )}
                <p className="font-medium tracking-wider mt-2">{org?.name}</p>
            </div>

            <div className="mt-[50%] w-full text-center">
                <h1 className="text-black text-6xl font-medium leading-tight mb-4 flex flex-col uppercase">
                    <span>Vulnerability Scanning Report</span>
                </h1>
                <div className="text-[10px] text-red-600 font-semibold uppercase tracking-[0.2em] mt-8 pt-4 border-t border-gray-100 max-w-[60%] mx-auto">
                    Confidential Notice: This document is the private property of {org?.name}.
                </div>
            </div>

            <div className="absolute bottom-0 right-0 m-12">
                <p className="px-6 py-2 text-sm font-medium uppercase tracking-widest text-gray-500">
                    {formatDate(new Date())}
                </p>
            </div>
        </div>
    );
};

const TableOfContents = () => (
    <PrintLayout>
        <div className="font-bold text-3xl tracking-tight mt-10 mb-8">Table of Contents</div>
        <div className="space-y-6">
            <div>
                <div className="border-b border-gray-200 pb-2">
                    <span className="font-semibold text-lg text-gray-800">1. Scan Details</span>
                </div>
                <div className="pl-6 mt-3 space-y-2">
                    <div className="text-sm text-gray-600">
                        <span>1.1 General Scan Details</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        <span>1.2 Severity Breakdown</span>
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-200 pb-2">
                <span className="font-semibold text-lg text-gray-800">2. Vulnerability List Table</span>
            </div>

            <div className="border-b border-gray-200 pb-2">
                <span className="font-semibold text-lg text-gray-800">3. Vulnerability Detail Pages</span>
            </div>
        </div>
    </PrintLayout>
);

const ScanDetailsPage = ({ scan, severityBreakdown }) => {
    const severitySeries = [{
        name: "Vulnerabilities",
        data: [severityBreakdown?.critical || 0, severityBreakdown?.high || 0, severityBreakdown?.medium || 0, severityBreakdown?.low || 0, severityBreakdown?.info || 0],
    }];

    return (
        <PrintLayout>
            <div className="font-bold text-2xl tracking-tight mt-5 mb-8 uppercase text-gray-800">1. Scan Details</div>

            <div className="mb-10">
                <h3 className="font-bold text-lg mb-4 text-indigo-900 border-l-4 border-indigo-900 pl-3 text-sm">1.1 General Scan Details</h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    {[
                        { label: "Status", value: scan?.state || "Completed" },
                        { label: "Scanner", value: scan?.scanner?.name || "Default Scanner" },
                        { label: "Scan Type", value: scan?.scanType || "Full" },
                        { label: "Schedule", value: scan?.schedule || "Immediate" },
                        { label: "Started", value: shortDate(scan?.startedAt) },
                        { label: "Completed", value: shortDate(scan?.completedAt) },
                        { label: "Duration", value: formatDuration(scan?.duration) },
                        { label: "Asset Group", value: scan?.group?.name || "All Assets" },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between border-b border-gray-200 pb-1">
                            <span className="text-sm text-gray-500 font-medium">{label}</span>
                            <span className="text-sm font-bold text-gray-800 capitalize">{value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-bold text-lg mb-4 text-indigo-900 border-l-4 border-indigo-900 pl-3 uppercase">1.2 Severity Breakdown</h3>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <ColumnGraph
                        series={severitySeries}
                        xCategories={["Critical", "High", "Medium", "Low", "Info"]}
                        height={350}
                        showLegend={false}
                        colors={["#DC2626", "#F97316", "#EAB308", "#3B82F6", "#94A3B8"]}
                    />
                </div>
            </div>
        </PrintLayout>
    );
};

const VulnerabilityListTable = ({ vulns }) => (
    <PrintLayout>
        <div className="font-bold text-2xl tracking-tight mt-5 mb-8 uppercase text-gray-800">2. Vulnerability List Table</div>
        <table className="w-full text-left border-collapse table-auto border-t border-gray-200">
            <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-4 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest">#</th>
                    <th className="px-4 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest">Title</th>
                    <th className="px-4 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-center">Severity</th>
                    <th className="px-4 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-right">State</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 border-b border-gray-200">
                {vulns?.map((v, i) => (
                    <tr key={v._id || i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">{i + 1}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 leading-snug">{v.title}</td>
                        <td className="px-4 py-3 text-center">
                            <SeverityLabel severity={v.cvssRating} score={v.cvssScore} size="sm" />
                        </td>
                        <td className="px-4 py-3 text-right">
                            <StateLabels state={v.state} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </PrintLayout>
);

const VulnerabilityDetailPage = ({ vuln, index }) => (
    <PrintLayout>
        <div className="flex justify-between items-start mt-6 mb-8 border-b-2 border-gray-800 pb-4">
            <div className="max-w-[70%] break-words">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1">Vulnerability {index + 1}</p>
                <h2 className="text-xl font-bold text-black leading-tight">{vuln.title}</h2>
            </div>
            <div className="flex flex-col items-end pr-1">
                <SeverityLabel severity={vuln.cvssRating} score={vuln.cvssScore} size="lg" />
                <div className="mt-2">
                    <StateLabels state={vuln.state} />
                </div>
            </div>
        </div>

        <div className="space-y-8">


            <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-900 border-b pb-2 mb-3">Vulnerability Location</h3>
                <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{vuln.matchedAt || "N/A"}</div>
            </div>

            <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-900 border-b pb-2 mb-3">Description</h3>
                <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{vuln.description}</div>
            </div>

            {/* <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-900 border-b pb-2 mb-3">Recommendation</h3>
                <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{vuln.recommendation}</div>
            </div> */}

            {vuln.proof && (
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-900 border-b pb-2 mb-3">Evidence / Reproduction</h3>
                    <div className="bg-black text-green-400 p-6 rounded-xl font-mono text-xs break-all whitespace-pre-wrap selection:bg-green-900 leading-relaxed shadow-lg">
                        {vuln.proof}
                    </div>
                </div>
            )}

            {vuln.references?.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-900 border-b pb-2 mb-3">References</h3>
                     <ul className="list-disc pl-5 space-y-1">
                        {vuln.references.map((ref, i) => (
                            <li key={i} className="text-xs text-blue-600 hover:underline">
                                <a href={ref} target="_blank" rel="noopener noreferrer">{ref}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </PrintLayout>
);


// ─── Main Component ───────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ScanReport Error caught by boundary:", error, errorInfo);
        window.isPdfReady = true;
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-20 text-center bg-white min-h-screen">
                    <h1 className="text-2xl font-bold text-red-600">Something went wrong while rendering the report.</h1>
                    <p className="mt-4">The PDF generation will proceed with the available data.</p>
                    <pre>
                        {JSON.stringify(this.state.error, null, 2)}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}

const ScanReport = () => {
    const [params] = useSearchParams();
    const [reportData, setReportData] = useState(null);
    const [loadingReportData, setLoadingReportData] = useState(true);
    const [reportError, setReportError] = useState(false);
    const hasFetched = useRef(false);

    let viewMode = params.get("view_mode");
    if (viewMode === "web") {
        EXTERNAL_CONFIG.BASE_URL = externalApiUrl;
    } else {
        EXTERNAL_CONFIG.BASE_URL = internalApiUrl;
    }

    async function fetchReportData() {
        const scanId = params.get("scanId");
        const accessToken = params.get("accessToken");
        const jwtToken = localStorage.getItem("token");
        if (!scanId) return;

        const apiBase = `${EXTERNAL_CONFIG.BASE_URL}/${scanId}/report/data`;

        try {
            const response = await fetch(`${apiBase}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                params: {
                    accessToken
                },
                credentials: "include"
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setReportData(data?.data);
            setReportError(false);
        } catch (err) {
            console.error("[VS Report] Failed to fetch report data.", err);
            setReportError(true);
        } finally {
            setLoadingReportData(false);
        }
    }

    useEffect(() => {
        if (!hasFetched.current) {
            fetchReportData();
            hasFetched.current = true;
        }
    }, []);

    const { statusMessage } = useReportReady({
        loading: loadingReportData,
        data: reportData,
        error: reportError,
        options: { readyDelay: 1000 }
    });

    if (loadingReportData) {
        return (
            <div className="w-screen h-screen flex justify-center items-center text-lg font-semibold bg-white">
                <div className="flex flex-col items-center animate-pulse">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                    Generating Secure Scan Report...
                    <p className="text-xs text-gray-400 mt-2 font-mono uppercase tracking-widest">{statusMessage}</p>
                </div>
            </div>
        );
    }

    // Only treat the report as "no data" on a genuine fetch error or a missing
    // scan payload. A scan whose findings are info-only (or has zero vulns) still
    // returns a valid `scan` object and must render its severity breakdown + list
    // — it should not fall through to the "No Data Found" screen.
    if (reportError || !reportData || !reportData.scan) {
        return (
            <div className="w-screen h-screen flex flex-col justify-center items-center gap-4 bg-white">
                <div className="text-gray-900 font-bold text-3xl">No Data Found</div>
                <p className="text-gray-500 max-w-md text-center">We couldn't retrieve any data for this report. This could be due to missing scan results or invalid parameters.</p>
                <div className="mt-8 p-4 bg-gray-50 rounded border border-gray-200 w-full max-w-2xl overflow-auto">
                    <p className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest">Debug Info (Raw Response)</p>
                    <pre className="text-[10px] text-gray-600 leading-tight">
                        {JSON.stringify(reportData, null, 2)}
                    </pre>
                </div>
            </div>
        );
    }

    const { scan, org, severityBreakdown, vulns: rawVulns, customReport } = reportData;

    const severityWeight = {
        critical: 5,
        high: 4,
        medium: 3,
        low: 2,
        info: 1,
        none: 0,
    };

    const vulns = [...(rawVulns || [])].sort((a, b) => {
        const weightA = severityWeight[a.cvssRating?.toLowerCase()] ?? 0;
        const weightB = severityWeight[b.cvssRating?.toLowerCase()] ?? 0;
        return weightB - weightA;
    });

    return (
        <ErrorBoundary>
            <div className="w-full flex flex-col items-center bg-gray-200 py-12 print:p-0 print:bg-white no-scrollbar">
                <GlobalPrintStyles />
                <CoverPage scan={scan} org={org} custom={customReport} />
                <TableOfContents />
                <ScanDetailsPage scan={scan} severityBreakdown={severityBreakdown} />
                <VulnerabilityListTable vulns={vulns} />

                {vulns?.map((v, i) => (
                    <VulnerabilityDetailPage key={v._id || i} vuln={v} index={i} />
                ))}

                <div className="min-h-screen w-full bg-white p-8 font-sans relative report-page flex items-center justify-center" style={{ width: '210mm' }}>
                    <div className="text-center">
                        <p className="text-4xl font-bold tracking-widest text-gray-200 uppercase">END OF DOCUMENT</p>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default ScanReport;
