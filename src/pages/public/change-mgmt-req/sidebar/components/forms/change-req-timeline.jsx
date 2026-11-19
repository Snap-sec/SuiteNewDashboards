import { useFormContext } from "react-hook-form";
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const ChangeRequestTimeline = () => {
  const { control } = useFormContext();

  return (
    <Card className="pb-2.5">
      <CardHeader id="change_request_timeline">
        <CardTitle>Change Request Timeline</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        {/* Date of Request */}
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <Label className="flex w-full items-center gap-1 max-w-56">
              Date of Request <span className="text-destructive"> *</span>
            </Label>
            <FormField
              control={control}
              name="dateOfRequest"
              render={({ field }) => (
                <FormItem className="grow">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          mode="input"
                          variant="outline"
                          id="date-of-request"
                          className={cn(
                            'w-full data-[state=open]:border-primary',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <CalendarDays className="-ms-0.5" />
                          {field.value
                            ? format(new Date(field.value), 'LLL dd, y')
                            : 'Pick a date'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(format(date, 'yyyy-MM-dd'));
                          }
                        }}
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Planned Go Live Date */}
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <Label className="flex w-full items-center gap-1 max-w-56">
              Planned Go-Live Date <span className="text-destructive"> *</span>
            </Label>
            <FormField
              control={control}
              name="plannedGoLiveDate"
              render={({ field }) => (
                <FormItem className="grow">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          mode="input"
                          variant="outline"
                          id="planned-go-live-date"
                          className={cn(
                            'w-full data-[state=open]:border-primary',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <CalendarDays className="-ms-0.5" />
                          {field.value
                            ? format(new Date(field.value), 'LLL dd, y')
                            : 'Pick a date'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(format(date, 'yyyy-MM-dd'));
                          }
                        }}
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Deadline for Report */}
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <Label className="flex w-full items-center gap-1 max-w-56">
              Deadline for Report <span className="text-destructive"> *</span>
            </Label>
            <FormField
              control={control}
              name="deadlineForReport"
              render={({ field }) => (
                <FormItem className="grow">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          mode="input"
                          variant="outline"
                          id="deadline-for-report"
                          className={cn(
                            'w-full data-[state=open]:border-primary',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <CalendarDays className="-ms-0.5" />
                          {field.value
                            ? format(new Date(field.value), 'LLL dd, y')
                            : 'Pick a date'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(format(date, 'yyyy-MM-dd'));
                          }
                        }}
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { ChangeRequestTimeline };
