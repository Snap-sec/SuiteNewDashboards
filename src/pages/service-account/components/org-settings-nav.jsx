import { Shield, Settings2, Building2, Users } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

export const NAV_ITEMS = [
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'product-access', label: 'Product access', icon: Settings2 },
  { id: 'license', label: 'License', icon: Shield },
  { id: 'members', label: 'Members', icon: Users },
];

export function OrgSettingsNav() {
  return (
    <TabsList variant="line" size="md" className="border-b w-full justify-start">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
        <TabsTrigger key={id} value={id} className="gap-2">
          <Icon className="size-4 shrink-0" />
          {label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
