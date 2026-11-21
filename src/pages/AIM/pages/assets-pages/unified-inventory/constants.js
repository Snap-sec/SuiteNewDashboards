import {
  BadgeCheck,
  Box,
  Briefcase,
  Database,
  FileText,
  GitBranch,
  Globe,
  Layers,
  LayoutGrid,
  MapPin,
  Monitor,
  Server,
  Users,
  Webhook,
} from 'lucide-react';

export const ASSET_TYPES = [
  { id: 'all', label: 'All Assets', icon: Layers, category: 'Complete Estate', defaultCount: 12846 },
  { id: 'subdomain', label: 'Subdomains', icon: Globe, category: 'Network & DNS', defaultCount: 3412 },
  { id: 'api', label: 'APIs', icon: Webhook, category: 'Endpoints', defaultCount: 1846 },
  { id: 'ip', label: 'IP Addresses', icon: MapPin, category: 'Infrastructure', defaultCount: 1024 },
  { id: 'application', label: 'Applications', icon: LayoutGrid, category: 'Web & SaaS', defaultCount: 1420 },
  { id: 'server', label: 'Servers', icon: Server, category: 'Compute & Cloud', defaultCount: 2150 },
  { id: 'workstation', label: 'Workstations', icon: Monitor, category: 'Endpoints', defaultCount: 3104 },
  { id: 'repository', label: 'Repositories', icon: GitBranch, category: 'Code & SCM', defaultCount: 480 },
  { id: 'certificate', label: 'Certificates', icon: BadgeCheck, category: 'Security & TLS', defaultCount: 312 },
  { id: 'object_storage', label: 'Object Storages', icon: Database, category: 'Data & S3', defaultCount: 255 },
  { id: 'registry', label: 'Registries', icon: Box, category: 'Containers', defaultCount: 184 },
  { id: 'employee', label: 'Employees', icon: Users, category: 'Identities', defaultCount: 890 },
  { id: 'vendor', label: 'Hardware Vendors', icon: Briefcase, category: 'Supply Chain', defaultCount: 42 },
  { id: 'license', label: 'Software Licenses', icon: FileText, category: 'Governance', defaultCount: 118 },
];

export const LIFECYCLE_STATES = [
  { id: 'active', label: 'Active', dotColor: 'bg-emerald-500' },
  { id: 'idle', label: 'Idle', dotColor: 'bg-amber-500' },
  { id: 'dormant', label: 'Dormant', dotColor: 'bg-orange-500' },
  { id: 'staged', label: 'Staged', dotColor: 'bg-blue-500' },
  { id: 'decommissioned', label: 'Decommissioned', dotColor: 'bg-zinc-400' },
];

export const CONNECTIVITY_OPTIONS = [
  { id: 'all', label: 'All Reachability' },
  { id: 'external', label: 'External (Public Facing)' },
  { id: 'internal', label: 'Internal (Private / Restricted)' },
];

export const ENVIRONMENTS = [
  { id: 'all', label: 'All Environments' },
  { id: 'production', label: 'Production' },
  { id: 'staging', label: 'Staging' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'testing', label: 'Testing' },
];

export const SEVERITY_OPTIONS = [
  { id: 'all', label: 'All Severities' },
  { id: 'critical', label: 'Critical Vulnerabilities' },
  { id: 'high', label: 'High & Above' },
  { id: 'medium', label: 'Medium & Above' },
  { id: 'none', label: 'Zero Alerts (Clean)' },
];
