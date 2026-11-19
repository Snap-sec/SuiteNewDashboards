import { Switch } from '@/components/ui/switch';

export function ProductAccessTab({ products = [], enabledProducts, onToggle }) {
  const mapped = (products ?? []).map((p) => ({
    key: p.id,
    abbr: p.id,
    name: p.title,
    desc: p.description,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Product access</h2>
        <span className="text-xs text-muted-foreground">
          {enabledProducts.size} / {mapped.length} enabled
        </span>
      </div>

      <div className="border-t border-border/30 divide-y divide-border/20">
        {mapped.map((product) => (
          <div key={product.key} className="flex items-center justify-between py-4">
            <div className="flex items-start gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{product.desc}</p>
              </div>
            </div>
            <Switch
              checked={enabledProducts.has(product.key)}
              onCheckedChange={() => onToggle(product.key)}
              className="shrink-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
