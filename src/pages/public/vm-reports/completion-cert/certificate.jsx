import React, { useEffect, useState, useRef } from "react";
import appConfig from "@/config/appConfig";
import { useSearchParams } from "react-router-dom";
import { useReportReady } from "@/hooks/use-report-ready";

const EXTERNAL_CONFIG = {};

const externalApiUrl = `${appConfig.BASE_URL}/csm/api/reports/data/certificate`;
const internalApiUrl = `http://vm/api/reports/data/certificate`;

const Certificate = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setErr] = useState(false);
    const [params] = useSearchParams();
    const hasFetched = useRef(false);

    let viewMode = params.get("view_mode");
    let forceExternal = params.get("force_external_api") === "true";
    if (viewMode === "web" || forceExternal) {
        EXTERNAL_CONFIG.BASE_URL = externalApiUrl;
    } else {
        EXTERNAL_CONFIG.BASE_URL = internalApiUrl;
    }

    async function fetchReportData() {
        try {
            const searchParams = new URLSearchParams();
            searchParams.set("assessmentId", params.get("assessmentId"));
            searchParams.set("accessToken", params.get("accessToken"));

            const url = `${EXTERNAL_CONFIG.BASE_URL}?${searchParams.toString()}`;

            const response = await fetch(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Fetch Failed");

            const json = await response.json();
            setReportData(json.data);
        } catch (err) {
            console.error(err);
            setErr(true);
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
            <div className="w-[100vw] bg-gray-50 p-4 font-sans flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center p-8 bg-white shadow-xl rounded-lg">
                    <svg className="animate-spin h-8 w-8 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-lg text-gray-700 font-medium">Generating Completion Certificate...</p>
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
                        We couldn&apos;t find any certificate data for the provided assessment ID.
                        This might happen if the certificate is still being generated or if the ID is incorrect.
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

    const { orgDetails, assessmentDetails } = reportData;
    const company = orgDetails?.name || "Organization Name";

    // URL parsing for logo
    let website_url = orgDetails?.website;
    if (website_url) {
        if (website_url.startsWith("http://") || website_url.startsWith("https://")) {
            website_url = new URL(website_url).hostname;
        } else {
            website_url = new URL("https://" + website_url).hostname;
        }
    }

    const parseUTCtoLocal = (dateStr) => {
        if (!dateStr) return null;
        try {
            let d = new Date(dateStr);
            if (isNaN(d.getTime())) {
                if (typeof dateStr === "string" && /^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
                    const utcStr = dateStr.includes("T") ? `${dateStr}Z` : `${dateStr.trim().replace(" ", "T")}Z`;
                    const testD = new Date(utcStr);
                    if (!isNaN(testD.getTime())) return testD;
                }
                return null;
            }
            if (typeof dateStr === "string" && !dateStr.includes("Z") && !dateStr.includes("+") && !dateStr.includes("GMT")) {
                if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
                    const utcStr = dateStr.includes("T") ? `${dateStr}Z` : `${dateStr.trim().replace(" ", "T")}Z`;
                    const testD = new Date(utcStr);
                    if (!isNaN(testD.getTime())) return testD;
                }
            }
            return d;
        } catch (e) {
            return new Date(dateStr);
        }
    };

    const parsedStart = parseUTCtoLocal(assessmentDetails?.startDate);
    const startDate = parsedStart
        ? parsedStart.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "01 Jan 2025";

    const parsedEnd = parseUTCtoLocal(assessmentDetails?.endDate);
    const endDate = parsedEnd
        ? parsedEnd.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "10 Jan 2025";

    const currentDate = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });



    return (
        <div className="min-h-screen flex justify-center p-8">
            <div
                className="bg-white relative shadow-lg"
                style={{ width: "210mm", height: "297mm", padding: "10mm" }}
            >
                <div className="w-full h-full border-2 border-slate-800 flex flex-col items-center justify-between p-12 py-16">

                    {/* Header / Logos */}
                    <div className="w-full flex flex-col justify-center items-center mb-8">
                        <img
                            className="h-12 object-contain"
                            src={assessmentDetails?.vendorId?.logo_url || 'https://suite.snapsec.co/media/logos/snapsec.svg'}
                            alt={assessmentDetails?.vendorId?.name || 'Snapsec'}
                        />
                        <p className="text-3xl font-semibold text-slate-800">{assessmentDetails?.vendorId?.name || 'Snapsec'}</p>
                    </div>

                    {/* Title Section */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold text-slate-900 tracking-wide">CERTIFICATE OF COMPLETION</h1>
                        <p className="text-slate-500 text-sm">{assessmentDetails?.name}</p>
                    </div>

                    {/* Presented To */}
                    <div className="text-center space-y-6 mt-8">
                        <p className="text-xs text-slate-400 uppercase tracking-widest">This certificate is proudly presented to</p>
                        <h2 className="text-3xl font-semibold text-slate-800">{orgDetails?.name || 'Snapsec'}</h2>
                    </div>

                    {/* Description Body */}
                    <div className="text-center w-3/4 mx-auto">
                        <p className="text-sm text-slate-600 leading-relaxed">
                            In recognition of the successful completion of a comprehensive Vulnerability Assessment and Penetration Testing (VAPT) engagement conducted in accordance with industry-recognized security testing methodologies and best practices.
                        </p>
                    </div>

                    {/* Scope & Period */}
                    <div className="text-center space-y-8 mt-10">
                        <div className="space-y-3">
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Scope of Assessment</p>
                            <p className="text-lg font-medium text-slate-800">
                                {/* Web Application • API • Network Infrastructure */}
                                {assessmentDetails?.scopeString ? (
                                    assessmentDetails.scopeString.split('\n').map((line, index) => (
                                        <span key={index} className="block">
                                            {line}
                                        </span>
                                    ))
                                ) : (
                                    "Unknown"
                                )}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Assessment Period</p>
                            <p className="text-lg font-medium text-slate-800">
                                {startDate} – {endDate}
                            </p>
                        </div>
                    </div>

                    {/* Footer / Signatures */}
                    {/* <div className="w-full flex justify-between items-end mt-20">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-48 border-t border-slate-800"></div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-800">Authorized Signatory</p>
                                <p className="text-[10px] text-slate-500">Security Assessment Lead</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <div className="w-48 border-t border-slate-800"></div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-800">Snapsec</p>
                                <p className="text-[10px] text-slate-500">VAPT Service Provider</p>
                            </div>
                        </div>
                    </div> */}

                    {/* Footer Bottom */}
                    <div className="w-full flex justify-between text-[10px] text-slate-400 mt-8">
                        <p>Certificate ID: {reportData?.certificateId || "Unknown"}</p>
                        <p>Date of Issue: {currentDate}</p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Certificate;