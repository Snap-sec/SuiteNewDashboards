// project-report.jsx — WAS Project Report (Multi-page)
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReportReady } from "@/hooks/use-report-ready";
import appConfig from '@/config/appConfig';
import ColumnGraph from '@/components/custom/charts/column-graph';
import PieChart from '@/components/custom/charts/pie-chart';
import SeverityLabel from '@/components/custom/severity-label';

const EXTERNAL_CONFIG = {
  BASE_URL: `${appConfig.BASE_URL}/apisec/api/v1/reports`,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const shortDate = (d) => {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatDuration = (ms) => {
  if (!ms) return 'N/A';
  const m = Math.floor(ms / 60000);
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${m % 60}m` : `${m}m`;
};

// ─── Shared Components ────────────────────────────────────────────────────────
const PageHeader = ({ staticPosition = false }) => (
  <div
    className={`${staticPosition ? 'w-full flex mb-4' : 'absolute top-0 left-0 m-6 flex'} justify-end items-center gap-4`}
  >
    <p className="text-xs text-gray-400 font-medium">
      Web Application Scanner Report
    </p>
  </div>
);

const PrintLayout = ({ children, pageBreak = true, className = '' }) => (
  <div
    className={`bg-white font-sans relative report-page mx-auto ${className}`}
    style={{
      pageBreakAfter: pageBreak ? 'always' : 'auto',
      // minHeight: '497mm',
      minHeight: 'auto',
      width: '210mm',
      display: 'block',
    }}
  >
    <table className="w-full">
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

// ─── Report Pages ─────────────────────────────────────────────────────────────

const CoverPage = ({ meta, org }) => {
  const project = meta?.project;

  return (
    <div
      className="min-h-screen bg-white p-16 font-sans relative report-page mx-auto"
      style={{ pageBreakAfter: 'always', width: '210mm' }}
    >
      <PageHeader />

      <div className="absolute top-8 right-8 flex flex-col items-center">
        <img src={org.logo || 'https://suite.snapsec.co/media/logos/snapsec.svg'} className="h-16 object-contain" alt="logo" />
        <p className="font-medium tracking-wider mt-2">
          {org?.name || 'Snapsec'}
        </p>
      </div>

      <div className="mt-[50%] w-full text-center">
        <h1 className="text-black text-6xl font-medium leading-tight mb-4 flex flex-col uppercase">
          <span>WAS Security Report</span>
        </h1>
        <h2 className="text-2xl text-gray-600 font-medium">
          {project?.name || 'Application Report'}
        </h2>
        <div className="text-[10px] text-red-600 font-semibold uppercase tracking-[0.2em] mt-8 pt-4 border-t border-gray-100 max-w-[60%] mx-auto">
          Confidential Notice: This document is the private property of{' '}
          {org?.name || 'SnapSec Customer'}.
        </div>
      </div>

      <div className="absolute bottom-0 right-0 m-12">
        <p className="px-6 py-2 text-sm font-medium uppercase tracking-widest text-gray-500">
          {formatDate(meta?.generatedAt || new Date())}
        </p>
      </div>
    </div>
  );
};

const TableOfContents = () => (
  <PrintLayout>
    <div className="font-bold text-3xl tracking-tight mt-10 mb-8">
      Table of Contents
    </div>
    <div className="space-y-6">
      <div>
        <div className="border-b border-gray-200 pb-2">
          <span className="font-semibold text-lg text-gray-800">
            1. Application & Scan Details
          </span>
        </div>
        <div className="pl-6 mt-3 space-y-2">
          <div className="text-sm text-gray-600">
            <span>1.1 Application Metadata</span>
          </div>
          <div className="text-sm text-gray-600">
            <span>1.2 Metrics Distribution</span>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 pb-2">
        <span className="font-semibold text-lg text-gray-800">
          2. Vulnerability Summary
        </span>
      </div>

      <div className="border-b border-gray-200 pb-2">
        <span className="font-semibold text-lg text-gray-800">
          3. Detailed Findings
        </span>
      </div>
    </div>
  </PrintLayout>
);

const DetailsAndMetricsPage = ({ meta, severityBreakdown, cweBreakdown }) => {
  const severitySeries = [
    {
      name: 'Vulnerabilities',
      data: [
        severityBreakdown?.critical || 0,
        severityBreakdown?.high || 0,
        severityBreakdown?.medium || 0,
        severityBreakdown?.low || 0,
      ],
    },
  ];

  return (
    <PrintLayout>
      <div className="font-bold text-2xl tracking-tight mt-5 mb-8 uppercase text-gray-800">
        1. Details & Metrics
      </div>

      <div className="mb-10">
        <h3 className="font-bold text-lg mb-4 text-indigo-900 border-l-4 border-indigo-900 pl-3 text-sm">
          1.1 Application Metadata
        </h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
          {[
            { label: 'Application Name', value: meta?.project?.name },
            { label: 'Created At', value: shortDate(meta?.project?.createdAt) },
            {
              label: 'Latest Scan Status',
              value: meta?.latestScan?.status || 'N/A',
            },
            {
              label: 'Scan Duration',
              value: formatDuration(meta?.latestScan?.duration),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between border-b border-gray-200 pb-1"
            >
              <span className="text-sm text-gray-500 font-medium">{label}</span>
              <span className="text-sm font-bold text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h3 className="font-bold text-lg mb-4 text-indigo-900 border-l-4 border-indigo-900 pl-3 uppercase">
          1.2 Severity Distribution
        </h3>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <ColumnGraph
            series={severitySeries}
            xCategories={['Critical', 'High', 'Medium', 'Low']}
            height={300}
            showLegend={false}
            colors={['#DC2626', '#F97316', '#EAB308', '#3B82F6']}
          />
        </div>
      </div>

      {cweBreakdown && cweBreakdown.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4 text-indigo-900 border-l-4 border-indigo-900 pl-3 uppercase">
            1.3 Top CWE Distribution
          </h3>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <div className="space-y-2">
              {cweBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    {item.cwe}
                  </span>
                  <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500"
                      style={{
                        width: `${(item.count / cweBreakdown[0].count) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-800">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PrintLayout>
  );
};

const VulnerabilityListTable = ({ findings }) => {
  if (!findings || findings.length === 0) return null;

  return (
    <PrintLayout>
      <div className="font-bold text-2xl tracking-tight mt-5 mb-8 uppercase text-gray-800">
        2. Vulnerability Summary
      </div>
      <div className="rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-4 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest">
                #
              </th>
              <th className="px-4 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest">
                Title
              </th>
              <th className="px-4 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-center">
                Severity
              </th>
              <th className="px-4 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-right">
                CWE
              </th>

            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {findings.map((v, i) => (
              <tr
                key={v._id || i}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-xs text-gray-400 font-mono">
                  {i + 1}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 leading-snug">
                  {v.title}
                </td>
                <td className="px-4 py-3 text-center">
                  <SeverityLabel severity={v.severity} size="sm" />
                </td>
                <td className="px-4 py-3 text-right text-xs text-gray-500">
                  {v.cwe || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PrintLayout>
  );
};

const FindingDetailPage = ({ finding, index }) => (
  <PrintLayout>
    <div className="flex justify-between items-start mt-6 mb-8 border-b-2 border-gray-800 pb-4">
      <div className="max-w-[75%]">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1">
          Finding {index + 1}
        </p>
        <h2 className="text-xl font-bold text-black leading-tight">
          {finding.title}
        </h2>
      </div>
      <div className="flex flex-col items-end">
        <SeverityLabel severity={finding.severity} size="lg" />
        <div className="mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          {finding.cwe}
        </div>
      </div>
    </div>

    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-900 border-b pb-2 mb-3">
          Endpoint / Location
        </h3>
        <div className="bg-gray-50 p-3 rounded font-mono text-xs text-gray-700 break-all">
          {finding.endpoint}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-900 border-b pb-2 mb-3">
          Description
        </h3>
        <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap break-all">
          {finding.description}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-900 border-b pb-2 mb-3">
          Impact
        </h3>
        <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap break-all">
          {finding.impact}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-900 border-b pb-2 mb-3">
          Remediation
        </h3>
        <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap break-all">
          {finding.remediation}
        </div>
      </div>
    </div>
  </PrintLayout>
);

// ─── Shared Components ────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ProjectReport Error caught by boundary:', error, errorInfo);
    window.isPdfReady = true;
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-20 text-center bg-white min-h-screen">
          <h1 className="text-2xl font-bold text-red-600">
            Something went wrong while rendering the report.
          </h1>
          <p className="mt-4">
            The PDF generation will proceed with the available data.
          </p>
          <pre>{JSON.stringify(this.state.error, null, 2)}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
const ProjectReport = () => {
  const [params] = useSearchParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasFetched = useRef(false);

  async function fetchReportData() {
    const projectId = params.get('projectId');
    const accessToken = params.get('accessToken');
    const jwtToken = localStorage.getItem('token');
    if (!projectId) return;

    const apiBase = `${EXTERNAL_CONFIG.BASE_URL}/data/${projectId}`;
    const queryParams = new URLSearchParams();
    if (accessToken && accessToken !== 'null')
      queryParams.append('accessToken', accessToken);

    try {
      const response = await fetch(`${apiBase}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
        },
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setReportData(data?.data);
      setError(false);
    } catch (err) {
      console.error('[WAS Report] Failed to fetch report data.', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!hasFetched.current) {
      fetchReportData();
      hasFetched.current = true;
    }
  }, []);

  const { statusMessage } = useReportReady({
    loading,
    data: reportData,
    error,
    options: { readyDelay: 1000 }
  });

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center text-lg font-semibold bg-white">
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
          Generating Secure Application Security Report...
          <p className="text-xs text-gray-400 mt-2 font-mono uppercase tracking-widest">{statusMessage}</p>
        </div>
      </div>
    );
  }

  if (!reportData || (typeof reportData === 'object' && Object.keys(reportData).length === 0)) {
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

  const { meta, org, severityBreakdown, cweBreakdown, findings } = reportData;

  return (
    <ErrorBoundary>
      <div className="w-full flex flex-col items-center bg-gray-200 py-12 print:block print:p-0 print:bg-white no-scrollbar">
        <CoverPage meta={meta} org={org} />
        <TableOfContents />
        <DetailsAndMetricsPage
          meta={meta}
          severityBreakdown={severityBreakdown}
          cweBreakdown={cweBreakdown}
        />
        <VulnerabilityListTable findings={findings} />

        {findings?.map((f, i) => (
          <FindingDetailPage key={f._id || i} finding={f} index={i} />
        ))}

        <div
          className="min-h-screen bg-white p-16 font-sans relative report-page flex items-center justify-center mx-auto"
          style={{ width: '210mm' }}
        >
          <div className="text-center">
            <p className="text-4xl font-bold tracking-widest text-gray-200 uppercase">
              END OF DOCUMENT
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProjectReport;
