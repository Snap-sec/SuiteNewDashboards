// AssetReport.jsx
import React, { useEffect, useMemo, useState } from "react";
import appConfig from "@/config/appConfig";
import { useSearchParams } from "react-router-dom";
import { useReportReady } from "@/hooks/use-report-ready";
import ColumnGraph from "@/components/custom/charts/column-graph";
import PieChart from "@/components/custom/charts/pie-chart";
import Editor from "@/components/custom/Editor"; // optional: used for markdown rendering in vuln pages

const EXTERNAL_CONFIG = {};

const externalApiUrl = `${appConfig.BASE_URL}/csm/api/reports/data/asset`;
const internalApiUrl = `http://vm/api/reports/data/asset`;

// ---------------- helper functions ----------------
const severityFromScore = (score) => {
  const s = Number(score || 0);
  if (s === 0 || Number.isNaN(s)) return "none";
  if (s < 4.0) return "low";
  if (s < 7.0) return "medium";
  if (s < 9.0) return "high";
  return "critical";
};

const computeSeverityCounts = (vulns) => {
  const counts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    none: 0,
    open: 0,
    resolved: 0,
  };

  (vulns || []).forEach((v) => {
    const sev = severityFromScore(v.cvssScore);
    if (counts[sev] !== undefined) counts[sev] += 1;

    if (["In Review", "Re-test", "In Progress"].includes(v.state)) {
      counts.open += 1;
    } else {
      counts.resolved += 1;
    }
  });

  return counts;
};

const computeAssetTypeCounts = (vulns) => {
  const map = {};
  (vulns || []).forEach((v) => {
    (v.affectedAssets || []).forEach((a) => {
      const t = a.type || "Unknown";
      if (!map[t]) map[t] = 0;
      map[t] += 1;
    });
  });
  return map;
};

const toPascalCase = (str) =>
  (str || "")
    .replace(/[_\- ]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

const getSeverityColor = (rating) => {
  const r = (rating || "").toLowerCase();
  if (r === "critical") return "bg-red-600";
  if (r === "high") return "bg-orange-500";
  if (r === "medium") return "bg-yellow-500";
  if (r === "low") return "bg-blue-500";
  return "bg-gray-500";
};

// ---------------- small subcomponents ----------------
const PageHeader = ({ staticPosition = false }) => (
  <div
    className={
      staticPosition ? "w-full flex justify-end items-center" : "absolute top-0 left-0 m-6 flex justify-end items-center"
    }
  >
    <p className="text-xs">Audit Report</p>
  </div>
);

const SocialLink = ({ href, label, type }) => (
  <a href={href} target="_blank" rel="noreferrer" className="flex flex-col gap-0.5 justify-center items-center">
    <div className="w-5 h-5 border border-black rounded-full flex items-center justify-center text-[10px]">
      {type === "web" && "W"}
      {type === "x" && "X"}
      {type === "instagram" && "I"}
    </div>
    <span className="font-medium text-xs">{label}</span>
  </a>
);

const SocialBlock = () => (
  <div className="flex items-center gap-6">
    <SocialLink href="https://www.snapsec.co" label="snapsec.co" type="web" />
    <SocialLink href="https://x.com/snap_sec" label="snap_sec" type="x" />
    <SocialLink href="https://www.instagram.com/snap.sec/" label="snap.sec" type="instagram" />
  </div>
);

const EmptyChartPlaceholder = () => (
  <div className="flex flex-col justify-center items-center h-[250px] text-muted-foreground text-sm">
    <p>No data available</p>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-center gap-4">
    <p className="text-sm font-medium w-44">{label} :</p>
    <p className="font-bold text-lg">{value}</p>
  </div>
);

// PrintLayout (table-based header to prevent header splitting)
const PrintLayout = ({ children, pageBreak = true, className = "" }) => (
  <div
    className={`w-full bg-white font-sans relative report-page ${className}`}
    style={{
      pageBreakAfter: pageBreak ? "always" : "auto",
      minHeight: "297mm",
      width: "210mm",
    }}
  >
    <table className="w-full h-full">
      <thead className="table-header-group">
        <tr>
          <td>
            <div className="px-16 pt-12 pb-2">
              <PageHeader staticPosition={true} />
            </div>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="align-top">
            <div className="px-16 pb-16">{children}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

// ---------------- Error Boundary ----------------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AssetReport Error caught by boundary:", error, errorInfo);
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

// ---------------- main AssetReport ----------------
const AssetReport = () => {
  const [params] = useSearchParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState(false);

  let viewMode = params.get("view_mode");
  let forceExternal = params.get("force_external_api") === "true";
  if (viewMode === "web" || forceExternal) {
    EXTERNAL_CONFIG.BASE_URL = externalApiUrl;
  } else {
    EXTERNAL_CONFIG.BASE_URL = internalApiUrl;
  }

  async function fetchReportData() {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();
      searchParams.set("accessToken", params.get("accessToken"));
      searchParams.set("assetType", params.get("asset_type") || params.get("assetType"));

      const url = `${EXTERNAL_CONFIG.BASE_URL}?${searchParams.toString()}`;
      const resp = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!resp.ok) {
        const t = await resp.text().catch(() => "");
        throw new Error(`Fetch failed: ${resp.status} ${t}`);
      }
      const json = await resp.json();
      setReportData(json.data || json);
      // allow render to settle
    } catch (e) {
      console.error("AssetReport fetch error:", e);
      setErr(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);




  const { statusMessage } = useReportReady({
    loading,
    data: reportData,
    error,
    options: { readyDelay: 1000 }
  });






  // Ensure we compute these even if loading (hooks order)
  const vulnDetails = reportData?.vulnDetails || [];
  const severityCounts = useMemo(() => computeSeverityCounts(vulnDetails), [vulnDetails]);
  const assetTypeCounts = useMemo(() => computeAssetTypeCounts(vulnDetails), [vulnDetails]);

  if (loading) {
    return (
      <div className="w-[100vw] bg-gray-50 p-4 font-sans flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center p-8 bg-white shadow-xl rounded-lg">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-gray-700 font-medium">Generating Asset Report...</p>
          <p className="text-sm text-gray-400 mt-1 font-mono uppercase tracking-widest">{statusMessage}</p>
        </div>
      </div>
    );
  }

  // Define a replacer to only show top-level keys and values for debugging
  const replacer = (key, value) => {
    if (key === "") return value; // Root object
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) return `[Array(${value.length})]`;
      return '{...}';
    }
    return value;
  };

  if (!reportData || Object.keys(reportData).length === 0) {
    return (
      <div className="w-[100vw] bg-gray-50 p-4 font-sans flex items-center justify-center min-h-screen">
        <div className="max-w-2xl w-full flex flex-col items-center p-12 bg-white shadow-xl rounded-2xl border border-gray-100">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Found</h2>
          <p className="text-gray-600 text-center mb-8 leading-relaxed">
            We couldn&apos;t find any report data for the provided parameters.
            This might happen if the report is still being processed or if the parameters are incorrect.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95 mb-10"
          >
            Retry Fetch
          </button>

          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Raw Response (Top-level)</span>
              <span className="px-2 py-1 bg-gray-100 text-[10px] font-medium text-gray-500 rounded">Debug View</span>
            </div>
            <pre className="w-full p-6 bg-gray-900 text-indigo-300 text-sm rounded-xl overflow-auto border border-gray-800 shadow-inner max-h-64 font-mono">
              {JSON.stringify(reportData, replacer, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  // extracted values
  const orgDetails = reportData?.orgDetails || {};
  const assessmentDetails = reportData?.assessmentDetails || reportData?.assessmentDetails || {};
  const assetData = reportData?.assetData || {};
  const companyName = assetData?.companyName || orgDetails?.name || "Client";
  const assetType = assetData?.assetType || "asset";
  const pascalAssetType = toPascalCase(assetType);
  const startDateStr = assetData?.firstAssessmentStartDate || "N/A";
  const endDateStr = assetData?.lastAssessmentEndDate || "N/A";
  const noOfAssessments = assetData?.noOfAssessments || vulnDetails.length || 0;
  const totalVulns = assetData?.totalVulns || vulnDetails.length || 0;

  // charts
  const openResolvedSeries = [{ name: "Vulnerabilities", data: [severityCounts.open, severityCounts.resolved] }];
  const openResolvedCategories = ["Open", "Resolved"];
  const severityBarSeries = [
    { name: "Vulnerabilities", data: [severityCounts.critical, severityCounts.high, severityCounts.medium, severityCounts.low] },
  ];
  const severityBarCategories = ["Critical", "High", "Medium", "Low"];
  const assetTypes = Object.keys(assetTypeCounts);
  const assetSeries = [{ name: "Vulnerabilities by Asset Type", data: assetTypes.map((t) => assetTypeCounts[t]) }];

  // dynamic page numbering base for vuln pages
  const baseVulnPageNum = 8;
  const methodologyPageNum = baseVulnPageNum + vulnDetails.length + 0;
  const conclusionPageNum = methodologyPageNum + 1;
  const contactsPageNum = conclusionPageNum + 1;
  const referencesPageNum = contactsPageNum + 1;

  // ---------------- page components ----------------

  const PageCover = () => {



    let website_url = reportData?.orgDetails?.website || "";

    if (website_url && (website_url.startsWith("http://") || website_url.startsWith("https://"))) {
      try {
        website_url = new URL(website_url).hostname;
      } catch (e) {
        website_url = "";
      }
    } else if (website_url) {
      try {
        website_url = new URL("https://" + website_url).hostname;
      } catch (e) {
        website_url = "";
      }
    }

    return (
      <div className="min-h-screen w-full bg-white p-16 font-sans relative report-page" style={{ pageBreakAfter: "always" }}>
        <PageHeader />
        <div className="absolute top-8 right-8 flex flex-col items-center">
          <img
            className="h-15"
            src={ reportData?.assessmentDetails?.vendorId?.logo_url || 'https://suite.snapsec.co/media/logos/snapsec.svg'}
            alt={reportData?.assessmentDetails?.vendorId?.name || 'Snapsec'}
          />
          <p className="font-bold tracking-wider mt-2">{reportData?.assessmentDetails?.vendorId?.name || 'Snapsec'}</p>
        </div>

        <div className="text-center mt-20 z-10">
          <h1 className="text-black text-6xl font-bold leading-tight mb-4">
            <span className="assetType">{pascalAssetType}</span> Security Report
          </h1>

          <h3 className="text-2xl text-gray-600 mt-4">{companyName}</h3>

          <p className="font-medium mt-6 text-sm text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Confidential — This report contains proprietary security assessment information. The contents are intended only for the client and authorized stakeholders.
          </p>

          <div className="mt-12">
            <p className="text-sm text-gray-700">Assessment Period: <b>{startDateStr}</b> — <b>{endDateStr}</b></p>
            <p className="text-sm text-gray-700 mt-2">No. of Assessments: <b>{noOfAssessments}</b></p>
            <p className="text-sm text-gray-700 mt-2">Total Vulnerabilities: <b>{totalVulns}</b></p>
          </div>
        </div>

        <div className="absolute bottom-6 left-6">
          <SocialBlock />
        </div>

        <div className="absolute bottom-6 right-6 border border-black">
          <p className="px-6 py-2 text-sm font-medium uppercase tracking-wider">{new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        </div>
      </div>
    )
  };

  const PageReportDetails = () => (
    <PrintLayout>
      <h2 className="text-4xl font-bold mt-2">Report Details</h2>

      <table className="w-full table-auto border-collapse mt-6 rounded-lg">
        <tbody>
          <tr className="bg-gray-100 rounded-lg">
            <th className="text-left font-medium text-gray-800 py-2 px-4 rounded-l-lg">Assessment Name</th>
            <td className="text-gray-700 py-2 px-4 rounded-r-lg">{assessmentDetails?.title || `${pascalAssetType} Assessment`}</td>
          </tr>
          <tr>
            <th className="text-left font-medium text-gray-800 py-2 px-4">Start Date</th>
            <td className="text-gray-700 py-2 px-4">{startDateStr}</td>
          </tr>
          <tr className="bg-gray-100">
            <th className="text-left font-medium text-gray-800 py-2 px-4 rounded-l-lg">End Date</th>
            <td className="text-gray-700 py-2 px-4 rounded-r-lg">{endDateStr}</td>
          </tr>
          <tr>
            <th className="text-left font-medium text-gray-800 py-2 px-4">Scan Source</th>
            <td className="text-gray-700 py-2 px-4">{vulnDetails?.[0]?.reportOrigin || "N/A"}</td>
          </tr>
        </tbody>
      </table>
    </PrintLayout>
  );

  const PageTOC = () => (
    <PrintLayout>
      <div className="font-bold text-4xl tracking-wider mt-5">Table of Contents</div>

      <div className="mt-6">
        <ol className="list-decimal pl-6 space-y-2">
          <li>Executive Summary</li>
          <li>Scope</li>
          <li>Graphical Summary</li>
          <li>List of Vulnerabilities</li>
          <li>Vulnerability Detail Pages</li>
          <li>Methodology</li>
          <li>Conclusion</li>
          <li>Contacts</li>
          <li>References</li>
        </ol>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">Vulnerabilities (Quick List)</h3>
        <div className="mt-3 max-h-48 overflow-y-auto pr-2">
          <ol className="list-decimal pl-6 space-y-1 text-sm">
            {vulnDetails.map((v, i) => (
              <li key={v._id || i}>{v.title}</li>
            ))}
          </ol>
        </div>
      </div>
    </PrintLayout>
  );

  const PageExecutiveSummary = () => (
    <PrintLayout>
      <div className="font-bold text-4xl tracking-wider mt-5">Executive Summary</div>

      <div className="mt-6 space-y-4">
        <p className="text-black/80">
          This report consolidates findings for <b>{pascalAssetType}</b> assets of <b>{companyName}</b>. It summarizes the
          latest vulnerabilities identified across scans, provides graphical summaries, and prioritizes remediation recommendations.
        </p>

        <p className="text-black/80">
          The report includes a list of identified vulnerabilities, detailed vulnerability pages, methodology, and contacts for remediation support.
        </p>
      </div>
    </PrintLayout>
  );

  const PageScope = () => (
    <PrintLayout>
      <div className="font-bold text-4xl tracking-wider mt-5">Scope</div>

      <p className="mt-4 text-black/80 leading-relaxed">
        The assessment focused on identified <b>{pascalAssetType}</b> assets for <b>{companyName}</b>. Any additional assets discovered during scanning were included to ensure full coverage.
      </p>

      <div className="mt-6">
        <p className="font-medium">Assets covered (summary):</p>
        <ul className="list-disc pl-8 mt-2">
          {assetTypes.length > 0 ? assetTypes.map((t) => <li key={t}>{toPascalCase(t)}</li>) : <li>{pascalAssetType}</li>}
        </ul>
      </div>
    </PrintLayout>
  );

  const PageGraphicalSummary = () => (
    <PrintLayout>
      <div className="font-bold text-4xl tracking-wider mt-5">Graphical Summary</div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p className="font-medium mb-2">Open vs Resolved</p>
          <div className="bg-[#e9eef5] p-4 rounded-lg">
            {vulnDetails.length ? (
              <ColumnGraph series={openResolvedSeries} xCategories={openResolvedCategories} height={260} showLegend={false} animated={false} />
            ) : (
              <EmptyChartPlaceholder />
            )}
          </div>
        </div>

        <div>
          <p className="font-medium mb-2">Severity Breakdown</p>
          <div className="bg-[#e9eef5] p-4 rounded-lg">
            {vulnDetails.length ? <ColumnGraph series={severityBarSeries} xCategories={severityBarCategories} height={260} showLegend={false} animated={false} /> : <EmptyChartPlaceholder />}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="font-medium mb-2">Vulnerabilities by Asset Type</p>
        <div className="bg-[#e9eef5] p-4 rounded-lg">
          {assetTypes.length ? <ColumnGraph series={assetSeries} xCategories={assetTypes} height={260} showLegend={false} animated={false} /> : <EmptyChartPlaceholder />}
        </div>
      </div>
    </PrintLayout>
  );

  const PageVulnList = () => (
    <PrintLayout>
      <h2 className="text-4xl font-bold mt-2">List Of Vulnerabilities</h2>
      <p className="mt-4 text-black/80">The following vulnerabilities were identified across scanned assets.</p>

      <div className="mt-6">
        <table className="table-auto w-full text-left whitespace-no-wrap mt-4">
          <thead>
            <tr>
              <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">#</th>
              <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">TITLE</th>
              <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">SEVERITY</th>
              <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">CVSS SCORE</th>
            </tr>
          </thead>
          <tbody>
            {vulnDetails.map((v, i) => (
              <tr key={v._id || i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{v.title}</td>
                <td className="px-4 py-2">{severityFromScore(v.cvssScore)}</td>
                <td className="px-4 py-2">{v.cvssScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PrintLayout>
  );

  // parse markdown minimal helper for vuln pages (keeps Editor as fallback)
  const renderMarkdownOrEditor = (md) => {
    if (!md) return <p className="text-sm">No details provided.</p>;
    // If Editor component exists and supports readOnly: use it, otherwise fallback to pre block
    try {
      return <Editor defaultValue={md} readOnly={true} />;
    } catch (e) {
      return <pre className="whitespace-pre-wrap text-sm">{md}</pre>;
    }
  };

  const VulnerabilityDetailPage = ({ v, idx }) => (
    <PrintLayout>
      <div className="font-bold text-3xl tracking-wider mt-2 mb-4">{v.title}</div>

      <div className="flex items-center gap-4 mb-6">
        <div className={`px-4 py-2 text-white font-semibold rounded ${getSeverityColor(v.cvssRating)}`}>{(v.cvssRating || "").toUpperCase()}</div>
        <div className="text-sm"><span className="font-semibold">CVSS Score:</span> {v.cvssScore}</div>
        <div className="text-sm"><span className="font-semibold">Status:</span> {v.state}</div>
      </div>

      <div className="mt-4 space-y-6">
        <div>
          <h4 className="font-semibold text-lg">Summary</h4>
          <div className="text-sm mt-2">{v.description || v.fullMarkdownReport || "No description provided."}</div>
        </div>

        <div>
          <h4 className="font-semibold text-lg">Steps To Reproduce</h4>
          <div className="text-sm mt-2 whitespace-pre-line">{v.stepsToReproduce || "Not provided."}</div>
        </div>

        <div>
          <h4 className="font-semibold text-lg">Impact</h4>
          <div className="text-sm mt-2 whitespace-pre-line">{v.impact || "Not provided."}</div>
        </div>

        <div>
          <h4 className="font-semibold text-lg">Technical Details / Full Report</h4>
          <div className="mt-2">{renderMarkdownOrEditor(v.fullMarkdownReport)}</div>
        </div>

        {v.attachments?.length > 0 && (
          <div>
            <h4 className="font-semibold text-lg">Attachments / Screenshots</h4>
            <div className="mt-2 grid grid-cols-1 gap-4">
              {v.attachments.map((a, i) => (
                <img key={i} src={a} alt={`attachment-${i}`} className="w-full h-auto max-h-[600px] object-contain border mb-4" />
              ))}
            </div>
          </div>
        )}
      </div>
    </PrintLayout>
  );

  const MethodologyPage = () => (
    <PrintLayout>
      <div className="font-bold text-4xl tracking-wider mt-5">Methodology Used</div>

      <div className="mt-6 tracking-wider space-y-4">
        <p className="font-medium">
          The assessment followed an approach combining automated scans and manual validation to ensure each finding was validated and prioritized.
        </p>

        <ul className="list-decimal pl-6 space-y-3 mt-4 text-sm">
          <li><b>Reconnaissance & Asset Profiling</b> — mapping exposed assets and services.</li>
          <li><b>Automated Scanning</b> — vulnerability scanning & SCA/image scanning.</li>
          <li><b>Manual Verification</b> — reproduce and validate findings.</li>
          <li><b>Reporting</b> — technical details and remediation guidance.</li>
        </ul>
      </div>
    </PrintLayout>
  );

  const ConclusionPage = () => (
    <PrintLayout>
      <div className="font-bold text-4xl tracking-wider mt-5">Conclusion</div>

      <div className="mt-6 text-black/80">
        <p className="font-medium">
          This report summarizes the consolidated results across assessment runs. A total of <b>{totalVulns}</b> vulnerabilities were identified.
          Prioritize remediation for critical and high issues to reduce immediate risk. Continuous scanning and timely patching are recommended.
        </p>
      </div>
    </PrintLayout>
  );

  const ContactsPage = () => (
    <PrintLayout>
      <div className="font-bold text-4xl tracking-wider mt-5">Contacts</div>

      <div className="mt-6">
        <table className="w-full table-auto border-collapse mt-4 rounded-lg">
          <tbody>
            <tr className="bg-gray-100 rounded-lg">
              <th className="text-left font-medium text-gray-800 py-2 px-4 rounded-l-lg">Imran Parray</th>
              <td className="text-gray-700 py-2 px-4">imran@snapsec.co</td>
              <td className="text-gray-700 py-2 px-4 rounded-r-lg">Senior Cyber Security Consultant</td>
            </tr>
            <tr>
              <th className="text-left font-medium text-gray-800 py-2 px-4">Support Team</th>
              <td className="text-gray-700 py-2 px-4">support@snapsec.co</td>
              <td className="text-gray-700 py-2 px-4">Snapsec Support Team</td>
            </tr>
            <tr className="bg-gray-100">
              <th className="text-left font-medium text-gray-800 py-2 px-4 rounded-l-lg">Mubashir Mehraj</th>
              <td className="text-gray-700 py-2 px-4">mubashir@snapsec</td>
              <td className="text-gray-700 py-2 px-4 rounded-r-lg">Technical Support</td>
            </tr>
          </tbody>
        </table>
      </div>
    </PrintLayout>
  );

  const ReferencesPage = () => (
    <PrintLayout>
      <div className="font-bold text-4xl tracking-wider mt-5">References</div>

      <div className="mt-6">
        <p className="text-black/80">Vendor advisories, CVE pages, and NVD entries were used as primary reference sources. See individual vulnerability pages for the complete reference lists.</p>

        <div className="mt-4 space-y-1">
          <p>Website: <a className="font-medium" href="https://www.snapsec.co">snapsec.co</a></p>
          <p>Blog: <a className="font-medium" href="https://blog.snapsec.co">blog.snapsec.co</a></p>
          <p>Twitter/X: <a className="font-medium" href="https://x.com/snap_sec">@snap_sec</a></p>
        </div>
      </div>
    </PrintLayout>
  );

  const PageEnd = () => (
    <div className="min-h-screen w-full bg-white p-16 font-sans relative report-page">

      <div className="w-full h-full flex items-center justify-center mt-[40%]">
        <p className="font-medium text-3xl">END OF DOCUMENT</p>
      </div>
    </div>
  );

  // ---------------- assemble pages ----------------
  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen flex flex-col items-center" style={{ backgroundColor: "white" }}>
        <div className="min-h-screen bg-white" style={{ width: "210mm", minHeight: "297mm", minWidth: "210mm" }}>
          <PageCover />
          <PageReportDetails />
          <PageTOC />
          <PageExecutiveSummary />
          <PageScope />
          <PageGraphicalSummary />
          <PageVulnList />

          {/* dynamic vuln pages */}
          {vulnDetails.length > 0 &&
            vulnDetails.map((v, idx) => <VulnerabilityDetailPage key={v._id || idx} v={v} idx={idx} />)}

          <MethodologyPage />
          <ConclusionPage />
          <ContactsPage />
          <ReferencesPage />
          <PageEnd />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AssetReport;
