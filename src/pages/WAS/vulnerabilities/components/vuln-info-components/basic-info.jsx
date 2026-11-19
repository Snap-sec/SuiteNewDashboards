import SeverityLabel from '@/components/custom/severity-label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DateFormatter } from '@/components/custom/date-formatter';


function BasicInfo({ data }) {

  return (
    <div className="space-y-4 h-[60vh] lg:h-[70vh] kt-scrollable-auto px-4">
      <div className="space-y-2 ">
        <h4 className="text-sm sm:text-md font-semibold">
          Basic Info
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="flex gap-2">
            <strong>Severity:</strong>{' '}
            <SeverityLabel severity={data?.severity} />
          </div>
          <div className="flex gap-2">
            <strong>State:</strong>
            <Badge
              variant={
                data.status == 'active'
                  ? 'destructive'
                  : 'success'
              }
              appearance="outline"
              className="capitalize"
            >
              {data.status}
            </Badge>
          </div>
          <div>
            <strong>First Detected:</strong>{' '}
            <DateFormatter date={data?.firstDetectedAt} />
          </div>
          <div>
            <strong>Last Detected:</strong>{' '}
            <DateFormatter date={data?.lastDetectedAt} />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h4 className="text-sm sm:text-md font-semibold">
          Description
        </h4>
        <div className="text-xs sm:text-sm">
          <p className="whitespace-pre-wrap break-words">{data.description}</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h4 className="text-sm sm:text-md font-semibold">
          Impact
        </h4>
        <div className="text-xs sm:text-sm">
          <p className="whitespace-pre-wrap break-words">{data?.impact || 'N/A'}</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h4 className="text-sm sm:text-md font-semibold">
          Steps to Reproduce
        </h4>
        <div className="text-xs sm:text-sm">
          <p className="whitespace-pre-wrap break-words">{data?.stepsToReproduce || 'N/A'}</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h4 className="text-sm sm:text-md font-semibold">
          Mitigation
        </h4>
        <div className="text-xs sm:text-sm">
          <p className="whitespace-pre-wrap break-words">{data?.mitigation || 'N/A'}</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h4 className="text-sm sm:text-md font-semibold">
          Tags
        </h4>
        <div className="flex flex-wrap gap-2">
          {data?.tags?.map((tag) => (
            <Badge variant="secondary" key={tag}>
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BasicInfo;