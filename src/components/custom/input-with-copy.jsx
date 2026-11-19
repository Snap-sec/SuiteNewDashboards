import { CheckIcon, CopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function InputWithCopy({
  value,
  className,
  toastMsg = 'Copied to Clipboard',
}) {
  const { copy, copied } = useCopyToClipboard();

  const handleCopy = () => {
    if (typeof value === 'string') {
      copy(value);
      toast.success(toastMsg);
    }
  };

  return (
    <div className={`${className ? className : 'w-60'}`}>
      <InputWrapper>
        <Input
          type="text"
          placeholder="Copy to clipboard"
          value={typeof value === 'string' ? value : ''}
          readOnly
        />
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleCopy} variant="dim" className="-me-3.5">
                {copied ? (
                  <CheckIcon className="stroke-green-600" size={16} />
                ) : (
                  <CopyIcon size={16} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs">
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </InputWrapper>
    </div>
  );
}
