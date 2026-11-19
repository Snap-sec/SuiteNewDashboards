import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Members from './components/Card/members';
import SeverityOpenCloseDistribution from './components/Charts/severity-distribution-graph2';
import VulnerabilityDistribution from './components/Charts/VulnerabilityDistribution';
import FormModel from './components/form-model';
import SeverityHighlights from './components/SeverityHighlights';
import Projects from './components/table/project';
import Table from './components/table/table';
import VulnStateMetrics from './components/VulnStateMetrics';


function DemoDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [companyEmail, setCompanyEmail] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    // if current host is not demo.snapsec.co
    if (window.location.hostname !== "demo.snapsec.co") {
      window.location.replace("https://demo.snapsec.co/demo");
    }
  }, []);

  useEffect(() => {
    // Set theme to 'light'
    localStorage.setItem('theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');

    // redirect user to
    if (localStorage.getItem("token")) window.location.href = '/?fromDemo=true';
  }, []);

  const stats = {
    top5: [
      {
        _id: '6889019b2cf113863a3b04e0',
        title: 'SQL Injection vulnerability in login endpoint',
        blockers: ['blocker1'],
        severity: 'critical',
        cvssRating: 'critical',
        cvssScoreNum: 9.8,
        assigneeDetails: {
          _id: '6867b94e620e640012c48627',
          firstName: 'Imrann',
          lastName: 'Parrayy',
          email: 'imran+demoaccount2@snapsec.co',
          role: 'Manager',
        },
        state: 'In Review',
        createdAt: '2025-07-29T17:19:11.778Z',
        eventType: 'Application Vulnerability',
        severityLevel: 'critical',
      },
      {
        _id: '6889019c3df113863a3b05e1',
        title: 'Cross-Site Scripting (XSS) in comment form',
        blockers: [],
        severity: 'high',
        cvssRating: 'high',
        cvssScoreNum: 8.1,
        assigneeDetails: {
          _id: '6867c84a620e640012c5123a',
          firstName: 'Sarah',
          lastName: 'Conner',
          email: 'sarah.conner@example.com',
          role: 'Senior Security Analyst',
        },
        state: 'Open',
        createdAt: '2025-08-10T12:30:22.123Z',
        eventType: 'Web Vulnerability',
        severityLevel: 'high',
      },
      {
        _id: '6889019d4ef224974b3c06d2',
        title: 'Outdated SSL/TLS version detected',
        blockers: ['blocker2', 'blocker3'],
        severity: 'medium',
        cvssRating: 'medium',
        cvssScoreNum: 5.4,
        assigneeDetails: {
          _id: '6867d12e720e360014b632ef',
          firstName: 'Mark',
          lastName: 'Watson',
          email: 'mark.watson@example.com',
          role: 'IT Infrastructure Lead',
        },
        state: 'Mitigated',
        createdAt: '2025-06-05T09:15:45.987Z',
        eventType: 'Network Vulnerability',
        severityLevel: 'medium',
      },
      {
        _id: '6889019e5ff335a85d7c07f4',
        title: 'Privilege escalation vulnerability in Linux kernel',
        blockers: [],
        severity: 'critical',
        cvssRating: 'critical',
        cvssScoreNum: 9.0,
        assigneeDetails: {
          _id: '6867e94f830f470015a84ed1',
          firstName: 'Lara',
          lastName: 'Croft',
          email: 'lara.croft@example.com',
          role: 'Kernel Security Engineer',
        },
        state: 'Investigating',
        createdAt: '2025-09-14T23:40:10.654Z',
        eventType: 'Kernel Vulnerability',
        severityLevel: 'critical',
      },
      {
        _id: '6889019f70f446b96e8d0815',
        title: 'Information disclosure via misconfigured API',
        blockers: ['blocker1'],
        severity: 'low',
        cvssRating: 'low',
        cvssScoreNum: 3.3,
        assigneeDetails: {
          _id: '6867f0b1830048016f9f27bf',
          firstName: 'David',
          lastName: 'Beckham',
          email: 'david.beckham@example.com',
          role: 'API Security Specialist',
        },
        state: 'Resolved',
        createdAt: '2025-05-19T18:29:34.321Z',
        eventType: 'API Vulnerability',
        severityLevel: 'low',
      },
    ],
    aggCvss: 4.05,
    totalVulns: 69,
    inReview: 27,
    notApplicable: 0,
    falsePositive: 1,
    inProgress: 1,
    fixedInStaging: 0,
    unResolved: 1,
    resolved: 30,
    retest: 2,
    duplicate: 7,
    none: 10,
    low: 13,
    medium: 15,
    high: 28,
    critical: 3,
    openVulns: 28,
    closedVulns: 34,
    noneOpen: 9,
    noneClosed: 1,
    highOpen: 6,
    highClosed: 21,
    lowOpen: 4,
    lowClosed: 3,
    medOpen: 8,
    medClosed: 7,
    criticalOpen: 1,
    criticalClosed: 2,
    vulnTimeline: [
      {
        unresolvedCount: 1,
        resolvedCount: 24,
        date: '2025-06-16',
        totalUnresolved: 1,
        totalResolved: 24,
      },
      {
        unresolvedCount: 3,
        resolvedCount: 2,
        date: '2025-06-17',
        totalUnresolved: 4,
        totalResolved: 26,
      },
      {
        unresolvedCount: 0,
        resolvedCount: 2,
        date: '2025-06-18',
        totalUnresolved: 4,
        totalResolved: 28,
      },
      {
        unresolvedCount: 1,
        resolvedCount: 0,
        date: '2025-06-20',
        totalUnresolved: 5,
        totalResolved: 28,
      },
      {
        unresolvedCount: 2,
        resolvedCount: 1,
        date: '2025-06-24',
        totalUnresolved: 7,
        totalResolved: 29,
      },
      {
        unresolvedCount: 3,
        resolvedCount: 2,
        date: '2025-06-25',
        totalUnresolved: 10,
        totalResolved: 31,
      },
      {
        unresolvedCount: 3,
        resolvedCount: 1,
        date: '2025-06-27',
        totalUnresolved: 13,
        totalResolved: 32,
      },
      {
        unresolvedCount: 3,
        resolvedCount: 1,
        date: '2025-07-02',
        totalUnresolved: 16,
        totalResolved: 33,
      },
      {
        unresolvedCount: 6,
        resolvedCount: 1,
        date: '2025-07-10',
        totalUnresolved: 22,
        totalResolved: 34,
      },
      {
        unresolvedCount: 2,
        resolvedCount: 0,
        date: '2025-07-23',
        totalUnresolved: 24,
        totalResolved: 34,
      },
      {
        unresolvedCount: 2,
        resolvedCount: 0,
        date: '2025-07-29',
        totalUnresolved: 26,
        totalResolved: 34,
      },
      {
        unresolvedCount: 2,
        resolvedCount: 0,
        date: '2025-07-30',
        totalUnresolved: 28,
        totalResolved: 34,
      },
      {
        unresolvedCount: 0,
        resolvedCount: 0,
        date: '2025-07-31',
        totalUnresolved: 28,
        totalResolved: 34,
      },
      {
        unresolvedCount: 0,
        resolvedCount: 0,
        date: '2025-08-13',
        totalUnresolved: 28,
        totalResolved: 34,
      },
    ],
    slaMetrics: {
      withinSla: 28,
      atRisk: 0,
      breached: 0,
    },
    cweDistribution: [
      {
        count: 9,
        cwe: 'CWE-15',
      },
      {
        count: 7,
        cwe: 'CWE-CWE-59',
      },
      {
        count: 6,
        cwe: 'CWE-13',
      },
      {
        count: 5,
        cwe: null,
      },
      {
        count: 2,
        cwe: 'CWE-22',
      },
      {
        count: 1,
        cwe: 'CWE-35',
      },
      {
        count: 1,
        cwe: 'cwe-200',
      },
      {
        count: 1,
        cwe: 'CWE-CWE-15',
      },
      {
        count: 1,
        cwe: 'CWE-CWE-95',
      },
      {
        count: 1,
        cwe: 'CWE-CWE-13',
      },
    ],
    cveDistribution: [
      {
        count: 1,
        cve: 'CVE-2018-25032',
      },
      {
        count: 1,
        cve: 'CVE-2021-37750',
      },
      {
        count: 1,
        cve: 'CVE-2021-42380',
      },
      {
        count: 1,
        cve: 'CVE-2023-0286',
      },
      {
        count: 1,
        cve: 'CVE-2021-42386',
      },
      {
        count: 1,
        cve: 'CVE-2021-42378',
      },
      {
        count: 1,
        cve: 'CVE-2021-42385',
      },
      {
        count: 1,
        cve: 'CVE-2021-42381',
      },
      {
        count: 1,
        cve: 'CVE-2023-0465',
      },
      {
        count: 1,
        cve: 'CVE-2022-0778',
      },
    ],
    vulnDistribution12Months: [
      {
        month: 'Nov 2024',
        open: 0,
        closed: 0,
      },
      {
        month: 'Dec 2024',
        open: 0,
        closed: 0,
      },
      {
        month: 'Jan 2025',
        open: 0,
        closed: 0,
      },
      {
        month: 'Feb 2025',
        open: 0,
        closed: 0,
      },
      {
        month: 'Mar 2025',
        open: 0,
        closed: 0,
      },
      {
        month: 'Apr 2025',
        open: 0,
        closed: 0,
      },
      {
        month: 'May 2025',
        open: 0,
        closed: 0,
      },
      {
        month: 'Jun 2025',
        open: 13,
        closed: 32,
      },
      {
        month: 'Jul 2025',
        open: 15,
        closed: 2,
      },
      {
        month: 'Aug 2025',
        open: 0,
        closed: 0,
      },
      {
        month: 'Sep 2025',
        open: 0,
        closed: 0,
      },
      {
        month: 'Oct 2025',
        open: 0,
        closed: 0,
      },
    ],
    topMembers: [
      {
        _id: 'saleemparray@gmail.com',
        name: 'saleemparray',
        email: 'saleemparray@gmail.co',
        assignedVulns: 29,
        closedVulns: 25,
        closureRate: 0.8620689655172413,
      },
      {
        _id: 'naikmubashir095@gmail.com',
        name: 'Naik Mubashir',
        email: 'naikmubashir095@gmail.com',
        assignedVulns: 6,
        closedVulns: 3,
        closureRate: 0.5,
      },
      {
        _id: 'maliktawkeerulislam@gmail.com',
        name: 'MALIK ISLAM',
        email: 'maliktawkeerulislam@gmail.com',
        assignedVulns: 13,
        closedVulns: 4,
        closureRate: 0.3076923076923077,
      },
      {
        _id: 'shoaibhassan@snapsec.co',
        name: 'shoaib wani',
        email: 'shoaibhassan@gmail.co',
        assignedVulns: 7,
        closedVulns: 1,
        closureRate: 0.14285714285714285,
      },
      {
        _id: 'subhaib@gmail.co',
        name: 'Shoaib Wani',
        email: 'subhaib@gmail.co',
        assignedVulns: 1,
        closedVulns: 0,
        closureRate: 0,
      },
    ],
    topAssessments: [
      {
        _id: '67d938153f63d90012052f3c',
        title: 'Web Application Pentesting',
        collaborators: [
          {
            _id: '67d938153f63d90012052f3d',
            userId: '673b6e68896a4804fd9173b9',
            name: 'imrandemo imrandemo',
            email: 'imran+demoaccount2@snapsec.co',
          },
          {
            _id: '68494e6015535500127fa463',
            userId: '68494e45b9d23000128a549d',
            name: 'Naik Mubashir',
            email: 'naikmubashir095@gmail.com',
          },
          {
            _id: '6867b88908eb8700127358e4',
            userId: '6864b21ae4b02f0011f9ebb6',
            name: 'shoaib wani',
            email: 'shoaibhassan@snapsec.co',
          },
        ],
        startDate: '2025-02-10T00:54:22.000Z',
        numberOfDays: '2',
        openVulns: 2,
        closedVulns: 26,
        remediationProgress: 93,
      },
      {
        _id: '67d3bb3adf2bd3001250d956',
        title: 'CSPM - Cloud Security',
        collaborators: [
          {
            _id: '67d3bb3adf2bd3001250d957',
            userId: '673b6e68896a4804fd9173b9',
            name: 'imrandemo imrandemo',
            email: 'imran+demoaccount2@snapsec.co',
          },
          {
            _id: '68494e6015535500127fa466',
            userId: '68494e45b9d23000128a549d',
            name: 'Naik Mubashir',
            email: 'naikmubashir095@gmail.com',
          },
        ],
        startDate: null,
        numberOfDays: '10',
        openVulns: 6,
        closedVulns: 5,
        remediationProgress: 45,
      },
      {
        _id: '67d3bb3adf2bd3001250d953',
        title: 'Mobile Application Pentesting',
        collaborators: [
          {
            _id: '67dbc734279904001255d169',
            email: 'imran+demoaccount2@snapsec.co',
            name: 'imran+demoaccount2',
            userId: '673b6e68896a4804fd9173b9',
          },
          {
            _id: '68494e5f15535500127fa449',
            userId: '68494e45b9d23000128a549d',
            name: 'Naik Mubashir',
            email: 'naikmubashir095@gmail.com',
          },
        ],
        startDate: '2025-08-20T18:30:00.000Z',
        numberOfDays: '10',
        openVulns: 2,
        closedVulns: 1,
        remediationProgress: 33,
      },
      {
        _id: '67dbde81279904001255dc8a',
        title: 'VDP Reports',
        collaborators: [
          {
            _id: '68494e5f15535500127fa44c',
            userId: '68494e45b9d23000128a549d',
            name: 'Naik Mubashir',
            email: 'naikmubashir095@gmail.com',
          },
          {
            _id: '6864c143edb75100121ebd3c',
            email: 'support+snapsec@snapsec.co',
            name: 'SnapSec Support',
            userId: '67c7ccf480054f001278c9b0',
          },
          {
            _id: '6864e5e9c5808c00120864d8',
            email: 'imran+demoaccount2@snapsec.co',
            name: 'imrandemo imrandemo',
            userId: '673b6e68896a4804fd9173b9',
          },
          {
            _id: '6864e5f2c5808c00120864dc',
            email: 'shoaibwani@snapsec.co',
            name: 'Shoaib Wani',
            userId: '686253a2ef093a0012d7bde6',
          },
        ],
        startDate: null,
        numberOfDays: '10',
        openVulns: 13,
        closedVulns: 1,
        remediationProgress: 7,
      },
      {
        _id: '6864c711c3727f0012626766',
        title: 'new oonw',
        collaborators: [
          {
            _id: '6864c711c3727f0012626767',
            userId: '673b6e68896a4804fd9173b9',
            name: 'imran parray',
            email: 'imran+demoaccount2@snapsec.co',
          },
        ],
        startDate: null,
        numberOfDays: null,
        openVulns: 0,
        closedVulns: 1,
        remediationProgress: 100,
      },
    ],
    topDepartments: [],
    assessmentMetrics: {
      total: 18,
      completed: 5,
      pending: 13,
      byType: {
        blackBox: 3,
        greyBox: 12,
        whiteBox: 3,
      },
      byState: {
        Running: 2,
        Configured: 1,
        Paused: 1,
        Completed: 5,
        'Not Configured': 6,
        Pending: 3,
      },
      totalCost:
        '079007900790015007900-100-100-100-100-100-100-100-100-100-8300-8300NaN-8400',
      averageDuration: 56116783333333340000,
      totalVulns: 69,
      averageVulnsPerAssessment: 4,
    },
    _id: null,
    cvssTotal: 113.5,
  };

  return (
    <>
      <div className="p-12">

        <Helmet>
          <title>Snapsec suite | Demo</title>
          <meta
            name="description"
            content="Try Snapsec's demo for comprehensive security solutions."
          />
          <meta property="og:title" content="Snapsec Demo" />
          <meta
            property="og:description"
            content="Explore the Snapsec demo to experience our security suite."
          />
          <meta property="og:url" content="https://suite.snapsec.co/demo" />
          <meta
            property="og:image"
            content="https://suite.snapsec.co/assets/demo-preview.png"
          />
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>

        <div className="flex flex-col 2xl:flex-row gap-6 justify-between">
          <div className="sm:w-full 2xl:w-full grid grid-cols-8 gap-4 h-full">
            <VulnStateMetrics data={stats} />
          </div>
        </div>

        <FormModel isOpen={showModal} callback={(data) => { setShowModal(false); setCompanyEmail(data.companyEmail); }} />

        <div className="flex gap-6 mt-6 justify-between">
          <div className="w-[35%]">
            <SeverityHighlights data={stats} limit={4} />
          </div>

          <div className="w-[65%]">
            <VulnerabilityDistribution data={stats} />
          </div>
        </div>

        {/* Cve and Cwe distribution charts */}
        <div className="flex gap-6 mt-6 justify-between">
          <div className="w-[35%] flex flex-col gap-4">
            <SeverityOpenCloseDistribution Data={stats} />
          </div>

          <div className="w-[65%]">
            <Projects
              title="Top Performing Assessments"
              assessments={stats?.topAssessments}
            />
          </div>
        </div>

        <div className="flex gap-6 mt-6 justify-between">
          <div className="w-[35%]">
            <Members
              title="Top Performing Members"
              members={stats?.topMembers}
            />
          </div>

          <div className="w-[65%]">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Top 5 Vulnerabilities</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 p-0">
                <Table data={stats?.top5} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default DemoDashboard;
