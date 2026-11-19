import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import OperationalDashboard from './dashboard';
import RiskAnalyticsDashboard from '../risk-analytics/risk-analytics';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { useAuth } from '@/auth/context/auth-context';

export default function MainDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const type = searchParams.get('type') || 'opt';
  const isDeveloper = user?.role === 'Developer';

  useEffect(() => {
    if (isDeveloper && type === 'risk') {
      setSearchParams({ type: 'opt' }, { replace: true });
    }
  }, [isDeveloper, type, setSearchParams]);

  if (type === 'opt' || (isDeveloper && type === 'risk')) {
    return <OperationalDashboard />;
  }

  return (
    <AuthorityGuard forbidRoles={['Developer']} showAccessDenied>
      <RiskAnalyticsDashboard />
    </AuthorityGuard>
  );
}
