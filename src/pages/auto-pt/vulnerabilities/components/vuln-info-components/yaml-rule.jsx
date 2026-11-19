
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import YamlEditor from '../../../../../components/custom/yaml-editor/yaml-editor';
function YamlRule({ data }) {
    return (
        <div className="w-full">
            <ScrollArea className="pr-2">
                <CardContent className="p-0 h-[60vh] lg:h-[70vh] kt-scrollable-y-auto">
                    {/* <div className="space-y-0">

                        <pre className=" overflow-auto text-xs sm:text-sm whitespace-pre-wrap break-words">
                            {data?.ruleSnapshot?.raw_yaml || 'N/A'}
                        </pre>
                    </div> */}
                    <YamlEditor
                        yaml={data?.ruleSnapshot?.raw_yaml}
                        // onChange={setYaml}
                        height="600px"
                        readOnly={true}
                    />
                </CardContent>
            </ScrollArea>
        </div>
    )
}

export default YamlRule;