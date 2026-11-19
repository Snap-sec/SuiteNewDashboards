import { useEffect, useMemo, useRef } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '@/hooks/use-debounce';
import { useGetVmVulnsQuery } from '@/services/vm/vulnerabilityApi';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';
import MetricsCard from './components/metrics-card';
import CreateVulnerability from './components/modals/create-vulnerability';
import VulnList from './components/VulnList';
import useStore from './store';


// Utility to parse filters param (e.g., "listId:abc,severity:high")
function parseFiltersParam(filtersParam) {
  if (!filtersParam) return {};

  const separator = filtersParam.includes(';') ? ';' : ',';
  return filtersParam.split(separator).reduce((acc, pair) => {
    const [key, value] = pair.split(':');
    if (key && value) acc[key] = value;
    return acc;
  }, {});
}

function getPageHeadingDetails(params) {
  if (params.get('owner') === 'my-vulns') {
    return {
      title: 'My Vulnerabilities',
      description:
        'Track, prioritize, and remediate all security vulnerabilities currently assigned to you across assets.',
    };
  }

  const status = params.get('status');
  switch (status) {
    case 'active':
      return {
        title: 'Active Vulnerabilities',
        description:
          'Monitor, analyze, and manage all unresolved security vulnerabilities requiring remediation across your infrastructure.',
      };
    case 'closed':
      return {
        title: 'Closed Vulnerabilities',
        description:
          'Review resolved, mitigated, and verified security vulnerabilities across all organizational assets and systems.',
      };
    case 'top-risks':
      return {
        title: 'Top Risks Vulnerabilities',
        description:
          'Focus on critical and high-severity security vulnerabilities posing immediate risk to your organization.',
      };
    default:
      return {
        title: 'All Vulnerabilities',
        description:
          'Comprehensive overview and management of all detected security vulnerabilities across your organizational assets.',
      };
  }
}

function Vulnerabilities() {
  const { user } = useAuth();
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const sorting = useStore((state) => state.sorting);
  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);

  const rawSearchQuery = useStore((state) => state.searchQuery);
  const setRawSearchQuery = useStore((state) => state.setSearchQuery);

  const debouncedSearch = useDebounce(rawSearchQuery, 400);

  // Read-only — we only use URL params to seed the initial state on mount.
  // We never write back to the URL from within this page.
  const [params] = useSearchParams();
  const statusParam = params.get('status');
  const ownerParam = params.get('owner');
  const hasInitializedFromUrl = useRef(false);
  const lastParams = useRef('');

  const activeStates = ['In Review', 'Unresolved', 'Triaged']
    .map(encodeURIComponent)
    .join(',');
  const closedStates = [
    'Fixed In Staging',
    'Re Test',
    'Resolved',
    'False Positive',
    'Not Applicable',
    'Duplicate',
  ]
    .map(encodeURIComponent)
    .join(',');

  const handleResetFilters = () => {
    setRawSearchQuery('');
    setRowSelection(() => ({}));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

    let base = {};
    if (ownerParam === 'my-vulns') {
      if (user?.email) {
        const assigneeFilters = data?.data?.filters?.assignee || [];
        const userEmailLower = user.email.toLowerCase();
        const matchedAssignee = assigneeFilters.find((assignee) =>
          String(assignee).toLowerCase().includes(userEmailLower)
        );
        base = { assignee: matchedAssignee || user.email };
      }
    } else if (statusParam === 'active') {
      base = { state: activeStates };
    } else if (statusParam === 'closed') {
      base = { state: closedStates };
    } else if (statusParam === 'top-risks') {
      base = { state: activeStates, severity: 'critical' };
    } else {
      const filtersParam = params.get('filters');
      base = filtersParam ? parseFiltersParam(filtersParam) : {};
    }

    setFilters(() => base);
  };

  const { data, isLoading, isFetching, isError, error } = useGetVmVulnsQuery({
    search: debouncedSearch,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
    ...(sorting?.length && sorting[0]
      ? {
        sortBy:
          sorting[0]?.id === 'Severity'
            ? 'cvssScore'
            : sorting[0]?.id === 'Reported On'
              ? 'createdAt'
              : sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      }
      : statusParam === 'top-risks'
        ? {
          sortBy: 'createdAt',
          sortOrder: 'asc',
        }
        : {}),
  });

  // Seed filters ONCE from URL params when navigating from another page (e.g., Risk Analytics).
  // Using a ref guard ensures this never re-runs and never creates a feedback loop.
  useEffect(() => {
    // if (hasInitializedFromUrl.current) return;
    // hasInitializedFromUrl.current = true;

    const filtersParam = params.get('filters');
    const searchParam = params.get('search');

    const paramsStr = params.toString();
    const isNavigating = lastParams.current !== paramsStr;
    lastParams.current = paramsStr;

    if (isNavigating && searchParam) {
      setRawSearchQuery(searchParam);
    }

    const activeStates = ['In Review', 'Unresolved', 'Triaged']
      .map(encodeURIComponent)
      .join(',');
    const closedStates = [
      'Fixed In Staging',
      'Re Test',
      'Resolved',
      'False Positive',
      'Not Applicable',
      'Duplicate',
    ]
      .map(encodeURIComponent)
      .join(',');

    setFilters((prev) => {
      let next = { ...prev };
      let changed = false;

      if (ownerParam === 'my-vulns') {
        if (user?.email) {
          const assigneeFilters = data?.data?.filters?.assignee || [];
          const userEmailLower = user.email.toLowerCase();
          const matchedAssignee = assigneeFilters.find(
            (assignee) => String(assignee).toLowerCase().includes(userEmailLower)
          );
          const targetValue = matchedAssignee || user.email;

          if (isNavigating) {
            // Fresh navigation: reset other filters and set assignee
            const nextKeys = Object.keys(next);
            const match = nextKeys.length === 1 && next.assignee === targetValue;
            if (!match) {
              next = { assignee: targetValue };
              changed = true;
            }
          } else {
            // Subsequent update (e.g. data loaded): preserve other filters, only update assignee
            if (next.assignee !== targetValue) {
              next.assignee = targetValue;
              changed = true;
            }
          }
        }
      } else if (isNavigating) {
        if (next.assignee) {
          const parsed = filtersParam ? parseFiltersParam(filtersParam) : {};
          if (!parsed.assignee) {
            delete next.assignee;
            changed = true;
          }
        }

        if (statusParam === 'active') {
          if (next.state !== activeStates) {
            next.state = activeStates;
            changed = true;
          }
          if (next.severity === 'critical') {
            delete next.severity;
            changed = true;
          }
        } else if (statusParam === 'closed') {
          if (next.state !== closedStates) {
            next.state = closedStates;
            changed = true;
          }
          if (next.severity === 'critical') {
            delete next.severity;
            changed = true;
          }
        } else if (statusParam === 'top-risks') {
          let updateNeeded = false;
          if (next.state !== activeStates) {
            next.state = activeStates;
            updateNeeded = true;
          }
          if (next.severity !== 'critical') {
            next.severity = 'critical';
            updateNeeded = true;
          }
          if (updateNeeded) {
            changed = true;
          }
        } else {
          const targetFilters = filtersParam ? parseFiltersParam(filtersParam) : {};
          const targetKeys = Object.keys(targetFilters);
          const nextKeys = Object.keys(next);
          let match = targetKeys.length === nextKeys.length;
          if (match) {
            for (const key of targetKeys) {
              if (next[key] !== targetFilters[key]) {
                match = false;
                break;
              }
            }
          }
          if (!match) {
            next = targetFilters;
            changed = true;
          }
        }
      }

      return changed ? next : prev;
    });
  }, [params, setFilters, setRawSearchQuery, rawSearchQuery, user, data]);

  // Compute default filters for the current page view so we can differentiate
  // default view filters from extra user-applied filters.
  const defaultFilters = useMemo(() => {
    if (ownerParam === 'my-vulns') {
      if (user?.email) {
        const assigneeFilters = data?.data?.filters?.assignee || [];
        const userEmailLower = user.email.toLowerCase();
        const matchedAssignee = assigneeFilters.find((assignee) =>
          String(assignee).toLowerCase().includes(userEmailLower)
        );
        const targetValue = matchedAssignee || user.email;
        return { assignee: targetValue };
      }
      return {};
    }
    if (statusParam === 'active') {
      return { state: activeStates };
    }
    if (statusParam === 'closed') {
      return { state: closedStates };
    }
    if (statusParam === 'top-risks') {
      return { state: activeStates, severity: 'critical' };
    }
    const filtersParam = params.get('filters');
    return filtersParam ? parseFiltersParam(filtersParam) : {};
  }, [ownerParam, statusParam, params, user?.email, data?.data?.filters?.assignee, activeStates, closedStates]);

  const hasExtraFilters = useMemo(() => {
    const currentKeys = Object.keys(filters || {});
    for (const key of currentKeys) {
      if (filters[key] !== defaultFilters[key]) {
        return true;
      }
    }
    return false;
  }, [filters, defaultFilters]);

  // Reset page when filters or search query change, to avoid wrong data fetching
  useEffect(() => {
    if (pagination?.pageIndex !== 0)
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [JSON.stringify(filters), rawSearchQuery]);

  if (
    !isLoading &&
    !isFetching &&
    !data?.data?.totalItems &&
    !debouncedSearch &&
    !hasExtraFilters &&
    !isError
  )
    return (
      <EmptyScreen
        title="No Vulnerabilities Found"
        subTitle="When new vulnerabilities are reported, they will show here."
        engage={
          <AuthorityGuard forbidRoles={'Auditor'}>
            <CreateVulnerability />
          </AuthorityGuard>
        }
      />
    );

  if (isError) {
    return <ApiErrorHandler error={error} />
  }

  const { title: headingTitle, description: headingDescription } =
    getPageHeadingDetails(params);

  return (
    <div className="p-4">
      <Helmet>
        <title>{`UniRisk | ${headingTitle}`}</title>
      </Helmet>

      <div className="flex items-center justify-between w-full overflow-x-hidden mb-1">
        <PageHeading
          title={headingTitle}
          description={headingDescription}
        />

        <div className="shrink-0">
          <AuthorityGuard forbidRoles={['Auditor', 'Developer']}>
            <CreateVulnerability />
          </AuthorityGuard>
        </div>
      </div>

      <div>
        <MetricsCard metrics={data?.data?.metrics} isLoading={isLoading} />
      </div>

      <div className="mt-4">
        <VulnList
          data={data?.data}
          isLoading={isLoading}
          isFetching={isFetching}
          onReset={handleResetFilters}
        />
      </div>
    </div>
  );
}

export default Vulnerabilities;