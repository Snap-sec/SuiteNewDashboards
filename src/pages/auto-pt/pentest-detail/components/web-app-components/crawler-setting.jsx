
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useId, useState, forwardRef, useImperativeHandle, useEffect } from 'react';


const CrawlerSetting = forwardRef(function CrawlerSetting({props,data}, ref) {

    const id1 = useId();
    const id2 = useId();
    const [selectedMode, setSelectedMode] = useState("aggressive");

    useImperativeHandle(ref, () => ({
        getData: () => selectedMode,
    }));

    useEffect(() => {
    if (data?.data?.configuration?.scan_type) {
      setSelectedMode(data?.data?.configuration?.scan_type);
    }
  }, [data]);

    return(
        <div className="flex flex-col gap-2 rounded-lg border p-4">
            <div className="flex items-center gap-4 border p-2 rounded-lg">
                <RadioGroup value={selectedMode} onValueChange={setSelectedMode}>
                   <RadioGroupItem value="aggressive" id={id1} />
                </RadioGroup>
                
                <div className="flex flex-col">
                    <p className="font-medium text-sm">Aggressive</p>
                    <p className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                        Fast, comprehensive crawling with maximum coverage
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4 border p-2 rounded-lg">
                <RadioGroup value={selectedMode} onValueChange={setSelectedMode}>
                   <RadioGroupItem value="intelligent" id={id2} />
                </RadioGroup>
                
                <div className="flex flex-col">
                    <p className="font-medium text-sm">Intelligent (AI-Powered)</p>
                    <p className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                       Smart crawling using AI to identify and prioritize important paths
                    </p>
                </div>
            </div>
        </div>
    );
});

export default CrawlerSetting;