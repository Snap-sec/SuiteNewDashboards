const RANGE_7D = {
  value: "7d",
  label: "Last 7 days",
  description: "Daily open findings by severity",
  trend: [
    { date: "Nov 13", critical: 43, high: 168, medium: 306 },
    { date: "Nov 14", critical: 42, high: 167, medium: 308 },
    { date: "Nov 15", critical: 41, high: 166, medium: 309 },
    { date: "Nov 16", critical: 41, high: 165, medium: 311 },
    { date: "Nov 17", critical: 40, high: 165, medium: 310 },
    { date: "Nov 18", critical: 39, high: 164, medium: 311 },
    { date: "Nov 19", critical: 38, high: 164, medium: 312 },
  ],
};

const RANGE_30D = {
  value: "30d",
  label: "Last 30 days",
  description: "Open findings by severity",
  trend: [
    { date: "Oct 21", critical: 52, high: 178, medium: 322 },
    { date: "Oct 24", critical: 49, high: 176, medium: 320 },
    { date: "Oct 27", critical: 47, high: 173, medium: 318 },
    { date: "Oct 30", critical: 45, high: 171, medium: 316 },
    { date: "Nov 2", critical: 44, high: 169, medium: 314 },
    { date: "Nov 5", critical: 43, high: 168, medium: 313 },
    { date: "Nov 8", critical: 42, high: 167, medium: 311 },
    { date: "Nov 11", critical: 41, high: 166, medium: 312 },
    { date: "Nov 14", critical: 40, high: 165, medium: 310 },
    { date: "Nov 17", critical: 39, high: 164, medium: 311 },
    { date: "Nov 19", critical: 38, high: 164, medium: 312 },
  ],
};

const RANGE_90D = {
  value: "90d",
  label: "Last 90 days",
  description: "Weekly open findings by severity",
  trend: [
    { date: "Sep 1", critical: 78, high: 214, medium: 348 },
    { date: "Sep 8", critical: 74, high: 209, medium: 344 },
    { date: "Sep 15", critical: 71, high: 206, medium: 341 },
    { date: "Sep 22", critical: 68, high: 202, medium: 338 },
    { date: "Sep 29", critical: 66, high: 198, medium: 334 },
    { date: "Oct 6", critical: 63, high: 194, medium: 331 },
    { date: "Oct 13", critical: 59, high: 190, medium: 329 },
    { date: "Oct 20", critical: 55, high: 186, medium: 327 },
    { date: "Oct 27", critical: 51, high: 181, medium: 324 },
    { date: "Nov 3", critical: 46, high: 175, medium: 320 },
    { date: "Nov 10", critical: 42, high: 169, medium: 316 },
    { date: "Nov 17", critical: 39, high: 164, medium: 311 },
  ],
};

export const RANGE_OPTIONS = [RANGE_7D, RANGE_30D, RANGE_90D];

export function getRange(value) {
  return RANGE_OPTIONS.find((range) => range.value === value) ?? RANGE_90D;
}

export const METRICS = [
  { label: "External assets", value: "2,847" },
  { label: "Critical exposures", value: "38" },
  { label: "SLA compliance", value: "86%" },
  { label: "Mean time to remediate", value: "6.4d" },
];

export const RISK_DRIVERS = [
  { label: "Internet-facing admin consoles", detail: "14 assets", value: 38 },
  { label: "Public cloud storage", detail: "4 buckets", value: 27 },
  { label: "Weak or expired TLS", detail: "6 endpoints", value: 21 },
  { label: "Third-party scripts", detail: "11 domains", value: 14 },
];

export const SEVERITY_MIX = [
  { key: "critical", label: "Critical", value: 38, color: "#DC2626" },
  { key: "high", label: "High", value: 164, color: "#F97316" },
  { key: "medium", label: "Medium", value: 312, color: "#EAB308" },
  { key: "low", label: "Low", value: 241, color: "#A1A1AA" },
];

export const SURFACE_MIX = [
  { label: "Subdomains", value: 1248 },
  { label: "Web apps", value: 594 },
  { label: "IP addresses", value: 486 },
  { label: "APIs", value: 212 },
  { label: "Cloud", value: 93 },
  { label: "Other", value: 214 },
];

export const ASSET_COLORS = [
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#F43F5E",
  "#8B5CF6",
  "#64748B",
];

export const BUSINESS_UNITS = [
  { label: "Payments", value: 268 },
  { label: "Wealth", value: 184 },
  { label: "Insurance", value: 142 },
  { label: "Corporate", value: 94 },
  { label: "Shared", value: 67 },
];

export const ATTENTION_ITEMS = [
  {
    id: "SIG-2481",
    severity: "Critical",
    title: "Unauthenticated Grafana console",
    asset: "admin.meridian-pay.com",
    sla: "4d over SLA",
  },
  {
    id: "SIG-2474",
    severity: "Critical",
    title: "Public bucket exposes customer exports",
    asset: "s3://mrc-backups-prod",
    sla: "2d over SLA",
  },
  {
    id: "SIG-2469",
    severity: "High",
    title: "SSL VPN portal missing MFA",
    asset: "vpn.eu.meridian-pay.com",
    sla: "Due today",
  },
];

export const FINDINGS = [
  {
    id: "SIG-2481",
    title: "Unauthenticated Grafana console",
    asset: "admin.meridian-pay.com",
    address: "18.194.22.41",
    surface: "Web application",
    surfaceKey: "web",
    severity: "Critical",
    cvss: 9.8,
    sla: { label: "4d over SLA", overdue: true },
    owner: { name: "Priya Nair", team: "Payments" },
    status: "In progress",
    detected: "2h ago",
    firstSeen: "Nov 19, 2026 · 07:26 UTC",
    confidence: "Confirmed",
    description:
      "The Grafana administrative console is reachable from the public internet and accepts anonymous dashboard queries. A misconfigured anonymous role exposes datasource metadata and query results.",
    evidence:
      'HTTP/2 200 OK\nserver: grafana\nset-cookie: grafana_session=...\nGET /api/datasources -> 200\nGET /api/health -> {"database":"ok"}',
    remediation:
      "Disable anonymous access, require SSO through the corporate identity provider, and restrict the console to the VPN egress range. Rotate datasource credentials after applying the change.",
  },
  {
    id: "SIG-2474",
    title: "Public bucket exposes customer exports",
    asset: "s3://mrc-backups-prod",
    address: "Cloud storage",
    surface: "Cloud storage",
    surfaceKey: "cloud",
    severity: "Critical",
    cvss: 9.1,
    sla: { label: "2d over SLA", overdue: true },
    owner: { name: "Lukas Weber", team: "Cloud platform" },
    status: "Triaged",
    detected: "6h ago",
    firstSeen: "Nov 19, 2026 · 03:12 UTC",
    confidence: "Confirmed",
    description:
      "An S3 bucket used for nightly customer data exports allows anonymous ListBucket and GetObject. Object names follow the customer account identifier and export date.",
    evidence:
      "aws s3 ls s3://mrc-backups-prod -> PRE 2026-11-18/\nGET /mrc-backups-prod/2026-11-18/customer-exports.zip -> 200\nx-amz-request-id: 8F3A...",
    remediation:
      "Enable S3 Block Public Access at the account level, replace the bucket policy with an explicit deny for anonymous principals, and confirm the retention policy for affected exports.",
  },
  {
    id: "SIG-2469",
    title: "SSL VPN portal missing MFA",
    asset: "vpn.eu.meridian-pay.com",
    address: "52.58.19.7",
    surface: "Remote access",
    surfaceKey: "remote",
    severity: "High",
    cvss: 8.2,
    sla: { label: "Due today", overdue: false },
    owner: { name: "Sofia Almeida", team: "Infrastructure" },
    status: "In progress",
    detected: "1d ago",
    firstSeen: "Nov 18, 2026 · 12:04 UTC",
    confidence: "Confirmed",
    description:
      "The perimeter VPN portal accepts password-only authentication for a subset of contractor accounts. Device posture checks are not enforced for that identity group.",
    evidence:
      "GET /remote/login -> 200\nRealm: contractors\nAuth methods: password\nMFA: disabled",
    remediation:
      "Enforce MFA for all identity groups, remove the contractor bypass, and require device posture before tunnel establishment.",
  },
  {
    id: "SIG-2461",
    title: "GraphQL introspection publicly enabled",
    asset: "api.partner.meridian-pay.com",
    address: "3.126.7.18",
    surface: "API",
    surfaceKey: "api",
    severity: "High",
    cvss: 7.5,
    sla: { label: "2d left", overdue: false },
    owner: { name: "Daniel Kim", team: "Partner APIs" },
    status: "Open",
    detected: "1d ago",
    firstSeen: "Nov 18, 2026 · 09:41 UTC",
    confidence: "Confirmed",
    description:
      "The partner GraphQL endpoint returns its full schema to unauthenticated callers. Introspection reveals internal mutations and deprecated administrative fields.",
    evidence:
      'POST /graphql {"query":"{ __schema { types { name } } }"} -> 200\nschema.typeCount: 184\nmutations: 31',
    remediation:
      "Disable introspection outside development, require partner authentication at the gateway, and review the schema for fields that should not be publicly discoverable.",
  },
  {
    id: "SIG-2454",
    title: "Expired TLS certificate on payments edge",
    asset: "pay.meridian-pay.com",
    address: "34.89.11.20",
    surface: "Web application",
    surfaceKey: "web",
    severity: "High",
    cvss: 7.4,
    sla: { label: "1d left", overdue: false },
    owner: { name: "Amara Okafor", team: "Payments" },
    status: "In progress",
    detected: "2d ago",
    firstSeen: "Nov 17, 2026 · 16:19 UTC",
    confidence: "Confirmed",
    description:
      "The edge load balancer is serving an expired certificate for the payment authorization hostname. Clients relying on strict validation will receive a trust error.",
    evidence:
      "tls.connect pay.meridian-pay.com:443\nvalid_to: Nov 16 23:59:59 2026 GMT\nerror: CERT_HAS_EXPIRED",
    remediation:
      "Install the renewed certificate chain, verify OCSP stapling, and roll the edge configuration across all regions.",
  },
  {
    id: "SIG-2448",
    title: "Public Jenkins controller exposed",
    asset: "ci.meridian-pay.com",
    address: "18.157.88.12",
    surface: "Web application",
    surfaceKey: "web",
    severity: "High",
    cvss: 7.1,
    sla: { label: "3d left", overdue: false },
    owner: { name: "Marcus Chen", team: "Engineering" },
    status: "Triaged",
    detected: "2d ago",
    firstSeen: "Nov 17, 2026 · 08:52 UTC",
    confidence: "Confirmed",
    description:
      "A Jenkins controller is reachable without network restrictions. Anonymous users can enumerate jobs and read build parameters that reference deployment secrets by name.",
    evidence:
      "GET /api/json -> 200\njobs: 214\nanonymous.read: true\nsecurityRealm: none",
    remediation:
      "Move the controller behind the corporate network or an identity-aware proxy, disable anonymous read access, and rotate any credentials referenced by public job parameters.",
  },
  {
    id: "SIG-2439",
    title: "Exposed .git directory on marketing site",
    asset: "www.meridian-pay.com",
    address: "151.101.2.18",
    surface: "Web application",
    surfaceKey: "web",
    severity: "Medium",
    cvss: 6.5,
    sla: { label: "6d left", overdue: false },
    owner: { name: "Elena Rossi", team: "Brand" },
    status: "Open",
    detected: "3d ago",
    firstSeen: "Nov 16, 2026 · 14:30 UTC",
    confidence: "Confirmed",
    description:
      "The marketing site serves its .git metadata directory, including commit history and a configuration file with a legacy deployment token.",
    evidence:
      "GET /.git/config -> 200\nGET /.git/HEAD -> ref: refs/heads/main\ndeploy token: legacy-edge-...",
    remediation:
      "Block dotfile access at the edge, remove the directory from the deployed artifact, and revoke the legacy deployment token.",
  },
  {
    id: "SIG-2431",
    title: "S3 website endpoint allows directory listing",
    asset: "assets.meridian-pay.com",
    address: "Cloud storage",
    surface: "Cloud storage",
    surfaceKey: "cloud",
    severity: "Medium",
    cvss: 6.1,
    sla: { label: "8d left", overdue: false },
    owner: { name: "Lukas Weber", team: "Cloud platform" },
    status: "Risk accepted",
    detected: "4d ago",
    firstSeen: "Nov 15, 2026 · 11:08 UTC",
    confidence: "Likely",
    description:
      "The static asset bucket returns an index for directories without an object. The content is intended for public consumption but reveals draft campaign folders.",
    evidence: "GET /2026/campaigns/ -> 200\nObjects: draft-q4, press-kit-v3",
    remediation:
      "Disable the static website index document, add a deny for ListBucket, and verify that draft folders are not deployed to the production bucket.",
  },
  {
    id: "SIG-2425",
    title: "Deprecated API version exposed",
    asset: "api.meridian-pay.com",
    address: "3.120.44.91",
    surface: "API",
    surfaceKey: "api",
    severity: "Medium",
    cvss: 5.8,
    sla: { label: "9d left", overdue: false },
    owner: { name: "Daniel Kim", team: "Partner APIs" },
    status: "Open",
    detected: "5d ago",
    firstSeen: "Nov 14, 2026 · 18:43 UTC",
    confidence: "Confirmed",
    description:
      "API v1 remains reachable after the published deprecation date. It returns verbose validation errors and lacks the rate limits enforced on v2.",
    evidence: "GET /v1/accounts -> 200\nDeprecation: true\nSunset not enforced",
    remediation:
      "Return 410 for v1 routes, remove the v1 deployment from the gateway, and confirm that remaining partner integrations have migrated.",
  },
  {
    id: "SIG-2417",
    title: "SPF record missing for secondary domain",
    asset: "notifications.meridian-pay.com",
    address: "DNS record",
    surface: "Email",
    surfaceKey: "email",
    severity: "Medium",
    cvss: 5.3,
    sla: { label: "11d left", overdue: false },
    owner: { name: "Amara Okafor", team: "Payments" },
    status: "Triaged",
    detected: "6d ago",
    firstSeen: "Nov 13, 2026 · 10:22 UTC",
    confidence: "Confirmed",
    description:
      "The notification domain has no SPF record and uses a permissive DMARC policy. This increases the domain’s susceptibility to sender spoofing.",
    evidence:
      "dig TXT notifications.meridian-pay.com\n-> (no SPF record)\nDMARC: v=DMARC1; p=none",
    remediation:
      "Publish an SPF record that includes the transactional email provider, move DMARC to p=quarantine, and monitor the aggregate reports for two weeks.",
  },
  {
    id: "SIG-2409",
    title: "Legacy FTP service reachable",
    asset: "ftp.meridian-pay.com",
    address: "52.57.101.34",
    surface: "Remote access",
    surfaceKey: "remote",
    severity: "High",
    cvss: 7.0,
    sla: { label: "1d over SLA", overdue: true },
    owner: { name: "Sofia Almeida", team: "Infrastructure" },
    status: "In progress",
    detected: "7d ago",
    firstSeen: "Nov 12, 2026 · 06:17 UTC",
    confidence: "Confirmed",
    description:
      "A legacy FTP endpoint remains reachable on the public internet. The service advertises anonymous read access and has no transport encryption.",
    evidence:
      "220 FTP server ready\nUSER anonymous -> 230 Login successful\nPASV supported, TLS not advertised",
    remediation:
      "Decommission the FTP endpoint, migrate the remaining batch partner to SFTP over the VPN, and block port 21 at the perimeter.",
  },
  {
    id: "SIG-2401",
    title: "Password policy weakened on support portal",
    asset: "support.meridian-pay.com",
    address: "18.198.14.77",
    surface: "Web application",
    surfaceKey: "web",
    severity: "Low",
    cvss: 3.7,
    sla: { label: "18d left", overdue: false },
    owner: { name: "Elena Rossi", team: "Brand" },
    status: "Open",
    detected: "8d ago",
    firstSeen: "Nov 11, 2026 · 09:05 UTC",
    confidence: "Likely",
    description:
      "The support portal accepts eight-character passwords without a breach-list check. This does not expose data directly but increases account takeover risk.",
    evidence:
      "POST /api/register password=12345678 -> 201\nPolicy: minLength=8, hibp=false",
    remediation:
      "Raise the minimum length to twelve characters, add a breached-password check, and notify users with a grace period before enforcement.",
  },
];

export const LATEST = {
  updated: "19 Nov 2026, 09:42 UTC",
  assets: 2847,
  domains: 42,
  subsidiaries: 27,
  openFindings: 755,
  score: 68,
  criticalPastSla: 9,
};
