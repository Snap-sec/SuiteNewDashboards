import { Fragment, useEffect, useState } from 'react';
import { HexagonBadge } from '@/partials/common/hexagon-badge';
import {
  BadgeCheck,
  CheckCircle,
  LocateFixed,
  Puzzle,
  ShieldCheck,
  TabletSmartphone,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetOrgSecurityPreferencesQuery,
  useUpdateOrgSecurityPreferencesMutation,
} from '@/services/auth/orgApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { onAuthority } from '../../../../../lib/helpers';

const LoadingWrap = ({ loading, children }) => {
  if (loading) {
    return <Skeleton className="h-[20px] rounded-md" />;
  } else {
    return children;
  }
};

const GeneralSettings = () => {
  const { data, isLoading: preferencesLoading } =
    useGetOrgSecurityPreferencesQuery();

  const preferences = data?.data?.securityPreferences || {};

  const [updateSecurity, { isLoading: updatingSecrtyPref }] =
    useUpdateOrgSecurityPreferencesMutation();

  const [localPreferences, setLocalPreferences] = useState({});

  // useEffect(() => {
  //   if (preferencesLoading === false) {
  //     setLocalPreferences(preferences);
  //   }
  // }, [preferencesLoading, preferences]);

  const handleSecurityUpdate = onAuthority(['Admin'], (update) => {
    const key = Object.keys(update)[0];
    const originalValue = localPreferences[key];

    // Optimistically update UI
    setLocalPreferences((prev) => ({ ...prev, [key]: update[key] }));

    toast.promise(updateSecurity(update).unwrap(), {
      loading: 'Updating preferences',
      error: () => {
        setLocalPreferences((prev) => ({ ...prev, [key]: originalValue }));

        return 'Failed to update preferences';
      },
      success: 'Preferences updated',
    });
  });

  const items = [
    {
      icon: Users,
      title: (
        <Fragment>
          Allow Members to Invite
          {/* <Badge size="sm" variant="primary" appearance="outline">
            Pro
          </Badge> */}
        </Fragment>
      ),

      description: 'Allow members to invite other people',
      actions: (
        <LoadingWrap loading={preferencesLoading}>
          <Switch
            disabled={updatingSecrtyPref}
            size="sm"
            id="auto-update"
            checked={!!localPreferences.allowMembersInvite}
            onClick={() =>
              handleSecurityUpdate({
                allowMembersInvite: !preferences?.allowMembersInvite,
              })
            }
          />
        </LoadingWrap>
      ),
    },
    {
      icon: Puzzle,
      title: (
        <Fragment>
          Allow members to install Integrations
          {/* <Badge size="sm" variant="primary" appearance="outline">
            Pro
          </Badge> */}
        </Fragment>
      ),

      description:
        'Allow the installation of external apps or integrations by members..',
      actions: (
        <LoadingWrap loading={preferencesLoading}>
          <Switch
            disabled={updatingSecrtyPref}
            size="sm"
            id="auto-update"
            checked={!!localPreferences.allowMembersInstallIntegrations}
            onClick={() =>
              handleSecurityUpdate({
                allowMembersInstallIntegrations:
                  !preferences.allowMembersInstallIntegrations,
              })
            }
          />
        </LoadingWrap>
      ),
    },
    {
      icon: LocateFixed,
      title: 'Allow assignees to delete their vulnerabilities',
      description:
        'Enable Assignees to remove vulnerabilities assigned to them',
      actions: (
        <LoadingWrap loading={preferencesLoading}>
          <Switch
            disabled={updatingSecrtyPref}
            size="sm"
            checked={!!localPreferences.allowOwnersDeleteOwnVulns}
            onClick={() =>
              handleSecurityUpdate({
                allowOwnersDeleteOwnVulns:
                  !preferences.allowOwnersDeleteOwnVulns,
              })
            }
          />
        </LoadingWrap>
      ),
    },
    {
      icon: ShieldCheck,
      title: (
        <Fragment>
          Enforce 2FA (two factor authentication) for all members
          {/* <Badge variant="info" appearance="outline">
            Beta
          </Badge> */}
        </Fragment>
      ),

      description: 'Enforce 2FA for all the organization members',
      actions: (
        <LoadingWrap loading={preferencesLoading}>
          <Switch
            disabled={updatingSecrtyPref}
            size="sm"
            checked={!!localPreferences?.enforce2FA}
            onClick={() =>
              handleSecurityUpdate({ enforce2FA: !preferences.enforce2FA })
            }
          />
        </LoadingWrap>
      ),
    },
    {
      icon: BadgeCheck,
      title: 'Allow members to assign Vulnerabilities',
      description: 'Enable members to assign vulnerabilities to other members',
      actions: (
        <LoadingWrap loading={preferencesLoading}>
          <Switch
            disabled={updatingSecrtyPref}
            size="sm"
            checked={!!localPreferences?.allowMembersAssignVulns}
            onClick={() =>
              handleSecurityUpdate({
                allowMembersAssignVulns: !preferences.allowMembersAssignVulns,
              })
            }
          />
        </LoadingWrap>
      ),
    },
    {
      icon: CheckCircle,
      title: 'Allow PDF report generation',
      description: 'Enable members to generate PDF reports',
      actions: (
        <LoadingWrap loading={preferencesLoading}>
          <Switch
            disabled={updatingSecrtyPref}
            size="sm"
            checked={!!localPreferences?.allowMembersGeneratePDFReports}
            onClick={() =>
              handleSecurityUpdate({
                allowMembersGeneratePDFReports:
                  !preferences.allowMembersGeneratePDFReports,
              })
            }
          />
        </LoadingWrap>
      ),
    },
    {
      icon: TabletSmartphone,
      title: (
        <Fragment>
          Share VM Vulnerabilities
          {/* <Badge variant="info" appearance="outline">
            Beta
          </Badge> */}
        </Fragment>
      ),

      description: 'Enable members to share VM vulnerabilities',
      // actions: (
      //   <Fragment>
      //     <Button
      //       variant="outline"
      //       className="bg-red-100 border-red-200 text-red-600 hover:text-white hover:bg-red-500 dark:border-red-950 dark:bg-red-950/30"
      //     >
      //       Disable all
      //     </Button>
      //     <Button variant="outline">Enable all</Button>
      //   </Fragment>
      // ),
      actions: (
        <LoadingWrap loading={preferencesLoading}>
          <Switch
            disabled={updatingSecrtyPref}
            size="sm"
            checked={!!localPreferences?.allowMembersShareVMVulns}
            onClick={() =>
              handleSecurityUpdate({
                allowMembersShareVMVulns: !preferences.allowMembersShareVMVulns,
              })
            }
          />
        </LoadingWrap>
      ),
    },
  ];

  const renderItem = (item, index) => {
    return (
      <CardContent
        key={index}
        className="border-b border-border flex items-center flex-wrap sm:flex-nowrap justify-between py-4 gap-2.5"
      >
        <div className="flex items-center gap-3.5">
          <HexagonBadge
            stroke="stroke-input"
            fill="fill-muted/30"
            size="size-[50px]"
            badge={<item.icon className="text-xl text-muted-foreground" />}
          />

          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-1.5 leading-none font-medium text-sm text-mono">
              {item.title}
            </span>
            <span className="text-sm text-gray700">{item.description}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">{item.actions}</div>
      </CardContent>
    );
  };

  return (
    <Card>
      {items.map((item, index) => {
        return renderItem(item, index);
      })}
    </Card>
  );
};

export { GeneralSettings };
