import React, { useState, useEffect, useMemo, useRef } from 'react';
import appConfig from "@/config/appConfig";
import { useSearchParams } from 'react-router-dom';
import { useReportReady } from "@/hooks/use-report-ready";
import { pdfDebug } from '@/lib/pdf-debug';
import PieChart from '@/components/custom/charts/pie-chart';
import ColumnGraph from '@/components/custom/charts/column-graph';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Component from "./components/graph";

const EXTERNAL_CONFIG = {};

const externalApiUrl = `${appConfig.BASE_URL}/csm/api/reports/data/revalidation`;
const internalApiUrl = `http://vm/api/reports/data/revalidation`;


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("RevalidationReport Error caught by boundary:", error, errorInfo);
    pdfDebug.error(error, { errorInfo, context: "ErrorBoundary" });
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

const RevalidationReport = () => {

  const [reportData, setReportData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingReportData, setLoadingReportData] = useState(true);
  const [reportError, setReportError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const hasFetched = useRef(false);

  const [params, setParams] = useSearchParams();

  let viewMode = params.get("view_mode");
  if (viewMode === "web") {
    EXTERNAL_CONFIG.BASE_URL = externalApiUrl;
  } else {
    EXTERNAL_CONFIG.BASE_URL = internalApiUrl;
  }

  async function fetchReportData() {
    console.log("Attempting to fetch data from:", appConfig);
    pdfDebug.dataFetchStarted();

    try {
      const searchParams = new URLSearchParams();
      searchParams.set("assessmentId", params.get("assessmentId"));
      searchParams.set("accessToken", params.get("accessToken"));

      const url = `${EXTERNAL_CONFIG.BASE_URL}?${searchParams.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}. Details: ${errorText}`);
      }

      const data = await response.json();
      setReportData(data?.data);
      setTotalPages(data?.data?.vulnDetails?.length || 4);
      setReportError(false);
      console.log("Successfully fetched report data.");
      pdfDebug.dataFetchCompleted(data?.data);

    } catch (err) {
      console.error("Failed to fetch report data (likely CORS/network error in sandbox). Using static fallback data.", err);
      setReportError(true);
      pdfDebug.error(err, { context: "fetchReportData" });
    } finally {
      setLoadingReportData(false);
    }
  }

  useEffect(() => {
    pdfDebug.pageLoaded();
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
      <div className="w-[100vw] bg-gray-50 p-4 font-sans flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center p-8 bg-white shadow-xl rounded-lg">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-gray-700 font-medium">Generating Revalidation Report...</p>
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
            We couldn&apos;t find any report data for the provided assessment ID.
            This might happen if the report is still being processed or if the ID is incorrect.
          </p>

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

  const revalidated_vulns = reportData?.vulnDetails?.filter(v => ["Resolved", "Fixed In Staging", "False Positive"].includes(v.state));

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getSeverityColor = (rating) => {
    const colors = {
      critical: 'bg-red-600',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500',
      info: 'bg-gray-500'
    };
    return colors[rating?.toLowerCase()] || 'bg-gray-500';
  };

  const hasCustomField = (value) => typeof value === "string" && value.trim().length > 0;
  const renderCustomHtml = (value) => ({ __html: value?.replace?.(/\n/g, "<br />") });



  const PageHeader = ({ staticPosition = false }) => (
    <div className={`${staticPosition ? 'w-full flex mb-4' : 'absolute top-0 left-0 m-6 flex'} justify-between items-center gap-4`}>
      <p className="text-xs">Revalidation Report</p>
    </div>
  );


  const PrintLayout = ({ children, pageBreak = true, className = "" }) => (
    <div className={`w-full bg-white font-sans relative report-page ${className}`} style={{
      pageBreakAfter: pageBreak ? 'always' : 'auto',
      minHeight: '297mm',
      width: '210mm'
    }}>
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
              <div className="px-16 pb-16">
                {children}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const Page1 = () => {

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
      <div className="min-h-screen w-full bg-white p-16 font-sans relative report-page" style={{ pageBreakAfter: 'always' }}>
        <PageHeader />

        <div className="absolute top-8 right-8 flex justify-center flex-col items-center">
          <img
            className="h-15"
            src={reportData?.assessmentDetails?.vendorId?.logo_url || 'https://suite.snapsec.co/media/logos/snapsec.svg'}
            // style={{ filter: 'grayscale(100%)' }}
            alt={reportData?.assessmentDetails?.vendorId?.name || 'Snapsec'}
          />
          <p className="font-bold tracking-wider">{reportData?.assessmentDetails?.vendorId?.name || 'Snapsec'}</p>
        </div>

        <div className="mt-[50%] w-[100%] text-center">
          <h1 className="text-black text-6xl font-bold leading-tight mb-4 flex flex-col">
            <span>Revalidation Report</span>
            <span className="text-black text-[16px] font-normal">
              {reportData?.assessmentDetails?.customReport?.title || reportData?.assessmentDetails?.title || `${reportData?.orgDetails?.name} Revalidation Report`}
            </span>
          </h1>
        </div>

        <div className="text-center mt-16 space-y-1">
          {
            hasCustomField(reportData?.assessmentDetails?.customReport?.author) &&
            <p className="text-sm"> Author: {reportData?.assessmentDetails?.customReport?.author}</p>
          }

          {
            hasCustomField(reportData?.assessmentDetails?.customReport?.reviewer) &&
            <p className="text-sm"> Reviewer: {reportData?.assessmentDetails?.customReport?.reviewer}</p>
          }


          <p className="font-medium mt-6 text-sm text-[#ff0000] leading-relaxed max-w-2xl mx-auto">
            <b>Confidentiality Notice:</b> This document contains proprietary information belonging to {reportData?.orgDetails?.name} and is intended solely for the authorized recipient. Unauthorized copying, sharing, or distribution is strictly prohibited and may result in legal action.
          </p>

          {/* 
        <div className="absolute bottom-0 left-0 m-6 flex items-center gap-4">
          <div>
            <a href="https://www.snapsec.co" target="_blank" rel="noopener noreferrer"
              className="flex flex-col gap-0.5 justify-center items-center">
              <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#000000" strokeLinejoin="round" />
                <path d="M12 3C12 3 8.5 6 8.5 12C8.5 18 12 21 12 21" stroke="#000000" strokeLinejoin="round" />
                <path d="M12 3C12 3 15.5 6 15.5 12C15.5 18 12 21 12 21" stroke="#000000" strokeLinejoin="round" />
                <path d="M3 12H21" stroke="#000000" strokeLinejoin="round" />
              </svg>
              <span className="font-medium">snapsec.co</span>
            </a>
          </div>
        </div>

          <div>
            <a href="https://x.com/snap_sec" target="_blank" rel="noopener noreferrer"
              className="flex flex-col gap-0.5 justify-center items-center">
              <svg width="20px" height="20px" viewBox="0 0 50 50">
                <path d="M 11 4 C 7.1456661 4 4 7.1456661 4 11 L 4 39 C 4 42.854334 7.1456661 46 11 46 L 39 46 C 42.854334 46 46 42.854334 46 39 L 46 11 C 46 7.1456661 42.854334 4 39 4 L 11 4 z M 13.085938 13 L 22.308594 26.103516 L 13 37 L 15.5 37 L 23.4375 27.707031 L 29.976562 37 L 37.914062 37 L 27.789062 22.613281 L 36 13 L 33.5 13 L 26.660156 21.009766 L 21.023438 13 L 13.085938 13 z" />
              </svg>
              <span className="font-medium">snap_sec</span>
            </a>
          </div>

          <div>
            <a href="https://www.instagram.com/snap.sec/" target="_blank" rel="noopener noreferrer"
              className="flex flex-col gap-0.5 justify-center items-center">
              <svg width="20px" height="20px" viewBox="0 0 50 50">
                <path d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z" />
              </svg>
              <span className="font-medium">snap.sec</span>
            </a>
          </div>
        </div> */}

          <div className="absolute bottom-0 right-0 m-6">
            <p className="px-6 py-2 text-sm font-medium uppercase tracking-wider">
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>
    )
  };

  const Page2 = () => (
    <PrintLayout>
      <div className="font-medium text-2xl tracking-wider mt-5">
        <p>Table of Contents</p>
      </div>

      <div className="font-mediumtext-xl tracking-wider mt-5">
        <p>1. Executive Summary</p>
      </div>

      <div className="tracking-wider mt-1 px-12">
        <ul className="font-medium text-sm list-decimal space-y-2">
          <li>Introduction</li>
          <li>Assessment Details</li>
          <li>Scope</li>
          <li>Graphical Summary</li>
        </ul>
      </div>

      <div className="font-mediumtext-xl tracking-wider mt-2">
        <p>2. List of Vulnerabilities</p>
      </div>

      <div className="font-mediumtext-xl tracking-wider mt-0">
        <p>3. Methodology Used</p>
        <p>4. Conclusion</p>
        <p>5. Contacts</p>
      </div>
    </PrintLayout>
  );

  const PageReportDetail = () => (
    <PrintLayout pageBreak={false}>
      <div className="font-medium text-2xl tracking-wider mt-5">
        <p>Report Details</p>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h3 className="font-mediumtext-xl tracking-wider mb-3">1. Introduction</h3>
          <p className="text-sm leading-relaxed">
            This re-validation report presents the findings from our comprehensive security assessment of {reportData?.assessmentDetails?.customReport?.title || reportData.assessmentDetails.title}.
            The assessment was conducted to verify the current status of previously identified vulnerabilities and ensure
            that appropriate remediation measures have been implemented.
          </p>
        </div>

        {
          reportData?.assessmentDetails &&
          <div>
            <h3 className="font-mediumtext-xl tracking-wider mb-3">Report Details</h3>
            <div className="text-sm leading-relaxed space-y-2 px-6">
              <p><span className="font-semibold">Assessment Type:</span> {reportData.assessmentDetails.type}</p>
              <p><span className="font-semibold">Category:</span> {reportData.assessmentDetails.category}</p>
              <p><span className="font-semibold">Start Date:</span> {formatDate(reportData.assessmentDetails.startDate)}</p>
              <p><span className="font-semibold">Status:</span> {reportData.assessmentDetails.state}</p>
              <p><span className="font-semibold">Lead Auditor:</span> {reportData.assessmentDetails.collaborators[0]?.name}</p>
            </div>
          </div>
        }

      </div>
    </PrintLayout>
  );






  const ExecutiveSummaryPage = () => (
    <PrintLayout>
      <div className="font-bold text-4xl tracking-wider mt-5">
        <p>Executive Summary</p>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h3 className="font-semibold text-xl tracking-wider mb-3">1. Introduction</h3>

          <div className="mt-2 flex flex-col gap-6">
            {
              hasCustomField(reportData?.assessmentDetails?.customReport?.executiveSummary) ?
                <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={renderCustomHtml(reportData?.assessmentDetails?.customReport?.executiveSummary)} />
                :
                <p id="executiveSummary" className="text-sm leading-relaxed">
                  This report summarizes the results of the Vulnerability Revalidation Exercise conducted for {reportData?.orgDetails?.name}.
                  The objective of this engagement was to revalidate and verify the remediation of previously identified vulnerabilities,
                  ensuring that all fixes implemented by the development team are effective and that no residual security gaps remain.<br /><br />
                  {/* 
                  Snapsec was provided with authenticated access to the relevant assets, allowing for an in-depth testing of
                  the applied security measures within a controlled environment.
                  <br /><br /> */}

                  The report outlines the overall scope, methodology, and test parameters used during the engagement.
                  It then presents detailed results categorized by vulnerability type, along with observations and
                  verification outcomes. Where relevant, technical details, Evidences, and recommendations are included to support validation and future hardening efforts.<br />
                </p>
            }
          </div>
        </div>
      </div>
    </PrintLayout>
  );


  const customScope = reportData?.assessmentDetails?.customReport?.scope?.split?.("\n")?.filter(Boolean) || [];
  const defaultScope = reportData?.assessmentDetails?.scopeString?.split?.("\n")?.filter(Boolean) || [];

  const ScopePage = () => (
    <PrintLayout>
      <div className="font-medium text-2xl tracking-wider mt-5">
        <p>Scope</p>
      </div>

      <div className="mt-8 space-y-6">

        <div>
          <p className="text-sm leading-relaxed">
            The scope of this revalidation report was to verify the remediation of the previously identified {reportData?.vulnDetails?.length}  vulnerabilities<br /><br />
            The revalidation was conducted within the defined scope of the previously tested assets. During this exercise, any
            additional or updated assets identified within the environment were also included to ensure comprehensive verification. This
            approach allowed us to validate the security posture of both the originally assessed and newly identified components,
            confirming that all critical assets have been appropriately remediated and secured. The following list outlines the assets
            covered during the revalidation engagement:<br />
          </p>
          <div className="font-bold text-xl tracking-wider mt-5">
            <p>Scope of Assessment:</p>
          </div>

          <ul className="list-disc ml-6">
            {
              defaultScope?.length > 0 ? defaultScope?.map(s => <li>{s}</li>) :
                customScope.length > 0 &&
                <>
                  <ul className="list-disc ml-6">
                    {
                      customScope.map(s => <li>{s}</li>)
                    }
                  </ul>
                </>
            }
          </ul>
        </div>
      </div>
    </PrintLayout>
  );

  const open_close_breakdown = [
    {
      name: "Unresolved",
      value: reportData?.vulnDetails?.reduce((t, c) => !["Resolved", "Fixed In Staging", "Duplicate", "False Positive"].includes(c.state) ? t + 1 : t, 0) || 0,
    },
    {
      name: "Resolved",
      value: reportData?.vulnDetails?.reduce((t, c) => ["Resolved", "Fixed In Staging", "Duplicate", "False Positive"].includes(c.state) ? t + 1 : t, 0) || 0,
    },
  ];

  const criticalCount = reportData?.vulnDetails?.reduce((t, c) => c.cvssRating == "critical" ? t + 1 : t, 0) || 0;

  const severity_breakdown = [
    {
      name: "Critical",
      value: criticalCount,
    },
    {
      name: "High",
      value: reportData?.vulnDetails?.reduce((t, c) => c.cvssRating == "high" ? t + 1 : t, 0) || 0,
    },
    {
      name: "Medium",
      value: reportData?.vulnDetails?.reduce((t, c) => c.cvssRating == "medium" ? t + 1 : t, 0) || 0,
    },
    {
      name: "Low",
      value: reportData?.vulnDetails?.reduce((t, c) => c.cvssRating == "low" ? t + 1 : t, 0) || 0,
    },
  ];

  const state_breakdown = [
    // {
    //   name: "In Review",
    //   value: reportData?.vulnerabilities?.reduce((t, c) => c.state == "In Review" ? t + 1 : t, 0) || 0,
    // },
    // {
    //   name: "In Progress",
    //   value: reportData?.vulnerabilities?.reduce((t, c) => c.state == "In Progress" ? t + 1 : t, 0) || 0,
    // },
    {
      name: "Duplicate",
      value: reportData?.vulnDetails?.reduce((t, c) => c.state == "Duplicate" ? t + 1 : t, 0) || 0,
    },
    {
      name: "False Positive",
      value: reportData?.vulnDetails?.reduce((t, c) => c.state == "False Positive" ? t + 1 : t, 0) || 0,
    },
    {
      name: "Fixed In Staging",
      value: reportData?.vulnDetails?.reduce((t, c) => c.state == "Fixed In Staging" ? t + 1 : t, 0) || 0,
    },
    {
      name: "Resolved",
      value: reportData?.vulnDetails?.reduce((t, c) => c.state == "Resolved" ? t + 1 : t, 0) || 0,
    },
    {
      name: "Re Test",
      value: reportData?.vulnDetails?.reduce((t, c) => c.state == "Re Test" ? t + 1 : t, 0) || 0,
    },
  ];

  const GraphicalSummary = () => (
    <PrintLayout>
      <div className="font-medium text-2xl tracking-wider mt-5">
        <p>Graphical Summary</p>
      </div>

      <div className="mt-8 space-y-6 flex gap-4 items-center justify-between">
        <div class="flex items-center justify-between">
          <div class="mt-6 w-full">
            <p class="font-medium text-lg">Resolved vs Unresolved</p>
            <PieChart data={open_close_breakdown} isLoading={false} colors={['#FF4D4F', '#52C41A']} animated={false} />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="mt-6 w-full">
            <p class="font-medium text-lg">Severity Breakdown</p>
            <ColumnGraph data={severity_breakdown} isLoading={false} colors={['#D32F2F', '#F57C00', '#FBC02D', '#388E3C']} animated={false} />
          </div>
        </div>
      </div>

      <div class="w-full">
        <div class="mt-6 w-full">
          <p class="font-medium text-lg">Severity Lifecycle</p>
          <ColumnGraph data={state_breakdown} isLoading={false} animated={false} />
        </div>
      </div>
    </PrintLayout>
  );

  const VulnerabilityDetailPage = ({ vuln, pageNum }) => {

    let markdown = vuln.fullMarkdownReport;

    // find the first line that has # some text
    // and remove that line only, other lines can also have #, ##, ###
    markdown = markdown?.replace(/^# .+\n/, '');


    return (
      <PrintLayout>
        <div className="font-medium text-2xl tracking-wider mt-5 mb-6 capitalize">
          <p>{vuln.title}</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-2">
              <p className="font-medium">
                Severity :
              </p>
              <SeverityLabel severity={vuln.cvssRating} score={vuln.cvssScore} size="sm" />
            </div>

            <div className="flex items-center gap-2">
              <p className="font-medium">
                State :
              </p>
              <StateLabels state={vuln.state} />
            </div>

            {(vuln.assignee?.name || vuln.assignee?.email) &&
              <div className="flex items-center gap-2">
                <p className="font-medium">
                  Owner :
                </p>
                <span className="font-medium flex gap-1">
                  {vuln.assignee?.name}
                  {vuln.assignee?.name && vuln.assignee?.email && " - "}
                  {vuln.assignee?.email && <p className="font-normal">({vuln.assignee?.email})</p>}
                </span>
              </div>
            }

            {vuln.cvssString &&
              <div className="flex items-center gap-2">
                <p className="font-medium">
                  CVSS String :
                </p>
                <span className="font-medium">{vuln.cvssString}</span>
              </div>
            }
          </div>

          <div className=" -mt-10">
            <Component
              data={vuln.cvssScore}
              maxValue={10}
              isLoading={false}
              height={140}
              width={140}
              labels={['CVSS']}
            />
          </div>
        </div>

        <div className="space-y-6">
          {vuln.revalidation?.reason &&
            <div>
              <h3 className="font-semibold text-xl tracking-wider mb-3">Remediation Verification</h3>
              <p className="text-sm leading-relaxed whitespace-pre-line">{vuln.revalidation?.reason}</p>
            </div>
          }

          <div>
            <h3 className="font-semibold text-xl tracking-wider mb-3">Revalidation Details</h3>
            <div className="text-sm space-y-2">
              {vuln.revalidation?.date && <p><span className="font-semibold">Revalidation Date:</span> {formatDate(vuln.revalidation?.date)}</p>}
              {(vuln?.assignee?.name || vuln.assignee?.email) &&
                <p>
                  <span className="font-semibold">Vulnerability Owner:</span> {vuln?.assignee?.name} {vuln.assignee?.email && `(${vuln.assignee?.email})`}
                </p>
              }
              {/* <p><span className="font-semibold">Revalidated By:</span> {vuln?.revalidation?.revalidatedBy?.name} ({vuln.revalidation?.revalidatedBy?.email})</p> */}
              <p><span className="font-semibold">Revalidated By:</span> {reportData?.orgDetails?.name}</p>
              {vuln?.assessment?.title && <p><span className="font-semibold">Assessment Name:</span> {vuln?.assessment?.title}</p>}
              {
                vuln?.businessUnits?.at?.(0)?.name &&
                <p><span className="font-semibold">Business Unit:</span> {vuln?.businessUnits?.at?.(0)?.name || "N/A"}</p>
              }
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-xl tracking-wider mb-3">Evidence</h3>
            {vuln.revalidation.evidence && vuln.revalidation.evidence.length > 0 ? (
              <div className="w-full">
                {vuln.revalidation.evidence?.map((evidence, idx) => (
                  <img
                    key={idx}
                    src={evidence}
                    alt={`Evidence ${idx + 1}`}
                    className="border border-gray-300 rounded w-full h-auto max-h-[600px] object-contain mb-4"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm">No Evidences Provided</p>
            )}
          </div>
        </div>
      </PrintLayout>
    );
  };

  const VulnListTable = ({ vulns, isFirst, base }) => {
    return (
      <PrintLayout>
        <div className="pl-2 pr-8">
          {
            isFirst &&
            <>
              <div className="font-medium text-3xl tracking-wider mt-5">
                <p>Vulnerability List</p>
              </div>
              <p className="text-sm">
                The following section outlines the vulnerabilities that were previously identified during the initial penetration test and have been revalidated in this assessment. Each finding has been reviewed to confirm the effectiveness of the implemented remediation and to verify whether the issue has been fully resolved or requires further attention. The detailed results of the revalidation are presented below:<br /><br />
              </p>
            </>
          }
        </div>


        <table className="table-auto w-full mt-4 border border-gray-300 border-collapse rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-3 text-sm font-medium border border-gray-300 text-left">#</th>
              <th className="px-4 py-3 text-sm font-medium border border-gray-300 text-left">TITLE</th>
              <th className="px-4 py-3 text-sm font-medium border border-gray-300 text-center">SEVERITY</th>
              <th className="px-4 py-3 text-sm font-medium border border-gray-300 text-left">STATE</th>
            </tr>
          </thead>

          <tbody>
            {
              vulns?.map((vuln, idx) => {
                const getSeverityMutedStyle = (rating) => {
                  const styles = {
                    critical: "bg-rose-50 text-rose-600 border-rose-100",
                    high: "bg-orange-50 text-orange-600 border-orange-100",
                    medium: "bg-yellow-50 text-yellow-600 border-yellow-100",
                    low: "bg-sky-50 text-sky-600 border-sky-100",
                    info: "bg-slate-50 text-slate-600 border-slate-100"
                  };
                  return styles[rating?.toLowerCase()] || styles.info;
                };

                const getStateMutedStyle = (state) => {
                  const styles = {
                    "Resolved": "bg-emerald-50 text-emerald-600 border-emerald-100",
                    "Fixed In Staging": "bg-indigo-50 text-indigo-600 border-indigo-100",
                    "False Positive": "bg-rose-50 text-rose-600 border-rose-100",
                    "Duplicate": "bg-amber-50 text-amber-600 border-amber-100",
                    "Not Applicable": "bg-slate-50 text-slate-600 border-slate-100"
                  };
                  return styles[state] || "bg-slate-50 text-slate-500 border-slate-100";
                };

                return (
                  <tr key={idx} className="bg-gray-100/30 border-b border-gray-200/60">
                    <td className="px-4 py-3 text-xs text-center font-medium text-gray-400 tabular-nums">{base + idx + 1}</td>
                    <td className="px-4 py-3 text-[13px] text-left font-semibold text-gray-800">{vuln.title}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest min-w-[75px] ${getSeverityMutedStyle(vuln.cvssRating)}`}>
                        {vuln.cvssRating}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest min-w-[95px] ${getStateMutedStyle(vuln.state)}`}>
                        {vuln.state}
                      </span>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>

      </PrintLayout>
    )
  };

  const MethodologyPage = () => (
    <PrintLayout>
      <div className="font-medium text-2xl tracking-wider mt-5">
        <p>Methodology Used</p>
      </div>

      <p>
        The revalidation assessment followed a structured and methodical approach designed to verify the effectiveness of previously implemented remediation actions. The objective was to ensure that all vulnerabilities identified during the initial penetration test had been adequately fixed and no residual risks remained.
      </p>

      {
        hasCustomField(reportData?.assessmentDetails?.customReport?.methodology) ?
          <div className="text-sm leading-relaxed my-4" dangerouslySetInnerHTML={renderCustomHtml(reportData?.assessmentDetails?.customReport?.methodology)} />
          :
          <div id="methodology" class="tracking-wider mt-8">
            <ul>
              <li><b>1. Review of Previous Findings</b></li>
              <p class="font-normal text-sm mt-2">
                The engagement began with a comprehensive review of the original penetration testing report and the list of vulnerabilities previously identified. Each issue was analyzed to understand its root cause, affected components, and remediation steps recommended during the initial assessment.
              </p><br />

              <li><b>2. Verification of Fixes</b></li>
              <p class="font-normal text-sm mt-2">
                For each previously reported vulnerability, targeted validation tests were performed to confirm whether the applied fixes were effective. The same test cases, payloads, and exploitation techniques used during the original assessment were re-executed where applicable. This ensured consistency and accuracy in verification.
              </p><br />

              <li><b>3. Environment and Scope Validation</b></li>
              <p class="font-normal text-sm mt-2">
                The revalidation covered the same in-scope assets defined in the original test. Any new or updated components discovered during the exercise were also reviewed to confirm that security patches and configurations were consistently applied across the environment.
              </p><br />

              <li><b>4. Re-Testing and Analysis</b></li>
              <p class="font-normal text-sm mt-2">
                Manual and automated testing methods were employed to replicate the original attack scenarios. If a vulnerability was found to persist, further analysis was conducted to determine whether it was due to incomplete remediation, configuration changes, or a new instance of the same weakness.
              </p><br />

              <li><b>5. Reporting and Status Classification</b></li>
              <p class="font-normal text-sm mt-2">
                Each vulnerability was classified as one of the following based on its current state:<br />

                Resolved: The issue was successfully remediated and is no longer exploitable.<br />

                Not Fixed: The vulnerability persists or remediation was ineffective.<br />

                New Finding: A related or previously unseen issue identified during revalidation.<br />
              </p><br />

              <li><b>6. Recommendations</b></li>
              <p class="font-normal text-sm mt-2">
                Where applicable, additional recommendations were provided to strengthen the implemented controls, ensure long-term mitigation, and prevent recurrence of similar issues.
              </p><br />
            </ul>
          </div>
      }
    </PrintLayout>
  );

  const ActionPlanPage = () => {
    const customActionPlan = reportData?.assessmentDetails?.customReport?.actionPlan;
    return (
      <PrintLayout>
        <div className="font-medium text-2xl tracking-wider mt-5">
          <p>Action Plan</p>
        </div>

        <div className="mt-6 space-y-4">
          {
            hasCustomField(customActionPlan) ?
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={renderCustomHtml(customActionPlan)} />
              :
              <>

                <ul className="list-disc ml-6 text-sm leading-relaxed">
                  <li>
                    <strong>Risk Review &amp; Classification</strong><br />
                    Analyze all identified findings and classify them based on severity, exploitability, likelihood, and potential business impact.
                  </li>

                  <li>
                    <strong>Business Context Validation</strong><br />
                    Validate technical risks with business stakeholders to understand asset criticality, data sensitivity, and real-world impact.
                  </li>

                  <li>
                    <strong>Prioritization &amp; Remediation Planning</strong><br />
                    Prioritize remediation efforts using a risk-based approach and define corrective actions for each finding.
                  </li>

                  <li>
                    <strong>Ownership Assignment</strong><br />
                    Assign a responsible owner (team or individual) for every finding to ensure accountability throughout the remediation lifecycle.
                  </li>

                  <li>
                    <strong>Timeline Definition</strong><br />
                    Establish remediation deadlines based on risk criticality (e.g., Critical, High, Medium, Low).
                  </li>

                  <li>
                    <strong>Remediation Execution</strong><br />
                    Implement fixes following secure coding, configuration hardening, and best-practice security guidelines.
                  </li>

                  <li>
                    <strong>Exception &amp; Risk Acceptance (if applicable)</strong><br />
                    Document any accepted risks with management approval, including justification and compensating controls.
                  </li>

                  <li>
                    <strong>Verification &amp; Re-Testing</strong><br />
                    Conduct re-testing to confirm that vulnerabilities have been effectively remediated and no regressions were introduced.
                  </li>

                  <li>
                    <strong>Formal Closure</strong><br />
                    Close findings only after successful validation, or update their status if further action is required.
                  </li>

                  <li>
                    <strong>Continuous Improvement</strong><br />
                    Use lessons learned to enhance security controls, processes, and developer awareness to prevent recurrence.
                  </li>

                </ul>
              </>
          }

        </div>
      </PrintLayout>
    );
  };

  const PageConclusion = () => (
    <PrintLayout>
      <div className="font-medium text-2xl tracking-wider mt-5 mb-8">
        <p>Conclusion</p>
      </div>

      <div className="space-y-8">
        {
          hasCustomField(reportData?.assessmentDetails?.customReport?.conclusion) ?
            <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={renderCustomHtml(reportData?.assessmentDetails?.customReport?.conclusion)} />
            :
            <div>
              {/* <h3 className="font-semibold text-xl tracking-wider mb-3">Conclusion</h3> */}
              <p className="text-sm leading-relaxed">

                <p class="font-medium">
                  {reportData?.orgDetails?.name} conducted a comprehensive <span class="font-bold">Vulnerability Revalidation Assessment</span> of the above in scope vulnerabilities to verify
                  the effectiveness of previously implemented security remediations.<br /><br />


                  This revalidation focused on confirming the closure of vulnerabilities identified during the earlier penetration testing engagement.
                  Using a structured and methodical approach, {reportData?.orgDetails?.name} reassessed the same target scope to ensure that all previously reported security
                  weaknesses had been effectively addressed. The assessment included manual and automated verification techniques across multiple layers such as <span class="font-bold">
                    application logic, authentication mechanisms, and network configurations</span>.<br /><br />
                </p>

                <p class="font-medium">
                  Where applicable, real-world attack simulations were used to validate the robustness of the applied fixes and ensure the environment’s resilience against potential exploitation.<br /><br />
                </p>

                <p class="font-medium">
                  During the revalidation, vulnerabilities were re-examined and categorized based on their current status. A total of <span class="severityCountsStg"></span> vulnerabilities were
                  identified across different areas of the target system. The critical and high-risk issues require immediate attention as they pose significant security threats,
                  while the medium and low-risk findings should be addressed to enhance overall security resilience. Detailed information on each vulnerability, its impact,
                  and recommended remediation steps is provided in the report.<br /><br />
                </p>


                <p class="font-medium">
                  <span class="font-bold">{reportData?.orgDetails?.name}</span> extends its appreciation to all the members for their continued collaboration, support,
                  and assistance throughout this revalidation engagement.
                </p>
              </p>
            </div>
        }

      </div>
    </PrintLayout>
  );

  const PageContacts = () => (
    <PrintLayout>
      <div className="font-bold text-4xl tracking-wider mt-5 mb-8">
        <p>Contacts</p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="font-semibold text-xl tracking-wider mb-3">Contacts</h3>
          <div className="text-sm space-y-2">

            <table class="w-full table-auto border-collapse mt-4 rounded-lg">
              <tbody>
                <tr class="bg-gray-100 rounded-lg">
                  <th class="text-left font-medium text-gray-800 py-2 px-4 rounded-l-lg">Imran Parray</th>
                  <td class="text-gray-700 py-2 px-4">imran@snapsec.co </td>
                  <td class="text-gray-700 py-2 px-4 rounded-r-lg">Senior Cyber Security Consultant</td>
                </tr>
                <tr>
                  <th class="text-left font-medium text-gray-800 py-2 px-4">Support Team</th>
                  <td class="text-gray-700 py-2 px-4">support@snapsec.co </td>
                  <td class="text-gray-700 py-2 px-4">Snapsec Support Team</td>
                </tr>
                <tr class="bg-gray-100">
                  <th class="text-left font-medium text-gray-800 py-2 px-4 rounded-l-lg">Mubashir Mehraj</th>
                  <td class="text-gray-700 py-2 px-4">mubashir@snapsec </td>
                  <td class="text-gray-700 py-2 px-4 rounded-r-lg">Technical Support</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PrintLayout>
  );

  const PageEnd = () => (
    <div className="min-h-screen w-full bg-white p-16 font-sans relative report-page">
      {/* <PageHeader /> */}

      <div className="w-full h-full flex items-center justify-center mt-[50%]">
        <p class="font-medium text-3xl">END OF DOCUMENT</p>
      </div>

    </div>
  );

  const renderVulnListPages = () => {
    let vulns = reportData?.vulnDetails;
    return [<VulnListTable vulns={[...vulns]} isFirst={true} base={0} />];
  }

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen flex flex-col items-center" style={{
        'backgroundColor': 'white',
        // 'breakInside': '',
        // 'pageBreakInside': 'avoid',
      }}>
        <div className="min-h-screen bg-white" style={{
          width: "230mm",
          minHeight: "297mm",
          minWidth: "230mm"
        }}>
          <Page1 />
          <PageReportDetail />
          <Page2 />
          <ExecutiveSummaryPage />
          <ScopePage />
          <GraphicalSummary />
          {
            reportData?.vulnDetails?.length > 0 ?
              renderVulnListPages()
              :
              <div className="w-full h-full flex items-center justify-center">
                No Vulnerabilities
              </div>
          }
          {
            revalidated_vulns?.length > 0 ?
              revalidated_vulns?.map((vuln, index) => {
                return <VulnerabilityDetailPage vuln={vuln} />
              })
              :
              <div className="w-full h-full flex items-center justify-center">
                No Vulnerabilities
              </div>
          }
          <MethodologyPage />
          {/* <ActionPlanPage /> */}
          <PageConclusion />
          {/* <PageContacts /> */}
          <PageEnd />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default RevalidationReport;