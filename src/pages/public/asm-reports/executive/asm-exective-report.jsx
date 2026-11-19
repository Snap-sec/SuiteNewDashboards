;
// asm-executive-report.jsx — ASM Executive Report (Single-page print-ready)
import React, { useEffect } from "react";
import { Shield } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import appConfig from "@/config/appConfig";
import { useReportReady } from "@/hooks/use-report-ready";


const externalApiBaseUrl = `${appConfig.BASE_URL}/op/api/v1/reports/data/executive`;
const internalApiBaseUrl = `http://op/op/api/v1/reports/data/executive`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const ASSET_TYPE_LABELS = {
    subdomain: "Subdomains",
    ip_address: "IP Addresses",
    ip: "IP Addresses",
    port: "Ports",
    web_server: "Web Servers",
    dns: "DNS Records",
    certificate: "Certificates",
    technology: "Technologies",
};

const SEVERITY_COLORS = {
    critical: { text: "text-red-600", bg: "bg-red-50", border: "border-red-600/20" },
    high: { text: "text-red-500", bg: "bg-red-50", border: "border-red-500/20" },
    medium: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-500/20" },
    low: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-500/20" },
    info: { text: "text-blue-500", bg: "bg-blue-50", border: "border-blue-500/20" },
};



// ─── Shared Components ────────────────────────────────────────────────────────
const ReportHeader = ({ summary }) => (
    <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-[#1379f0]">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1379f0]/10 flex items-center justify-center">
                <img src="https://suite.snapsec.co/media/logos/snapsec.svg" className="w-6 h-6" alt="SnapSec" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-[#1379f0] leading-tight">Attack Surface Management</h1>
                <p className="text-sm font-medium text-gray-500">Executive Summary Report</p>
            </div>
        </div>
        <div className="text-right text-[11px] text-gray-400 leading-tight">
            <p>Generated: {formatDate(new Date())}</p>
            <p>Last Scan: {formatDate(summary?.lastScanDate)}</p>
        </div>
    </div>
);

const SectionTitle = ({ children, color = "bg-[#1379f0]" }) => (
    <div className="flex items-center gap-2 mb-3">
        <div className={`w-1 h-4 ${color} rounded-full`} />
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">{children}</h3>
    </div>
);

const MetricCard = ({ value, label, textColor = "text-[#1379f0]", borderColor = "border-gray-200", bgColor = "" }) => (
    <div className={`rounded-lg border ${borderColor} ${bgColor} p-3 text-left`}>
        <p className={`text-xl font-bold ${textColor}`}>{value}</p>
        <p className="text-[10px] text-gray-500 uppercase font-semibold">{label}</p>
    </div>
);

const ReportFooter = () => (
    <footer className="absolute bottom-6 left-6 right-6 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <img
                src="https://suite.snapsec.co/media/logos/snapsec.svg"
                className="w-4 h-4"
                alt="SnapSec"
            />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                SnapSec ASM
            </span>
        </div>
        <a
            href="https://snapsec.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-primary"
        >
            https://snapsec.co
        </a>
    </footer>
);

// ─── Print Layout (mirrors scan-report pattern) ──────────────────────────────
const PrintLayout = ({ children, pageBreak = true, className = "" }) => (
    <div
        className={`w-[210mm] min-h-[297mm] bg-white font-sans text-[13px] relative report-page flex flex-col ${className}`}
        style={{ pageBreakAfter: pageBreak ? 'always' : 'auto' }}
    >
        <div className="max-w-5xl mx-auto p-4 lg:p-6 pb-24 flex-1 flex flex-col w-full">
            {children}
        </div>
    </div>
);

// ─── Report Content ───────────────────────────────────────────────────────────
const AssetOverviewSection = ({ assets, typewise, totalSignals, totalExposures }) => (
    <div>
        <SectionTitle>Asset Overview</SectionTitle>

        <div className="grid grid-cols-3 gap-2 mb-4">
            <MetricCard value={assets?.total || 0} label="Total Assets" />
            <MetricCard
                value={totalSignals || 0}
                label="Total Signals"
                textColor="text-yellow-500"
                borderColor="border-yellow-500/20"
                bgColor="bg-yellow-500/5"
            />
            <MetricCard
                value={totalExposures || 0}
                label="Total Exposures"
                textColor="text-red-500"
                borderColor="border-red-500/20"
                bgColor="bg-red-500/5"
            />
        </div>

        <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-xs text-left">
                <thead className="bg-gray-50/50 border-b border-gray-200">
                    <tr>
                        <th className="px-3 py-2 font-semibold text-gray-500">Asset Type</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-500">Total Assets</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-500">Total Signals</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-500">Total Exposures</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {Object.entries(typewise || assets?.byType || {}).map(([type, data]) => {
                        const count = typeof data === 'number' ? data : data?.total_assets || 0;
                        const signals = typeof data === 'number' ? 0 : data?.total_signals || 0;
                        const exposures = typeof data === 'number' ? 0 : data?.total_exposures || 0;
                        return (
                            <tr key={type}>
                                <td className="px-3 py-1.5 font-medium">{ASSET_TYPE_LABELS[type] || type}</td>
                                <td className="px-3 py-1.5 text-right">
                                    <span className="bg-[#1379f0]/10 text-[#1379f0] px-2 py-0.5 rounded text-[11px] font-bold">
                                        {count}
                                    </span>
                                </td>
                                <td className="px-3 py-1.5 text-right">
                                    <span className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded text-[11px] font-bold">
                                        {signals}
                                    </span>
                                </td>
                                <td className="px-3 py-1.5 text-right">
                                    <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-[11px] font-bold">
                                        {exposures}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);

const ExposureStatusSection = ({ exposures }) => (
    <div>
        <SectionTitle color="bg-red-500">Exposure Status Breakdown</SectionTitle>

        <div className="grid grid-cols-3 gap-2 mb-4">
            <MetricCard value={exposures.total} label="Total Exposures" />
            <MetricCard value={exposures?.totalOpen} label="Open Exposures" textColor="text-orange-500" />
            <MetricCard value={exposures?.totalClosed} label="Resolved Exposures" textColor="text-blue-500" />
        </div>

        <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-xs text-left">
                <thead className="bg-gray-50/50 border-b border-gray-200">
                    <tr>
                        <th className="px-3 py-2 font-semibold text-gray-500">Severity Distribution on Signals</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-500">Count</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {Object.entries(exposures.bySeverity || {}).map(([severity, count]) => {
                        const colors = SEVERITY_COLORS[severity.toLowerCase()] || { text: "text-gray-600", bg: "bg-gray-100" };
                        return (
                            <tr key={severity}>
                                <td className="px-3 py-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${colors.text} ${colors.bg}`}>
                                        {severity}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-right font-bold">{count}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);

const TopExposuresSection = ({ exposures }) => {


    console.log("XXXXXXXXXXXXXXX", exposures)

    if (!exposures || exposures.length === 0) {
        return (
            <div className="mt-4 p-4 border border-dashed border-red-300 text-red-500 text-xs">
                Top Exposures Debug: array is empty or undefined. Type: {typeof exposures}
            </div>
        );
    }

    return (
        <div>
            <SectionTitle color="bg-orange-500">Top Exposures</SectionTitle>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-200">
                        <tr>
                            <th className="px-3 py-2 font-semibold text-gray-500">Signal</th>
                            <th className="px-3 py-2 font-semibold text-gray-500">Asset</th>
                            <th className="px-3 py-2 font-semibold text-gray-500">Severity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {exposures.slice(0, 5).map((exp, idx) => {
                            const signalName = exp?.ruleId?.name || exp?.rule?.name || exp?.title || exp?.name || "Unknown Signal";
                            let assetValue = exp?.associatedAsset?.value;
                            if (exp?.subdomain) assetValue = exp.subdomain;
                            else if (exp?.ip_address) assetValue = exp.ip_address;
                            else if (exp?.ip) assetValue = exp.ip;
                            else if (exp?.port) assetValue = exp.port;
                            else if (exp?.web_server) assetValue = exp.web_server;
                            else if (exp?.technology) assetValue = exp.technology;
                            else if (typeof exp?.assetId === 'object') assetValue = exp?.assetId?.value || exp?.assetId?.ip || exp?.assetId?.subdomain;
                            else if (typeof exp?.asset === 'object') assetValue = exp?.asset?.value;
                            else if (exp?.value) assetValue = exp.value;
                            else if (typeof exp?.assetId === 'string') assetValue = exp.assetId;
                            const severity = exp?.severity || exp?.ruleId?.severity || exp?.rule?.severity || "INFO";
                            const colors = SEVERITY_COLORS[severity.toLowerCase()] || { text: "text-gray-600", bg: "bg-gray-100" };

                            return (
                                <tr key={exp?._id || idx}>
                                    <td className="px-3 py-1.5 font-medium">{signalName}</td>
                                    <td className="px-3 py-1.5 text-gray-600">{assetValue}</td>
                                    <td className="px-3 py-1.5">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${colors.text} ${colors.bg}`}>
                                            {severity}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ─── Error Boundary ───────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("AsmExecutiveReport Error caught by boundary:", error, errorInfo);
        window.isPdfReady = true;
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-20 text-center bg-white min-h-screen">
                    <h1 className="text-2xl font-bold text-red-600">Something went wrong while rendering the report.</h1>
                    <p className="mt-4">The PDF generation will proceed with the available data.</p>
                    <pre>{JSON.stringify(this.state.error, null, 2)}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

// ─── Main Component ───────────────────────────────────────────────────────────
function AsmExecutiveReport() {
    const [params] = useSearchParams();

    const [reportData, setReportData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isError, setIsError] = React.useState(false);

    const accessToken = params.get("accessToken");
    const reportId = params.get("reportId");
    const viewMode = params.get("view_mode");
    const hasFetched = React.useRef(false);

    async function fetchReportData() {
        // Match vulnerability-report.jsx: Default to internal URL unless explicitly "web"
        let activeBaseUrl = "";
        if (viewMode === "web") {
            activeBaseUrl = externalApiBaseUrl;
        } else {
            activeBaseUrl = internalApiBaseUrl;
        }

        console.log("Fetching ASM Report data from:", activeBaseUrl);

        const searchParams = new URLSearchParams();
        if (accessToken) searchParams.set("accessToken", accessToken);
        if (reportId) searchParams.set("reportId", reportId);

        try {
            const response = await fetch(`${activeBaseUrl}?${searchParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : '',
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}. Details: ${errorText}`);
            }

            const result = await response.json();
            setReportData(result?.data);
            setIsError(false);
        } catch (err) {
            console.error("Failed to fetch ASM report data:", err);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!hasFetched.current) {
            fetchReportData();
            hasFetched.current = true;
        }
    }, [accessToken, reportId, viewMode]);

    const summary = reportData?.data?.summary || reportData?.summary;
    const topExposures = reportData?.data?.summary?.top_exposures || reportData?.top_exposures || reportData?.data?.topExposures || reportData?.topExposures || [];
    const orgDetails = reportData?.orgDetails;

    const { statusMessage } = useReportReady({
        loading: isLoading,
        data: summary,
        error: isError,
        options: { readyDelay: 1000 }
    });

    if (isError) {
        return (
            <div className="w-screen h-screen flex flex-col justify-center items-center gap-4 bg-white">
                <div className="text-red-600 font-bold text-xl">Failed to Load Report (API returned error)</div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="w-[100vw] bg-gray-50 p-4 font-sans flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center p-8 bg-white shadow-xl rounded-lg">
                    <svg className="animate-spin h-8 w-8 text-[#1379f0] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-lg text-gray-700 font-medium">Generating Executive Report...</p>
                    <p className="text-sm text-gray-400 mt-1 font-mono uppercase tracking-widest">{statusMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="w-full flex flex-col items-center print:bg-white bg-white" style={{
                'backgroundColor': 'white',
            }}>
                <div className="min-h-screen bg-white" style={{
                    width: "230mm",
                    minHeight: "297mm",
                    minWidth: "230mm"
                }}>
                    <PrintLayout pageBreak={false}>
                        <ReportHeader summary={summary} />

                        <div className="space-y-6 pb-8">
                            {/* Asset Overview */}
                            <div>
                                <AssetOverviewSection
                                    assets={summary?.assets}
                                    typewise={reportData?.data?.summary?.typeWise || reportData?.typewise || summary?.typewise}
                                    totalSignals={summary?.exposures?.totalSignals}
                                    totalExposures={summary?.exposures?.total}
                                />
                            </div>

                            {/* Divider */}
                            <div className="border border-gray-200 w-full mt-2 mb-2" />

                            {/* Exposure Breakdown */}
                            <div>
                                <ExposureStatusSection exposures={summary.exposures} />
                            </div>

                            {/* Top Exposures */}
                            <div>
                                <TopExposuresSection exposures={topExposures} />
                            </div>
                        </div>

                        <ReportFooter />
                    </PrintLayout>
                </div>
            </div>
        </ErrorBoundary>
    );
}

export default AsmExecutiveReport;