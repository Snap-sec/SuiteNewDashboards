import { useState } from 'react';
import { toast } from 'sonner';
import { Copy, Check } from 'lucide-react';

function syntaxHighlight(line) {
  return line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(?:[^"\\]|\\.)*")(\s*:)/g, '<span style="color:#93C5FD">$1</span><span style="color:#64748B">$2</span>')
    .replace(/:\s*("(?:[^"\\]|\\.)*")/g, (_, p1) => `: <span style="color:#34D399">${p1}</span>`)
    .replace(/:\s*(\[|\{)/g,             (_, p1) => `: <span style="color:#94A3B8">${p1}</span>`)
    .replace(/^(\s*)(- )/g,              '$1<span style="color:#F472B6">$2</span>')
    .replace(/(\{|\}|\[|\])/g,           '<span style="color:#94A3B8">$1</span>')
    .replace(/(true|false|null)/g,        '<span style="color:#F472B6">$1</span>')
    .replace(/\b(\d+)\b/g,               '<span style="color:#FCD34D">$1</span>');
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Code snippet copied to clipboard');
    } catch {
      toast.error('Failed to copy code snippet');
    }
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="copy-button text-[11px]"
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-emerald-500" strokeWidth={2.5} />
          <span className="text-emerald-500 font-semibold">Copied</span>
        </>
      ) : (
        <>
          <Copy className="size-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

export function CodeBlock({ code, filename }) {
  const lines = code.split('\n');
  return (
    <div className="code-block-wrapper my-0 border-border/80">
      {/* Titlebar */}
      <div className="code-block-header bg-[#1c1c1c] border-b border-border/60">
        <span className="font-mono text-[11px] truncate">
          {filename}
        </span>
        <CopyButton text={code} />
      </div>
      {/* Code area */}
      <div className="overflow-x-auto py-3">
        <table className="border-collapse w-full">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="pl-4 pr-3.5 text-right select-none text-[#404040] text-[11px] font-mono w-10 vertical-align-top leading-6">
                  {i + 1}
                </td>
                <td className="pr-4">
                  <code
                    className="block font-mono text-xs leading-6 text-gray-300 whitespace-pre"
                    dangerouslySetInnerHTML={{ __html: syntaxHighlight(line) }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
