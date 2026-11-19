import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';


export default function ButtonGroup({ defaultValue, onClick, options = [], label, className = "w-[400px]" }) {

  return (
    <div>
        <p>{label}</p>
        <Tabs
            defaultValue={ defaultValue || options[0]?.value}
            className={`${className} text-sm text-muted-foreground`}
        >
            <TabsList className="flex">
                {
                    options?.map(option => {
                        return <TabsTrigger onClick={()=> onClick(option)} value={option.value}>{option.label}</TabsTrigger>
                    })
                }
            </TabsList>
        </Tabs>
    </div>
  );
}
