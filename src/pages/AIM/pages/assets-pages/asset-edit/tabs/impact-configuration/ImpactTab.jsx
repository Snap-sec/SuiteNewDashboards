import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Select from '@/components/custom/select';
import { useGetAimAssetImpactQuery, useUpdateAimAssetImpactMutation, useGetAimAssetImpactConfigurationQuery } from '@/services/asset-inventory/assets/assetsApi';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

import { useAuth } from '@/auth/context/auth-context';

export default function ImpactTab({ asset }) {
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';

  const { data: configRes, isLoading: isLoadingConfig } = useGetAimAssetImpactConfigurationQuery();
  const { data: impactRes, isLoading: isLoadingImpact } = useGetAimAssetImpactQuery(asset?.id || asset?._id, {
    skip: !asset?.id && !asset?._id,
  });
  const [updateImpact, { isLoading: isUpdating }] = useUpdateAimAssetImpactMutation();

  const handleUpdate = async (payload) => {
    if (isAuditor) return;
    try {
      await updateImpact({ id: asset?.id || asset?._id, body: payload }).unwrap();
      toast.success('Impact configuration updated successfully');
    } catch (error) {
      toast.error('Failed to update impact configuration');
    }
  };

  if (isLoadingConfig || isLoadingImpact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Impact Configuration</CardTitle>
          <CardDescription>
            Configure the potential impact levels for this asset across different business dimensions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-2">
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use API config
  const properties = Array.isArray(configRes?.data) ? configRes.data : Array.isArray(configRes) ? configRes : [];

  const impactValues = impactRes || impactRes?.data?.impacts || impactRes?.impacts || impactRes?.data?.impact || impactRes?.impact || impactRes?.data || impactRes || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impact Configuration</CardTitle>
        <CardDescription>
          Configure the potential impact levels for this asset across different business dimensions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {properties.map((prop, idx) => {
              const options = (prop.exampleValues || []).map(val => ({ label: val, value: val.toLowerCase() }));
              const key = prop.property;
              const payloadKey = key ? key.split(' ')[0].toLowerCase() : '';

              return (
                <TableRow key={key || idx}>
                  <TableCell className="font-medium">{prop.property}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{prop.description}</TableCell>
                  <TableCell>
                    <Select
                      options={options}
                      value={payloadKey ? (impactValues[payloadKey] || '') : ''}
                      placeholder="Select Level"
                      enableSearch={false}
                      disabled={isAuditor || isUpdating}
                      onChange={(selected) => {
                        if (!isAuditor && selected && payloadKey) {
                          handleUpdate({ [payloadKey]: selected.value });
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
