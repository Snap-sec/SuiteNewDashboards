import React from 'react';
import MetricsCards from '@/components/custom/cards/metric-cards';
import useStore from '../store';

const MetricsCard = ({ metrics, isLoading }) => {
  const setFilters = useStore((state) => state.setFilters);

  const stats = [
    { label: 'In Review', number: metrics?.inReviewVulns || 0, state: 'In Review' },
    { label: 'Triaged', number: metrics?.inProgressVulns || 0, state: 'Triaged' },
    { label: 'Duplicate', number: metrics?.duplicateVulns || 0, state: 'Duplicate' },
    { label: 'Retest', number: metrics?.retestVulns || 0, state: 'Re Test' },
    { label: 'Fixed In Staging', number: metrics?.fixedInStagingVulns || 0, state: 'Fixed In Staging' },
    { label: 'Resolved', number: metrics?.resolvedVulns || 0, state: 'Resolved' },
    { label: 'Risk Accepted', number: metrics?.riskAcceptedVulns || 0, state: 'Risk Accepted' },
    { label: 'Unresolved', number: metrics?.unresolvedVulns || 0, state: 'Unresolved' },
    { label: 'False Positive', number: metrics?.falsePositiveVulns || 0, state: 'False Positive' },
    { label: 'Not Applicable', number: metrics?.notApplicableVulns || 0, state: 'Not Applicable' },
  ];

  const handleItemClick = (item) => {
    if (item?.state) {
      setFilters((prev) => ({ ...prev, state: item.state }));
    }
  };

  return (
    <MetricsCards
      items={stats}
      isLoading={isLoading}
      onItemClick={handleItemClick}
    />
  );
};

export default MetricsCard;
