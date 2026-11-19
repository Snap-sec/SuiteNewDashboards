
export const NotificationMapper = {
    // User Profile
    "auth.user.id": "/user/profile/:id",

    // CAIM
    "caim.groups": "/caim/groups",
    "caim.settings": "/caim/settings",
    "caim.export": "/caim/export",
    "caim.adapters": "/caim/adapters",

    // VS
    "vs.groups": "/vs/groups",
    "vs.scans": "/vs/scans",
    "vs.scanners": "/vs/scanners",
    "vs.settings": "/vs/config",
    "vs.dashboard": "/vs/dashboard",
    "vs.vulnerabilities": "/vs/vulnerabilities",

    // VM
    "vm.adapters": "/vm/adapters",
    "vm.assets": "/vm/assets",
    "vm.blockers": "/vm/blockers", // or /vm/vulnerability-report?
    "vm.integrations": "/vm/integrations",
    "vm.reports": "/vm/reports",
    "vm.vulnerabilities": "/vm/vulnerabilities", // Maps to list
    "vm.claps": "/dashboard", // Global clap usually goes to dashboard
    "vm.assessments": "/vm/assessments",

    // Threat Modeler
    "tm.threats": "/threat-modeler/threat-detail/:id",

    // Auth
    "auth.login": "/auth/login",
    "auth.organization": "/settings/organization",
    "auth.assets": "/settings/assets",

    // APISec
    "apisec.scans": "/scans/:id", // or /scans/:id/results
    "apisec.vulnerabilities": "/vulnerabilities/:id", // or /vulnerabilities?suppressed=true

    // Strike (Auto Pentest)
    "strike.projects": "/apt/pentesting/projects",
    "strike.project.id": "/apt/pentests/:id",
    "strike.scans": "/apt/scans",
    "strike.integrations": "/apt/integrations"
}
