export const workspace = {
  name: "Northwind Labs",
  initials: "NL",
  plan: "Demo",
}

export const currentUser = {
  name: "Avery Mitchell",
  initials: "AM",
}

export const summaryStats = [
  { id: "assets", label: "Assets", value: "1,284" },
  { id: "findings", label: "With findings", value: "214" },
  { id: "coverage", label: "Scan coverage", value: "92%" },
  { id: "sla", label: "Past SLA", value: "3", alert: true },
]

export const flowWeeks = [
  { week: "Sep 28", opened: 5, resolved: 8 },
  { week: "Oct 5", opened: 7, resolved: 6 },
  { week: "Oct 12", opened: 4, resolved: 7 },
  { week: "Oct 19", opened: 8, resolved: 6 },
  { week: "Oct 26", opened: 5, resolved: 8 },
  { week: "Nov 2", opened: 6, resolved: 7 },
  { week: "Nov 9", opened: 4, resolved: 8 },
  { week: "Nov 16", opened: 3, resolved: 8 },
]

export const flowTotals = flowWeeks.reduce(
  (totals, week) => ({
    opened: totals.opened + week.opened,
    resolved: totals.resolved + week.resolved,
  }),
  { opened: 0, resolved: 0 },
)

export const riskScore = {
  value: 68,
  max: 100,
  band: "Elevated",
  deltaLabel: "6 points since Oct 20",
  drivers: [
    { id: "surface", label: "External surface", value: 72 },
    { id: "patch", label: "Patch latency", value: 58 },
    { id: "identity", label: "Identity gaps", value: 44 },
  ],
}

export const scanPulse = {
  nextDate: "Nov 24",
  nextTime: "09:00 UTC",
  coverage: 92,
  inScope: "1,183 of 1,284 assets in scope",
  lastScan: "Last scan Nov 17 · 47 findings",
  days: [
    { key: "Thu", date: "19", state: "today" },
    { key: "Fri", date: "20", state: "default" },
    { key: "Sat", date: "21", state: "default" },
    { key: "Sun", date: "22", state: "default" },
    { key: "Mon", date: "23", state: "default" },
    { key: "Tue", date: "24", state: "scan" },
    { key: "Wed", date: "25", state: "default" },
  ],
}

export const priorityAssets = [
  {
    id: "payments",
    rank: 1,
    name: "payments.northwind.dev",
    severity: "critical",
    openFindings: 12,
    type: "Web server",
    team: "Payments",
    sla: "2h",
    slaRisk: true,
  },
  {
    id: "legacy-admin",
    rank: 2,
    name: "legacy-admin.northwind.dev",
    severity: "critical",
    openFindings: 8,
    type: "Web server",
    team: "Platform",
    sla: "6h",
    slaRisk: true,
  },
  {
    id: "media-prod",
    rank: 3,
    name: "northwind-media-prod",
    severity: "high",
    openFindings: 6,
    type: "Storage bucket",
    team: "Media",
    sla: "12h",
    slaRisk: true,
  },
  {
    id: "vpn-gw",
    rank: 4,
    name: "vpn-gw.northwind.dev",
    severity: "high",
    openFindings: 5,
    type: "IP address",
    team: "IT operations",
    sla: "2d",
    slaRisk: false,
  },
  {
    id: "dns1",
    rank: 5,
    name: "dns1.northwind.dev",
    severity: "low",
    openFindings: 2,
    type: "DNS record",
    team: "Infrastructure",
    sla: "3d",
    slaRisk: false,
  },
]

export const priorityAssetTotal = 9

export const matrixRows = [
  { id: "subdomains", type: "Subdomains", series: 1, critical: 1, high: 3, medium: 2, low: 1 },
  { id: "web-servers", type: "Web servers", series: 2, critical: 4, high: 3, medium: 3, low: 1 },
  { id: "dns-records", type: "DNS records", series: 3, critical: 0, high: 2, medium: 3, low: 0 },
  { id: "ip-addresses", type: "IP addresses", series: 4, critical: 2, high: 3, medium: 2, low: 2 },
  { id: "technologies", type: "Technologies", series: 5, critical: 2, high: 3, medium: 6, low: 4 },
]

export const matrixTotals = matrixRows.reduce(
  (totals, row) => ({
    critical: totals.critical + row.critical,
    high: totals.high + row.high,
    medium: totals.medium + row.medium,
    low: totals.low + row.low,
    total: totals.total + row.critical + row.high + row.medium + row.low,
  }),
  { critical: 0, high: 0, medium: 0, low: 0, total: 0 },
)

export const boardStages = [
  { id: "triage", label: "Triage", dotClassName: "bg-warning" },
  { id: "progress", label: "In progress", dotClassName: "bg-info" },
  { id: "verify", label: "Verify", dotClassName: "bg-success" },
]

export const initialBoard = {
  triage: [
    {
      id: "mfa-admin",
      severity: "critical",
      due: "2h",
      dueRisk: true,
      title: "Enforce MFA on admin console",
      asset: "admin.northwind.dev",
      owner: "PL",
      team: "Platform",
      age: "3d",
    },
    {
      id: "bucket-acl",
      severity: "high",
      due: "6h",
      dueRisk: true,
      title: "Restrict public bucket ACL",
      asset: "northwind-media-prod",
      owner: "ME",
      team: "Media",
      age: "2d",
    },
  ],
  progress: [
    {
      id: "openssh-vpn",
      severity: "high",
      due: "1d",
      dueRisk: false,
      title: "Patch OpenSSH on VPN gateway",
      asset: "vpn-gw.northwind.dev",
      owner: "IT",
      team: "IT operations",
      age: "1d",
    },
    {
      id: "wildcard-cert",
      severity: "medium",
      due: "4d",
      dueRisk: false,
      title: "Rotate wildcard certificate",
      asset: "*.northwind.dev",
      owner: "IN",
      team: "Infrastructure",
      age: "5d",
    },
  ],
  verify: [
    {
      id: "mfa-payments",
      severity: "critical",
      due: "today",
      dueRisk: true,
      title: "Confirm MFA on payments portal",
      asset: "payments.northwind.dev",
      owner: "PA",
      team: "Payments",
      age: "6h",
    },
    {
      id: "dns-zone",
      severity: "low",
      due: "2d",
      dueRisk: false,
      title: "Verify DNS zone transfer rule",
      asset: "dns1.northwind.dev",
      owner: "IN",
      team: "Infrastructure",
      age: "1d",
    },
  ],
}

export const surfaceChanges = [
  {
    id: "change-subdomain",
    type: "discovery",
    title: "New subdomain discovered",
    asset: "staging-db.northwind.dev",
    time: "1h ago",
  },
  {
    id: "change-cert",
    type: "resolved",
    title: "TLS certificate rotated",
    asset: "api.northwind.dev",
    time: "3h ago",
  },
  {
    id: "change-maintenance",
    type: "changed",
    title: "Asset moved to maintenance",
    asset: "payments.northwind.dev",
    time: "5h ago",
  },
  {
    id: "change-scan",
    type: "scan",
    title: "Weekly scan completed",
    asset: "1,284 assets · 6 new findings",
    time: "8h ago",
  },
  {
    id: "change-bucket",
    type: "resolved",
    title: "Bucket ACL restricted",
    asset: "northwind-media-prod",
    time: "1d ago",
  },
]

export const initialNotifications = [
  {
    id: "notif-critical",
    tone: "critical",
    text: "3 critical exposures found on payments.northwind.dev.",
    time: "8 minutes ago",
    unread: true,
  },
  {
    id: "notif-subdomain",
    tone: "high",
    text: "New subdomain staging-db.northwind.dev discovered.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "notif-scan",
    tone: "info",
    text: "Weekly scan finished with 6 new findings.",
    time: "3 hours ago",
    unread: true,
  },
]
