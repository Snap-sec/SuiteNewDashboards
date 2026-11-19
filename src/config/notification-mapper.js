
export const NotificationMapper = {
    // User Profile
    "auth.user.id": "/user/profile/:id",

    // CAIM
    "caim.groups": "/caim/groups",
    "caim.settings": "/caim/settings",
    "caim.export": "/caim/export",
    "caim.adapters": "/caim/adapters",

    // VM
    "vm.adapters": "/vm/adapters",
    "vm.assets": "/vm/assets",
    "vm.blockers": "/vm/blockers", // or /vm/vulnerability-report?
    "vm.integrations": "/vm/integrations",
    "vm.reports": "/vm/reports",
    "vm.vulnerabilities": "/vm/vulnerabilities", // Maps to list
    "vm.claps": "/dashboard", // Global clap usually goes to dashboard
    "vm.assessments": "/vm/assessments",

    // Auth
    "auth.login": "/auth/login",
    "auth.organization": "/settings/organization",
    "auth.assets": "/settings/assets",

    // Strike (Auto Pentest)
    "strike.projects": "/apt/pentesting/projects",
    "strike.project.id": "/apt/pentests/:id",
    "strike.scans": "/apt/scans",
    "strike.integrations": "/apt/integrations"
}
