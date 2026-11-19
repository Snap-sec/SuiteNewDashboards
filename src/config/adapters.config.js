export const adaptersConfig = {
  // Currently Active/Working Adapters
  activeAdapters: [
    {
      name: "Jira",
      isActive: true,
      description: "Issue tracking and project management tool integration",
      category: ["issue-tracking"],
      logo: "/media/brand-logos/jira.svg",
      docsUrl: "https://docs.snapsec.co/integrations/vm"
    },
    {
      name: "Checkmarx",
      isActive: true,
      description: "Unify SAST, SCA, IaC, & ASPM with Agentic AI to prevent and remediate risks faster – from code to cloud.",
      category: ["SAST"],
      logo: "https://avatars.githubusercontent.com/u/51130080?s=200&v=4",
      docsUrl: "https://docs.snapsec.co/integrations/vm"
    },
    
    {
      name: "Qualys",
      isActive: true,
      logo: "https://cdn.brandfetch.io/idgLar8NO2/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B",
      description: "Comprehensive vulnerability management and assessment",
      category: ["vulnerability-management"],
      docsUrl: "https://docs.snapsec.co/integrations/vm"
    },
    {
      name: "CSV",
      isActive: true,
      description: "Import vulnerabilities from CSV files",
      category: ["data-import"],
      docsUrl: "https://docs.snapsec.co/integrations/vm"
    },
    {
      name: "AIM",
      isActive: true,
      description: "Asset and inventory management integration",
      category: ["asset-management"],
      logo: "/media/logos/aim.svg",
      docsUrl: "https://docs.snapsec.co/integrations/vm"
    },
    {
      name: "Nuclei",
      isActive: true,
      description: "Fast and template-based vulnerability scanner for APIs, web apps, and infrastructure",
      category: ["DAST", "network-scanning"],
      logo: "/new-adapter-logos/nuclei.svg",
      docsUrl: "https://docs.snapsec.co/integrations/vm"
    },
    {
      name: "Trivy",
      isActive: true,
      description: "All-in-one security scanner for containers, IaC, dependencies, secrets, and cloud configurations",
      category: ["docker-image-scanning", "dependency-scanning", "iac-scanning", "secret-scanning", "cloud-posture"],
      docsUrl: "https://docs.snapsec.co/integrations/vm"
    },
    {
      name: "ManualImport",
      isActive: true,
      description: "Manual vulnerability data import tool",
      category: ["data-import"],
      logo: "/media/brand-logos/jira.svg",
      docsUrl: "https://docs.snapsec.co/integrations/vm"
    }
  ],

  // Demo/Dummy Adapters by Category
  dummyAdapters: {
    "SAST": [
      {
        name: "Semgrep",
        description: "Lightweight static analysis tool for finding security vulnerabilities",
        isActive: false,
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      },
      {
        name: "Bandit",
        description: "Python-specific static analysis tool",
        isActive: false,
        logo: "/new-adapter-logos/bandit.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      },
      {
        name: "CodeQL",
        description: "Semantic code analysis engine",
        isActive: false,
        logo: "/new-adapter-logos/CodeQL.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      },
      {
        name: "SonarQube",
        description: "Code quality and security analyzer",
        isActive: false,
        logo: "/new-adapter-logos/SonarQube.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      }
    ],

    "DAST": [
      {
        name: "OWASP ZAP",
        description: "Dynamic application security testing tool",
        isActive: false,
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      },
      {
        name: "Nikto",
        description: "Web server vulnerability scanner",
        isActive: false,
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      },
      {
        name: "Arachni",
        description: "Web application security scanner",
        isActive: false,
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      }
    ],

    "Container Security": [
      {
        name: "Clair",
        description: "Container vulnerability analysis service",
        isActive: false,
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      },
      {
        name: "Grype",
        description: "Vulnerability scanner for containers",
        isActive: false,
        logo: "/new-adapter-logos/Grype.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      },
      {
        name: "Syft",
        description: "SBOM generator for containers",
        isActive: false,
        logo: "/new-adapter-logos/syft.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      }
    ],

    "Secret Scanning": [
      {
        name: "TruffleHog",
        description: "Secret scanning tool for repositories",
        isActive: false,
        logo: "/new-adapter-logos/TruffleHog.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      },
      {
        name: "Gitleaks",
        description: "Secret detection in Git repositories",
        isActive: false,
        logo: "/new-adapter-logos/GitLeaks.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      },
      {
        name: "GitGuardian",
        description: "Secret detection in CI/CD pipelines",
        isActive: false,
        logo: "/media/brand-logos/GitGuardian shield.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      }
    ],

    "Infrastructure as Code": [
      {
        name: "Checkov",
        description: "Policy-as-code scanning tool",
        isActive: false,
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      },
      {
        name: "TFSec",
        description: "Terraform security scanner",
        isActive: false,
        logo: "/new-adapter-logos/TFSec.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      },
      {
        name: "Kics",
        description: "IaC security scanning tool",
        isActive: false,
        logo: "/new-adapter-logos/Kics.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      }
    ],

    "Cloud Security": [
      {
        name: "ScoutSuite",
        description: "Multi-cloud security auditing",
        isActive: false,
        logo: "/new-adapter-logos/ScoutSuite.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      },
      {
        name: "CloudSploit",
        description: "Cloud configuration scanner",
        isActive: false,
        logo: "/new-adapter-logos/CloudSploit.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      },
      {
        name: "Prowler",
        description: "AWS security assessment tool",
        isActive: false,
        logo: "/new-adapter-logos/prowler.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      }
    ],

    "Kubernetes Security": [
      {
        name: "Kubescape",
        description: "Kubernetes security scanner",
        isActive: false,
        logo: "/new-adapter-logos/Kubescape.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      },
      {
        name: "Kube-bench",
        description: "Kubernetes CIS benchmark tool",
        isActive: false,
        logo: "/new-adapter-logos/Kube-bench.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      },
      {
        name: "Kube-hunter",
        description: "Kubernetes penetration testing",
        isActive: false,
        logo: "/new-adapter-logos/Kube-hunter.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      }
    ],

    "Dependency Scanning": [
      {
        name: "Dependency-Check",
        description: "OWASP dependency checker",
        isActive: false,
        logo: "/new-adapter-logos/Dependency-Check.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      },
      {
        name: "Safety",
        description: "Python dependency checker",
        isActive: false,
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      },
      {
        name: "npm audit",
        description: "Node.js dependency scanner",
        isActive: false,
        logo: "/new-adapter-logos/npm.svg",
        docsUrl: "https://docs.snapsec.co/integrations/vm"
      }
    ]
  }
};

export default adaptersConfig;