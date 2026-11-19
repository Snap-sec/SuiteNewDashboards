import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Role to badge variant mapping.
 * Supported roles:
 * - Platform Admin: Violet/Info
 * - Admin: Destructive/Red
 * - Developer: Primary/Blue
 * - Auditor: Success/Emerald
 * - Manager: Warning/Amber
 * - Default (Member/other): Secondary
 */
const ROLE_CONFIG = {
  'platform admin': {
    label: 'Platform Admin',
    variant: 'info',
  },
  'admin': {
    label: 'Admin',
    variant: 'destructive',
  },
  'developer': {
    label: 'Developer',
    variant: 'primary',
  },
  'auditor': {
    label: 'Auditor',
    variant: 'success',
  },
  'manager': {
    label: 'Manager',
    variant: 'warning',
  },
  default: {
    label: 'Member',
    variant: 'secondary',
  },
};

function formatRoleLabel(role) {
  if (!role || typeof role !== 'string') return 'Member';
  return role
    .trim()
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeRole(role) {
  if (!role || typeof role !== 'string') return '';
  return role.toLowerCase().replace(/[_-]/g, ' ').trim();
}

function UserRoleBadge({
  role,
  variant,
  appearance = 'outline',
  size = 'md',
  className,
  children,
  ...props
}) {
  const normalizedKey = normalizeRole(role);
  const config = ROLE_CONFIG[normalizedKey] || ROLE_CONFIG.default;

  const displayLabel = children ?? (role ? formatRoleLabel(role) : config.label);
  const badgeVariant = variant || config.variant;

  return (
    <Badge
      variant={badgeVariant}
      appearance={appearance}
      size={size}
      className={cn('capitalize', className)}
      {...props}
    >
      {displayLabel}
    </Badge>
  );
}

export { UserRoleBadge, ROLE_CONFIG };
export default UserRoleBadge;
