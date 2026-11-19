import { Badge } from '@/components/ui/badge';

const environmentConfig = {
    production: {
        label: "Production",
        variant: "success",
    },
    staging: {
        label: "Staging",
        variant: "warning",
    },
    testing: {
        label: "Testing",
        variant: "info",
    },
    dev: {
        label: "Development",
        variant: "destructive",
    },
    development: {
        label: "Development",
        variant: "destructive",
    },
    demo: {
        label: "Demo",
        variant: "secondary",
    },
};

function EnvironmentLabel({ environment, size = "sm" }) {
    const env = environment?.toLowerCase();
    const config = environmentConfig[env] || {
        label: environment || "Unknown",
        variant: "secondary",
    };

    return (
        <Badge
            variant={config.variant}
            appearance="outline"
            shape="circle"
            size={size}
            className="capitalize"
        >
            {config.label}
        </Badge>
    );
}

export default EnvironmentLabel;
