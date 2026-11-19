import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import useDebounce from '@/hooks/use-debounce';
import { useAuth } from '@/auth/context/auth-context';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import {
  useExportAimPublicAssetsViewMutation,
  useGetAimPublicAssetsQuery,
  useGetAimPublicAssetsSchemaQuery,
  useUpdateAimPublicAssetMutation,
} from '@/services/asset-inventory/assets/public-assets';
import { useGetAimBusinessUnitsQuery } from '@/services/asset-inventory/businessUnitsApi';
import { useGetDepartmentsQuery } from '@/services/auth/departmentsApi';
import { useGetOrgMembersQuery } from '@/services/auth/orgApi';
import { useGetTeamsQuery } from '@/services/auth/teamsApi';
import { Card, CardFooter, CardTable } from '@/components/ui/card';
import PageHeading from '@/components/custom/page-heading';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../../../components/common/empty-screen';
import { Button } from '../../../../../components/ui/button';
import EditAssetHeader from './components/EditAssetHeader';
import EditAssetPagination from './components/EditAssetPagination';
import EditAssetTable from './components/EditAssetTable';
import { Plug } from 'lucide-react';

export function EditAsset() {
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';
  const { orgId: paramOrgId } = useParams();

  // Retrieve current active organization ID
  const effectiveOrgId = useMemo(() => {
    if (paramOrgId) return paramOrgId;
    try {
      const userStr = localStorage.getItem('user');
      const userObj = userStr ? JSON.parse(userStr) : {};
      return (
        userObj?.orgId ||
        userObj?.orgID ||
        userObj?.organization ||
        localStorage.getItem('orgId') ||
        ''
      );
    } catch (e) {
      return localStorage.getItem('orgId') || '';
    }
  }, [paramOrgId]);

  const DEFAULT_INITIAL_COLUMNS = useMemo(() => [], []);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedType, setSelectedType] = useState('');
  const [localAssets, setLocalAssets] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(
    DEFAULT_INITIAL_COLUMNS,
  );
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    totalPages: 1,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const hasSeenAssets = React.useRef(false);

  // Parameter for schema endpoint query ('all' when all types selected, or selectedType)
  const schemaQueryType = useMemo(
    () => (selectedType && selectedType !== 'all' ? selectedType : 'all'),
    [selectedType],
  );

  // Fetch schema parameters passing only type
  const { data: schemaData } = useGetAimPublicAssetsSchemaQuery({
    type: schemaQueryType,
  });

  // Query parameters for RTK Query assets endpoint
  const queryParams = useMemo(
    () => ({
      orgId: effectiveOrgId,
      search: debouncedSearchQuery,
      limit: pagination.limit,
      page: pagination.page,
      ...(selectedType && selectedType !== 'all' && { type: selectedType }),
    }),
    [
      effectiveOrgId,
      debouncedSearchQuery,
      pagination.limit,
      pagination.page,
      selectedType,
    ],
  );

  const {
    data: publicAssets,
    isLoading,
    isFetching,
    refetch,
    isError: isAssetsError,
    error: assetsError,
  } = useGetAimPublicAssetsQuery(queryParams, {
    skip: !effectiveOrgId,
  });

  const [updatePublicAsset] = useUpdateAimPublicAssetMutation();
  const [exportPublicAssetsView, { isLoading: isExporting }] =
    useExportAimPublicAssetsViewMutation();

  // Extract referenced IDs from current page of assets to ensure they are included in dropdown data
  const {
    referencedBuIds,
    referencedDeptIds,
    referencedTeamIds,
    referencedUserIds,
  } = useMemo(() => {
    const assetsList = publicAssets?.assets || publicAssets?.data || [];
    const buIds = new Set();
    const deptIds = new Set();
    const teamIds = new Set();
    const userIds = new Set();

    assetsList.forEach((asset) => {
      // Business Units
      const buVal =
        asset.businessUnitIds || asset.businessUnits || asset.businessUnit;
      if (Array.isArray(buVal)) {
        buVal.forEach((v) =>
          buIds.add(
            typeof v === 'object' && v !== null ? v._id || v.id : String(v),
          ),
        );
      } else if (buVal && buVal !== '-') {
        buIds.add(
          typeof buVal === 'object' ? buVal._id || buVal.id : String(buVal),
        );
      }

      // Departments
      const deptVal = asset.ownerDepartmentId || asset.ownerDepartmentIds;
      if (Array.isArray(deptVal)) {
        deptVal.forEach((v) =>
          deptIds.add(
            typeof v === 'object' && v !== null ? v._id || v.id : String(v),
          ),
        );
      } else if (deptVal && deptVal !== '-') {
        deptIds.add(
          typeof deptVal === 'object'
            ? deptVal._id || deptVal.id
            : String(deptVal),
        );
      }

      // Teams
      const teamVal = asset.ownerTeamId || asset.ownerTeamIds;
      if (Array.isArray(teamVal)) {
        teamVal.forEach((v) =>
          teamIds.add(
            typeof v === 'object' && v !== null ? v._id || v.id : String(v),
          ),
        );
      } else if (teamVal && teamVal !== '-') {
        teamIds.add(
          typeof teamVal === 'object'
            ? teamVal._id || teamVal.id
            : String(teamVal),
        );
      }

      // Users
      const userVal = asset.ownerUserId || asset.ownerUserIds || asset.ownerId;
      if (Array.isArray(userVal)) {
        userVal.forEach((v) =>
          userIds.add(
            typeof v === 'object' && v !== null ? v._id || v.id : String(v),
          ),
        );
      } else if (userVal && userVal !== '-') {
        userIds.add(
          typeof userVal === 'object'
            ? userVal._id || userVal.id
            : String(userVal),
        );
      }
    });

    return {
      referencedBuIds: Array.from(buIds)
        .filter((id) => id && id !== 'undefined')
        .join(','),
      referencedDeptIds: Array.from(deptIds)
        .filter((id) => id && id !== 'undefined')
        .join(','),
      referencedTeamIds: Array.from(teamIds)
        .filter((id) => id && id !== 'undefined')
        .join(','),
      referencedUserIds: Array.from(userIds)
        .filter((id) => id && id !== 'undefined')
        .join(','),
    };
  }, [publicAssets]);

  // Fetch Business Units for dropdown selection
  const { data: businessUnitsResponse } = useGetAimBusinessUnitsQuery({
    limit: 500,
    ...(referencedBuIds && { includeIds: referencedBuIds }),
  });
  const businessUnitsList = useMemo(() => {
    if (!businessUnitsResponse) return [];
    if (Array.isArray(businessUnitsResponse.businessUnits)) {
      return businessUnitsResponse.businessUnits;
    }
    if (Array.isArray(businessUnitsResponse.data?.businessUnits)) {
      return businessUnitsResponse.data.businessUnits;
    }
    if (Array.isArray(businessUnitsResponse.data)) {
      return businessUnitsResponse.data;
    }
    if (Array.isArray(businessUnitsResponse)) {
      return businessUnitsResponse;
    }
    return [];
  }, [businessUnitsResponse]);

  const { data: departmentsData } = useGetDepartmentsQuery({
    limit: 500,
    ...(referencedDeptIds && { includeIds: referencedDeptIds }),
  });
  const departmentsList = useMemo(() => {
    if (!departmentsData) return [];
    if (Array.isArray(departmentsData.departments))
      return departmentsData.departments;
    if (Array.isArray(departmentsData.data?.departments))
      return departmentsData.data.departments;
    if (Array.isArray(departmentsData.data)) return departmentsData.data;
    if (Array.isArray(departmentsData)) return departmentsData;
    return [];
  }, [departmentsData]);

  const { data: teamsData } = useGetTeamsQuery({
    limit: 500,
    ...(referencedTeamIds && { includeIds: referencedTeamIds }),
  });
  const teamsList = useMemo(() => {
    if (!teamsData) return [];
    if (Array.isArray(teamsData.teams)) return teamsData.teams;
    if (Array.isArray(teamsData.data?.teams)) return teamsData.data.teams;
    if (Array.isArray(teamsData.data)) return teamsData.data;
    if (Array.isArray(teamsData)) return teamsData;
    return [];
  }, [teamsData]);

  const { data: membersData } = useGetOrgMembersQuery({
    limit: 500,
    ...(referencedUserIds && { includeIds: referencedUserIds }),
  });
  const membersList = useMemo(() => {
    if (!membersData) return [];
    if (Array.isArray(membersData.members)) return membersData.members;
    if (Array.isArray(membersData.data?.members))
      return membersData.data.members;
    if (Array.isArray(membersData.data)) return membersData.data;
    if (Array.isArray(membersData)) return membersData;
    return [];
  }, [membersData]);

  // Sync fetched asset list & pagination metadata with local state
  useEffect(() => {
    if (publicAssets) {
      const assetsList = publicAssets.assets || publicAssets.data || [];
      const validAssets = assetsList.map((asset) => ({
        ...asset,
        id: asset._id || asset.id,
      }));
      setLocalAssets(validAssets);

      const pag = publicAssets.pagination || {};
      const totalCount =
        pag.total ??
        publicAssets.totalAssets ??
        publicAssets.totalCount ??
        publicAssets.total ??
        0;
      const calculatedPages =
        pag.totalPages ??
        publicAssets.totalPages ??
        (totalCount && pagination.limit
          ? Math.ceil(totalCount / pagination.limit)
          : 1);

      setPagination((prev) => ({
        ...prev,
        page: pag.page || publicAssets.page || prev.page,
        totalPages: Math.max(1, calculatedPages),
      }));
    }
  }, [publicAssets, pagination.limit]);

  // Handlers for search, filtering, and pagination
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination((prev) => ({ ...prev, limit: newSize, page: 1 }));
  };

  const handleAvailableColumnsChange = useCallback((cols) => {
    setAvailableColumns(cols);
    if (cols && cols.length > 0) {
      setVisibleColumnKeys(cols.map((c) => c.key));
    }
  }, []);

  const handleToggleColumn = useCallback((key) => {
    setVisibleColumnKeys((prev) => {
      if (prev.includes(key)) {
        if (prev.length <= 1) return prev; // Keep at least one column visible
        return prev.filter((k) => k !== key);
      } else {
        return [...prev, key];
      }
    });
  }, []);

  const handleExportView = async () => {
    if (!effectiveOrgId) return;
    try {
      toast.info('Preparing export...');
      const blob = await exportPublicAssetsView({
        orgId: effectiveOrgId,
        search: debouncedSearchQuery,
        type: selectedType && selectedType !== 'all' ? selectedType : undefined,
        columns: visibleColumnKeys.join(','),
      }).unwrap();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'assets_export.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Export completed successfully');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error(err?.data?.message || 'Failed to export assets');
    }
  };

  // Inline cell update handler supporting both flat and nested property updates
  const handleCellUpdate = useCallback(
    async (assetId, fieldPath, rawNewValue) => {
      if (!effectiveOrgId || isAuditor) return;

      setIsUpdating(true);

      const assetToUpdate = localAssets.find(
        (a) => a.id === assetId || a._id === assetId,
      );
      if (!assetToUpdate) return;

      let newValue = rawNewValue;
      if (rawNewValue === 'true') newValue = true;
      if (rawNewValue === 'false') newValue = false;

      let changes = {};
      let selectedBu = null;
      if (fieldPath === 'risk.exposure' || fieldPath === 'exposure') {
        const isTrue =
          newValue === true || newValue === 'true' || newValue === 'Exposed';
        changes = {
          risk: {
            ...assetToUpdate.risk,
            exposure: isTrue,
          },
        };
      } else if (
        fieldPath === 'businessUnitIds' ||
        fieldPath === 'businessUnits' ||
        fieldPath.toLowerCase().includes('businessunit') ||
        fieldPath === 'ownerDepartmentId' ||
        fieldPath === 'ownerDepartmentIds' ||
        fieldPath.toLowerCase().includes('departmentid') ||
        fieldPath === 'ownerTeamId' ||
        fieldPath === 'ownerTeamIds' ||
        fieldPath.toLowerCase().includes('teamid') ||
        fieldPath === 'ownerUserId' ||
        fieldPath === 'ownerUserIds' ||
        fieldPath.toLowerCase().includes('userid') ||
        fieldPath.toLowerCase().includes('ownerid')
      ) {
        const isBu = fieldPath.toLowerCase().includes('businessunit');
        const isDept = fieldPath.toLowerCase().includes('departmentid');
        const isTeam = fieldPath.toLowerCase().includes('teamid');
        const isUser =
          fieldPath.toLowerCase().includes('userid') ||
          fieldPath.toLowerCase().includes('ownerid');

        const listToSearch = isBu
          ? businessUnitsList
          : isDept
            ? departmentsList
            : isTeam
              ? teamsList
              : membersList;

        const rawItems = Array.isArray(newValue)
          ? newValue
          : typeof newValue === 'string'
            ? newValue
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : newValue
              ? [newValue]
              : [];

        const matchingItems = [];
        const itemIds = [];

        rawItems.forEach((item) => {
          const itemStr =
            typeof item === 'object' && item !== null
              ? item._id || item.id || item.name || ''
              : String(item);
          const found = listToSearch.find((b) => {
            const id = b._id || b.id || b.businessUnitId || '';
            let name = b.name || id;
            if (isUser) {
              name =
                b.name ||
                (b.firstName
                  ? `${b.firstName} ${b.lastName || ''}`.trim()
                  : null) ||
                b.email ||
                id;
            }
            return name === itemStr || id === itemStr;
          });

          if (found) {
            const id = found._id || found.id || found.businessUnitId;
            if (id && !itemIds.includes(id)) {
              itemIds.push(id);
              matchingItems.push(found);
            }
          } else if (itemStr) {
            if (!itemIds.includes(itemStr)) {
              itemIds.push(itemStr);
            }
          }
        });

        // Use arrays for plural fields, single strings or null for singular fields
        const valueToSave =
          fieldPath.endsWith('Ids') || fieldPath === 'businessUnits'
            ? itemIds
            : itemIds[0] || null;

        changes = {
          [fieldPath]: valueToSave,
        };

        // Optimistic UI for business units, as they are sometimes mapped directly via the 'businessUnits' array on the asset object
        if (isBu) {
          selectedBu = matchingItems;
        }
      } else if (fieldPath.includes('.')) {
        const parts = fieldPath.split('.');
        if (parts.length === 2) {
          changes = {
            [parts[0]]: {
              ...(assetToUpdate[parts[0]] || {}),
              [parts[1]]: newValue,
            },
          };
        } else {
          changes = { [fieldPath]: newValue };
        }
      } else {
        changes = {
          [fieldPath]: newValue,
        };
      }

      try {
        await updatePublicAsset({
          orgId: effectiveOrgId,
          assetId,
          body: changes,
        }).unwrap();

        setLocalAssets((prevAssets) =>
          prevAssets.map((asset) =>
            asset.id === assetId || asset._id === assetId
              ? {
                  ...asset,
                  ...changes,
                  ...(Array.isArray(selectedBu)
                    ? { businessUnits: selectedBu }
                    : selectedBu
                      ? { businessUnits: [selectedBu] }
                      : {}),
                }
              : asset,
          ),
        );
      } catch (err) {
        console.error('Asset update error:', err);
        toast.error(err?.data?.message || 'Failed to update asset');
      } finally {
        setTimeout(() => setIsUpdating(false), 1500);
      }
    },
    [
      effectiveOrgId,
      isAuditor,
      localAssets,
      updatePublicAsset,
      businessUnitsList,
      departmentsList,
      teamsList,
      membersList,
    ],
  );

  const totalItems =
    publicAssets?.pagination?.total ??
    publicAssets?.totalAssets ??
    publicAssets?.totalCount ??
    publicAssets?.total ??
    localAssets.length;

  if (localAssets.length > 0) {
    hasSeenAssets.current = true;
  }

  if (isAssetsError) return <ApiErrorHandler error={assetsError} />;

  const hasActiveFilters = Boolean(searchQuery) || (selectedType && selectedType !== 'all');

  if (!isLoading && !isFetching && !isAssetsError && localAssets.length === 0 && !hasActiveFilters && !hasSeenAssets.current)
    return (
      <EmptyScreen
        title="No Assets Found"
        subTitle="Your asset list is currently empty. Please try installing a relevant adapter to begin."
        engage={
          <AuthorityGuard forbidRoles={['Auditor']}>
            <Button asChild>
              <Link to="/assetinventory/adapters">
                <Plug /> Connect Adapter</Link>
            </Button>
          </AuthorityGuard>
        }
      />
    );

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-5 w-full max-w-full">
      {/* Page Heading on top of table */}
      <PageHeading
        title="Manage Assets"
        description="View and manage all organization assets across the asset inventory."
      />

      {/* Unified Card Container taking full parent width */}
      <Card className="w-full min-w-full overflow-hidden border border-border shadow-xs bg-card p-0 gap-0">
        {/* Table Header Toolbar with Search on Left */}
        <EditAssetHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          onRefresh={refetch}
          isFetching={isFetching}
          availableColumns={availableColumns}
          visibleColumnKeys={visibleColumnKeys}
          onToggleColumn={handleToggleColumn}
          onExportView={handleExportView}
          isExporting={isExporting}
          isAuditor={isAuditor}
        />

        {/* Card Table Container with Dynamic Schema Columns & In-Table Skeleton Loader */}
        <CardTable className="w-full min-w-full p-0 m-0">
          <EditAssetTable
            data={localAssets}
            schemaData={schemaData}
            selectedType={selectedType}
            onCellUpdate={handleCellUpdate}
            isLoading={isLoading}
            isFetching={isFetching && !isUpdating}
            visibleColumnKeys={visibleColumnKeys}
            onAvailableColumnsChange={handleAvailableColumnsChange}
            currentPage={pagination.page}
            pageSize={pagination.limit}
            businessUnitsList={businessUnitsList}
            departmentsList={departmentsList}
            teamsList={teamsList}
            membersList={membersList}
            isAuditor={isAuditor}
          />
        </CardTable>

        {/* Flush Card Footer containing Pagination */}
        <CardFooter className="w-full p-0 m-0 border-t border-border bg-card min-h-0">
          <EditAssetPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            pageSize={pagination.limit}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        </CardFooter>
      </Card>
    </div>
  );
}

export default EditAsset;
