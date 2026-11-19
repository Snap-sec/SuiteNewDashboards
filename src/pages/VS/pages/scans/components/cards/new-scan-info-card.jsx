import React from 'react';
import { CheckCircle2, Globe, TriangleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DateFormatter } from '../../../../../components/custom/date-formatter';
import { StatusBadge } from '../../../../../components/custom/status-badge';
import { Dot } from 'lucide-react';
import { Clock } from 'lucide-react';

export default function ScanInfoCard({data}) {


  const ms = data?.execution_time || 0;
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);


function formatTimestampDuration(timestamp) {
  const now = new Date();
  const target = new Date(timestamp);

  const diffMs = Math.abs(now - target);
  const totalMinutes = Math.floor(diffMs / 60000);

  // Break minutes into units
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);

  const hours = totalHours % 24;
  const totalDays = Math.floor(totalHours / 24);

  const days = totalDays % 30;
  const months = Math.floor(totalDays / 30);

  let parts = [];

  if (months > 0) parts.push(`${months}mo`);
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}min`);

  return parts.join(" ");
}






  return (
    <Card className="w-full mx-auto">
      <CardContent className="space-y-6">
        
        {/* Domains */}
        <div className='flex items-center justify-between'>
          <div className="flex justify-between gap-3 w-full">
            {!data?.createdAt &&(
              <div className='flex items-start flex-col'>
                <p className='font-medium text-foreground flex items-center'>
                  <Clock className="w-4 h-4 mr-2" />
                   Schuduled Scan
                </p>
                {/* <p className="flex items-center justify-start">
                  <Dot />
                  <p className='text-sm text-muted-foreground capitalize'>
                    {data?.settingSnapshot?.frequency}
                  </p>
                </p> */}
              </div>
            )}
            <div className="flex items-start gap-2">
              {data?.settingSnapshot?.domains ? (
                data?.settingSnapshot?.domains?.map((domain, index) => (
                <a key={index} href="#" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors">
                  <Badge variant="primary" appearance="outline">
                    <Globe className="w-4 h-4" /> {domain}
                  </Badge>
                </a>
              )))
              :
                data?.settingSnapshot?.data?.domains?.map((domain, index) => (
                  <a key={index} href="#" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors">
                    <Badge variant="primary" appearance="outline">
                      <Globe className="w-4 h-4" /> {domain}
                    </Badge>
                  </a>
                ))
              }
            </div>
          </div>

          {data?.createdAt && (
            <div className='w-33'>
              <Badge className="w-33" variant={data?.exposure_count || data?.exposures > 0 ? "destructive" : "warning"} appearance="outline">
                <TriangleAlert /> Exposures | {data?.exposure_count || data?.exposures || 0}
              </Badge>
            </div>
          )}
        </div>

        {/* Time Info */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{!data?.createdAt ? 'Will Start' : 'Started'}</p>
            <p className="text-sm font-medium">
              {!data?.createdAt ? 
                <div className='flex items-center gap-1'>
                  <p className='text-sm font-normal text-muted-forehead'> In {formatTimestampDuration(data?.scheduledAt)} </p> | <p className='capitalize'>{data?.settingSnapshot?.frequency}</p>
                </div>
                :
                <DateFormatter date={data?.createdAt} />
              }
              
              
            </p>
          </div>

          {
            data?.createdAt &&
            <div>
              <p className="text-sm text-muted-foreground mb-1">Duration</p>
              <p className="text-sm font-medium">{minutes}m {seconds}s</p>
            </div>
          }

          <div>
            <StatusBadge status={data?.status} progress={data?.progress}/>
          </div>
         
        </div>



      </CardContent>
    </Card>
  );
}
