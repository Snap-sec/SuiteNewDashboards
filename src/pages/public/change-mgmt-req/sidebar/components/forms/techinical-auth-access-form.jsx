import { useEffect } from 'react';
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const TechnicalAuthAccess = () => {
  const { control, setValue } = useFormContext();

  const authTypeOptions = [
    'email/password',
    'API key',
    'OAuth 2.0',
    'JWT (JSON Web Token)',
    'Basic Auth',
    'Bearer Token',
    'Session Cookie',
    'SAML',
    'OpenID Connect',
    'Multi-Factor Authentication (MFA)',
    'Client Certificate',
    'Biometric',
    'SSO (Single Sign-On)',
  ];

  useEffect(() => {
    setValue('authenticationType', authTypeOptions[0]);
  }, [setValue]);

  return (
    <Card className="pb-2.5">
      <CardHeader id="technical_auth_access">
        <CardTitle>Technical Auth Access</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="flex items-center flex-wrap gap-2.5">
          <Label className="flex w-full max-w-56"> Authentication Type <span className="text-destructive px-1"> *</span></Label>
          <div className="grow">
            <FormField
              control={control}
              name="authenticationType"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {authTypeOptions?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
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
              Test Credentials <span className="text-destructive"> *</span>
            </Label>
            <FormField
              control={control}
              name="testCredentials"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter test credential for access"
                      className="w-full"
                      rows={4}
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

export { TechnicalAuthAccess };
