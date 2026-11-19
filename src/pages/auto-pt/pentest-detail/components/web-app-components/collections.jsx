import { forwardRef, useImperativeHandle, useState } from 'react';
import { useGetApisecEnvironmentCollectionsQuery } from '@/services/apisec/environmentApi';
import MultiSelect from '@/components/custom/multi-select';

const Collections = forwardRef(function Collections({ data }, ref) {
  const { data: collections, isLoading } =
    useGetApisecEnvironmentCollectionsQuery('');
  const [collectionIds, setCollectionIds] = useState(
    data?.data?.configuration?.collection_uids || [],
  );

  useImperativeHandle(ref, () => ({
    getData: () => ({
      collectionIds: collectionIds,
    }),
  }));

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <div>
        <p className="text-sm mb-1.5 font-medium">Select Collections</p>
        <MultiSelect
          placeholder="Select Collection(s)..."
          options={collections?.data?.map?.((env) => ({
            id: env.collection_uid,
            label: env?.name + ` (${env?.totalRequests})`,
            value: env.collection_uid,
          }))}
          values={collectionIds}
          onChange={(options) => {
            console.log('options: ', options);
            setCollectionIds(options?.map((p) => p.value));
          }}
          isLoading={isLoading}
        />
        <p className="text-xs mt-2 text-muted-foreground">
          Select the collections you want to include in the scan.
        </p>
      </div>
    </div>
  );
});

export default Collections;
