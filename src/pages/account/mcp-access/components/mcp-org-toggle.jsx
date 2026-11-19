import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { toast } from 'sonner';
import { useRefreshTokenMutation } from '@/services/auth/authApi';
import {
  useGetOrgMcpAccessQuery,
  useUpdateOrgMcpAccessMutation,
} from '@/services/auth/orgApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export function McpOrgToggle() {
  const { user, setUser } = useAuth();
  const isMember = user?.role?.toLowerCase() === 'member';
  const isAuditor = user?.role === 'Auditor';
  const [refreshToken] = useRefreshTokenMutation();

  const { data, isLoading } = useGetOrgMcpAccessQuery();
  const [updateMcpAccess, { isLoading: isUpdating }] =
    useUpdateOrgMcpAccessMutation();

  const [mcpEnabled, setMcpEnabled] = useState(false);

  useEffect(() => {
    if (data?.data) {
      setMcpEnabled(data.data.mcp_enabled === true);
    } else if (user) {
      setMcpEnabled(user.mcp_enabled === true);
    }
  }, [data, user]);

  const handleToggle = async (checked) => {
    setMcpEnabled(checked);
    try {
      await updateMcpAccess({ mcp_enabled: checked }).unwrap();

      const { data: refreshedData } = await refreshToken({
        refreshToken: user.refreshToken,
      }).unwrap();
      const newUser = { ...user, ...refreshedData };
      setUser(newUser);
      toast.success(
        `MCP Integration ${checked ? 'enabled' : 'disabled'} successfully`,
      );
    } catch (error) {
      setMcpEnabled(!checked);
      toast.error(error?.data?.error || 'Failed to update MCP settings');
    }
  };

  if (isLoading) {
    return (
      <Card className="min-w-full animate-pulse">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3 bg-muted/50 p-4 rounded-lg border border-border">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-12" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-w-full">
      <CardHeader>
        <div className="flex flex-col gap-1">
          <CardTitle>MCP Configuration</CardTitle>
          <span className="text-secondary-foreground text-sm">
            Manage Model Context Protocol settings for the entire organization
          </span>
        </div>
      </CardHeader>

      <CardContent className="py-5">
        <div className="flex items-center justify-between gap-3 bg-muted/50 p-4 rounded-lg border border-border">
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {mcpEnabled
                ? 'MCP Integration Active'
                : 'MCP Integration Disabled'}
            </span>
            <span className="text-xs text-muted-foreground">
              {mcpEnabled
                ? 'This allows organization members to connect their IDE agents to Snapsec remote MCP servers.'
                : 'This disables all organization-wide MCP access and tool usage.'}
            </span>
          </div>

          <Switch
            checked={mcpEnabled}
            onCheckedChange={handleToggle}
            disabled={isMember || isAuditor || isLoading || isUpdating}
          />
        </div>
      </CardContent>
    </Card>
  );
}
