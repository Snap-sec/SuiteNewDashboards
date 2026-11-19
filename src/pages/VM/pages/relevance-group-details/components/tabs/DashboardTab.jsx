import React from 'react';
import RelevanceResolutionsTimelineChart from '../charts/RelevanceResolutionsTimelineChart';
import RelevanceVulnerabilityDonutChart from '../charts/RelevanceVulnerabilityDonutChart';
import RelevanceSeverityColumnChart from '../charts/RelevanceSeverityColumnChart';
import RelevanceStatePieChart from '../charts/RelevanceStatePieChart';

export default function DashboardTab({ group, isLoading }) {
  const charts = group?.charts || {};

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Resolutions Timeline Chart */}
      <div className="w-full">
        <RelevanceResolutionsTimelineChart
          timeline={charts.resolutions_timeline}
          isLoading={isLoading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch w-full">
        <RelevanceVulnerabilityDonutChart
          breakdown={charts.vuln_breakdown}
          isLoading={isLoading}
        />
        <RelevanceSeverityColumnChart
          breakdown={charts.severity_breakdown}
          isLoading={isLoading}
        />
        <RelevanceStatePieChart
          breakdown={charts.state_breakdown}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
