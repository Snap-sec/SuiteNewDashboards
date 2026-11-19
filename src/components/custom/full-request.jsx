import { useState } from "react";
import { Modal } from "@/components/custom/modal";
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react";
import { CustomTooltip } from "@/components/custom/tooltip";



// This component is specifically designed to display raw text,
// preserving all whitespace and line breaks.
function HttpRequestViewer({ rawRequest, onClick, generated, showGenerateThreatButton = true}) {
    return (
       <div className="relative">
         <pre className="flex justify-between"
            style={{
                padding: '15px',
                fontFamily: 'monospace',    // Monospace font for code-like appearance
                fontSize: '0.9em',          // Slightly smaller font for compactness
                whiteSpace: 'pre-wrap',     // Preserves whitespace and wraps long lines
                wordBreak: 'break-all',     // Breaks words if necessary to fit
                overflowX: 'auto',          // Adds horizontal scroll if content overflows
                maxHeight: 'calc(100vh - 300px)',
                margin: '0',                // Remove default margins
            }}
        >
        {rawRequest}
        </pre>
        {showGenerateThreatButton && (
                <div className="top-0 right-5 absolute -mt-18 mr-4">
                    <Button variant="outline" onClick={onClick}>
                        {generated ? "Re-Generate Threats" : "Generate Threats"}
                    </Button>
                </div>
        )}

        
        
       </div>
    );
}



function FullRequest({ raw, onClick, generated, triggerBtn, showGenerateThreatButton}){

    const [isOpen, setIsOpen] = useState(false);

    return(
        <Modal
            open={isOpen}
            setOpen={setIsOpen}
            title="Original Request"
            description="Full Request Details"
            className="w-5/6 h-[calc(100vh-150px)]"
            trigger={ triggerBtn ? triggerBtn :
                <Button variant="ghost" className="p-0 px-2">
                     <CustomTooltip text="Full Request Details">
                      <Eye className="text-blue-500 cursor-pointer" />
                    </CustomTooltip>
                </Button>
            }>
                <HttpRequestViewer rawRequest={raw} onClick={onClick} generated={generated} showGenerateThreatButton={showGenerateThreatButton}/>
        </Modal>
    )
}


export default FullRequest;