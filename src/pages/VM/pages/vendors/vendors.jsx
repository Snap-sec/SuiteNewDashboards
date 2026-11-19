import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import useDebounce from '@/hooks/use-debounce';
import { useCreateVmVendorMutation, useDeleteVmVendorMutation, useGetVmVendorsQuery, useMarkVmVendorAsDefaultMutation, useUpdateVmVendorMutation } from '@/services/vm/vendorsApi';
import { Button } from '@/components/ui/button';
import PageHeading from '@/components/custom/page-heading';
import { EmptyScreen } from '../../../../components/common/empty-screen';
import DeleteVendorDialog from './components/DeleteVendorDialog';
import VendorDetailDialog from './components/VendorDetailDialog';
import VendorFormDialog from './components/VendorFormDialog';
import VendorTable from './components/VendorTable';
import useStore from './store';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';
import { Helmet } from 'react-helmet';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

export default function VendorsPage() {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const filters = useStore((state) => state.filters);
  const sorting = useStore((state) => state.sorting);
  const rawSearchQuery = useStore((state) => state.searchQuery);
  const setRawSearchQuery = useStore((state) => state.setSearchQuery);

  const debouncedSearch = useDebounce(rawSearchQuery, 400);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [editVendor, setEditVendor] = useState(null);
  const [detailVendor, setDetailVendor] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteVendor, setDeleteVendor] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetVmVendorsQuery({
    search: debouncedSearch,
    // page: pagination.pageIndex + 1,
    // limit: pagination.pageSize,
    ...filters,
    ...(sorting?.length && sorting[0]
      ? {
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      }
      : {}),
  });

  const vendors = data?.data?.vendors || [];
  const totalItems = data?.data?.total || 0;

  const [createVendor, { isLoading: isCreating }] = useCreateVmVendorMutation();
  const [updateVendor, { isLoading: isUpdating }] = useUpdateVmVendorMutation();
  const [deleteVendorMutation, { isLoading: isDeleting }] = useDeleteVmVendorMutation();
  const [markAsDefaultMutation] = useMarkVmVendorAsDefaultMutation();

  // Reset page when search or filters change
  useEffect(() => {
    if (pagination?.pageIndex !== 0) {
      setPagination({ ...pagination, pageIndex: 0 });
    }
  }, [debouncedSearch, JSON.stringify(filters)]);

  // CRUD handlers
  const handleSave = async (formData) => {
    if (editVendor?.id || editVendor?._id) {
      toast.promise(
        updateVendor({ vendorId: editVendor.id || editVendor._id, ...formData }).unwrap(),
        {
          loading: 'Updating vendor...',
          success: 'Vendor updated successfully',
          error: 'Failed to update vendor',
        }
      );
      setEditVendor(null);
      return;
    }

    toast.promise(
      createVendor(formData).unwrap(),
      {
        loading: 'Registering vendor...',
        success: 'Vendor registered successfully',
        error: 'Failed to register vendor',
      }
    );
  };

  const handleDelete = async (id) => {
    if (!id) return;
    toast.promise(
      deleteVendorMutation(id).unwrap(),
      {
        loading: 'Deleting vendor...',
        success: 'Vendor deleted successfully',
        error: 'Failed to delete vendor',
      }
    );
  };

  const handleToggleActive = async (id) => {
    const current = vendors.find((v) => (v.id || v._id) === id);
    if (!current) return;
    toast.promise(
      updateVendor({ vendorId: id, is_active: !current.is_active }).unwrap(),
      {
        loading: current.is_active ? 'Deactivating vendor...' : 'Activating vendor...',
        success: `Vendor ${current.is_active ? 'deactivated' : 'activated'} successfully`,
        error: `Failed to ${current.is_active ? 'deactivate' : 'activate'} vendor`,
      }
    );
  };

  const handleMarkAsDefault = async (id) => {
    toast.promise(
      markAsDefaultMutation(id).unwrap(),
      {
        loading: 'Setting as default vendor...',
        success: 'Default vendor updated successfully',
        error: 'Failed to set default vendor',
      }
    );
  };

  // SHOW EMPTY SCREEN
  if (!isError && !vendors?.length && !debouncedSearch && !totalItems && !isLoading) {
    return (
      <>
      <Helmet><title>UniRisk | Vendors</title></Helmet>
        <EmptyScreen
          title="No Service Vendors Found"
          subTitle="Get started by adding your first service vendor."
          engage={
            <AuthorityGuard forbidRoles={['Auditor']}>
              <Button
                variant="primary"
                onClick={() => {
                  setEditVendor(null);
                  setFormOpen(true);
                }}
                disabled={isCreating || isUpdating || isDeleting}
              >
                <Plus size={16} />
                <span>Add Service Vendor</span>
              </Button>
            </AuthorityGuard>
          }
        />

        <VendorFormDialog
          open={formOpen}
          setOpen={(v) => {
            setFormOpen(v);
            if (!v) setEditVendor(null);
          }}
          vendor={editVendor}
          onSave={handleSave}
        />
      </>
    );
  }

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <div className="p-6 flex flex-col gap-6 animate-in fade-in duration-500">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <PageHeading
          title="Service Vendors Management"
          description="Manage service vendor identities and reporting profiles for branded vulnerability reports."
        />

        <AuthorityGuard forbidRoles={['Auditor']}>
          <Button
            variant="primary"
            onClick={() => {
              setEditVendor(null);
              setFormOpen(true);
            }}
            disabled={isCreating || isUpdating || isDeleting}
          >
            <Plus size={16} />
            <span>Add Service Vendor</span>
          </Button>
        </AuthorityGuard>
        <Helmet><title>UniRisk | Vendors</title></Helmet>
      </div>

      {/* ── Vendor Table ── */}
      <VendorTable
        vendors={vendors}
        totalCount={totalItems}
        isLoading={isLoading || isFetching}
        onToggleActive={handleToggleActive}
        onMarkAsDefault={handleMarkAsDefault}
        setEditVendor={setEditVendor}
        setFormOpen={setFormOpen}
        setDetailVendor={setDetailVendor}
        setDetailOpen={setDetailOpen}
        setDeleteVendor={setDeleteVendor}
        setDeleteOpen={setDeleteOpen}
      />

      {/* ── Dialogs ── */}
      <VendorFormDialog
        open={formOpen}
        setOpen={(v) => {
          setFormOpen(v);
          if (!v) setEditVendor(null);
        }}
        vendor={editVendor}
        onSave={handleSave}
      />

      <VendorDetailDialog
        open={detailOpen}
        setOpen={setDetailOpen}
        vendor={detailVendor}
      />

      <DeleteVendorDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        vendor={deleteVendor}
        onConfirm={handleDelete}
      />
    </div>
  );
}