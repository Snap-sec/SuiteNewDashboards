import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { useAuth } from '@/auth/context/auth-context';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import Table from '@/components/custom/table';
import { AddVendorModal } from './components/add-vendor-modal';
import { getVendorsTableColumns } from './components/vendors-table-columns';
import useStore from './store';

import {
  useDeleteAimVendorMutation,
  useGetAimVendorsQuery,
} from '@/services/asset-inventory/vendorsApi';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';

function Vendors() {
  const { user } = useAuth();
  const isAuditor = user?.role?.toLowerCase() === 'auditor';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const pagination = useStore((state) => state.pagination);
  const sorting = useStore((state) => state.sorting);
  const searchQuery = useStore((state) => state.searchQuery);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setSorting = useStore((state) => state.setSorting);

  // RTK Query API Hooks
  const { data: apiVendors, isLoading: isApiLoading } = useGetAimVendorsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: searchQuery || undefined,
  });
  const [deleteAimVendor] = useDeleteAimVendorMutation();

  const activeVendorsList = useMemo(() => {
    if (Array.isArray(apiVendors?.assets)) {
      return apiVendors.assets;
    }
    if (Array.isArray(apiVendors?.data?.assets)) {
      return apiVendors.data.assets;
    }
    if (apiVendors?.data?.vendors && Array.isArray(apiVendors.data.vendors)) {
      return apiVendors.data.vendors;
    }
    if (apiVendors?.vendors && Array.isArray(apiVendors.vendors)) {
      return apiVendors.vendors;
    }
    if (Array.isArray(apiVendors?.data)) {
      return apiVendors.data;
    }
    if (Array.isArray(apiVendors)) {
      return apiVendors;
    }
    return [];
  }, [apiVendors]);

  const handleDeleteVendor = async (item) => {
    try {
      const idToDelete = item._id || item.id;
      if (idToDelete) {
        await deleteAimVendor(idToDelete).unwrap();
        toast.success(`Deleted vendor: ${item.vendor?.name || item.name || item.value || ''}`);
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete vendor');
    }
  };

  const handleEditVendor = (item) => {
    setSelectedVendor(item);
    setIsAddModalOpen(true);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return activeVendorsList;
    const query = searchQuery.toLowerCase();
    return activeVendorsList.filter((item) => {
      const v = item.vendor || item.data || item;
      const name = v.name || item.name || item.value || '';
      const description = v.description || item.description || '';
      const email = v.email || item.email || '';
      const website = v.website || item.website || v.domain || item.domain || '';
      const address = v.address || item.address || '';
      return (
        name.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        website.toLowerCase().includes(query) ||
        address.toLowerCase().includes(query)
      );
    });
  }, [activeVendorsList, searchQuery]);

  const columns = useMemo(
    () =>
      getVendorsTableColumns({
        onDelete: handleDeleteVendor,
        onEdit: handleEditVendor,
        isAuditor,
      }),
    [activeVendorsList, isAuditor],
  );

  if (!isApiLoading && activeVendorsList.length === 0 && !searchQuery) {
    return (
      <div className="p-4 flex flex-col gap-4">
        <Helmet>
          <title>AssetIQ | Vendors</title>
        </Helmet>
        <EmptyScreen
          title="No Vendors Found"
          subTitle="There are currently no vendors available. Click below to add your first vendor."
          showTitle={false}
          engage={
            <Button
              variant="primary"
              onClick={() => {
                setSelectedVendor(null);
                setIsAddModalOpen(true);
              }}
            >
              <Plus className="size-4 mr-1" /> Add Vendor
            </Button>
          }
        />
        <AuthorityGuard forbidRoles={['Auditor']}>
        <AddVendorModal
          open={isAddModalOpen}
          setOpen={(val) => {
            setIsAddModalOpen(val);
            if (!val) setSelectedVendor(null);
          }}
          selectedVendor={selectedVendor}
        />
        </AuthorityGuard>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <Helmet>
        <title>AssetIQ | Vendors</title>
      </Helmet>

      <div className="flex items-center justify-between">
        <PageHeading
          title="Vendors"
          description="Track and manage all third-party software and service providers."
        />
        <AuthorityGuard forbidRoles={['Auditor']}>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedVendor(null);
            setIsAddModalOpen(true);
          }}
        >
          <Plus className="size-4 mr-1" /> Add Vendor
        </Button>
        </AuthorityGuard>
      </div>

      <Table
        data={filteredData}
        columns={columns}
        isLoading={isApiLoading}
        totalPages={apiVendors?.pagination?.totalPages || 1}
        totalCount={apiVendors?.pagination?.total ?? filteredData.length}
        search={searchQuery}
        setSearch={setSearchQuery}
        searchPlaceholder="Search vendors..."
        searchWidth="64"
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        manualPagination={true}
        manualSorting={false}
      />

      <AddVendorModal
        open={isAddModalOpen}
        setOpen={(val) => {
          setIsAddModalOpen(val);
          if (!val) setSelectedVendor(null);
        }}
        selectedVendor={selectedVendor}
      />
    </div>
  );
}

export default Vendors;
