export function SelectedKindPill({ icon: Icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/5 w-fit">
      <Icon className="w-3.5 h-3.5" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
