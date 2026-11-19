export function Pill({ children }) {
  return (
    <code className="font-mono text-xs text-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
      {children}
    </code>
  );
}
