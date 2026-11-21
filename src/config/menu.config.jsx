import { icon } from 'leaflet';
import { AlertCircle, Award, Badge, BadgeAlert, Ban, Bell, BetweenHorizontalStart, Bitcoin, Bolt, Book, Bot, BotIcon, Box, Boxes, BrainCog, Briefcase, Bug, BugPlay, Building, Building2, CalendarCheck, CalendarClock, CalendarRange, Captions, ChartCandlestick, ChartPie, CheckCircle, ClipboardCheck, Clock, CloudAlert, Code, Code2Icon, CodeIcon, Codepen, CodeSquare, Coffee, Crosshair, File as DocumentIcon, Euro, Eye, File, FileBarChart, FileQuestion, FileText, Flag, FolderOutput, Ghost, Gift, GitPullRequestDraft, Globe, Grid, Group, HatGlasses, Heart, HelpCircle, History, Kanban, Key, Layers, Layout, LayoutDashboard, LayoutGrid, LifeBuoy, Link, Link2, List, ListCheck, ListOrdered, LockIcon, Logs, MessageSquare, Monitor, MonitorCloud, Network, NotebookText, Users as PeopleIcon, PlayCircle, Plug, PlugZap, Radar, Rocket, ScanEye, ScanQrCode, ScanSearch, ScrollText, Search, Server, Settings, Shapes, Share2, Shield, ShieldAlert, ShieldCheck, ShieldEllipsis, ShieldHalf, ShieldMinus, ShieldOff, ShieldUser, ShoppingCart, SlidersHorizontal, Sparkles, SquareChartGantt, SquareMousePointer, SquarePen, Star, Tags, Target, Theater, ThumbsUp, TrendingUp, TriangleAlert, Unplug, UserCheck, UserCircle, Users, Workflow, Briefcase as WorkIcon, Zap } from 'lucide-react';
import { BlockersCountBadge } from './sidebar-custom-comps-index';


// ----------- PRODUCT WISE SIDE BARS ----------------- //
export const VM_SIDEBAR = [


  {
    title: 'Dashboards',
    icon: LayoutGrid,
    children: [
      { title: 'Operational Analytics', icon: LayoutGrid, path: '/vm?type=opt' },
      { title: 'Risk Analytics', icon: LayoutGrid, path: '/vm?type=risk', forbid: ['Developer'] },
      { title: 'Source Analytics', icon: LayoutGrid, path: '/vm/vulnerability-sources', forbid: ['Developer'] },
    ],
  },

  // { heading: 'ASSESSMENT MANAGEMENT' },

  // { title: 'Change Management', icon: Bolt, path: '/vm/change-management' },

  { heading: 'VULNERABILITY MANAGEMENT' },
  // {
  //   title: 'Vulnerabilities',
  //   icon: Bug,
  //   children: [
  //     { title: 'Vulnerabilities', path: '/vm/vulnerabilities' },
  //     { title: 'Archived', path: '/vm/archived-vulns' },
  //     { title: 'Groups', path: '/vm/vulnerability-list' },
  //   ],
  // },
  {
    title: 'Assessments',
    icon: ClipboardCheck,
    children: [
      { title: 'Assessments', path: '/vm/assessments' },
      { title: 'Groups', path: '/vm/folders' },
      { title: 'Change Management', path: '/vm/change-management' },
    ],
    forbid: ['Developer'],
  },

  {
    title: 'Vulnerabilities',
    icon: Bug,
    children: [
      { title: 'All Vulnerabilities', path: '/vm/vulnerabilities' },
      {
        title: 'My Vulnerabilities',
        path: '/vm/vulnerabilities?owner=my-vulns',
      },
      {
        title: 'Active Vulnerabilities',
        path: '/vm/vulnerabilities?status=active',
      },
      // {
      //   title: 'Top Risks',
      //   path: '/vm/vulnerabilities?status=top-risks',
      // },
      {
        title: 'Closed Vulnerabilities',
        path: '/vm/vulnerabilities?status=closed',
      },
      { title: 'Archived Vulnerabilities', path: '/vm/archived-vulns' },
      { title: 'Vulnerability Groups', path: '/vm/vulnerability-list' },
      { title: 'Advanced Search ', path: '/vm/search' },
    ],
  },
  {
    title: 'Prioritization',
    icon: ListOrdered,
    children: [
      { title: 'Remediation Campaigns', path: '/vm/remidation-campaigns' },
      {
        title: 'False Positive Analysis',
        path: '/vm/false-positive-analysis',
        forbid: ['Developer'],
      },
      {
        title: 'Risk Relevance Groups',
        path: '/vm/relevance-groups',
        forbid: ['Developer'],
      },
      {
        title: 'True Risk',
        path: '/vm/true-risk',
        forbid: ['Developer', 'Manager'],
      },
    ],
  },
  // { title: 'Search', icon: Search, path: '/vm/search' },
  {
    title: 'Blockers',
    icon: ShieldOff,
    path: '/vm/blockers',
    customComponent: <BlockersCountBadge />,
  },
  // {
  //   title: 'Normalization Engine',
  //   icon: BotIcon,
  //   path: '/vm/normalization-engine',
  //   forbid: ["Developer", "Manager"],
  // },

  { heading: 'ASSET MANAGEMENT' },
  { title: 'Asset catalog', icon: Shapes, path: '/vm/assets' },
  {
    title: 'Business Units',
    icon: Box,
    path: '/vm/business-units',
    forbid: ['Developer'],
  },

  { heading: 'REPORTING & COMPLIANCE', forbid: ['Developer'] },
  {
    title: 'SLA',
    icon: Clock,
    path: '/vm/sla',
    forbid: ['Developer'],
  },
  {
    title: 'Risk Acceptance',
    icon: Shield,
    path: '/vm/risk-acceptance',
    forbid: ['Developer'],
  },

  {
    title: 'Reports and Vendors',
    icon: FileBarChart,
    children: [
      { title: 'Reports', path: '/vm/reports' },
      { title: 'Service Vendors', path: '/vm/service-vendors' },
    ],
    forbid: ['Developer'],
  },

  { heading: 'AUTOMATIONS & INTEGRATIONS', forbid: ['Developer'] },

  // {
  //   title: 'Automations',
  //   icon: Workflow,
  //   children: [
  //     { title: 'Workflow Automation', path: '/vm/automation-engine' },
  //   ],
  //   forbid: ['Developer'],
  // },
  {
    title: "Workflow Automation",
    icon: Workflow,
    path: "/vm/automation-engine",
    forbid: ['Developer', 'Manager'],
  },
  {
    title: 'Integrations',
    forbid: ['Developer',],
    icon: Network,
    path: '/vm/integrations',
  },
];

export const DEMO_SIDEBAR = [
  { title: 'Dashboard', icon: LayoutGrid, path: '/demo' },
  {
    title: 'Assessments',
    icon: CalendarRange,
    children: [
      { title: 'Assessments', path: '/demo#1000' },
      { title: 'Groups', path: '/demo#999' },
    ],
  },
  {
    title: 'Vulnerabilities',
    icon: Bug,
    children: [
      { title: 'Vulnerabilities', path: '/demo#888' },
      { title: 'Groups', path: '/demo#777' },
    ],
  },
  { title: 'Search', icon: Search, path: '/demo#666' },
  { title: 'Assets', icon: Shapes, path: '/demo#555' },
  { title: 'Change Management', icon: Bolt, path: '/demo#444' },
  { title: 'Reports', icon: ChartPie, path: '/demo#333' },
  { title: 'Blockers', icon: ShieldAlert, path: '/demo#22' },
  { title: 'Integrations', icon: Network, path: '/demo#11' },
  { title: 'Service Vendors', icon: Building, path: '/demo/service-vendors' },
  { title: 'Vuln Sources', icon: Radar, path: '/demo/vuln-sources' },
];

export const ADMIN_SIDEBAR = [
  { title: 'Organisations', icon: Building, path: '/adminforleads/orgs' },
  { title: 'Leads', icon: Users, path: '/adminforleads/leads' },
];

export const ADMIN_TOPBAR = [
  { title: 'Organizations', icon: Building, path: '/adminforleads/orgs' },
  { title: 'Leads', icon: Users, path: '/adminforleads/leads' },
  { title: 'Backups', icon: Users, path: '/adminforleads/backups' },
];

export const RR_SIDEBAR = [
  { title: 'Dashboard', icon: LayoutGrid, path: '/rr' },
  { title: 'Risk', icon: TriangleAlert, path: '/rr/risks' },
  { title: 'Rules', icon: ListCheck, path: '/rr/rules' },
  { title: 'Frameworks', icon: ShieldHalf, path: '/rr/framework' },
  { title: 'Business Units', icon: Boxes, path: '/rr/business-units' },
];

export const VDP_SIDEBAR = [
  { title: 'Dashboard', icon: LayoutGrid, path: '/vdp/dashboard' },
  { title: 'Policy', icon: ScrollText, path: '/vdp/policy' },
  { title: 'Leaderboard', icon: Award, path: '/vdp/leaderboard' },
  { title: 'Vulnerabilities', icon: Bug, path: '/vdp/vulnerabilities' },
  { title: 'Hacker Pool', icon: Users, path: '/vdp/hackerpool' },
  { title: 'Share', icon: Share2, path: '/vdp/share' },
];

export const ASM_SIDEBAR = [
  // {
  //   title: 'Dashboards',
  //   icon: LayoutGrid,
  //   children: [
  //     { title: 'Executive', icon: LayoutGrid, path: '/casm' },
  //     { title: 'Analytics', icon: LayoutGrid, path: '/casm/dashboards/analytics' },
  //   ],
  // },


  {
    title: 'Dashboard',
    icon: LayoutGrid,
    path: '/casm',
  },

  { heading: 'ATTACK SURFACE MANAGEMENT' },
  {
    title: 'Assets Discovered',
    icon: Globe,
    path: '/casm/assets',
  },
  {
    title: 'Exposures',
    icon: ShieldAlert,
    path: '/casm/exposures',
  },
  {
    title: 'Custom Rule',
    icon: SlidersHorizontal,
    path: '/casm/rules',
  },

  // { heading: 'EXPOSURE MANAGEMENT' },

  // { title: 'Scans', icon: ScanSearch, path: '/casm/scans' },
  { heading: 'REPORTING & SETTINGS' },
  { title: 'Scans', icon: ScanSearch, path: '/casm/scans' },
  { title: 'Reports', icon: ChartPie, path: '/casm/reports' },

  { title: 'Blacklist Rules', icon: Ban, path: '/casm/blacklist-rules' },

  {
    title: 'Settings',
    roles: ['Admin'],
    icon: Settings,
    path: '/casm/settings',
  },

  // { heading: 'SETTINGS', roles: ['Admin'] },
  // {
  //   title: 'Settings',
  //   roles: ['Admin'],
  //   icon: Settings,
  //   path: '/casm/settings',
  // },
];

export const AIM_SIDEBAR = [
  { title: 'Dashboard', icon: LayoutGrid, path: '/caim' },
  {
    title: 'Assets',
    icon: ChartCandlestick,
    children: [
      { title: 'All Assets', path: '/caim/assets' },
      { title: 'Subdomains', path: '/caim/assets/subdomains' },
      { title: 'APIs', path: '/caim/assets/apis' },
      { title: 'IP Addresses', path: '/caim/assets/ips' },
      { title: 'DNS Records', path: '/caim/assets/dns-records' },
      { title: 'Repositories', path: '/caim/assets/repositories' },
      { title: 'Certificates', path: '/caim/assets/certificates' },
      { title: 'Employees', path: '/caim/assets/employees' },
      { title: 'Applications', path: '/caim/assets/applications' },
      { title: 'Technologies', path: '/caim/assets/technologies' },
      { title: 'Compartments', path: '/caim/assets/compartments' },
      { title: 'Workstations', path: '/caim/assets/workstation' },
      { title: 'Servers', path: '/caim/assets/servers' },
      { title: 'Registries', path: '/caim/assets/registries' },
      { title: 'Object Storages', path: '/caim/assets/object-storage' },
      { title: 'Service Vendors', path: '/caim/assets/service-vendors' },
      { title: 'Licensing', path: '/caim/assets/licenses' },
    ],
  },
  {
    title: 'Decommissioned',
    icon: ShieldMinus,
    children: [
      { title: 'Staged', path: '/caim/assets/staged' },
      { title: 'Decommissioned', path: '/caim/assets/decomissioned' },
    ],
  },
  { title: 'Integrations', icon: Unplug, path: '/caim/adapters' },
  { title: 'Classifiers', icon: Shapes, path: '/caim/classifiers' },
  {
    title: 'Settings',
    icon: Settings,
    children: [
      {
        title: 'Adapter Settings',
        path: '/caim/settings?tab=adapter-settings',
      },
      {
        title: 'Global Settings',
        path: '/caim/settings?tab=global-settings',
      },
      {
        title: 'Decommission Workflow',
        path: '/caim/settings?tab=lifecycle-management',
      },
      {
        title: 'Default Ownership',
        path: '/caim/settings?tab=default-ownership',
      },
      {
        title: 'Custom Fields',
        path: '/caim/settings?tab=custom-fields',
      },
      {
        title: 'Tags',
        path: '/caim/settings?tab=tags',
      },
    ],
  },
  { title: 'Tags', icon: Tags, path: '/caim/tags' },
  { title: 'Groups', icon: Group, path: '/caim/groups' },
  { title: 'Export', icon: FolderOutput, path: '/caim/export' },
];

export const ASSET_INVENTORY_SIDEBAR = [
  { title: 'Dashboard', icon: LayoutGrid, path: '/assetinventory' },
  { heading: 'Inventory Management' },
  {
    title: 'Assets Inventory',
    icon: ChartCandlestick,
    children: [
      {
        title: 'Advanced Search',
        path: '/assetinventory/advance-search',
      },
      { title: 'Subdomains', path: '/assetinventory/assets/subdomains' },
      { title: 'APIs', path: '/assetinventory/assets/apis' },
      { title: 'IP Addresses', path: '/assetinventory/assets/ips' },
      // { title: 'DNS Records', path: '/assetinventory/assets/dns-records' },
      { title: 'Repositories', path: '/assetinventory/assets/repositories' },
      { title: 'Certificates', path: '/assetinventory/assets/certificates' },
      { title: 'Employees', path: '/assetinventory/assets/employees' },
      { title: 'Applications', path: '/assetinventory/assets/applications' },
      { title: 'Workstations', path: '/assetinventory/assets/workstation' },
      { title: 'Servers', path: '/assetinventory/assets/servers' },
      { title: 'Registries', path: '/assetinventory/assets/registries' },
      {
        title: 'Object Storages',
        path: '/assetinventory/assets/object-storage',
      },
      {
        title: 'Business Units',
        path: '/assetinventory/business-units',
      },
      {
        title: 'Licensing',
        path: '/assetinventory/assets/licenses',
      },
      {
        title: 'Vendors',
        path: '/assetinventory/assets/vendors',
      },
    ],
  },

  {
    title: 'Manage Assets',
    icon: SlidersHorizontal,
    path: '/assetinventory/edit-asset',
  },

  {
    title: 'Lifecycle Management',
    icon: ShieldMinus,
    children: [
      { title: 'Staged', path: '/assetinventory/assets/staged' },
      { title: 'Decommissioned', path: '/assetinventory/assets/decomissioned' },
    ],
  },

  { heading: 'Sensor Management' },
  { title: 'Sensor Inventory', icon: Bot, path: '/assetinventory/agent-list' },
  {
    title: 'Sensor Deployment',
    icon: Settings,
    path: '/assetinventory/agent-settings',
  },

  { heading: 'Automations and Reports' },
  {
    title: 'Automation',
    icon: Workflow,
    path: '/assetinventory/automation',
  },
  { title: 'Reports', icon: FileText, path: '/assetinventory/export' },

  { heading: 'Integrations and Settings' },
  { title: 'Integrations', icon: Unplug, path: '/assetinventory/adapters' },
  {
    title: 'Settings',
    icon: Settings,
    roles: ['Admin', 'Manager'],
    children: [
      {
        title: 'Adapter Settings',
        path: '/assetinventory/settings?tab=adapter-settings',
      },
      {
        title: 'Global Settings',
        path: '/assetinventory/settings?tab=global-settings',
      },
      {
        title: 'Decommission Workflow',
        path: '/assetinventory/settings?tab=lifecycle-management',
      },
      {
        title: 'Default Ownership',
        path: '/assetinventory/settings?tab=default-ownership',
      },
      {
        title: 'Custom Fields',
        path: '/assetinventory/settings?tab=custom-fields',
      },
      {
        title: 'Tags',
        path: '/assetinventory/settings?tab=tags',
      },
    ],
  },
];

export const AGENT_SIDEBAR = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/agent' },
  { title: 'Agent Inventory', icon: Bot, path: '/agent/inventory' },
  { title: 'Deployment', icon: Rocket, path: '/agent/deployment' },
  { title: 'Settings', icon: Settings, path: '/agent/settings' },
];

export const AW_SIDEBAR = [
  // { heading: 'Automation Agents' },
  { title: 'Dashboard', icon: LayoutGrid, path: '/ai-agent-builder' },
  // { title: 'Agent Library', icon: Bot, path: '/ai-agent-builder/agents/library'  {},
  { heading: 'Agent Management' },
  { title: 'Agents', icon: Bot, path: '/ai-agent-builder/agents' },
  { title: 'Skills', icon: Sparkles, path: '/ai-agent-builder/skills' },
  { title: 'Playground', icon: Rocket, path: '/ai-agent-builder/playground' },

  { heading: 'Automation Workflows' },
  { title: 'Workflows', icon: Workflow, path: '/ai-agent-builder/workflows' },
  { title: 'Runs', icon: History, path: '/ai-agent-builder/runs' },

  { heading: 'Integratoins And Settings' },
  { title: 'Models', icon: PlugZap, path: '/ai-agent-builder/models' },
];

export const APT_SIDEBAR = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/apt' },

  { heading: 'Attack' },
  {
    title: 'AI Pentesting',
    icon: Crosshair,
    children: [
      { title: 'Overview', path: '/apt/pentesting/overview' },
      { title: 'Projects', path: '/apt/pentesting/projects?type=pentest' },
      { title: 'Findings', path: '/apt/pentesting/findings' },
    ],
  },
  {
    title: 'Vulnerability Scanning',
    icon: Radar,
    children: [
      { title: 'Overview', path: '/apt/vulnerability-scanning/overview' },
      { title: 'Projects', path: '/apt/vulnerability-scanning/projects?type=vulnerability-scan' },
      { title: 'Findings', path: '/apt/vulnerability-scanning/findings' },
    ],
  },
  {
    title: 'Cloud Security',
    icon: CloudAlert,
    children: [
      { title: 'Overview', path: '/apt/cloud-security/overview' },
      { title: 'Cloud Accounts', path: '/apt/cloud-security/projects?type=cloud' },
      { title: 'Findings', path: '/apt/cloud-security/findings?type=cloud' },
    ],
  },
  {
    title: 'Code Security',
    icon: Code2Icon,
    children: [
      { title: 'Overview', path: '/apt/code-security/overview' },
      { title: 'Projects', path: '/apt/code-security/projects?type=code-security' },
      { title: 'Findings', path: '/apt/code-security/findings' },
      { title: 'Settings', path: '/apt/code-security/settings' },
    ],
  },

  { heading: 'Discover' },
  { title: 'Assets', icon: Server, path: '/apt/assets' },

  { heading: 'Remediate' },
  { title: 'Vulnerabilities', icon: ShieldAlert, path: '/apt/vulnerablities' },

  { heading: 'Other' },
  { title: 'Scan Logs', icon: ScanSearch, path: '/apt/scans' },
  { title: 'Integrations', icon: PlugZap, path: '/apt/integrations' },
];

// works on path
export const PRODUCT_TO_MENU = {
  vm: VM_SIDEBAR,
  aim: AIM_SIDEBAR,
  caim: AIM_SIDEBAR,
  assetinventory: ASSET_INVENTORY_SIDEBAR,
  asm: ASM_SIDEBAR,
  casm: ASM_SIDEBAR,
  vdp: VDP_SIDEBAR,
  admin: ADMIN_SIDEBAR,
  rr: RR_SIDEBAR,
  demo: DEMO_SIDEBAR,
  agent: AGENT_SIDEBAR,
  "ai-agent-builder": AW_SIDEBAR,
  "apt": APT_SIDEBAR,
};

// ----------- PRODUCT WISE TOP BAR ------------------- //
export const VM_TOPBAR = [{ title: 'Dashboard', path: '/vm' }];
export const VDP_TOPBAR = [{ title: 'Dashboard', path: '/home' }];
export const ASM_TOPBAR = [{ title: 'Dashboard', path: '/home' }];
export const AIM_TOPBAR = [{ title: 'Dashboard', path: '/home' }];

export const AUTH_TOPBAR = [
  {
    title: 'My Account',
    icon: Settings,
    children: [
      {
        title: 'Account',
        children: [
          { title: 'Get Started', path: '/profile/started' },
          {
            title: 'Profile Settings',
            path: '/profile/account/user-info',
          },
          {
            title: 'Company Settings',
            path: '/profile/account/company-profile',
          },
        ],
      },
      {
        title: 'Security',
        forbid: ['Developer'],
        children: [
          // {
          //   title: 'Security Overview',
          //   path: '/profile/account/security/overview',
          //   roles: ['Admin'],
          // },
          {
            title: 'Current Sessions',
            path: '/profile/account/security/current-sessions',
            forbid: ['Developer'],
          },
          {
            title: 'Security Log',
            path: '/profile/account/security/security-log',
            forbid: ['Developer'],
          },
        ],
      },
      {
        title: 'Members & Teams',
        children: [
          {
            title: 'Departments',
            path: '/profile/account/members/departments',
          },

          // { title: 'Teams Starter', path: '/profile/account/members/team-starter' },
          { title: 'Teams', path: '/profile/account/members/teams' },
          // { title: 'Team Info', path: '/profile/account/members/team-info' },
          // {
          //   title: 'Members Starter',
          //   path: '/profile/account/members/members-starter',
          // },
          {
            title: 'Members',
            path: '/profile/account/members/team-members',
          },

          // { title: 'Import Members', path: '/profile/account/members/import-members' },
          // { title: 'Roles', path: '/profile/account/members/roles' },
          // {
          //   title: 'Permissions',
          //   path: '/profile/account/members/permissions-toggle',
          // },
          // {
          //   title: 'Permissions - Check',
          //   path: '/profile/account/members/permissions-check',
          // },
        ],
      },
      // { title: 'Notifications', path: '/profile/account/notifications' },
      {
        title: 'Developer Access',
        children: [
          {
            title: 'API Keys',
            path: '/profile/account/api-keys',
            forbid: ['Auditor'],
          },

          {
            title: 'MCP Access',
            path: '/profile/account/mcp-access',
          },
        ],
      },
      {
        title: 'Integrations',
        path: '/profile/account/integrations',
        forbid: ['Developer'],
      },
      // {
      //   title: 'Configuration',
      //   path: '/profile/account/configration',
      //   roles: ['Admin'],
      // },

      // {
      //   title: 'AI Configuration',
      //   path: '/profile/account/ai-config',
      //   forbid: ['Developer', "Auditor"],
      // },
      {
        title: 'Data & Backup',
        path: '/profile/account/data-backup',
        roles: ['Platform Admin'],
      },
    ],
  },
];

export const MENU_SIDEBAR = [
  {
    title: 'Dashboard',
    icon: LayoutGrid,
    path: '/home',
    childrenIndex: 1,
  },
  {
    title: 'Scans',
    icon: LayoutGrid,
    path: '/scans',
    childrenIndex: 2,
  },
  {
    title: 'Groups',
    icon: LayoutGrid,
    path: '/groups',
    childrenIndex: 3,
  },
  {
    title: 'Assets',
    icon: Codepen,
    path: '/assets',
    childrenIndex: 4,
  },
  {
    title: 'Vulnerabilities',
    icon: LayoutGrid,
    path: '/vulns',
    childrenIndex: 5,
  },
];

export const MENU_SIDEBAR_CUSTOM = [
  {
    title: 'Store - Client',
    icon: Users,
    children: [
      { title: 'Home', path: '/store-client/home' },
      {
        title: 'Search Results',
        children: [
          {
            title: 'Search Results - Grid',
            path: '/store-client/search-results-grid',
          },
          {
            title: 'Search Results - List',
            path: '/store-client/search-results-list',
          },
        ],
      },
      {
        title: 'Overlays',
        children: [
          { title: 'Product Details', path: '/store-client/product-details' },
          { title: 'Wishlist', path: '/store-client/wishlist' },
        ],
      },
      {
        title: 'Checkout',
        children: [
          {
            title: 'Order Summary',
            path: '/store-client/checkout/order-summary',
          },
          {
            title: 'Shipping Info',
            path: '/store-client/checkout/shipping-info',
          },
          {
            title: 'Payment Method',
            path: '/store-client/checkout/payment-method',
          },
          {
            title: 'Order Placed',
            path: '/store-client/checkout/order-placed',
          },
        ],
      },
      { title: 'My Orders', path: '/store-client/my-orders' },
      { title: 'Order Receipt', path: '/store-client/order-receipt' },
    ],
  },
];

export const MENU_SIDEBAR_COMPACT = [
  {
    title: 'Dashboards',
    icon: LayoutGrid,
    path: '/',
  },
  {
    title: 'Public Profile',
    icon: UserCircle,
    children: [
      {
        title: 'Profiles',
        children: [
          { title: 'Default', path: '/public-profile/profiles/default' },
          { title: 'Creator', path: '/public-profile/profiles/creator' },
          { title: 'Company', path: '/public-profile/profiles/company' },
          { title: 'NFT', path: '/public-profile/profiles/nft' },
          { title: 'Blogger', path: '/public-profile/profiles/blogger' },
          { title: 'CRM', path: '/public-profile/profiles/crm' },
          {
            title: 'More',
            collapse: true,
            collapseTitle: 'Show less',
            expandTitle: 'Show 4 more',
            children: [
              { title: 'Gamer', path: '/public-profile/profiles/gamer' },
              { title: 'Feeds', path: '/public-profile/profiles/feeds' },
              { title: 'Plain', path: '/public-profile/profiles/plain' },
              { title: 'Modal', path: '/public-profile/profiles/modal' },
            ],
          },
        ],
      },
      {
        title: 'Projects',
        children: [
          { title: '3 Columns', path: '/public-profile/projects/3-columns' },
          { title: '2 Columns', path: '/public-profile/projects/2-columns' },
        ],
      },
      { title: 'Works', path: '/public-profile/works' },
      { title: 'Teams', path: '/public-profile/teams' },
      { title: 'Network', path: '/public-profile/network' },
      { title: 'Activity', path: '/public-profile/activity' },
      {
        title: 'More',
        collapse: true,
        collapseTitle: 'Show less',
        expandTitle: 'Show 3 more',
        children: [
          { title: 'Campaigns - Card', path: '/public-profile/campaigns/card' },
          { title: 'Campaigns - List', path: '/public-profile/campaigns/list' },
          { title: 'Empty', path: '/public-profile/empty' },
        ],
      },
    ],
  },
  {
    title: 'My Account',
    icon: Settings,
    children: [
      {
        title: 'Account',
        children: [
          { title: 'Get Started', path: '/account/home/get-started' },
          { title: 'User Profile', path: '/account/home/user-profile' },
          { title: 'Company Profile', path: '/account/home/company-profile' },
          {
            title: 'Settings - With Sidebar',
            path: '/account/home/settings-sidebar',
          },
          {
            title: 'Settings - Enterprise',
            path: '/account/home/settings-enterprise',
          },
          { title: 'Settings - Plain', path: '/account/home/settings-plain' },
          { title: 'Settings - Modal', path: '/account/home/settings-modal' },
        ],
      },
      {
        title: 'Billing',
        children: [
          { title: 'Billing - Basic', path: '/account/billing/basic' },
          {
            title: 'Billing - Enterprise',
            path: '/account/billing/enterprise',
          },
          { title: 'Plans', path: '/account/billing/plans' },
          { title: 'Billing History', path: '/account/billing/history' },
        ],
      },
      {
        title: 'Security',
        children: [
          { title: 'Get Started', path: '/account/security/get-started' },
          { title: 'Security Overview', path: '/account/security/overview' },
          {
            title: 'Allowed IP Addresses',
            path: '/account/security/allowed-ip-addresses',
          },
          {
            title: 'Privacy Settings',
            path: '/account/security/privacy-settings',
          },
          {
            title: 'Device Management',
            path: '/account/security/device-management',
          },
          {
            title: 'Backup & Recovery',
            path: '/account/security/backup-and-recovery',
          },
          {
            title: 'Current Sessions',
            path: '/account/security/current-sessions',
          },
          { title: 'Security Log', path: '/account/security/security-log' },
        ],
      },
      {
        title: 'Members & Teams',
        children: [
          { title: 'Teams Starter', path: '/account/members/team-starter' },
          { title: 'Teams', path: '/account/members/teams' },
          { title: 'Team Info', path: '/account/members/team-info' },
          {
            title: 'Members Starter',
            path: '/account/members/members-starter',
          },
          { title: 'Team Members', path: '/account/members/team-members' },
          { title: 'Import Members', path: '/account/members/import-members' },
          { title: 'Roles', path: '/account/members/roles' },
          {
            title: 'Permissions - Toggler',
            path: '/account/members/permissions-toggle',
          },
          {
            title: 'Permissions - Check',
            path: '/account/members/permissions-check',
          },
        ],
      },
      { title: 'Integrations', path: '/account/integrations' },
      { title: 'Notifications', path: '/account/notifications' },
      { title: 'API Keys', path: '/account/api-keys' },
      {
        title: 'More',
        collapse: true,
        collapseTitle: 'Show less',
        expandTitle: 'Show 3 more',
        children: [
          { title: 'Appearance', path: '/account/appearance' },
          { title: 'Invite a Friend', path: '/account/invite-a-friend' },
          { title: 'Activity', path: '/account/activity' },
        ],
      },
    ],
  },
  {
    title: 'Network',
    icon: Users,
    children: [
      { title: 'Get Started', path: '/network/get-started' },
      {
        title: 'User Cards',
        children: [
          { title: 'Mini Cards', path: '/network/user-cards/mini-cards' },
          { title: 'Team Crew', path: '/network/user-cards/team-crew' },
          { title: 'Author', path: '/network/user-cards/author' },
          { title: 'NFT', path: '/network/user-cards/nft' },
          { title: 'Social', path: '/network/user-cards/social' },
        ],
      },
      {
        title: 'User Table',
        children: [
          { title: 'Team Crew', path: '/network/user-table/team-crew' },
          { title: 'App Roster', path: '/network/user-table/app-roster' },
          {
            title: 'Market Authors',
            path: '/network/user-table/market-authors',
          },
          { title: 'SaaS Users', path: '/network/user-table/saas-users' },
          { title: 'Store Clients', path: '/network/user-table/store-clients' },
          { title: 'Visitors', path: '/network/user-table/visitors' },
        ],
      },
      { title: 'Cooperations', path: '/network/cooperations', disabled: true },
      { title: 'Leads', path: '/network/leads', disabled: true },
      { title: 'Donators', path: '/network/donators', disabled: true },
    ],
  },
  {
    title: 'Store - Client',
    icon: ShoppingCart,
    children: [
      { title: 'Home', path: '/store-client/home' },
      {
        title: 'Search Results - Grid',
        path: '/store-client/search-results-grid',
      },
      {
        title: 'Search Results - List',
        path: '/store-client/search-results-list',
      },
      { title: 'Product Details', path: '/store-client/product-details' },
      { title: 'Wishlist', path: '/store-client/wishlist' },
      {
        title: 'Checkout',
        children: [
          {
            title: 'Order Summary',
            path: '/store-client/checkout/order-summary',
          },
          {
            title: 'Shipping Info',
            path: '/store-client/checkout/shipping-info',
          },
          {
            title: 'Payment Method',
            path: '/store-client/checkout/payment-method',
          },
          {
            title: 'Order Placed',
            path: '/store-client/checkout/order-placed',
          },
        ],
      },
      { title: 'My Orders', path: '/store-client/my-orders' },
      { title: 'Order Receipt', path: '/store-client/order-receipt' },
    ],
  },
  {
    title: 'Authentication',
    icon: Shield,
    children: [
      {
        title: 'Classic',
        children: [
          { title: 'Sign In', path: '/auth/classic/signin' },
          { title: 'Sign Up', path: '/auth/classic/signup' },
          { title: '2FA', path: '/auth/classic/2fa' },
          { title: 'Check Email', path: '/auth/classic/check-email' },
          {
            title: 'Reset Password',
            children: [
              {
                title: 'Enter Email',
                path: '/auth/classic/request-reset',
              },
              {
                title: 'Check Email',
                path: '/auth/classic/reset-password/check-email',
              },
              {
                title: 'Password Changed',
                path: '/auth/classic/reset-password/changed',
              },
            ],
          },
        ],
      },
      {
        title: 'Branded',
        children: [
          { title: 'Sign In', path: '/auth/signin' },
          { title: 'Sign Up', path: '/auth/signup' },
          { title: '2FA', path: '/auth/2fa' },
          { title: 'Check Email', path: '/auth/check-email' },
          {
            title: 'Reset Password',
            children: [
              {
                title: 'Enter Email',
                path: '/auth/request-reset',
              },
              {
                title: 'Check Email',
                path: '/auth/reset-password/check-email',
              },
              {
                title: 'Password Changed',
                path: '/auth/reset-password/changed',
              },
            ],
          },
        ],
      },
      { title: 'Welcome Message', path: '/auth/welcome-message' },
      { title: 'Account Deactivated', path: '/auth/account-deactivated' },
      { title: 'Error 404', path: '/error/404' },
      { title: 'Error 500', path: '/error/500' },
    ],
  },
];

export const MENU_MEGA = [
  { title: 'Home', path: '/' },
  {
    title: 'Profiles',
    children: [
      {
        title: 'Profiles',
        children: [
          {
            children: [
              {
                title: 'Default',
                icon: Badge,
                path: '/public-profile/profiles/default',
              },
              {
                title: 'Creator',
                icon: Coffee,
                path: '/public-profile/profiles/creator',
              },
              {
                title: 'Company',
                icon: Building,
                path: '/public-profile/profiles/company',
              },
              {
                title: 'NFT',
                icon: Bitcoin,
                path: '/public-profile/profiles/nft',
              },
              {
                title: 'Blogger',
                icon: MessageSquare,
                path: '/public-profile/profiles/blogger',
              },
              {
                title: 'CRM',
                icon: Monitor,
                path: '/public-profile/profiles/crm',
              },
              {
                title: 'Gamer',
                icon: Ghost,
                path: '/public-profile/profiles/gamer',
              },
            ],
          },
          {
            children: [
              {
                title: 'Feeds',
                icon: Book,
                path: '/public-profile/profiles/feeds',
              },
              {
                title: 'Plain',
                icon: File,
                path: '/public-profile/profiles/plain',
              },
              {
                title: 'Modal',
                icon: SquareMousePointer,
                path: '/public-profile/profiles/modal',
              },
              {
                title: 'Freelancer',
                icon: Briefcase,
                path: '#',
                disabled: true,
              },
              { title: 'Developer', icon: Code, path: '#', disabled: true },
              { title: 'Team', icon: Users, path: '#', disabled: true },
              {
                title: 'Events',
                icon: CalendarCheck,
                path: '#',
                disabled: true,
              },
            ],
          },
        ],
      },
      {
        title: 'Other Pages',
        children: [
          {
            children: [
              {
                title: 'Projects - 3 Cols',
                icon: Layout,
                path: '/public-profile/projects/3-columns',
              },
              {
                title: 'Projects - 2 Cols',
                icon: Grid,
                path: '/public-profile/projects/2-columns',
              },
              { title: 'Works', icon: WorkIcon, path: '/public-profile/works' },
              {
                title: 'Teams',
                icon: PeopleIcon,
                path: '/public-profile/teams',
              },
              {
                title: 'Network',
                icon: Network,
                path: '/public-profile/network',
              },
              {
                title: 'Activity',
                icon: TrendingUp,
                path: '/public-profile/activity',
              },
              {
                title: 'Campaigns - Card',
                icon: LayoutGrid,
                path: '/public-profile/campaigns/card',
              },
            ],
          },
          {
            children: [
              {
                title: 'Campaigns - List',
                icon: Kanban,
                path: '/public-profile/campaigns/list',
              },
              { title: 'Empty', icon: FileText, path: '/public-profile/empty' },
              {
                title: 'Documents',
                icon: DocumentIcon,
                path: '#',
                disabled: true,
              },
              { title: 'Badges', icon: Award, path: '#', disabled: true },
              { title: 'Awards', icon: Gift, path: '#', disabled: true },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'My Account',
    children: [
      {
        title: 'General Pages',
        children: [
          { title: 'Integrations', icon: Plug, path: '/account/integrations' },
          {
            title: 'Notifications',
            icon: Bell,
            path: '/account/notifications',
          },
          { title: 'API Keys', icon: Key, path: '/account/api-keys' },
          { title: 'Appearance', icon: Eye, path: '/account/appearance' },
          {
            title: 'Invite a Friend',
            icon: UserCheck,
            path: '/account/invite-a-friend',
          },
          { title: 'Activity', icon: LifeBuoy, path: '/account/activity' },
          { title: 'Brand', icon: CheckCircle, disabled: true },
          { title: 'Get Paid', icon: Euro, disabled: true },
        ],
      },
      {
        title: 'Other pages',
        children: [
          {
            title: 'Account Home',
            children: [
              { title: 'Get Started', path: '/account/home/get-started' },
              { title: 'User Profile', path: '/account/home/user-profile' },
              {
                title: 'Company Profile',
                path: '/account/home/company-profile',
              },
              { title: 'With Sidebar', path: '/account/home/settings-sidebar' },
              {
                title: 'Enterprise',
                path: '/account/home/settings-enterprise',
              },
              { title: 'Plain', path: '/account/home/settings-plain' },
              { title: 'Modal', path: '/account/home/settings-modal' },
            ],
          },
          {
            title: 'Billing',
            children: [
              { title: 'Basic Billing', path: '/account/billing/basic' },
              { title: 'Enterprise', path: '/account/billing/enterprise' },
              { title: 'Plans', path: '/account/billing/plans' },
              { title: 'Billing History', path: '/account/billing/history' },
              { title: 'Tax Info', disabled: true },
              { title: 'Invoices', disabled: true },
              { title: 'Gateaways', disabled: true },
            ],
          },
          {
            title: 'Security',
            children: [
              { title: 'Get Started', path: '/account/security/get-started' },
              {
                title: 'Security Overview',
                path: '/account/security/overview',
              },
              {
                title: 'IP Addresses',
                path: '/account/security/allowed-ip-addresses',
              },
              {
                title: 'Privacy Settings',
                path: '/account/security/privacy-settings',
              },
              {
                title: 'Device Management',
                path: '/account/security/device-management',
              },
              {
                title: 'Backup & Recovery',
                path: '/account/security/backup-and-recovery',
              },
              {
                title: 'Current Sessions',
                path: '/account/security/current-sessions',
              },
              { title: 'Security Log', path: '/account/security/security-log' },
            ],
          },
          {
            title: 'Members & Teams',
            children: [
              { title: 'Teams Starter', path: '/account/members/team-starter' },
              { title: 'Teams', path: '/account/members/teams' },
              { title: 'Team Info', path: '/account/members/team-info' },
              {
                title: 'Members Starter',
                path: '/account/members/members-starter',
              },
              { title: 'Team Members', path: '/account/members/team-members' },
              {
                title: 'Import Members',
                path: '/account/members/import-members',
              },
              { title: 'Roles', path: '/account/members/roles' },
              {
                title: 'Permissions - Toggler',
                path: '/account/members/permissions-toggle',
              },
              {
                title: 'Permissions - Check',
                path: '/account/members/permissions-check',
              },
            ],
          },
          {
            title: 'Other Pages',
            children: [
              { title: 'Integrations', path: '/account/integrations' },
              { title: 'Notifications', path: '/account/notifications' },
              { title: 'API Keys', path: '/account/api-keys' },
              { title: 'Appearance', path: '/account/appearance' },
              { title: 'Invite a Friend', path: '/account/invite-a-friend' },
              { title: 'Activity', path: '/account/activity' },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Network',
    children: [
      {
        title: 'General Pages',
        children: [
          { title: 'Get Started', icon: Flag, path: '/network/get-started' },
          { title: 'Colleagues', icon: Users, path: '#', disabled: true },
          { title: 'Donators', icon: Heart, path: '#', disabled: true },
          { title: 'Leads', icon: Zap, path: '#', disabled: true },
        ],
      },
      {
        title: 'Other pages',
        children: [
          {
            title: 'User Cards',
            children: [
              { title: 'Mini Cards', path: '/network/user-cards/mini-cards' },
              { title: 'Team Members', path: '/network/user-cards/team-crew' },
              { title: 'Authors', path: '/network/user-cards/author' },
              { title: 'NFT Users', path: '/network/user-cards/nft' },
              { title: 'Social Users', path: '/network/user-cards/social' },
              { title: 'Gamers', path: '#', disabled: true },
            ],
          },
          {
            title: 'User Base',
            badge: 'Datatables',
            children: [
              { title: 'Team Crew', path: '/network/user-table/team-crew' },
              { title: 'App Roster', path: '/network/user-table/app-roster' },
              {
                title: 'Market Authors',
                path: '/network/user-table/market-authors',
              },
              { title: 'SaaS Users', path: '/network/user-table/saas-users' },
              {
                title: 'Store Clients',
                path: '/network/user-table/store-clients',
              },
              { title: 'Visitors', path: '/network/user-table/visitors' },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Authentication',
    children: [
      {
        title: 'General pages',
        children: [
          {
            title: 'Classic Layout',
            children: [
              { title: 'Sign In', path: '/auth/classic/signin' },
              { title: 'Sign Up', path: '/auth/classic/signup' },
              { title: '2FA', path: '/auth/classic/2fa' },
              { title: 'Check Email', path: '/auth/classic/check-email' },
              {
                title: 'Reset Password',
                children: [
                  {
                    title: 'Enter Email',
                    path: '/auth/classic/reset-password',
                  },
                  {
                    title: 'Check Email',
                    path: '/auth/classic/reset-password/check-email',
                  },
                  {
                    title: 'Password is Changed',
                    path: '/auth/classic/reset-password/changed',
                  },
                ],
              },
            ],
          },
          {
            title: 'Branded Layout',
            children: [
              { title: 'Sign In', path: '/auth/signin' },
              { title: 'Sign Up', path: '/auth/signup' },
              { title: '2FA', path: '/auth/2fa' },
              { title: 'Check Email', path: '/auth/check-email' },
              {
                title: 'Reset Password',
                children: [
                  {
                    title: 'Enter Email',
                    path: '/auth/request-reset',
                  },
                  {
                    title: 'Check Email',
                    path: '/auth/reset-password/check-email',
                  },
                  {
                    title: 'Password is Changed',
                    path: '/auth/reset-password/changed',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: 'Other Pages',
        children: [
          {
            title: 'Welcome Message',
            icon: ThumbsUp,
            path: '/auth/welcome-message',
          },
          {
            title: 'Account Deactivated',
            icon: ShieldOff,
            path: '/auth/account-deactivated',
          },
          { title: 'Error 404', icon: HelpCircle, path: '/error/404' },
          { title: 'Error 500', icon: AlertCircle, path: '/error/500' },
        ],
      },
    ],
  },
  {
    title: 'Store ',
    children: [
      {
        title: 'Store - Client',
        children: [
          {
            children: [
              { title: 'Home', path: '/store-client/home' },
              {
                title: 'Search Results - Grid',
                path: '/store-client/search-results-grid',
              },
              {
                title: 'Search Results - List',
                path: '/store-client/search-results-list',
              },
              {
                title: 'Product Details',
                path: '/store-client/product-details',
              },
              { title: 'Wishlist', path: '/store-client/wishlist' },
              { title: 'My Orders', path: '/store-client/my-orders' },
            ],
          },
          {
            children: [
              {
                title: 'Checkout - Order Summary',
                path: '/store-client/checkout/order-summary',
              },
              {
                title: 'Checkout - Shipping Info',
                path: '/store-client/checkout/shipping-info',
              },
              {
                title: 'Checkout - Payment Method',
                path: '/store-client/checkout/payment-method',
              },
              {
                title: 'Checkout - Order Placed',
                path: '/store-client/checkout/order-placed',
              },
              { title: 'Order Receipt', path: '/store-client/order-receipt' },
            ],
          },
        ],
      },
    ],
  },
];

export const MENU_MEGA_MOBILE = [
  { title: 'Home', path: '/' },
  {
    title: 'Profiles',
    children: [
      {
        title: 'Profiles',
        children: [
          {
            title: 'Default',
            icon: Badge,
            path: '/public-profile/profiles/default',
          },
          {
            title: 'Creator',
            icon: Coffee,
            path: '/public-profile/profiles/creator',
          },
          {
            title: 'Company',
            icon: Building,
            path: '/public-profile/profiles/company',
          },
          { title: 'NFT', icon: Bitcoin, path: '/public-profile/profiles/nft' },
          {
            title: 'Blogger',
            icon: MessageSquare,
            path: '/public-profile/profiles/blogger',
          },
          { title: 'CRM', icon: Monitor, path: '/public-profile/profiles/crm' },
          {
            title: 'Gamer',
            icon: Ghost,
            path: '/public-profile/profiles/gamer',
          },
          {
            title: 'Feeds',
            icon: Book,
            path: '/public-profile/profiles/feeds',
          },
          {
            title: 'Plain',
            icon: File,
            path: '/public-profile/profiles/plain',
          },
          {
            title: 'Modal',
            icon: SquareMousePointer,
            path: '/public-profile/profiles/modal',
          },
          { title: 'Freelancer', icon: Briefcase, path: '#', disabled: true },
          { title: 'Developer', icon: Code, path: '#', disabled: true },
          { title: 'Team', icon: Users, path: '#', disabled: true },
          { title: 'Events', icon: CalendarCheck, path: '#', disabled: true },
        ],
      },
      {
        title: 'Other Pages',
        children: [
          {
            title: 'Projects - 3 Cols',
            icon: Layout,
            path: '/public-profile/projects/3-columns',
          },
          {
            title: 'Projects - 2 Cols',
            icon: Grid,
            path: '/public-profile/projects/2-columns',
          },
          { title: 'Works', icon: WorkIcon, path: '/public-profile/works' },
          { title: 'Teams', icon: PeopleIcon, path: '/public-profile/teams' },
          { title: 'Network', icon: Network, path: '/public-profile/network' },
          {
            title: 'Activity',
            icon: TrendingUp,
            path: '/public-profile/activity',
          },
          {
            title: 'Campaigns - Card',
            icon: LayoutGrid,
            path: '/public-profile/campaigns/card',
          },
          {
            title: 'Campaigns - List',
            icon: Kanban,
            path: '/public-profile/campaigns/list',
          },
          { title: 'Empty', icon: FileText, path: '/public-profile/empty' },
          { title: 'Documents', icon: DocumentIcon, path: '#', disabled: true },
          { title: 'Badges', icon: Award, path: '#', disabled: true },
          { title: 'Awards', icon: Gift, path: '#', disabled: true },
        ],
      },
    ],
  },
  {
    title: 'My Account',
    children: [
      {
        title: 'General Pages',
        children: [
          { title: 'Integrations', icon: Plug, path: '/account/integrations' },
          {
            title: 'Notifications',
            icon: Bell,
            path: '/account/notifications',
          },
          { title: 'API Keys', icon: Key, path: '/account/api-keys' },
          { title: 'Appearance', icon: Eye, path: '/account/appearance' },
          {
            title: 'Invite a Friend',
            icon: UserCheck,
            path: '/account/invite-a-friend',
          },
          { title: 'Activity', icon: LifeBuoy, path: '/account/activity' },
          { title: 'Brand', icon: CheckCircle, disabled: true },
          { title: 'Get Paid', icon: Euro, disabled: true },
        ],
      },
      {
        title: 'Other pages',
        children: [
          {
            title: 'Account Home',
            children: [
              { title: 'Get Started', path: '/account/home/get-started' },
              { title: 'User Profile', path: '/account/home/user-profile' },
              {
                title: 'Company Profile',
                path: '/account/home/company-profile',
              },
              { title: 'With Sidebar', path: '/account/home/settings-sidebar' },
              {
                title: 'Enterprise',
                path: '/account/home/settings-enterprise',
              },
              { title: 'Plain', path: '/account/home/settings-plain' },
              { title: 'Modal', path: '/account/home/settings-modal' },
            ],
          },
          {
            title: 'Billing',
            children: [
              { title: 'Basic Billing', path: '/account/billing/basic' },
              { title: 'Enterprise', path: '/account/billing/enterprise' },
              { title: 'Plans', path: '/account/billing/plans' },
              { title: 'Billing History', path: '/account/billing/history' },
              { title: 'Tax Info', disabled: true },
              { title: 'Invoices', disabled: true },
              { title: 'Gateaways', disabled: true },
            ],
          },
          {
            title: 'Security',
            children: [
              { title: 'Get Started', path: '/account/security/get-started' },
              {
                title: 'Security Overview',
                path: '/account/security/overview',
              },
              {
                title: 'IP Addresses',
                path: '/account/security/allowed-ip-addresses',
              },
              {
                title: 'Privacy Settings',
                path: '/account/security/privacy-settings',
              },
              {
                title: 'Device Management',
                path: '/account/security/device-management',
              },
              {
                title: 'Backup & Recovery',
                path: '/account/security/backup-and-recovery',
              },
              {
                title: 'Current Sessions',
                path: '/account/security/current-sessions',
              },
              { title: 'Security Log', path: '/account/security/security-log' },
            ],
          },
          {
            title: 'Members & Teams',
            children: [
              { title: 'Teams Starter', path: '/account/members/team-starter' },
              { title: 'Teams', path: '/account/members/teams' },
              { title: 'Team Info', path: '/account/members/team-info' },
              {
                title: 'Members Starter',
                path: '/account/members/members-starter',
              },
              { title: 'Team Members', path: '/account/members/team-members' },
              {
                title: 'Import Members',
                path: '/account/members/import-members',
              },
              { title: 'Roles', path: '/account/members/roles' },
              {
                title: 'Permissions - Toggler',
                path: '/account/members/permissions-toggle',
              },
              {
                title: 'Permissions - Check',
                path: '/account/members/permissions-check',
              },
            ],
          },
          {
            title: 'Other Pages',
            children: [
              { title: 'Integrations', path: '/account/integrations' },
              { title: 'Notifications', path: '/account/notifications' },
              { title: 'API Keys', path: '/account/api-keys' },
              { title: 'Appearance', path: '/account/appearance' },
              { title: 'Invite a Friend', path: '/account/invite-a-friend' },
              { title: 'Activity', path: '/account/activity' },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Network',
    children: [
      {
        title: 'General Pages',
        children: [
          { title: 'Get Started', icon: Flag, path: '/network/get-started' },
          { title: 'Colleagues', icon: Users, path: '#', disabled: true },
          { title: 'Donators', icon: Heart, path: '#', disabled: true },
          { title: 'Leads', icon: Zap, path: '#', disabled: true },
        ],
      },
      {
        title: 'Other pages',
        children: [
          {
            title: 'User Cards',
            children: [
              { title: 'Mini Cards', path: '/network/user-cards/mini-cards' },
              { title: 'Team Members', path: '/network/user-cards/team-crew' },
              { title: 'Authors', path: '/network/user-cards/author' },
              { title: 'NFT Users', path: '/network/user-cards/nft' },
              { title: 'Social Users', path: '/network/user-cards/social' },
              { title: 'Gamers', path: '#', disabled: true },
            ],
          },
          {
            title: 'User Base',
            badge: 'Datatables',
            children: [
              { title: 'Team Crew', path: '/network/user-table/team-crew' },
              { title: 'App Roster', path: '/network/user-table/app-roster' },
              {
                title: 'Market Authors',
                path: '/network/user-table/market-authors',
              },
              { title: 'SaaS Users', path: '/network/user-table/saas-users' },
              {
                title: 'Store Clients',
                path: '/network/user-table/store-clients',
              },
              { title: 'Visitors', path: '/network/user-table/visitors' },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Store - Client',
    children: [
      { title: 'Home', path: '/store-client/home' },
      {
        title: 'Search Results - Grid',
        path: '/store-client/search-results-grid',
      },
      {
        title: 'Search Results - List',
        path: '/store-client/search-results-list',
      },
      { title: 'Product Details', path: '/store-client/product-details' },
      { title: 'Wishlist', path: '/store-client/wishlist' },
      {
        title: 'Checkout',
        children: [
          {
            title: 'Order Summary',
            path: '/store-client/checkout/order-summary',
          },
          {
            title: 'Shipping Info',
            path: '/store-client/checkout/shipping-info',
          },
          {
            title: 'Payment Method',
            path: '/store-client/checkout/payment-method',
          },
          {
            title: 'Order Placed',
            path: '/store-client/checkout/order-placed',
          },
        ],
      },
      { title: 'My Orders', path: '/store-client/my-orders' },
      { title: 'Order Receipt', path: '/store-client/order-receipt' },
    ],
  },
  {
    title: 'Authentication',
    children: [
      {
        title: 'General pages',
        children: [
          {
            title: 'Classic Layout',
            children: [
              { title: 'Sign In', path: '/auth/classic/signin' },
              { title: 'Sign Up', path: '/auth/classic/signup' },
              { title: '2FA', path: '/auth/classic/2fa' },
              { title: 'Check Email', path: '/auth/classic/check-email' },
              {
                title: 'Reset Password',
                children: [
                  {
                    title: 'Enter Email',
                    path: '/auth/classic/request-reset',
                  },
                  {
                    title: 'Check Email',
                    path: '/auth/classic/reset-password/check-email',
                  },
                  {
                    title: 'Password is Changed',
                    path: '/auth/classic/reset-password/changed',
                  },
                ],
              },
            ],
          },
          {
            title: 'Branded Layout',
            children: [
              { title: 'Sign In', path: '/auth/signin' },
              { title: 'Sign Up', path: '/auth/signup' },
              { title: '2FA', path: '/auth/2fa' },
              { title: 'Check Email', path: '/auth/check-email' },
              {
                title: 'Reset Password',
                children: [
                  {
                    title: 'Enter Email',
                    path: '/auth/request-reset',
                  },
                  {
                    title: 'Check Email',
                    path: '/auth/reset-password/check-email',
                  },
                  {
                    title: 'Password is Changed',
                    path: '/auth/reset-password/changed',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: 'Other Pages',
        children: [
          {
            title: 'Welcome Message',
            icon: ThumbsUp,
            path: '/auth/welcome-message',
          },
          {
            title: 'Account Deactivated',
            icon: ShieldOff,
            path: '/auth/account-deactivated',
          },
          { title: 'Error 404', icon: HelpCircle, path: '/error/404' },
          { title: 'Error 500', icon: AlertCircle, path: '/error/500' },
        ],
      },
    ],
  },
  {
    title: 'Help',
    children: [
      {
        title: 'Getting Started',
        icon: Coffee,
        path: 'https://keenthemes.com/metronic/tailwind/docs/getting-started/installation',
      },
      {
        title: 'Support Forum',
        icon: AlertCircle,
        children: [
          {
            title: 'All Questions',
            icon: FileQuestion,
            path: 'https://devs.keenthemes.com',
          },
          {
            title: 'Popular Questions',
            icon: Star,
            path: 'https://devs.keenthemes.com/popular',
          },
          {
            title: 'Ask Question',
            icon: HelpCircle,
            path: 'https://devs.keenthemes.com/question/create',
          },
        ],
      },
      {
        title: 'Licenses & FAQ',
        icon: Captions,
        path: 'https://keenthemes.com/metronic/tailwind/docs/getting-started/license',
      },
      {
        title: 'Documentation',
        icon: FileQuestion,
        path: 'https://keenthemes.com/metronic/tailwind/docs',
      },
      { separator: true },
      {
        title: 'Contact Us',
        icon: Share2,
        path: 'https://keenthemes.com/contact',
      },
    ],
  },
];

export const MENU_HELP = [
  {
    title: 'Getting Started',
    icon: Coffee,
    path: 'https://keenthemes.com/metronic/tailwind/docs/getting-started/installation',
  },
  {
    title: 'Support Forum',
    icon: AlertCircle,
    children: [
      {
        title: 'All Questions',
        icon: FileQuestion,
        path: 'https://devs.keenthemes.com',
      },
      {
        title: 'Popular Questions',
        icon: Star,
        path: 'https://devs.keenthemes.com/popular',
      },
      {
        title: 'Ask Question',
        icon: HelpCircle,
        path: 'https://devs.keenthemes.com/question/create',
      },
    ],
  },
  {
    title: 'Licenses & FAQ',
    icon: Captions,
    path: 'https://keenthemes.com/metronic/tailwind/docs/getting-started/license',
  },
  {
    title: 'Documentation',
    icon: FileQuestion,
    path: 'https://keenthemes.com/metronic/tailwind/docs',
  },
  { separator: true },
  { title: 'Contact Us', icon: Share2, path: 'https://keenthemes.com/contact' },
];

export const MENU_ROOT = [
  {
    title: 'Public Profile',
    icon: UserCircle,
    rootPath: '/public-profile/',
    path: 'public-profile/profiles/default',
    childrenIndex: 2,
  },
  {
    title: 'Account',
    icon: Settings,
    rootPath: '/account/',
    path: '/',
    childrenIndex: 3,
  },
  {
    title: 'Network',
    icon: Users,
    rootPath: '/network/',
    path: 'network/get-started',
    childrenIndex: 4,
  },
  {
    title: 'Store - Client',
    icon: ShoppingCart,
    rootPath: '/store-client/',
    path: 'store-client/home',
    childrenIndex: 4,
  },
  {
    title: 'Authentication',
    icon: Shield,
    rootPath: '/authentication/',
    path: 'authentication/get-started',
    childrenIndex: 5,
  },
];
