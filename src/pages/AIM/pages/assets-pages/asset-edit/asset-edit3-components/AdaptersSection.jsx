import { Badge } from '@/components/ui/badge';
import { Plug } from 'lucide-react';
import SectionCard from './SectionCard';

const AdaptersSection = ({ asset }) => {
    const adapters = asset?.adapters || [];
    if (adapters.length === 0) return null;

    return (
        <SectionCard
            icon={<Plug className="size-4" />}
            iconColor="text-emerald-500"
            title="Data Sources (Adapters)"
            toolbar={<Badge variant="secondary" appearance="outline" size="sm">{adapters.length} adapters</Badge>}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                {adapters.map((adapter, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border/50 transition-colors hover:bg-muted/20"
                    >
                        {adapter?.logo && (
                            <img
                                src={adapter.logo}
                                alt={adapter.title}
                                className="size-8 rounded object-contain shrink-0 mt-0.5"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        )}
                        <div className="flex flex-col gap-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">{adapter?.title || adapter?.type}</span>
                                <Badge variant="info" appearance="outline">{adapter?.type}</Badge>
                            </div>
                            {adapter?.description && (
                                <span className="text-xs text-muted-foreground line-clamp-2">{adapter.description}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
};

export default AdaptersSection;
