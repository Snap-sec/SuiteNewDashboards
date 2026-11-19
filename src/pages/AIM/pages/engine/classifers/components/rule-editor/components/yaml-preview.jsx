import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import DrawerModal from '@/components/custom/drawer-modal';

import useStore from "../store";

export function YamlPreview({ trigger }) {
  const currentRuleYaml = useStore((state) => state.currentRuleYaml);

  return (
    <DrawerModal
      width="[600px]"
      trigger={trigger}
      title={
        <div className="flex items-center justify-between w-[92%]">
          <span className="font-semibold text-sm tracking-wide">
            YAML Preview
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(currentRuleYaml);
              toast.success('Copied!');
            }}
            className="h-7 text-xs -my-2"
          >
            <Copy size={12} className="mr-1.5" /> Copy
          </Button>
        </div>
      }
    >
      <div className="flex-1 h-full overflow-auto bg-muted/20">
        <Textarea
          className="h-full min-h-full w-full p-4 text-xs font-mono leading-relaxed resize-none outline-none border-none bg-transparent"
          value={currentRuleYaml}
          spellCheck="false"
          readOnly
        />
      </div>
    </DrawerModal>
  )
}