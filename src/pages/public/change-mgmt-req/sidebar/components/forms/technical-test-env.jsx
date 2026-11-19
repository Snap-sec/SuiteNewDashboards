import { useEffect } from 'react';
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const TechnicalTestEnv = () => {
  const { control, setValue } = useFormContext();

  useEffect(() => {
    // Only set default if not already set
    setValue('environmentToBeTested', 'Development');
  }, [setValue]);

  return (
    <Card className="pb-2.5">
      <CardHeader id="technical_test_env">
        <CardTitle>Technical Test Environment</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="flex items-center flex-wrap gap-2.5">
          <Label className="flex w-full max-w-56">
            Environment To Be Tested <span className="text-destructive px-1"> *</span>
          </Label>
          <div className="grow">
            <FormField
              control={control}
              name="environmentToBeTested"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Environment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Development">Development</SelectItem>
                      <SelectItem value="Staging">Staging</SelectItem>
                      <SelectItem value="High">Production</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <Label className="flex w-full items-center gap-1 max-w-56">
              Test URL or IP <span className="text-destructive"> *</span>
            </Label>
            <FormField
              control={control}
              name="testUrlOrIp"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., https://test.example.com or 192.168.1.1"
                    />
                  </FormControl>
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

export { TechnicalTestEnv };
