import {
  Globe,
  MapPin,
  Server,
  Plug,
  Cpu,
  BadgeCheck,
  Microchip,
  HardDrive,
  GitBranch,
  Box,
  Database,
  Webhook,
  Briefcase,
  Users,
  LayoutGrid,
  CircleDot,
  Monitor,
} from 'lucide-react';

function GetAssetTypeInfo(type) {
  const normalized = (type || '').toLowerCase().trim();
  switch (normalized) {
    case 'subdomain':
    case 'subdomains':
      return { icon: <Globe className="w-3.5 h-3.5" />, label: 'Subdomains' };
    case 'ip':
    case 'ips':
    case 'ip address':
    case 'ip addresses':
      return { icon: <MapPin className="w-3.5 h-3.5" />, label: 'IP Addresses' };
    case 'web_server':
    case 'webserver':
    case 'web server':
    case 'web servers':
      return { icon: <Server className="w-3.5 h-3.5" />, label: 'Web Servers' };
    case 'server':
    case 'servers':
      return { icon: <Server className="w-3.5 h-3.5" />, label: 'Servers' };
    case 'port':
    case 'ports':
      return { icon: <Plug className="w-3.5 h-3.5" />, label: 'Ports' };
    case 'service':
    case 'services':
      return { icon: <Cpu className="w-3.5 h-3.5" />, label: 'Services' };
    case 'certificate':
    case 'certificates':
      return { icon: <BadgeCheck className="w-3.5 h-3.5" />, label: 'Certificates' };
    case 'technology':
    case 'technologies':
      return { icon: <Microchip className="w-3.5 h-3.5" />, label: 'Technologies' };
    case 'dns':
    case 'dns records':
    case 'dns record':
      return { icon: <HardDrive className="w-3.5 h-3.5" />, label: 'DNS Records' };
    case 'repository':
    case 'repositories':
      return { icon: <GitBranch className="w-3.5 h-3.5" />, label: 'Repositories' };
    case 'registry':
    case 'registries':
      return { icon: <Box className="w-3.5 h-3.5" />, label: 'Registries' };
    case 'object_storage':
    case 'object storage':
    case 'object storages':
      return { icon: <Database className="w-3.5 h-3.5" />, label: 'Object Storages' };
    case 'api':
    case 'apis':
      return { icon: <Webhook className="w-3.5 h-3.5" />, label: 'APIs' };
    case 'employee':
    case 'employees':
      return { icon: <Users className="w-3.5 h-3.5" />, label: 'Employees' };
    case 'vendor':
    case 'vendors':
      return { icon: <Briefcase className="w-3.5 h-3.5" />, label: 'Vendors' };
    case 'application':
    case 'applications':
      return { icon: <LayoutGrid className="w-3.5 h-3.5" />, label: 'Applications' };
    case 'endpoint':
    case 'endpoints':
      return { icon: <Server className="w-3.5 h-3.5" />, label: 'Applications' };
    case 'workstation':
    case 'workstations':
      return { icon: <Monitor className="w-3.5 h-3.5" />, label: 'Workstations' };
    default:
      return { icon: <CircleDot className="w-3.5 h-3.5" />, label: type || 'Asset' };
  }
}

export default GetAssetTypeInfo;
