import { useState } from 'react';
import { CheckCheck, Copy } from 'lucide-react';

export function CodeBlock({ code, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      )}
      <div className="relative group rounded-lg bg-muted border overflow-hidden">
        <pre className="text-xs text-foreground p-4 pr-12 whitespace-pre-wrap break-all font-mono leading-relaxed">
          {code}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          {copied
            ? <CheckCheck size={13} className="text-green-500" />
            : <Copy size={13} />
          }
        </button>
      </div>
    </div>
  );
}
