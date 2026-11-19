/**
 * Helper to get the correct APT projects list URL by project/scan type.
 */
export function getAptProjectsPath(type) {
  if (
    type === 'vulnerability-scan' ||
    type === 'vulnerability-scanning' ||
    type === 'network'
  ) {
    return '/apt/vulnerability-scanning/projects?type=vulnerability-scan';
  }
  if (type === 'cloud' || type === 'cloud-security') {
    return '/apt/cloud-security/projects?type=cloud';
  }
  if (
    type === 'code-security' ||
    type === 'code' ||
    type === 'code-sast' ||
    type === 'code-sca' ||
    type === 'sast' ||
    type === 'sca'
  ) {
    return '/apt/code-security/projects?type=code-security';
  }
  return '/apt/pentesting/projects?type=pentest';
}

/**
 * Strike (APT) Breadcrumb Routes Configuration.
 *
 * Rules:
 * 1. Exact query matches (e.g. ?type=pentest) must precede general patterns.
 * 2. Breadcrumb links for standard pages (overview, projects list, findings, assets, etc.)
 *    are NOT clickable.
 * 3. ONLY project details pages (/apt/pentests/:id...) have clickable links back to
 *    their respective module projects page (AI Pentesting, Vulnerability Scanning, Cloud Security, Code Security).
 */
export const STRIKE_BREADCRUMB_ROUTES = [
  // =========================================================================
  // 1. PROJECT DETAILS ROUTES (CLICKABLE LINKS BACK TO MODULE PROJECTS)
  // =========================================================================

  // AI Pentesting Project Details
  {
    pattern: '/apt/pentests/:id?type=pentest',
    crumbs: [
      {
        label: 'AI Pentesting',
        path: '/apt/pentesting/projects?type=pentest',
        clickable: true,
      },
      {
        label: 'Projects',
        path: '/apt/pentesting/projects?type=pentest',
        clickable: true,
      },
      { dynamic: true, fallback: 'Project Details' },
    ],
  },

  // Vulnerability Scanning Project Details
  {
    pattern: '/apt/pentests/:id?type=vulnerability-scan',
    crumbs: [
      {
        label: 'Vulnerability Scanning',
        path: '/apt/vulnerability-scanning/projects?type=vulnerability-scan',
        clickable: true,
      },
      {
        label: 'Projects',
        path: '/apt/vulnerability-scanning/projects?type=vulnerability-scan',
        clickable: true,
      },
      { dynamic: true, fallback: 'Project Details' },
    ],
  },

  // Cloud Security Project Details
  {
    pattern: '/apt/pentests/:id?type=cloud',
    crumbs: [
      {
        label: 'Cloud Security',
        path: '/apt/cloud-security/projects?type=cloud',
        clickable: true,
      },
      {
        label: 'Accounts',
        path: '/apt/cloud-security/projects?type=cloud',
        clickable: true,
      },
      { dynamic: true, fallback: 'Project Details' },
    ],
  },

  // Code Security Project Details
  {
    pattern: '/apt/pentests/:id?type=code-security',
    crumbs: [
      {
        label: 'Code Security',
        path: '/apt/code-security/projects?type=code-security',
        clickable: true,
      },
      {
        label: 'Projects',
        path: '/apt/code-security/projects?type=code-security',
        clickable: true,
      },
      { dynamic: true, fallback: 'Project Details' },
    ],
  },

  // Dynamic / Fallback Details Routes (when type is resolved from state, context, or entityType)
  {
    pattern: '/apt/pentests/:id',
    crumbs: [
      {
        label: (params, loc, ctx) => {
          const t =
            ctx?.entityType || loc?.state?.projectType || loc?.state?.type;
          if (t === 'cloud' || t === 'cloud-security') return 'Cloud Security';
          if (t === 'vulnerability-scan' || t === 'vulnerability-scanning')
            return 'Vulnerability Scanning';
          if (
            t === 'code-security' ||
            t === 'code' ||
            t === 'sast' ||
            t === 'sca'
          )
            return 'Code Security';
          return 'AI Pentesting';
        },
        path: (params, loc, ctx) => {
          const t =
            ctx?.entityType || loc?.state?.projectType || loc?.state?.type;
          return getAptProjectsPath(t);
        },
        clickable: true,
      },
      {
        label: (params, loc, ctx) => {
          const t =
            ctx?.entityType || loc?.state?.projectType || loc?.state?.type;
          if (t === 'cloud' || t === 'cloud-security') return 'Accounts';
          return 'Projects';
        },
        path: (params, loc, ctx) => {
          const t =
            ctx?.entityType || loc?.state?.projectType || loc?.state?.type;
          return getAptProjectsPath(t);
        },
        clickable: true,
      },
      { dynamic: true, fallback: 'Project Details' },
    ],
  },
  {
    pattern: '/apt/projects/:id',
    crumbs: [
      {
        label: (params, loc, ctx) => {
          const t =
            ctx?.entityType || loc?.state?.projectType || loc?.state?.type;
          if (t === 'cloud' || t === 'cloud-security') return 'Cloud Security';
          if (t === 'vulnerability-scan' || t === 'vulnerability-scanning')
            return 'Vulnerability Scanning';
          if (
            t === 'code-security' ||
            t === 'code' ||
            t === 'sast' ||
            t === 'sca'
          )
            return 'Code Security';
          return 'AI Pentesting';
        },
        path: (params, loc, ctx) => {
          const t =
            ctx?.entityType || loc?.state?.projectType || loc?.state?.type;
          return getAptProjectsPath(t);
        },
        clickable: true,
      },
      {
        label: (params, loc, ctx) => {
          const t =
            ctx?.entityType || loc?.state?.projectType || loc?.state?.type;
          if (t === 'cloud' || t === 'cloud-security') return 'Accounts';
          return 'Projects';
        },
        path: (params, loc, ctx) => {
          const t =
            ctx?.entityType || loc?.state?.projectType || loc?.state?.type;
          return getAptProjectsPath(t);
        },
        clickable: true,
      },
      { dynamic: true, fallback: 'Project Details' },
    ],
  },
  {
    pattern: '/apt/applications/:id',
    crumbs: [
      {
        label: 'AI Pentesting',
        path: '/apt/pentesting/projects?type=pentest',
        clickable: true,
      },
      {
        label: 'Projects',
        path: '/apt/pentesting/projects?type=pentest',
        clickable: true,
      },
      { dynamic: true, fallback: 'Project Details' },
    ],
  },

  // =========================================================================
  // 2. PROJECT CREATE ROUTES (NOT CLICKABLE)
  // =========================================================================
  {
    pattern: '/apt/pentests/create?type=pentest',
    crumbs: [{ label: 'AI Pentesting' }, { label: 'Create Project' }],
  },
  {
    pattern: '/apt/pentests/create?type=vulnerability-scan',
    crumbs: [{ label: 'Vulnerability Scanning' }, { label: 'Create Project' }],
  },
  {
    pattern: '/apt/pentests/create?type=cloud',
    crumbs: [{ label: 'Cloud Security' }, { label: 'Connect Account' }],
  },
  {
    pattern: '/apt/pentests/create?type=code-security',
    crumbs: [{ label: 'Code Security' }, { label: 'Create Project' }],
  },
  {
    pattern: '/apt/pentests/create',
    crumbs: [{ label: 'AI Pentesting' }, { label: 'Create Project' }],
  },
  {
    pattern: '/apt/pentests/new',
    crumbs: [{ label: 'AI Pentesting' }, { label: 'Create Project' }],
  },
  {
    pattern: '/apt/cloud-security/connect',
    crumbs: [{ label: 'Cloud Security' }, { label: 'Connect Account' }],
  },
  {
    pattern: '/apt/cloud-security/add-account',
    crumbs: [{ label: 'Cloud Security' }, { label: 'Connect Account' }],
  },
  {
    pattern: '/apt/code-security/connect',
    crumbs: [{ label: 'Code Security' }, { label: 'Connect Repository' }],
  },
  {
    pattern: '/apt/code-security/add-account',
    crumbs: [{ label: 'Code Security' }, { label: 'Connect Repository' }],
  },

  // =========================================================================
  // 3. SIDEBAR ROUTES (NOT CLICKABLE)
  // =========================================================================

  // --- Attack: AI Pentesting ---
  {
    pattern: '/apt/pentesting/overview',
    crumbs: [{ label: 'AI Pentesting' }, { label: 'Overview' }],
  },
  {
    pattern: '/apt/pentesting/projects?type=pentest',
    crumbs: [{ label: 'AI Pentesting' }, { label: 'Projects' }],
  },
  {
    pattern: '/apt/pentesting/projects',
    crumbs: [{ label: 'AI Pentesting' }, { label: 'Projects' }],
  },
  {
    pattern: '/apt/pentesting/findings',
    crumbs: [{ label: 'AI Pentesting' }, { label: 'Findings' }],
  },
  {
    pattern: '/apt/pentesting',
    crumbs: [{ label: 'AI Pentesting' }, { label: 'Overview' }],
  },

  // --- Attack: Vulnerability Scanning ---
  {
    pattern: '/apt/vulnerability-scanning/overview',
    crumbs: [{ label: 'Vulnerability Scanning' }, { label: 'Overview' }],
  },
  {
    pattern: '/apt/vulnerability-scanning/projects?type=vulnerability-scan',
    crumbs: [{ label: 'Vulnerability Scanning' }, { label: 'Projects' }],
  },
  {
    pattern: '/apt/vulnerability-scanning/projects',
    crumbs: [{ label: 'Vulnerability Scanning' }, { label: 'Projects' }],
  },
  {
    pattern: '/apt/vulnerability-scanning/findings',
    crumbs: [{ label: 'Vulnerability Scanning' }, { label: 'Findings' }],
  },
  {
    pattern: '/apt/vulnerability-scanning',
    crumbs: [{ label: 'Vulnerability Scanning' }, { label: 'Overview' }],
  },

  // --- Attack: Cloud Security ---
  {
    pattern: '/apt/cloud-security/overview',
    crumbs: [{ label: 'Cloud Security' }, { label: 'Overview' }],
  },
  {
    pattern: '/apt/cloud-security/projects?type=cloud',
    crumbs: [{ label: 'Cloud Security' }, { label: 'Accounts' }],
  },
  {
    pattern: '/apt/cloud-security/projects',
    crumbs: [{ label: 'Cloud Security' }, { label: 'Accounts' }],
  },
  {
    pattern: '/apt/cloud-security/findings?type=cloud',
    crumbs: [{ label: 'Cloud Security' }, { label: 'Findings' }],
  },
  {
    pattern: '/apt/cloud-security/findings',
    crumbs: [{ label: 'Cloud Security' }, { label: 'Findings' }],
  },
  {
    pattern: '/apt/cloud-security',
    crumbs: [{ label: 'Cloud Security' }, { label: 'Overview' }],
  },

  // --- Attack: Code Security ---
  {
    pattern: '/apt/code-security/overview',
    crumbs: [{ label: 'Code Security' }, { label: 'Overview' }],
  },
  {
    pattern: '/apt/code-security/projects?type=code-security',
    crumbs: [{ label: 'Code Security' }, { label: 'Projects' }],
  },
  {
    pattern: '/apt/code-security/projects',
    crumbs: [{ label: 'Code Security' }, { label: 'Projects' }],
  },
  {
    pattern: '/apt/code-security/findings',
    crumbs: [{ label: 'Code Security' }, { label: 'Findings' }],
  },
  {
    pattern: '/apt/code-security/settings',
    crumbs: [{ label: 'Code Security' }, { label: 'Settings' }],
  },
  {
    pattern: '/apt/code-security',
    crumbs: [{ label: 'Code Security' }, { label: 'Overview' }],
  },

  // --- Discover: Assets ---
  {
    pattern: '/apt/assets',
    crumbs: [{ label: 'Assets' }],
  },

  // --- Remediate: Vulnerabilities ---
  {
    pattern: '/apt/vulnerablities',
    crumbs: [{ label: 'Vulnerabilities' }],
  },
  {
    pattern: '/apt/vulnerabilities',
    crumbs: [{ label: 'Vulnerabilities' }],
  },

  // --- Other: Scan Logs ---
  {
    pattern: '/apt/scans',
    crumbs: [{ label: 'Scan Logs' }],
  },

  // --- Other: Integrations ---
  {
    pattern: '/apt/integrations',
    crumbs: [{ label: 'Integrations' }],
  },

  // --- Dashboard ---
  {
    pattern: '/apt',
    crumbs: [{ label: 'Dashboard' }],
  },
];

export const BREADCRUMB_ROUTES = STRIKE_BREADCRUMB_ROUTES;
