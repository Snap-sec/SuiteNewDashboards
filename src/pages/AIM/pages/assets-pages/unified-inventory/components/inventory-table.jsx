import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MoreHorizontal,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import GetAssetTypeInfo from '@/components/custom/asset-icons';

const STATUS_CONFIG = {
  active: { label: 'Active', dotClass: 'bg-emerald-500', textClass: 'text-emerald-700 dark:text-emerald-400' },
  idle: { label: 'Idle', dotClass: 'bg-amber-500', textClass: 'text-amber-700 dark:text-amber-400' },
  dormant: { label: 'Dormant', dotClass: 'bg-orange-500', textClass: 'text-orange-700 dark:text-orange-400' },
  staged: { label: 'Staged', dotClass: 'bg-blue-500', textClass: 'text-blue-700 dark:text-blue-400' },
  decommissioned: { label: 'Decommissioned', dotClass: 'bg-zinc-400', textClass: 'text-zinc-500' },
};

function parseOwner(owner, businessUnit) {
  const buStr = typeof businessUnit === 'string'
    ? businessUnit
    : (typeof businessUnit?.name === 'string' ? businessUnit.name : null);

  if (!owner) {
    return buStr ? { name: buStr, sub: null } : null;
  }
  if (typeof owner === 'string') {
    if (owner === 'Unassigned' || !owner.trim()) {
      return buStr ? { name: buStr, sub: null } : null;
    }
    return { name: owner, sub: buStr };
  }
  if (typeof owner === 'object') {
    const user = owner.user;
    const team = owner.team;
    const dept = owner.department;

    let userName = null;
    if (user) {
      if (typeof user === 'string') {
        userName = user;
      } else if (typeof user === 'object') {
        if (user.firstName || user.lastName) {
          userName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        } else if (user.email) {
          userName = user.email.split('@')[0];
        }
      }
    }

    const teamName = typeof team === 'string' ? team : (typeof team?.name === 'string' ? team.name : null);
    const deptName = typeof dept === 'string' ? dept : (typeof dept?.name === 'string' ? dept.name : null);
    const userEmail = typeof user?.email === 'string' ? user.email : null;

    const mainName = userName || teamName || deptName;
    const subName = (userName && (teamName || deptName || userEmail)) ||
                    (teamName && deptName) ||
                    buStr;

    if (mainName) {
      return { name: mainName, sub: subName || null };
    }
    if (buStr) {
      return { name: buStr, sub: null };
    }
  }
  return null;
}

function formatRelativeDate(val) {
  if (!val) return 'Recently';
  if (typeof val === 'string' && !val.includes('-') && !val.includes('T')) {
    return val;
  }
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return 'Recently';
    const now = Date.now();
    const diffMs = now - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export function InventoryTable({
  assets = [],
  isLoading = false,
  pagination = { pageIndex: 0, pageSize: 10 },
  onPageChange,
  onPageSizeChange,
  totalItems = 0,
  selectedRows = {},
  onToggleRow,
  onToggleAllRows,
  onResetFilters,
  onDecommission,
}) {
  const pageCount = Math.max(1, Math.ceil(totalItems / pagination.pageSize));
  const isAllSelected =
    assets.length > 0 && assets.every((item) => selectedRows[item._id]);

  return (
    <div className="space-y-3">
      {/* Table Container */}
      <div className="border border-border rounded-lg bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto min-h-[320px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                <th className="w-10 px-3 py-2.5">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(checked) => onToggleAllRows(Boolean(checked))}
                    aria-label="Select all assets on page"
                  />
                </th>
                <th className="px-3 py-2.5 min-w-[200px]">Asset / Value</th>
                <th className="px-3 py-2.5 min-w-[120px]">Type</th>
                <th className="px-3 py-2.5 min-w-[110px]">Environment</th>
                <th className="px-3 py-2.5 min-w-[140px]">Accountable Owner</th>
                <th className="px-3 py-2.5 min-w-[110px]">Vulnerabilities</th>
                <th className="px-3 py-2.5 min-w-[100px]">Lifecycle</th>
                <th className="px-3 py-2.5 min-w-[100px]">Discovered</th>
                <th className="w-12 px-2 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="p-3"><Skeleton className="h-4 w-4" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-44" /><Skeleton className="h-3 w-28 mt-1" /></td>
                    <td className="p-3"><Skeleton className="h-5 w-20" /></td>
                    <td className="p-3"><Skeleton className="h-5 w-16" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-28" /></td>
                    <td className="p-3"><Skeleton className="h-5 w-16" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-16" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-16" /></td>
                    <td className="p-3"><Skeleton className="h-6 w-6 ml-auto" /></td>
                  </tr>
                ))
              ) : assets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-xs mx-auto text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-sm text-foreground">No assets found</p>
                      <p className="text-xs text-muted-foreground">
                        No assets matched the current filters or query. Try resetting your search parameters.
                      </p>
                      {onResetFilters && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onResetFilters}
                          className="mt-2 text-xs gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Reset Filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                assets.map((asset) => {
                  const isSelected = Boolean(selectedRows[asset._id]);
                  const assetType =
                    typeof asset.type === 'string'
                      ? asset.type
                      : (typeof asset.asset_type === 'string' ? asset.asset_type : 'unknown');
                  const typeInfo = GetAssetTypeInfo(assetType);

                  const rawStatus =
                    typeof asset.state === 'string'
                      ? asset.state
                      : (typeof asset.status === 'string' ? asset.status : 'active');
                  const statusInfo =
                    STATUS_CONFIG[rawStatus.toLowerCase()] || STATUS_CONFIG.active;

                  const vulns = asset.security?.vulnerability_stats || asset.vulnerabilities || {};
                  const critCount = Number(vulns.critical) || 0;
                  const highCount = Number(vulns.high) || 0;
                  const medCount = Number(vulns.medium) || 0;
                  const totalVulns = Number(vulns.total) || (critCount + highCount + medCount);

                  const assetId = typeof asset._id === 'string' ? asset._id : '';
                  const displayValue =
                    typeof asset.value === 'string'
                      ? asset.value
                      : (typeof asset.name === 'string' ? asset.name : (assetId || 'Unnamed Asset'));
                  const displaySubtitle =
                    typeof asset.name === 'string' && asset.name !== displayValue
                      ? asset.name
                      : (typeof asset.ip === 'string' ? asset.ip : '');

                  const environment =
                    typeof asset.environment === 'string' ? asset.environment : 'Production';

                  const rawConn =
                    asset.connectivity ||
                    (asset.risk?.exposure ? String(asset.risk.exposure) : null) ||
                    (asset.is_internal !== undefined ? (asset.is_internal ? 'Internal' : 'External') : null);
                  const connectivity = typeof rawConn === 'string' ? rawConn : null;
                  const isExternal =
                    connectivity && connectivity.toLowerCase() === 'external';

                  const ownerInfo = parseOwner(
                    asset.owner,
                    asset.businessUnit || asset.business_unit,
                  );

                  const rawDate =
                    asset.last_seen ||
                    asset.lastSeen ||
                    asset.discoveredAt ||
                    asset.createdAt;
                  const displayDate = formatRelativeDate(rawDate);

                  return (
                    <tr
                      key={asset._id || displayValue}
                      className={`hover:bg-muted/30 transition-colors ${
                        isSelected ? 'bg-primary/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-2.5">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => onToggleRow(asset._id)}
                          aria-label={`Select ${displayValue}`}
                        />
                      </td>

                      {/* Asset / Value */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center bg-muted text-muted-foreground shrink-0">
                            {typeInfo?.icon}
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/assetinventory/asset-edit/${asset._id}`}
                              className="font-medium text-foreground hover:text-primary transition-colors block truncate max-w-[280px]"
                              title={displayValue}
                            >
                              {displayValue}
                            </Link>
                            {displaySubtitle ? (
                              <span className="text-[11px] text-muted-foreground block truncate max-w-[280px]">
                                {displaySubtitle}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-3 py-2.5">
                        <Badge
                          variant="secondary"
                          className="capitalize gap-1 text-[11px] font-normal"
                        >
                          {typeInfo?.label || assetType}
                        </Badge>
                      </td>

                      {/* Environment */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-secondary-foreground text-xs">
                            {environment}
                          </span>
                          {connectivity && (
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                                isExternal
                                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {connectivity}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Owner */}
                      <td className="px-3 py-2.5">
                        {ownerInfo ? (
                          <div>
                            <span className="font-medium text-foreground text-xs block truncate max-w-[160px]">
                              {ownerInfo.name}
                            </span>
                            {ownerInfo.sub && (
                              <span className="text-[10px] text-muted-foreground block truncate max-w-[160px]">
                                {ownerInfo.sub}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs font-normal">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Vulnerabilities */}
                      <td className="px-3 py-2.5">
                        {totalVulns > 0 ? (
                          <div className="flex items-center gap-1">
                            {critCount > 0 && (
                              <Badge variant="destructive" size="xs">
                                {critCount}C
                              </Badge>
                            )}
                            {highCount > 0 && (
                              <Badge variant="warning" size="xs">
                                {highCount}H
                              </Badge>
                            )}
                            {medCount > 0 && (
                              <Badge variant="secondary" size="xs">
                                {medCount}M
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground font-mono">0 alerts</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-2.5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                          <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
                          <span className={statusInfo.textClass}>{statusInfo.label}</span>
                        </span>
                      </td>

                      {/* Discovered / Last Seen */}
                      <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                        {displayDate}
                      </td>

                      {/* Actions */}
                      <td className="px-2 py-2.5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 text-xs">
                            <DropdownMenuItem
                              onClick={() => (window.location.href = `/assetinventory/asset-edit/${asset._id}`)}
                              className="gap-2 cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDecommission?.(asset._id)}
                              className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Stage Decommission
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground px-1">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={pagination.pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 px-2 bg-card border border-border rounded-md text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-primary"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>per page</span>
          <span className="border-l border-border pl-2 text-foreground font-mono">
            Page {pagination.pageIndex + 1} of {pageCount} ({totalItems.toLocaleString()} total)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(0, pagination.pageIndex - 1))}
            disabled={pagination.pageIndex === 0 || isLoading}
            className="h-8 px-2.5 text-xs gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(pageCount - 1, pagination.pageIndex + 1))}
            disabled={pagination.pageIndex >= pageCount - 1 || isLoading}
            className="h-8 px-2.5 text-xs gap-1"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InventoryTable;
