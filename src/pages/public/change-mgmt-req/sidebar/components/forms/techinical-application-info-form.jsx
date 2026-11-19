import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const TechnicalAppInfo = () => {
  const { control } = useFormContext();

  return (
    <Card className="pb-2.5">
      <CardHeader id="technical_app_info">
        <CardTitle>Technical Application Info</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <Label className="flex w-full items-center gap-1 max-w-56">
              Application Service Name <span className="text-destructive"> *</span>
            </Label>
            <FormField
              control={control}
              name="applicationServiceName"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Auth Service"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <Label className="flex w-full items-center gap-1 max-w-56">
              Tech Stack & Frameworks <span className="text-destructive"> *</span>
            </Label>
            <FormField
              control={control}
              name="techStackFrameworks"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., React, Node.js, PostgreSQL"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <Label className="flex w-full items-center gap-1 max-w-56">
              Third-Party Integrations <span className="text-destructive"> *</span>
            </Label>
            <FormField
              control={control}
              name="thirdPartyIntegrations"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Stripe, SendGrid"
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

export { TechnicalAppInfo };
