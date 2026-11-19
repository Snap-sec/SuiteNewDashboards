import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  useGetAimCustomFieldsQuery,
  useGetAimCustomFieldsSchemaQuery,
} from '@/services/asset-inventory/customFieldsApi';
import { Button } from '@/components/ui/button';
import Select from '@/components/custom/select';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';
import CustomFieldsList from './custom-fields-list';
import DefineFieldModal from './modals/define-field-modal';

import { EmptyScreen } from '@/components/common/empty-screen';

const CustomFieldsSettings = () => {
  const [search, setSearch] = useState('');
  const [filterAssetType, setFilterAssetType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const queryParams = {
    page,
    limit,
    ...(filterAssetType !== 'all' && { assetType: filterAssetType }),
    ...(search && { search }),
  };

  const {
    data: responseData,
    isLoading: isFieldsLoading,
    isFetching,
    isError,
    error,
  } = useGetAimCustomFieldsQuery(queryParams);
  const { data: schema } = useGetAimCustomFieldsSchemaQuery();

  const assetTypeOptions = [
    { label: 'All asset types', value: 'all' },
    ...(schema?.asset_types?.map((t) => ({ label: t.label, value: t.id })) ||
      []),
  ];

  const customFields = responseData?.data?.customFields || [];
  const paginationData = responseData?.data || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };

  const toolbar = (
    <div className="w-[180px]">
      <Select
        options={assetTypeOptions}
        value={filterAssetType}
        onChange={(val) => {
          setFilterAssetType(val?.value || 'all');
          setPage(1);
        }}
        className="h-9"
      />
    </div>
  );

  if (isError) return <ApiErrorHandler error={error} />;

  return (
    <div className="space-y-6 py-4">
      {(!isFieldsLoading && !isFetching && customFields.length === 0 && !search && filterAssetType === 'all') ? (
        <EmptyScreen
          title="No Custom Fields Found"
          subTitle="Capture extra data on your assets by adding fields that show up on their detail pages."
          lightImgUrl="/media/illustrations/32.svg"
          darkImgUrl="/media/illustrations/32-dark.svg"
          engage={
            <Button variant="primary" className="h-9 mt-2" onClick={() => setIsModalOpen(true)}>
              <Plus className="size-4 mr-2" />
              Define new field
            </Button>
          }
        />
      ) : (
        <div className="bg-background">
          {/* Header section */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Custom Fields
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Capture extra data on your assets by adding fields that show up on
                their detail pages.
              </p>
            </div>
            <Button
              variant="primary"
              className="h-9"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="size-4 mr-2" />
              Define new field
            </Button>
          </div>

          <CustomFieldsList
            data={customFields}
            schema={schema}
            paginationData={paginationData}
            isLoading={isFieldsLoading || isFetching}
            search={search}
            setSearch={(val) => {
              setSearch(val);
              setPage(1);
            }}
            page={page}
            limit={limit}
            setPage={setPage}
            setLimit={setLimit}
            toolbar={toolbar}
          />
        </div>
      )}

      <DefineFieldModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
      />
    </div>
  );
};

export default CustomFieldsSettings;
