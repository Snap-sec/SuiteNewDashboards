const RemediationProgress = ({ progress = 0 }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-full bg-secondary rounded-full h-2">
        <div
          className="h-2 rounded-full bg-secondary-foreground"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground font-medium whitespace-nowrap min-w-[40px]">
        {progress}%
      </span>
    </div>
  );
};

export default RemediationProgress;