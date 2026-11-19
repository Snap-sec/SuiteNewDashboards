import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import Table from '@/components/custom/table';
import { AddLicenseModal } from './components/add-license-modal';
import { getLicensesTableColumns } from './components/licenses-table-columns';
import useStore from './store';

import {
  useDeleteAimLicenseMutation,
  useGetAimLicensesQuery,
} from '@/services/asset-inventory/licensesApi';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';

function Licenses() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);

  const pagination = useStore((state) => state.pagination);
  const sorting = useStore((state) => state.sorting);
  const searchQuery = useStore((state) => state.searchQuery);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setSorting = useStore((state) => state.setSorting);

  // RTK Query API Hooks
  const { data: apiLicenses, isLoading: isApiLoading } = useGetAimLicensesQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: searchQuery || undefined,
  });
  const [deleteAimLicense] = useDeleteAimLicenseMutation();

  const activeLicensesList = useMemo(() => {
    if (Array.isArray(apiLicenses?.assets)) {
      return apiLicenses.assets;
    }
    if (Array.isArray(apiLicenses?.data?.assets)) {
      return apiLicenses.data.assets;
    }
    if (apiLicenses?.data?.licenses && Array.isArray(apiLicenses.data.licenses)) {
      return apiLicenses.data.licenses;
    }
    if (apiLicenses?.licenses && Array.isArray(apiLicenses.licenses)) {
      return apiLicenses.licenses;
    }
    if (Array.isArray(apiLicenses?.data)) {
      return apiLicenses.data;
    }
    if (Array.isArray(apiLicenses)) {
      return apiLicenses;
    }
    return [];
  }, [apiLicenses]);

  const handleDeleteLicense = async (item) => {
    try {
      const idToDelete = item._id || item.id;
      if (idToDelete) {
        await deleteAimLicense(idToDelete).unwrap();
        toast.success(`Deleted license: ${item.license?.name || item.name || item.value || ''}`);
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete license');
    }
  };

  const handleEditLicense = (item) => {
    setSelectedLicense(item);
    setIsAddModalOpen(true);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return activeLicensesList;
    const query = searchQuery.toLowerCase();
    return activeLicensesList.filter((item) => {
      const l = item.license || item.data || item;
      const name = l.name || item.name || item.value || '';
      const type = l.type || item.type || '';
      const key = l.key || l.license_key || item.key || item.license_key || '';
      const status = l.status || item.status || '';
      return (
        name.toLowerCase().includes(query) ||
        type.toLowerCase().includes(query) ||
        key.toLowerCase().includes(query) ||
        status.toLowerCase().includes(query)
      );
    });
  }, [activeLicensesList, searchQuery]);

  const columns = useMemo(
    () =>
      getLicensesTableColumns({
        onDelete: handleDeleteLicense,
        onEdit: handleEditLicense,
      }),
    [activeLicensesList],
  );

  if (!isApiLoading && activeLicensesList.length === 0 && !searchQuery) {
    return (
      <div className="p-4 flex flex-col gap-4">
        <Helmet>
          <title>AssetIQ | Software Licenses</title>
        </Helmet>
        <EmptyScreen
          title="No Licenses Found"
          subTitle="There are currently no software licenses available. Click below to add your first license."
          showTitle={false}
          engage={
            <Button
              variant="primary"
              onClick={() => {
                setSelectedLicense(null);
                setIsAddModalOpen(true);
              }}
            >
              <Plus className="size-4 mr-1" /> Add License
            </Button>
          }
        />
        <AuthorityGuard forbidRoles={['Auditor']}>
        <AddLicenseModal
          open={isAddModalOpen}
          setOpen={(val) => {
            setIsAddModalOpen(val);
            if (!val) setSelectedLicense(null);
          }}
          selectedLicense={selectedLicense}
        />
        </AuthorityGuard>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <Helmet>
        <title>AssetIQ | Software Licenses</title>
      </Helmet>

      <div className="flex items-center justify-between">
        <PageHeading
          title="Software Licenses"
          description="Track enterprise software licenses, subscriptions, usage, and renewal information."
        />
        <AuthorityGuard forbidRoles={['Auditor']}>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedLicense(null);
            setIsAddModalOpen(true);
          }}
        >
          <Plus className="size-4 mr-1" /> Add License
        </Button>
        </AuthorityGuard>
      </div>

      <Table
        data={filteredData}
        columns={columns}
        isLoading={isApiLoading}
        totalPages={apiLicenses?.pagination?.totalPages || 1}
        totalCount={apiLicenses?.pagination?.total ?? filteredData.length}
        search={searchQuery}
        setSearch={setSearchQuery}
        searchPlaceholder="Search licenses..."
        searchWidth="64"
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        manualPagination={true}
        manualSorting={false}
      />

      <AddLicenseModal
        open={isAddModalOpen}
        setOpen={(val) => {
          setIsAddModalOpen(val);
          if (!val) setSelectedLicense(null);
        }}
        selectedLicense={selectedLicense}
      />
    </div>
  );
}

export default Licenses;
