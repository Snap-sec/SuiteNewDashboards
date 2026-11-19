import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Select from "@/components/custom/select";
import { useGetApisecEnvironmentsQuery } from "@/services/apisec/environmentApi";

const Environment = forwardRef(function Environment({ data }, ref) {
    const { data: environments, isLoading } = useGetApisecEnvironmentsQuery();
    const [environmentId, setEnvironmentId] = useState(data?.data?.configuration?.environment_id || "");

    useEffect(() => {
        if (data?.configuration?.environment_id) {
            setEnvironmentId(data?.configuration?.environment_id);
        }
    }, [data]);

    useImperativeHandle(ref, () => ({
        getData: () => ({
            environmentId: environmentId,
            collectionIds: environmentId ? [environmentId] : [],
        }),
    }));

    return (
        <div className="flex flex-col gap-2 rounded-lg border p-4">
            <div>
                <p className="text-sm mb-1.5 font-medium">Select Environment</p>
                <Select
                    placeholder='Select Environment...'
                    options={environments?.data?.map?.((env) => ({
                        label: env.name,
                        value: env._id,
                    }))}
                    value={environmentId}
                    onChange={(option) => setEnvironmentId(option?.value)}
                    isSearching={isLoading}
                />
                <p className="text-xs mt-2 text-muted-foreground">
                    Select the environment you want to include in the scan.
                </p>
            </div>
        </div>
    );
});

export default Environment;