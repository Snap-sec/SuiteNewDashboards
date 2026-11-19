import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ReAreaChart from '@/components/custom/charts/reui/area-chart';

export default function DashboardTab({ agent, isLoading = false }) {
  const chartData = useMemo(() => {
    const rawData =
      agent?.stats?.tokenUsageOverTime ||
      agent?.tokenUsageOverTime ||
      agent?.stats?.tokenUsage ||
      [];
    if (!Array.isArray(rawData) || rawData.length === 0) return [];
    return rawData.map((item) => {
      let formattedDate = item.date || '';
      if (!formattedDate && item.timestamp) {
        try {
          formattedDate = new Date(item.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
        } catch {
          formattedDate = String(item.timestamp);
        }
      }
      return {
        date: formattedDate || 'N/A',
        tokens: Number(item.tokens ?? 0),
        inputTokens: Number(item.inputTokens ?? 0),
        outputTokens: Number(item.outputTokens ?? 0),
      };
    });
  }, [agent]);

  const totalTokens = agent?.stats?.totalTokensUsed;

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Token Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <ReAreaChart
            noCard
            data={chartData}
            xKey="date"
            xTickFormatter={(v) => v}
            keys={[
              { key: 'tokens', label: 'Total Tokens' },
              { key: 'inputTokens', label: 'Input Tokens' },
              { key: 'outputTokens', label: 'Output Tokens' },
            ]}
            colors={['#3b82f6', '#10b981', '#8b5cf6']}
            stacked={false}
            curveType="monotone"
            height={320}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}

