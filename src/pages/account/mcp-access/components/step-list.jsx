export function StepList({ steps }) {
  return (
    <div className="flex flex-col">
      {steps.map((step, i) => (
        <div
          key={i}
          className={`grid grid-cols-[36px_1fr] gap-x-3.5 py-4 ${
            i < steps.length - 1 ? 'border-b border-border' : ''
          }`}
        >
          <div className="pt-0.5">
            <div className="size-6.5 rounded-md border border-border bg-muted flex items-center justify-center font-mono text-[10px] text-muted-foreground font-semibold">
              {String(i + 1).padStart(2, '0')}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">
              {step.title}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {step.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
